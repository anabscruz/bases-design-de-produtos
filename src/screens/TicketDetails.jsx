import { useRef } from 'react'
import Header from '../components/Header.jsx'
import useDragScroll from '../hooks/useDragScroll.js'
import barcode from '../assets/images/barcode.png'
import '../components/Screen.css'
import './TicketDetails.css'

const TICKETS = [
  {
    id: 1,
    event: 'Lollapalooza 2027',
    holder: 'Clinton Elvis',
    date: '19 mar. 2027',
    time: '14h',
    type: 'Lounge',
    orderId: '872847829',
    location: 'Autódromo de Interlagos - SP',
  },
  {
    id: 2,
    event: 'Lollapalooza 2027',
    holder: 'Clinton Elvis',
    date: '19 mar. 2027',
    time: '14h',
    type: 'Lounge',
    orderId: '872847829',
    location: 'Autódromo de Interlagos - SP',
  },
]

const RULES = ['Obrigatório apresentar documento com foto', 'Objetos proibidos no festival: latas, guarda-chuvas e armas']

function Field({ label, value, wide = false }) {
  return (
    <div className={`ticket-card__field${wide ? ' ticket-card__field--wide' : ''}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

/** Figma "Ticket" (139:405): opened from the Home "Upcoming events" tickets. */
export default function TicketDetails({ navigate, onBack, balanceHidden, onToggleBalance }) {
  const cardsRef = useRef(null)
  useDragScroll(cardsRef)

  return (
    <main className="screen screen--padded ticket-details">
      <Header
        onBack={onBack}
        showBalance={false}
        balanceHidden={balanceHidden}
        onToggleBalance={onToggleBalance}
        onMenu={() => navigate('menu')}
      />

      <div className="carousel carousel--bleed ticket-details__cards" ref={cardsRef} tabIndex={0} aria-label="Ingressos">
        {TICKETS.map((ticket) => (
          // Figma "Ingresso" (266:1802): details card + separate barcode stub
          <article className="ticket-card" key={ticket.id}>
            <div className="ticket-card__main">
              <h1 className="ticket-card__event">{ticket.event}</h1>
              <dl className="ticket-card__fields">
                <Field label="Titular" value={ticket.holder} wide />
                <Field label="Data" value={ticket.date} />
                <Field label="Horário" value={ticket.time} />
                <Field label="Tipo de ingresso" value={ticket.type} />
                <Field label="Nº do pedido" value={ticket.orderId} />
                <Field label="Local" value={ticket.location} wide />
              </dl>
            </div>
            <div className="ticket-card__barcode">
              <img src={barcode} width="298" height="40" alt={`Código de barras do pedido ${ticket.orderId}`} />
            </div>
          </article>
        ))}
      </div>

      <section className="screen__section ticket-details__rules">
        <h2 className="section-title">Regras</h2>
        <ul>
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
