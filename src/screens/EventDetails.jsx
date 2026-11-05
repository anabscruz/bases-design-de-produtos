import { useRef, useState } from 'react'
import Header from '../components/Header.jsx'
import Attendees from '../components/Attendees.jsx'
import Icon from '../components/Icon.jsx'
import hero from '../assets/images/event-rtm-hero.png'
import '../components/Screen.css'
import './EventDetails.css'

const EVENT = {
  name: 'RTM 2026',
  place: 'Itaipava - RJ',
  date: 'November 2nd - 2PM',
  price: { coins: '3,000', cash: '$500' },
  description: [
    'Rock the Mountain is a music and art festival held in Itaipava, Petrópolis, in the state of Rio de Janeiro. The concept is simple: to offer a unique, high-vibe experience for a special crowd, set against the backdrop of the charming mountains of Rio de Janeiro state!',
    'Amidst nature, RTM brings together youth, modernity, sustainability, freedom, style, fun, gastronomy, and—of course—PLENTY of music, for a day that promises to be unforgettable!',
  ],
  attendees: 'Tom, Kim and others will attend',
  venue: 'Parque de exposições de petrópolis',
  address: 'Estr. União e Indústria, 10000 - Itaipava, Petrópolis - RJ',
}

const TICKET_OPTIONS = [
  {
    id: 'meia-entrada',
    name: 'Meia Entrada',
    rules:
      'Estudantes (apresentar DNE), jovens de baixa renda (apresentar ID Jovem), menores de 21 anos e maiores de 60 anos (apresentar documento oficial).',
  },
  {
    id: 'meia-solidaria',
    name: 'Meia Solidária',
    rules: 'Meia-entrada para quem doar 1kg de alimento não perecível na entrada do festival.',
  },
  {
    id: 'meia-pcd',
    name: 'Meia PCD',
    rules: 'Pessoas com deficiência e um acompanhante (apresentar documento que comprove a deficiência).',
  },
  { id: 'inteira', name: 'Inteira', rules: 'Ingresso sem desconto, válido para todo o público.' },
]

const MAX_PER_OPTION = 10

const mapQuery = encodeURIComponent(`${EVENT.venue}, ${EVENT.address}`)
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
// Google Maps embed (no API key needed with output=embed)
const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`

/** "3,000 or $500" chip: the price in coins or in cash. */
function PriceChip({ coins, cash }) {
  return (
    <p className="price-chip">
      <Icon name="paid" size={18} className="price-chip__coin" />
      <span className="price-chip__value">{coins}</span>
      <span className="price-chip__or">or</span>
      <span className="price-chip__value">{cash}</span>
    </p>
  )
}

/** Figma "Página evento" (233:98): opened from the RTM posters on Events. */
export default function EventDetails({ navigate, onBack, balanceHidden, onToggleBalance }) {
  const ticketsRef = useRef(null)
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState('meia-entrada')
  const [quantities, setQuantities] = useState({ 'meia-entrada': 0, 'meia-solidaria': 2, 'meia-pcd': 0, inteira: 0 })
  const total = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0)

  const changeQuantity = (id, delta) =>
    setQuantities((current) => ({
      ...current,
      [id]: Math.min(MAX_PER_OPTION, Math.max(0, current[id] + delta)),
    }))

  const share = () => {
    const data = { title: EVENT.name, text: `${EVENT.name} · ${EVENT.place}`, url: window.location.href }
    if (navigator.share) navigator.share(data).catch(() => {})
    else navigator.clipboard?.writeText(data.url).catch(() => {})
  }

  return (
    <main className="screen event-details">
      <section className="event-hero">
        <img className="event-hero__image" src={hero} alt="" />
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

        <div className="event-hero__content">
          <h1 className="event-hero__title">{EVENT.name}</h1>
          <p className="event-hero__when">
            {EVENT.place}
            <span aria-hidden="true">  ·  </span>
            <span className="visually-hidden">, </span>
            {EVENT.date}
          </p>
          <div className="event-hero__ctas">
            <button
              type="button"
              className="order-button"
              onClick={() => ticketsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <span className="order-button__label">Order</span>
              <PriceChip {...EVENT.price} />
            </button>
            <button
              type="button"
              className={`event-hero__icon-button${saved ? ' is-saved' : ''}`}
              onClick={() => setSaved((value) => !value)}
              aria-pressed={saved}
              aria-label="Salvar evento"
            >
              <Icon name="favorite" size={26} />
            </button>
            <button type="button" className="event-hero__icon-button" onClick={share} aria-label="Compartilhar evento">
              <Icon name="share" size={24} />
            </button>
          </div>
        </div>
      </section>

      <div className="event-details__content">
        <div className="event-details__description">
          {EVENT.description.map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </div>

        <div className="event-details__attendees">
          <Attendees className="attendees--large" />
          <p>{EVENT.attendees}</p>
        </div>

        <div className="event-map">
          <div className="event-map__frame">
            <iframe
              src={mapEmbedUrl}
              title={`Mapa: ${EVENT.venue}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a className="event-map__address" href={mapsUrl} target="_blank" rel="noreferrer">
            <span className="event-map__venue">{EVENT.venue}</span>
            <span className="event-map__street">{EVENT.address}</span>
          </a>
        </div>

        <section className="ticket-options" ref={ticketsRef} aria-labelledby="ticket-options-title">
          <h2 className="ticket-options__title" id="ticket-options-title">Ticket options</h2>

          <ul className="ticket-options__list">
            {TICKET_OPTIONS.map((option) => {
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
                    <span className="ticket-option__name">{option.name}</span>
                    {quantity > 0 && (
                      <span className="ticket-option__count" aria-label={`${quantity} selecionados`}>
                        {quantity}
                      </span>
                    )}
                    <PriceChip {...EVENT.price} />
                  </button>

                  {isOpen && (
                    <div className="ticket-option__body" id={`ticket-option-${option.id}`}>
                      <p className="ticket-option__rules">{option.rules}</p>
                      <div className="stepper" role="group" aria-label={`Quantidade: ${option.name}`}>
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

          <button type="button" className="buy-button" disabled={total === 0}>
            Comprar
            {total > 0 && <span className="visually-hidden">{` ${total} ingressos`}</span>}
          </button>
        </section>
      </div>
    </main>
  )
}
