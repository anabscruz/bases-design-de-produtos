import { useRef, useState } from 'react'
import Header from '../components/Header.jsx'
import Attendees from '../components/Attendees.jsx'
import Icon from '../components/Icon.jsx'
import Price from '../components/Price.jsx'
import SaveButton from '../components/SaveButton.jsx'
import { attendeesLabel, formatPrice, getEvent } from '../data/events.js'
import '../components/Screen.css'
import './EventDetails.css'

const MAX_PER_OPTION = 10

// Google Maps: search link + embed (no API key needed with output=embed)
function mapUrls(event) {
  const query = encodeURIComponent(`${event.venue}, ${event.address}`)
  return {
    link: `https://www.google.com/maps/search/?api=1&query=${query}`,
    embed: `https://maps.google.com/maps?q=${query}&z=14&output=embed`,
  }
}

// Unknown id in the URL: say so and offer the way back
function EventNotFound({ navigate, onBack, balanceHidden, onToggleBalance }) {
  return (
    <main className="screen screen--padded event-details event-details--missing">
      <Header onBack={onBack} balanceHidden={balanceHidden} onToggleBalance={onToggleBalance} onMenu={() => navigate('menu')} />
      <div className="event-details__missing">
        <h1 className="section-title">Evento não encontrado</h1>
        <p>Esse evento pode ter sido removido ou o link está incorreto.</p>
        <button type="button" className="button-primary" onClick={() => navigate('events')}>
          Ver todos os eventos
        </button>
      </div>
    </main>
  )
}

/**
 * Figma "Página evento" (233:98), filled from src/data/events.json.
 * The event comes from the URL: "#/event/placebo" → param "placebo".
 */
export default function EventDetails({ param, ...props }) {
  // "#/event" without an id keeps opening RTM, the event the Figma page was drawn for
  const event = getEvent(param ?? 'rtm')
  if (!event) return <EventNotFound {...props} />
  // key: a different event starts with fresh choices (quantities, open option)
  return <EventPage key={event.id} event={event} {...props} />
}

function EventPage({ event, navigate, onBack, balanceHidden, onToggleBalance }) {
  const ticketsRef = useRef(null)
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState(event.tickets[0]?.id ?? null)
  const [quantities, setQuantities] = useState(() => Object.fromEntries(event.tickets.map((ticket) => [ticket.id, 0])))
  const total = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0)
  const totalAmount = event.tickets.reduce((sum, ticket) => sum + ticket.amount * quantities[ticket.id], 0)
  // While the total row folds away, keep showing the last amount instead of "R$ 0"
  const lastTotal = useRef(0)
  if (totalAmount > 0) lastTotal.current = totalAmount
  const map = mapUrls(event)

  const changeQuantity = (id, delta) =>
    setQuantities((current) => ({
      ...current,
      [id]: Math.min(MAX_PER_OPTION, Math.max(0, current[id] + delta)),
    }))

  const share = () => {
    const data = { title: event.title, text: `${event.title} · ${event.place}`, url: window.location.href }
    if (navigator.share) navigator.share(data).catch(() => {})
    else navigator.clipboard?.writeText(data.url).catch(() => {})
  }

  return (
    <main className="screen event-details">
      <section className="event-hero">
        <img className="event-hero__image" src={event.artistPhotoUrl} alt="" />
        <div className="event-hero__shade" aria-hidden="true" />

        <div className="event-hero__header screen__inset">
          <Header
            tone="light"
            onBack={onBack}
            balanceHidden={balanceHidden}
            onToggleBalance={onToggleBalance}
            onMenu={() => navigate('menu')}
          />
        </div>

        {/* Figma 304:3176: save + share, top right under the header */}
        <div className="event-hero__actions">
          <SaveButton
            className="event-hero__icon-button"
            size={26}
            saved={saved}
            onToggle={() => setSaved((value) => !value)}
          />
          <button type="button" className="event-hero__icon-button" onClick={share} aria-label="Compartilhar evento">
            <Icon name="share" size={24} />
          </button>
        </div>

        <div className="event-hero__content">
          <h1 className="event-hero__title">{event.title}</h1>
          {/* Date on top, place underneath, both in mono */}
          <p className="event-hero__when">
            <span className="event-hero__date">{event.dateLabel}</span>
            <span className="visually-hidden">, </span>
            <span className="event-hero__place">{event.place}</span>
          </p>
          {/* Figma 304:3159: price on the left, order button on the right */}
          <div className="event-hero__ctas">
            <Price className="event-hero__price" value={event.priceFrom} label="A partir de" />
            <button
              type="button"
              className="event-hero__buy"
              onClick={() => ticketsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              Comprar
            </button>
          </div>
        </div>
      </section>

      <div className="event-details__content">
        <div className="event-details__description">
          {event.description.map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </div>

        <div className="event-details__attendees">
          <Attendees className="attendees--large" people={event.attendees} />
          <p>{attendeesLabel(event.attendees)}</p>
        </div>

        <div className="event-map">
          <div className="event-map__frame">
            <iframe
              src={map.embed}
              title={`Mapa: ${event.venue}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a className="event-map__address" href={map.link} target="_blank" rel="noreferrer">
            <span className="event-map__venue">{event.venue}</span>
            <span className="event-map__street">{event.address}</span>
          </a>
        </div>

        <section className="ticket-options" ref={ticketsRef} aria-labelledby="ticket-options-title">
          <h2 className="ticket-options__title" id="ticket-options-title">Ingressos</h2>

          <div className="ticket-options__summary">
          <ul className="ticket-options__list">
            {event.tickets.map((option) => {
              const isOpen = expanded === option.id
              const quantity = quantities[option.id]
              return (
                <li className={`ticket-option${isOpen ? ' is-open' : ''}`} key={option.id}>
                  <button
                    type="button"
                    className="ticket-option__header"
                    onClick={() => setExpanded(isOpen ? null : option.id)}
                    aria-expanded={isOpen}
                    aria-controls={`ticket-option-${option.id}`}
                  >
                    <span className="ticket-option__name">{option.label}</span>
                    {quantity > 0 && (
                      <span className="ticket-option__count" aria-label={`${quantity} selecionados`}>
                        {quantity}
                      </span>
                    )}
                    <Price value={option.price} />
                  </button>

                  {isOpen && (
                    <div className="ticket-option__body" id={`ticket-option-${option.id}`}>
                      <p className="ticket-option__rules">{option.rules}</p>
                      <div className="stepper" role="group" aria-label={`Quantidade: ${option.label}`}>
                        <button
                          type="button"
                          className="stepper__button"
                          onClick={() => changeQuantity(option.id, -1)}
                          disabled={quantity === 0}
                          aria-label="Diminuir"
                        >
                          <Icon name="remove" size={20} />
                        </button>
                        <output className="stepper__value" aria-live="polite">
                          {quantity}
                        </output>
                        <button
                          type="button"
                          className="stepper__button"
                          onClick={() => changeQuantity(option.id, 1)}
                          disabled={quantity === MAX_PER_OPTION}
                          aria-label="Aumentar"
                        >
                          <Icon name="add" size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Figma 303:3149: total row, only with at least one ticket; it unfolds under the list */}
          <div className={`ticket-total${total > 0 ? ' is-visible' : ''}`} aria-hidden={total === 0}>
            <div className="ticket-total__clip">
              <div className="ticket-total__row">
                <span className="ticket-total__label">Total</span>
                <Price className="ticket-total__price" value={formatPrice(lastTotal.current)} />
              </div>
            </div>
          </div>
          </div>

          <button type="button" className="buy-button" disabled={total === 0}>
            Finalizar compra
            {total > 0 && <span className="visually-hidden">{` ${total} ingressos`}</span>}
          </button>
        </section>
      </div>
    </main>
  )
}
