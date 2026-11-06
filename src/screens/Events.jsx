import { useState } from 'react'
import Header from '../components/Header.jsx'
import ExpandingSearch from '../components/ExpandingSearch.jsx'
import Attendees from '../components/Attendees.jsx'
import Amount from '../components/Amount.jsx'
import SaveButton from '../components/SaveButton.jsx'
import Icon from '../components/Icon.jsx'
import FeaturedSlider from '../components/FeaturedSlider.jsx'
import FilterSheet, { EMPTY_FILTERS, activeFilterCount, matchesFilters } from '../components/FilterSheet.jsx'
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

function shareEvent(event) {
  const data = { title: event.title, text: `${event.title} · ${event.place} · ${event.dateLabel}`, url: window.location.href }
  if (navigator.share) navigator.share(data).catch(() => {})
  else navigator.clipboard?.writeText(`${data.text} ${data.url}`).catch(() => {})
}

export default function Events({ navigate, balanceHidden, onToggleBalance }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(() => new Set())
  const toggleSaved = (id) =>
    setSaved((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const filterCount = activeFilterCount(filters)
  const term = query.trim().toLowerCase()
  const matchesSearch = (event) =>
    !term || [event.title, event.tour, event.place, event.venue, event.city].join(' ').toLowerCase().includes(term)
  const filterEvents = (current) =>
    EVENTS.filter((event) => matchesSearch(event) && matchesFilters(event, current, saved))
  const events = filterEvents(filters)

  return (
    <main className="screen events">
      {/* Opaque header band: always on top, so nothing scrolls over the header */}
      <div className="events__header-band">
        <div className="screen__inset">
          <Header
            balanceHidden={balanceHidden}
            onToggleBalance={onToggleBalance}
            onMenu={() => navigate('menu')}
          />
        </div>
      </div>

      {/* Poster wall stays put while "All Events" scrolls over it */}
      <div className="events__backdrop">
        <section className="events__top">
          <h2 className="visually-hidden">Em alta</h2>
          {/* Full-width featured slider with a staggered curtains wipe */}
          {/* transition: "glitch" (digital screen glitch), "tv" (TV interference) or "wipe" (strip wipe, the default) */}
          <FeaturedSlider slides={FEATURED} transition="glitch" onOpen={(slide) => navigate(eventPath(slide.id))} />
        </section>
      </div>

      <section className="events__sheet">
        <div className="events__sheet-content">
          {/* Pinned at the sheet's resting line while the list scrolls under it */}
          <div className="events__sheet-header">
            <div className="events__handle" aria-hidden="true" />

            <div className={`section-header events__section-header${searchOpen ? ' is-searching' : ''}`}>
              <h2 className="section-title events__section-title">Todos os eventos</h2>
              <ExpandingSearch
                open={searchOpen}
                onOpenChange={setSearchOpen}
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

          <div className="events__list">
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
                <article className="event-item" key={event.id}>
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
                      <div className="event-item__price">
                        <p className="event-item__price-label">A partir de</p>
                        <p className="event-item__price-value">
                          <Amount value={event.priceFrom} />
                        </p>
                      </div>
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
