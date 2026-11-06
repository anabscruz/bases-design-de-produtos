import Amount from './Amount.jsx'
import './Price.css'

/**
 * Event price, Figma 284:1013: an optional small label ("A partir de") over the
 * value in mono, highlighted (lime on dark, black on light). Used in the Events
 * list, the event hero and the ticket options.
 */
export default function Price({ value, label, className = '' }) {
  return (
    <p className={`price ${className}`}>
      {label ? <span className="price__label">{label}</span> : <span className="visually-hidden">Preço: </span>}
      <span className="price__value">
        <Amount value={value} />
      </span>
    </p>
  )
}
