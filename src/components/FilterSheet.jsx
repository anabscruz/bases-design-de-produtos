import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon.jsx'
import { EVENTS, formatPrice } from '../data/events.js'
import './FilterSheet.css'

/*
 * Events filters, Figma "Filtro" (284:1309): a bottom sheet that rises over the
 * Events screen. It edits a draft; "Filtrar" applies it, dragging the handle down,
 * tapping the shade or Escape discard it, like putting a form back in the drawer.
 */

const PRICE_STEP = 10
// Slider ceiling: the most expensive "a partir de" price, rounded up to the next R$ 100
export const PRICE_MAX = Math.ceil(Math.max(...EVENTS.map((event) => event.priceFrom)) / 100) * 100

const TYPES = [
  { id: 'show', label: 'show' },
  { id: 'festival', label: 'festival' },
]

const QUICK = [
  { id: 'saved', label: 'salvos' },
  { id: 'trending', label: 'em alta' },
  { id: 'friends', label: 'amigos vão' },
]

// Without GPS in the prototype, "my location" fills in the city the user is in
const MY_CITY = 'São Paulo'

export const EMPTY_FILTERS = { location: '', price: [0, PRICE_MAX], types: [], quick: [] }

/**
 * Filters a link can start the Events screen with: "#/events/trending" opens it
 * with "em alta" already on (any quick filter id works: saved, trending, friends)
 */
export function filtersFromParam(param) {
  return QUICK.some((quick) => quick.id === param) ? { ...EMPTY_FILTERS, quick: [param] } : EMPTY_FILTERS
}

/**
 * One tag per applied filter, for the row under the search: `remove(filters)`
 * returns the filters without that one
 */
export function appliedFilterTags(filters) {
  const tags = []
  const place = filters.location.trim()
  if (place) tags.push({ key: 'location', label: place, remove: (f) => ({ ...f, location: '' }) })
  const [min, max] = filters.price
  if (min > 0 || max < PRICE_MAX) {
    const label =
      min === 0 ? `até R$ ${formatPrice(max)}` : max === PRICE_MAX ? `a partir de R$ ${formatPrice(min)}` : `R$ ${formatPrice(min)} – ${formatPrice(max)}`
    tags.push({ key: 'price', label, remove: (f) => ({ ...f, price: EMPTY_FILTERS.price }) })
  }
  for (const type of TYPES.filter((option) => filters.types.includes(option.id))) {
    tags.push({ key: `type-${type.id}`, label: type.label, remove: (f) => ({ ...f, types: f.types.filter((id) => id !== type.id) }) })
  }
  for (const quick of QUICK.filter((option) => filters.quick.includes(option.id))) {
    tags.push({ key: `quick-${quick.id}`, label: quick.label, remove: (f) => ({ ...f, quick: f.quick.filter((id) => id !== quick.id) }) })
  }
  return tags
}

/** How many filters differ from the defaults (shown as a dot on the filter icon) */
export function activeFilterCount(filters) {
  return (
    (filters.location.trim() ? 1 : 0) +
    (filters.price[0] > 0 || filters.price[1] < PRICE_MAX ? 1 : 0) +
    filters.types.length +
    filters.quick.length
  )
}

const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** Does the event pass every filter? `saved` is the Set of saved event ids */
export function matchesFilters(event, filters, saved) {
  const place = normalize(filters.location.trim())
  if (place && !normalize([event.city, event.place, event.venue, event.address].join(' ')).includes(place)) return false
  if (event.priceFrom < filters.price[0] || event.priceFrom > filters.price[1]) return false
  if (filters.types.length && !filters.types.includes(event.type)) return false
  for (const quick of filters.quick) {
    if (quick === 'saved' && !saved.has(event.id)) return false
    if (quick === 'trending' && !event.featured) return false
    if (quick === 'friends' && event.attendees.length === 0) return false
  }
  return true
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const OPEN_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)' // fast start, long soft landing
const CLOSE_EASE = 'cubic-bezier(0.4, 0, 1, 1)'
const DISMISS_DISTANCE = 120 // px dragged down to let go of the sheet
const FLICK_SPEED = 0.6 // px/ms

const toggle = (list, id) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id])

function Chips({ options, selected, onToggle, label }) {
  return (
    <div className="filter-sheet__chips" role="group" aria-label={label}>
      {options.map((option) => {
        const on = selected.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            className={`filter-sheet__chip${on ? ' is-on' : ''}`}
            aria-pressed={on}
            onClick={() => onToggle(option.id)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** Two thumbs on one track: the minimum and maximum "a partir de" price */
function PriceRange({ value, onChange }) {
  const [min, max] = value
  const pct = (amount) => (amount / PRICE_MAX) * 100
  return (
    <div className="price-range" style={{ '--from': pct(min), '--to': pct(max) }}>
      <div className="price-range__track" aria-hidden="true">
        <div className="price-range__fill" />
      </div>
      <input
        type="range"
        className="price-range__input"
        // When both thumbs meet at the top end, the minimum has to stay grabbable
        data-on-top={min > PRICE_MAX / 2 || undefined}
        min={0}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={min}
        aria-label="Preço mínimo"
        aria-valuetext={`R$ ${formatPrice(min)}`}
        onChange={(event) => onChange([Math.min(Number(event.target.value), max), max])}
      />
      <input
        type="range"
        className="price-range__input"
        min={0}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={max}
        aria-label="Preço máximo"
        aria-valuetext={`R$ ${formatPrice(max)}`}
        onChange={(event) => onChange([min, Math.max(Number(event.target.value), min)])}
      />
      <span className="price-range__label" style={{ '--at': pct(min) }} aria-hidden="true">
        R$ {formatPrice(min)}
      </span>
      <span className="price-range__label" style={{ '--at': pct(max) }} aria-hidden="true">
        R$ {formatPrice(max)}
      </span>
    </div>
  )
}

/**
 * Rendered while open: mount it to open, it calls `onClose` once its exit
 * animation ends. `count(draft)` tells the button how many events would show.
 */
export default function FilterSheet({ filters, onApply, onClose, count }) {
  const [draft, setDraft] = useState(filters)
  const [host, setHost] = useState(null)
  const anchorRef = useRef(null)
  const sheetRef = useRef(null)
  const scrimRef = useRef(null)
  const closing = useRef(false)
  const drag = useRef(null)
  const offset = useRef(0)

  const results = count(draft)
  const set = (patch) => setDraft((current) => ({ ...current, ...patch }))

  // The sheet lives on the phone itself, outside the scrolling screen, so it
  // covers the whole display wherever the list is scrolled
  useLayoutEffect(() => {
    setHost(anchorRef.current.closest('.phone'))
  }, [])

  useLayoutEffect(() => {
    if (!host) return undefined
    const returnFocus = document.activeElement
    const viewport = anchorRef.current.closest('.phone__viewport')
    if (viewport) viewport.inert = true
    sheetRef.current.focus({ preventScroll: true })

    if (!prefersReducedMotion()) {
      sheetRef.current.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], {
        duration: 480,
        easing: OPEN_EASE,
      })
      scrimRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' })
      // Sections settle in one after the other, just behind the sheet
      sheetRef.current.querySelectorAll('[data-stagger]').forEach((section, i) =>
        section.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], {
          duration: 420,
          delay: 90 + i * 45,
          easing: OPEN_EASE,
          fill: 'backwards',
        }),
      )
    }

    return () => {
      if (viewport) viewport.inert = false
      returnFocus?.focus?.({ preventScroll: true })
    }
  }, [host])

  const close = () => {
    if (closing.current) return
    closing.current = true
    if (prefersReducedMotion()) {
      onClose()
      return
    }
    const sheet = sheetRef.current
    const from = offset.current
    sheet.style.transform = ''
    const duration = 280 * (1 - from / sheet.offsetHeight) + 80
    scrimRef.current.animate([{ opacity: 1 - from / sheet.offsetHeight }, { opacity: 0 }], {
      duration,
      fill: 'forwards',
    })
    sheet
      .animate([{ transform: `translateY(${from}px)` }, { transform: 'translateY(100%)' }], {
        duration,
        easing: CLOSE_EASE,
        fill: 'forwards',
      })
      .finished.then(onClose)
  }

  const apply = () => {
    onApply(draft)
    close()
  }

  // Drag the top of the sheet down to put it away; pulling up only stretches a little
  const setOffset = (y, animate = false) => {
    offset.current = y
    const sheet = sheetRef.current
    sheet.style.transition = animate ? `transform 380ms ${OPEN_EASE}` : 'none'
    sheet.style.transform = y ? `translateY(${y}px)` : ''
    scrimRef.current.style.opacity = String(1 - Math.max(0, y) / sheet.offsetHeight)
  }

  const onPointerDown = (event) => {
    if (event.button !== 0 || closing.current) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { id: event.pointerId, y0: event.clientY, lastY: event.clientY, lastT: event.timeStamp, speed: 0 }
  }

  const onPointerMove = (event) => {
    const d = drag.current
    if (!d || event.pointerId !== d.id) return
    const dy = event.clientY - d.y0
    const dt = event.timeStamp - d.lastT
    if (dt > 0) d.speed = (event.clientY - d.lastY) / dt
    d.lastY = event.clientY
    d.lastT = event.timeStamp
    setOffset(dy > 0 ? dy : dy / 6)
  }

  const onPointerUp = (event) => {
    const d = drag.current
    drag.current = null
    if (!d || event.pointerId !== d.id) return
    if (offset.current > DISMISS_DISTANCE || (d.speed > FLICK_SPEED && offset.current > 0)) close()
    else setOffset(0, true)
  }

  const sheet = (
    <div className="filter-sheet-layer">
      <div className="filter-sheet__scrim" ref={scrimRef} onClick={close} aria-hidden="true" />
      <section
        className="filter-sheet"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        tabIndex={-1}
        onKeyDown={(event) => event.key === 'Escape' && close()}
      >
        <h2 id="filter-sheet-title" className="visually-hidden">
          Filtros
        </h2>

        {/* Grab area: the handle plus some room around it */}
        <div
          className="filter-sheet__grab"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <button type="button" className="filter-sheet__handle" onClick={close} aria-label="Fechar filtros" />
          {activeFilterCount(draft) > 0 && (
            <button
              type="button"
              className="filter-sheet__clear"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setDraft(EMPTY_FILTERS)}
            >
              Limpar
            </button>
          )}
        </div>

        <div className="filter-sheet__sections">
          <div className="filter-sheet__section" data-stagger>
            <h3 className="filter-sheet__title">Localização</h3>
            <div className="filter-sheet__location">
              <label className="filter-sheet__field">
                <Icon name="search" size={22} />
                <input
                  type="search"
                  className="filter-sheet__input"
                  placeholder="cidade ou local"
                  aria-label="Cidade ou local"
                  value={draft.location}
                  onChange={(event) => set({ location: event.target.value })}
                />
              </label>
              <button
                type="button"
                className={`filter-sheet__locate${draft.location === MY_CITY ? ' is-on' : ''}`}
                aria-label="Usar minha localização"
                onClick={() => set({ location: MY_CITY })}
              >
                <Icon name="my_location" size={24} />
              </button>
            </div>
          </div>

          <div className="filter-sheet__section" data-stagger>
            <h3 className="filter-sheet__title">Preço</h3>
            <PriceRange value={draft.price} onChange={(price) => set({ price })} />
          </div>

          <div className="filter-sheet__section" data-stagger>
            <h3 className="filter-sheet__title">Tipo de evento</h3>
            <Chips
              label="Tipo de evento"
              options={TYPES}
              selected={draft.types}
              onToggle={(id) => set({ types: toggle(draft.types, id) })}
            />
          </div>

          <div className="filter-sheet__section" data-stagger>
            <h3 className="filter-sheet__title">Filtros rápidos</h3>
            <Chips
              label="Filtros rápidos"
              options={QUICK}
              selected={draft.quick}
              onToggle={(id) => set({ quick: toggle(draft.quick, id) })}
            />
          </div>
        </div>

        <div className="filter-sheet__footer" data-stagger>
          <button type="button" className="filter-sheet__apply" onClick={apply} disabled={results === 0}>
            {results === 0 ? 'Nenhum evento' : 'Filtrar'}
            {results > 0 && (
              <span className="filter-sheet__count" key={results}>
                {results}
              </span>
            )}
          </button>
          <p className="visually-hidden" aria-live="polite">
            {results === 1 ? '1 evento encontrado' : `${results} eventos encontrados`}
          </p>
        </div>
      </section>
    </div>
  )

  return (
    <>
      <span ref={anchorRef} hidden />
      {host && createPortal(sheet, host)}
    </>
  )
}
