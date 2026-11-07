import { useRef } from 'react'
import Header from '../components/Header.jsx'
import useDragScroll from '../hooks/useDragScroll.js'
import barcode from '../assets/images/barcode.png'
import { MY_TICKETS, TICKET_RULES } from '../data/tickets.js'
import '../components/Screen.css'
import './TicketDetails.css'

function Field({ label, value, wide = false }) {
  return (
    <div className={`ticket-card__field${wide ? ' ticket-card__field--wide' : ''}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

/** Figma "Ticket" (291:2389): opened from the Home "Upcoming events" tickets and the tab bar. */
export default function TicketDetails({ navigate, balanceHidden, onToggleBalance }) {
  const cardsRef = useRef(null)
  useDragScroll(cardsRef)

  return (
    <main className="screen screen--padded ticket-details">
      <Header
        balanceHidden={balanceHidden}
        onToggleBalance={onToggleBalance}
        onMenu={() => navigate('menu')}
      />

      <div className="carousel carousel--bleed ticket-details__cards" ref={cardsRef} tabIndex={0} aria-label="Ingressos">
        {MY_TICKETS.map((ticket) => (
          // Paper ticket: details card + barcode stub, white in both themes
          <article className="ticket-card" key={ticket.id}>
            <div className="ticket-card__main">
              {/* Figma 292:2566: coloured band with the event name */}
              <div className="ticket-card__head">
                <h1 className="ticket-card__event">{ticket.event}</h1>
              </div>
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
          {TICKET_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
