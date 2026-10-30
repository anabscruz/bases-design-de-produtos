import Header from '../components/Header.jsx'
import Attendees from '../components/Attendees.jsx'
import PricePill from '../components/PricePill.jsx'
import filterIcon from '../assets/icons/filter.svg'
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
import '../components/Screen.css'
import '../components/Poster.css'
import './Events.css'

const TOP_EVENTS = [
  { id: 'lollapalooza', image: lollapalooza, name: 'Lollapalooza' },
  { id: 'coachella', image: coachella, name: 'Coachella' },
  { id: 'rtm', image: rtm, name: 'RTM 2026' },
  { id: 'artrio', image: artrio, name: 'ArtRio 26' },
  { id: 'afropunk', image: afropunk, name: 'Afropunk' },
  { id: 'bole', image: boleBlue, name: 'Bole Festival 2022', place: 'Part Harcourt', info: 'Nov 2nd' },
  { id: 'gramado', image: gramado, name: 'Festival de Cinema de Gramado' },
  { id: 'bole-pink', image: bolePink, name: 'Bole Festival 2022', place: 'Part Harcourt', info: 'N3,000' },
  { id: 'festival-do-rio', image: festivalDoRio, name: 'Festival do Rio' },
  { id: 'parintins', image: parintins, name: 'Festival de Parintins' },
  { id: 'party', image: partyPhoto, name: 'Bole Festival' },
  { id: 'virada', image: viradaCultural, name: 'Virada Cultural' },
]

const ALL_EVENTS = [
  {
    id: 'bole',
    image: boleBlue,
    name: 'Bole Festival 2026',
    caption: { place: 'Part Harcourt', date: '10/28' },
    address: '@ Part Harcourt',
    date: 'October 28th - 9PM',
    price: '3,000',
  },
  { id: 'rtm', image: rtmList, name: 'RTM 2026', address: '@ Itaipava - RJ', date: 'November 2nd - 2PM', price: '3,000' },
  { id: 'afropunk', image: afropunk, name: 'Afropunk', address: '@ Salvador - BA', date: 'November 2nd - 2PM', price: '3,000' },
]

export default function Events({ navigate, balanceHidden, onToggleBalance }) {
  return (
    <main className="screen events">
      {/* Header + poster wall stay put while "All Events" scrolls over them */}
      <div className="events__backdrop">
        <div className="screen__inset">
          <Header
            balanceHidden={balanceHidden}
            onToggleBalance={onToggleBalance}
            onMenu={() => navigate('menu')}
            showBell
          />
        </div>

        <section className="events__top">
          <h2 className="section-title screen__inset">Top Events</h2>
          <div className="events__grid">
            {TOP_EVENTS.map((event) => (
              <article className="poster poster--tile" key={event.id} aria-label={event.name}>
                <img className="poster__image" src={event.image} alt="" />
                {event.place && (
                  <div className="poster__caption">
                    <p className="poster__title">{event.name}</p>
                    <p className="poster__meta">{event.place}</p>
                    <p className="poster__meta">{event.info}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="events__sheet">
        <div className="events__handle" aria-hidden="true" />

        <div className="section-header">
          <h2 className="section-title">All Events</h2>
          <button type="button" className="events__filter" aria-label="Filtrar eventos">
            <img src={filterIcon} width="26" height="22" alt="" />
          </button>
        </div>

        <div className="events__list">
          {ALL_EVENTS.map((event) => (
            <article className="event-item" key={event.id}>
              <div className="poster poster--list">
                <img className="poster__image" src={event.image} alt="" />
                {event.caption && (
                  <>
                    <p className="poster__title">{event.name}</p>
                    <p className="poster__meta">{event.caption.place}</p>
                    <p className="poster__meta">{event.caption.date}</p>
                  </>
                )}
              </div>

              <div className="event-item__details">
                <h3 className="event-item__name">{event.name}</h3>
                <div className="event-item__when">
                  <p>{event.address}</p>
                  <p>{event.date}</p>
                </div>
                <Attendees />
                <PricePill value={event.price} />
                <div className="event-item__ctas">
                  <button type="button" className="outline-pill">Order</button>
                  <button type="button" className="outline-pill">Save</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
