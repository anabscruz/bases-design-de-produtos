import { useState } from 'react'
import Header from '../components/Header.jsx'
import ExpandingSearch from '../components/ExpandingSearch.jsx'
import Attendees from '../components/Attendees.jsx'
import Amount from '../components/Amount.jsx'
import SaveButton from '../components/SaveButton.jsx'
import Icon from '../components/Icon.jsx'
import lollapalooza from '../assets/images/poster-lollapalooza.jpg'
import coachella from '../assets/images/poster-coachella.jpg'
import rtm from '../assets/images/poster-rtm.jpg'
import rtmList from '../assets/images/poster-rtm-list.jpg'
import artrio from '../assets/images/poster-artrio.jpg'
import afropunk from '../assets/images/poster-afropunk.jpg'
import boleBlue from '../assets/images/poster-bole-blue.jpg'
import bolePink from '../assets/images/poster-bole-pink.jpg'
import gramado from '../assets/images/poster-gramado.jpg'
import festivalDoRio from '../assets/images/poster-festival-do-rio.jpg'
import parintins from '../assets/images/poster-parintins.jpg'
import viradaCultural from '../assets/images/poster-virada-cultural.jpg'
import partyPhoto from '../assets/images/party-photo-grid.jpg'
import benHoward from '../assets/images/poster-ben-howard.jpg'
import pasteTexture from '../assets/images/poster-paste-texture.jpg'
import shareIcon from '../assets/icons/share-external.svg'
import '../components/Screen.css'
import '../components/Poster.css'
import './Events.css'

const TOP_EVENTS = [
  { id: 'lollapalooza', image: lollapalooza, name: 'Lollapalooza' },
  { id: 'coachella', image: coachella, name: 'Coachella' },
  { id: 'rtm', image: rtm, name: 'RTM 2026' },
  { id: 'artrio', image: artrio, name: 'ArtRio 26' },
  { id: 'afropunk', image: afropunk, name: 'Afropunk' },
  { id: 'bole', image: boleBlue, name: 'Bole Festival 2022', place: 'Port Harcourt', info: '2 nov' },
  { id: 'gramado', image: gramado, name: 'Festival de Cinema de Gramado' },
  { id: 'bole-pink', image: bolePink, name: 'Bole Festival 2022', place: 'Port Harcourt', info: 'R$ 3.000' },
  { id: 'festival-do-rio', image: festivalDoRio, name: 'Festival do Rio' },
  { id: 'parintins', image: parintins, name: 'Festival de Parintins' },
  { id: 'party', image: partyPhoto, name: 'Bole Festival' },
  { id: 'virada', image: viradaCultural, name: 'Virada Cultural' },
]

// Events with a details page (Figma only has RTM's)
const HAS_DETAILS = new Set(['rtm'])

function shareEvent(event) {
  const data = { title: event.name, text: `${event.name} · ${event.place} · ${event.date}`, url: window.location.href }
  if (navigator.share) navigator.share(data).catch(() => {})
  else navigator.clipboard?.writeText(`${data.text} ${data.url}`).catch(() => {})
}

const ALL_EVENTS = [
  {
    id: 'ben-howard',
    image: benHoward,
    name: 'Ben Howard',
    place: 'Audio - São Paulo',
    date: '26 de setembro - 21h',
    price: '3.000',
  },
  { id: 'rtm', image: rtmList, name: 'RTM 2026', place: 'Itaipava - RJ', date: '2 de novembro · 14h', price: '3.000' },
  { id: 'afropunk', image: afropunk, name: 'Afropunk', place: 'Salvador - BA', date: '2 de novembro · 14h', price: '3.000' },
]

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
  const term = query.trim().toLowerCase()
  const events = term
    ? ALL_EVENTS.filter((event) => `${event.name} ${event.place}`.toLowerCase().includes(term))
    : ALL_EVENTS

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
          <h2 className="section-title screen__inset">Em alta</h2>
          <div className="events__grid">
            {TOP_EVENTS.map((event) => {
              const opensDetails = HAS_DETAILS.has(event.id)
              const Tile = opensDetails ? 'button' : 'article'
              return (
                <Tile
                  className="poster poster--tile"
                  key={event.id}
                  aria-label={event.name}
                  type={opensDetails ? 'button' : undefined}
                  onClick={opensDetails ? () => navigate('event') : undefined}
                >
                  <img className="poster__image" src={event.image} alt="" />
                  {event.place && (
                    <div className="poster__caption">
                      <p className="poster__title">{event.name}</p>
                      <p className="poster__meta">{event.place}</p>
                      <p className="poster__meta">{event.info}</p>
                    </div>
                  )}
                </Tile>
              )
            })}
          </div>
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
              <button type="button" className="events__filter" aria-label="Filtrar eventos">
                <Icon name="tune" size={30} />
              </button>
            </div>
          </div>

          <div className="events__list">
            {events.length === 0 && <p className="events__empty">Nenhum evento encontrado para “{query.trim()}”</p>}
            {/* Figma "Frame 519" (278:321): pasted poster + details, social row at the bottom */}
            {events.map((event) => {
              const openDetails = HAS_DETAILS.has(event.id) ? () => navigate('event') : undefined
              const ListPoster = openDetails ? 'button' : 'div'
              const EventName = openDetails ? 'button' : 'span'
              return (
                <article className="event-item" key={event.id}>
                  <ListPoster
                    className="poster poster--list"
                    type={openDetails ? 'button' : undefined}
                    onClick={openDetails}
                    aria-label={openDetails ? `Ver ${event.name}` : undefined}
                  >
                    <img className="poster__image" src={event.image} alt="" />
                    {event.caption && (
                      <>
                        <p className="poster__title">{event.name}</p>
                        <p className="poster__meta">{event.caption.place}</p>
                        <p className="poster__meta">{event.caption.date}</p>
                      </>
                    )}
                    {/* Wrinkled paper on top: the poster looks pasted on a wall */}
                    <img className="poster__paste" src={pasteTexture} alt="" />
                  </ListPoster>

                  <div className="event-item__details">
                    <div className="event-item__info">
                      <div className="event-item__title-row">
                        <h3 className="event-item__name">
                          <EventName
                            className="event-item__name-link"
                            type={openDetails ? 'button' : undefined}
                            onClick={openDetails}
                          >
                            {event.name}
                          </EventName>
                        </h3>
                        <SaveButton
                          size={20}
                          saved={saved.has(event.id)}
                          onToggle={() => toggleSaved(event.id)}
                          label={`Salvar ${event.name}`}
                        />
                      </div>
                      <p className="event-item__place">{event.place}</p>
                      <p className="event-item__date">{event.date}</p>
                    </div>

                    <div className="event-item__footer">
                      <div className="event-item__price">
                        <p className="event-item__price-label">A partir de</p>
                        <p className="event-item__price-value">
                          <Amount value={event.price} />
                        </p>
                      </div>
                      <div className="event-item__social">
                        <Attendees />
                        <button
                          type="button"
                          className="event-item__share"
                          onClick={() => shareEvent(event)}
                          aria-label={`Compartilhar ${event.name}`}
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
    </main>
  )
}
