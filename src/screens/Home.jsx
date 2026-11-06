import Header from '../components/Header.jsx'
import Ticket from '../components/Ticket.jsx'
import benHoward from '../assets/images/poster-home-ben-howard.png'
import placebo from '../assets/images/poster-home-placebo.png'
import cabaretVoltaire from '../assets/images/poster-home-cabaret-voltaire.png'
import '../components/Screen.css'
import '../components/Poster.css'
import './Home.css'

const UPCOMING = [
  { id: 1, title: 'Show do Omah Lay', date: '20 mar', time: '21h' },
  { id: 2, title: 'Show do Omah Lay', date: '20 mar', time: '21h' },
]

// "Em alta" posters: the artwork already carries the event's name, place and date
const TOP_POSTERS = [
  {
    id: 'ben-howard',
    image: benHoward,
    alt: 'Ben Howard, South America Tour 2026: Audio, São Paulo, 26/09',
  },
  {
    id: 'placebo',
    image: placebo,
    alt: 'Placebo, 30th Anniversary Tour: São Paulo 20/02/27, Brasília 23/02/27, Curitiba 26/02/27, Porto Alegre 28/02/27',
  },
  {
    id: 'cabaret-voltaire',
    image: cabaretVoltaire,
    alt: 'Cabaret Voltaire, Final Tour: sábado, 06/03/2027, Cine Joia, São Paulo',
  },
]

export default function Home({ navigate, balanceHidden, onToggleBalance }) {
  return (
    <main className="screen screen--padded">
      <Header
        greeting
        balanceHidden={balanceHidden}
        onToggleBalance={onToggleBalance}
        onMenu={() => navigate('menu')}
      />

      <section className="screen__section home__section">
        {/* The whole row (title + arrow) opens the Events screen */}
        <h2 className="home__top-heading">
          <button type="button" className="section-header home__see-all" onClick={() => navigate('events')}>
            <span className="section-title home__title home__top-title">Trending</span>
            {/* Drawn edge to edge (no glyph padding) so it can sit on the text baseline */}
            <svg className="home__arrow" width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M1.6 22.4 22.4 1.6M6 1.6h16.4V18"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinejoin="miter"
              />
            </svg>
            <span className="visually-hidden">: ver todos os eventos</span>
          </button>
        </h2>

        <div className="carousel home__posters">
          {TOP_POSTERS.map((poster) => (
            <article className="poster poster--featured" key={poster.id}>
              <img className="poster__image" src={poster.image} alt={poster.alt} />
            </article>
          ))}
        </div>
      </section>

      <section className="screen__section home__section">
        {/* Marquee: the title repeats and keeps sliding left on one line.
            Two identical groups make the loop seamless (the track moves by -50%). */}
        <h2 className="section-title home__title home__marquee">
          <span className="visually-hidden">Seus ingressos</span>
          <span className="home__marquee-track" aria-hidden="true">
            {[0, 1].map((group) => (
              <span className="home__marquee-group" key={group}>
                {[0, 1, 2].map((item) => (
                  <span className="home__marquee-item" key={item}>
                    Seus ingressos
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h2>
        <div className="carousel home__tickets">
          {UPCOMING.map((event) => (
            <Ticket key={event.id} title={event.title} date={event.date} time={event.time} onOpen={() => navigate('ticket')} />
          ))}
        </div>
      </section>

    </main>
  )
}
