import { useLayoutEffect, useRef, useState } from 'react'
import Header from '../components/Header.jsx'
import ExpandingSearch from '../components/ExpandingSearch.jsx'
import Attendees from '../components/Attendees.jsx'
import Price from '../components/Price.jsx'
import SaveButton from '../components/SaveButton.jsx'
import Icon from '../components/Icon.jsx'
import FeaturedSlider from '../components/FeaturedSlider.jsx'
import FilterSheet, {
  EMPTY_FILTERS,
  activeFilterCount,
  appliedFilterTags,
  filtersFromParam,
  matchesFilters,
} from '../components/FilterSheet.jsx'
import { EVENTS, eventPath, formatDay } from '../data/events.js'
import pasteTexture from '../assets/images/poster-paste-texture.jpg'
import shareIcon from '../assets/icons/share-external.svg'
import '../components/Screen.css'
import '../components/Poster.css'
import './Events.css'

// Featured slider: the events marked "featured" in src/data/events.json
const FEATURED = EVENTS.filter((event) => event.featured).map((event) => ({
  id: event.id,
  image: event.artistPhotoUrl,
  title: event.tour ? `${event.title} ${event.tour}` : event.title,
  subtitle: `${formatDay(event.date)} - ${event.city}`,
}))

// Same curve as the search field growing, so tags and field move as one gesture
const SEARCH_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const SEARCH_DURATION = 450

/**
 * Smooths the row when the search opens or closes (FLIP): the tags glide from
 * where they were to their new line and the row's height eases, instead of jumping.
 * Call `snapshot()` right before the change; the layout effect plays it.
 */
function useSearchRowMotion(open) {
  const rowRef = useRef(null)
  const before = useRef(null)

  const snapshot = () => {
    const row = rowRef.current
    if (!row) return
    before.current = {
      height: row.offsetHeight,
      tags: [...row.querySelectorAll('.events__tag, .events__tags-clear')].map((el) => [el, el.getBoundingClientRect()]),
    }
  }

  useLayoutEffect(() => {
    const row = rowRef.current
    const from = before.current
    before.current = null
    if (!row || !from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Closing: give the field a head start, so the tags don't slide in under it
    const delay = open ? 0 : 120

    row.animate([{ height: `${from.height}px` }, { height: `${row.offsetHeight}px` }], {
      duration: SEARCH_DURATION,
      delay,
      easing: SEARCH_EASE,
      fill: 'backwards',
    })
    from.tags.forEach(([el, rect], i) => {
      if (!el.isConnected) return
      const now = el.getBoundingClientRect()
      const dx = rect.left - now.left
      const dy = rect.top - now.top
      if (!dx && !dy) return
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration: SEARCH_DURATION,
        delay: delay + i * 30, // a little wave, left to right
        easing: SEARCH_EASE,
        fill: 'backwards',
      })
    })
  }, [open])

  return { rowRef, snapshot }
}

/**
 * Smooths the list when filters or the search change which events show.
 * Events that come back grow open (height 0 → full) and fade in, pushing the
 * rows below down gradually, like a drawer sliding out. When events only leave,
 * the ones that stay glide up to their new place (FLIP).
 * Positions are remembered after every change (offsetTop ignores running transforms).
 */
function useListMotion(ids) {
  const listRef = useRef(null)
  const lastTops = useRef(null)
  const key = ids.join('|')

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const items = [...list.querySelectorAll('[data-event-id]')]
    const before = lastTops.current
    lastTops.current = new Map(items.map((item) => [item.dataset.eventId, item.offsetTop]))
    if (!before || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const entering = items.filter((item) => !before.has(item.dataset.eventId))

    entering.forEach((item, i) => {
      const style = getComputedStyle(item)
      const full = {
        height: `${item.offsetHeight}px`,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
      }
      const delay = i * 50
      item.style.overflow = 'hidden'
      // Grows open: the rows below are pushed down by the layout itself
      item
        .animate([{ height: '0px', paddingTop: '0px', paddingBottom: '0px' }, full], {
          duration: SEARCH_DURATION,
          delay,
          easing: SEARCH_EASE,
          fill: 'backwards',
        })
        .finished.then(
          () => (item.style.overflow = ''),
          () => (item.style.overflow = ''),
        )
      // Content fades in slightly behind the growth, so it never looks squashed
      item.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 360,
        delay: delay + 120,
        easing: 'ease-out',
        fill: 'backwards',
      })
    })

    // Growing rows already move the others smoothly; only glide when nothing enters
    if (entering.length) return
    items.forEach((item) => {
      const dy = before.get(item.dataset.eventId) - item.offsetTop
      if (!dy) return
      item.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], {
        duration: SEARCH_DURATION,
        easing: SEARCH_EASE,
      })
    })
  }, [key])

  return listRef
}

function shareEvent(event) {
  const data = { title: event.title, text: `${event.title} · ${event.place} · ${event.dateLabel}`, url: window.location.href }
  if (navigator.share) navigator.share(data).catch(() => {})
  else navigator.clipboard?.writeText(`${data.text} ${data.url}`).catch(() => {})
}

export default function Events({ param, navigate, balanceHidden, onToggleBalance }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRow = useSearchRowMotion(searchOpen)
  const changeSearchOpen = (open) => {
    if (open !== searchOpen) searchRow.snapshot()
    setSearchOpen(open)
  }
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(() => new Set())
  const toggleSaved = (id) =>
    setSaved((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  const [filtersOpen, setFiltersOpen] = useState(false)
  // "#/events/trending" (Home's Trending) opens with "em alta" already selected
  const [filters, setFilters] = useState(() => filtersFromParam(param))
  const filterCount = activeFilterCount(filters)
  const filterTags = appliedFilterTags(filters)
  const term = query.trim().toLowerCase()
  const matchesSearch = (event) =>
    !term || [event.title, event.tour, event.place, event.venue, event.city].join(' ').toLowerCase().includes(term)
  const filterEvents = (current) =>
    EVENTS.filter((event) => matchesSearch(event) && matchesFilters(event, current, saved))
  const events = filterEvents(filters)
  const listRef = useListMotion(events.map((event) => event.id))

  return (
    <main className="screen events">
      {/* The whole screen scrolls as one page: header, featured slider, list */}
      <div className="screen__inset">
        <Header
          balanceHidden={balanceHidden}
          onToggleBalance={onToggleBalance}
          onMenu={() => navigate('menu')}
        />
      </div>

      <section className="events__top">
        <h2 className="visually-hidden">Em alta</h2>
        {/* transition: "glitch" (digital screen glitch), "tv" (TV interference) or "wipe" (strip wipe) */}
        <FeaturedSlider slides={FEATURED} transition="glitch" onOpen={(slide) => navigate(eventPath(slide.id))} />
      </section>

      <section className="events__list-section">
        {/* One row: applied filter tags on the left, search + filter on the right.
            While the search is open it takes the whole row and the tags drop below it */}
        <div className={`events__list-header${searchOpen ? ' is-searching' : ''}`} ref={searchRow.rowRef}>
          {/* Title kept for screen readers only */}
          <h2 className="visually-hidden">Todos os eventos</h2>
          {/* Applied filters: each tag removes its own filter */}
          {filterTags.length > 0 && (
            <ul className="events__tags" aria-label="Filtros aplicados">
              {filterTags.map((tag) => (
                <li className="events__tag" key={tag.key}>
                  <span>{tag.label}</span>
                  <button
                    type="button"
                    className="events__tag-remove"
                    aria-label={`Remover filtro ${tag.label}`}
                    onClick={() => setFilters(tag.remove)}
                  >
                    <Icon name="close" size={16} />
                  </button>
                </li>
              ))}
              {filterTags.length > 1 && (
                <li>
                  <button type="button" className="events__tags-clear" onClick={() => setFilters(EMPTY_FILTERS)}>
                    limpar tudo
                  </button>
                </li>
              )}
            </ul>
          )}

          <div className="events__controls">
            <ExpandingSearch
              open={searchOpen}
              onOpenChange={changeSearchOpen}
              value={query}
              onChange={setQuery}
              label="Buscar eventos"
            />
            <button
              type="button"
              className={`events__filter${filterCount ? ' is-active' : ''}`}
              aria-label={filterCount ? `Filtrar eventos (${filterCount} filtros ativos)` : 'Filtrar eventos'}
              aria-haspopup="dialog"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen(true)}
            >
              <Icon name="tune" size={30} />
            </button>
          </div>
        </div>

        <div className="events__list" ref={listRef}>
          {events.length === 0 && (
            <div className="events__empty">
              <p>
                {term && !filterCount
                  ? `Nenhum evento encontrado para “${query.trim()}”`
                  : 'Nenhum evento com esses filtros'}
              </p>
              {filterCount > 0 && (
                <button type="button" className="events__clear" onClick={() => setFilters(EMPTY_FILTERS)}>
                  Limpar filtros
                </button>
              )}
            </div>
          )}
          {/* Figma "Frame 519" (278:321): pasted poster + details, social row at the bottom */}
          {events.map((event) => {
            // Every event has its page now: "#/event/<id>"
            const openDetails = () => navigate(eventPath(event.id))
            return (
              <article className="event-item" key={event.id} data-event-id={event.id}>
                <button
                  className="poster poster--list"
                  type="button"
                  onClick={openDetails}
                  aria-label={`Ver ${event.title}`}
                >
                  <img className="poster__image" src={event.posterUrl} alt="" />
                  {/* Wrinkled paper on top: the poster looks pasted on a wall */}
                  <img className="poster__paste" src={pasteTexture} alt="" />
                </button>

                <div className="event-item__details">
                  <div className="event-item__info">
                    <div className="event-item__title-row">
                      <h3 className="event-item__name">
                        <button className="event-item__name-link" type="button" onClick={openDetails}>
                          {event.title}
                        </button>
                      </h3>
                      <SaveButton
                        size={20}
                        saved={saved.has(event.id)}
                        onToggle={() => toggleSaved(event.id)}
                        label={`Salvar ${event.title}`}
                      />
                    </div>
                    <p className="event-item__place">{event.place}</p>
                    <p className="event-item__date">{event.dateLabel}</p>
                  </div>

                  <div className="event-item__footer">
                    <Price className="event-item__price" value={event.priceFrom} label="A partir de" />
                    <div className="event-item__social">
                      <Attendees people={event.attendees} />
                      <button
                        type="button"
                        className="event-item__share"
                        onClick={() => shareEvent(event)}
                        aria-label={`Compartilhar ${event.title}`}
                      >
                        <span className="event-item__share-icon" style={{ '--icon': `url("${shareIcon}")` }} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {filtersOpen && (
        <FilterSheet
          filters={filters}
          onApply={setFilters}
          onClose={() => setFiltersOpen(false)}
          count={(draft) => filterEvents(draft).length}
        />
      )}
    </main>
  )
}
