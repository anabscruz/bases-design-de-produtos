import Header from '../components/Header.jsx'
import Ticket from '../components/Ticket.jsx'
import Attendees from '../components/Attendees.jsx'
import Icon from '../components/Icon.jsx'
import boleBlue from '../assets/images/poster-bole-blue.jpg'
import partyPhoto from '../assets/images/party-photo.jpg'
import '../components/Screen.css'
import '../components/Poster.css'
import './Home.css'

const UPCOMING = [
  { id: 1, title: 'Omah Lay Rave show', date: 'Mar 20' },
  { id: 2, title: 'Omah Lay Rave show', date: 'Mar 20' },
]

export default function Home({ navigate, balanceHidden, onToggleBalance }) {
  return (
    <main className="screen screen--padded">
      <Header
        balanceHidden={balanceHidden}
        onToggleBalance={onToggleBalance}
        onMenu={() => navigate('menu')}
      />

      <div className="greeting">
        <p>Hello,</p>
        <p>Clinton Elvis</p>
      </div>

      <section className="screen__section home__section">
        <h2 className="home__upcoming-title">Upcoming events</h2>
        <div className="carousel home__tickets">
          {UPCOMING.map((event) => (
            <Ticket key={event.id} title={event.title} date={event.date} onOpen={() => navigate('ticket')} />
          ))}
        </div>
      </section>

      <section className="screen__section home__section">
        {/* The whole row (title + chevron) opens the Events screen */}
        <h2 className="home__top-heading">
          <button type="button" className="section-header home__see-all" onClick={() => navigate('events')}>
            <span className="section-title home__top-title">Top Event</span>
            <Icon name="chevron_right" size={32} className="home__chevron" />
            <span className="visually-hidden">: ver todos os eventos</span>
          </button>
        </h2>

        <div className="carousel home__posters">
          <article className="poster poster--featured">
            <img className="poster__image" src={boleBlue} alt="" />
            <Attendees className="attendees--scattered" />
            <div className="poster__caption">
              <p className="poster__title">Bole Festival 2022</p>
              <p className="poster__meta">Part Harcourt</p>
              <p className="poster__meta">N3,000</p>
            </div>
          </article>

          <article className="poster poster--featured poster--photo">
            <img className="poster__image" src={partyPhoto} alt="" />
            <p className="poster__photo-title">
              BoleFestival
              <br />
              2022
            </p>
            <p className="poster__photo-meta" style={{ top: 192.5 }}>Port Harcourt</p>
            <p className="poster__photo-meta" style={{ top: 222 }}>N3,000</p>
          </article>
        </div>
      </section>

    </main>
  )
}
