import Amount from './Amount.jsx'
import './PriceTag.css'

/**
 * The price of an event, drawn as a paper price tag (pointed end + punched hole).
 * It deliberately shares nothing with the balance pill (lime, coin icon):
 * the tag is what something costs, the pill is what you have.
 * Same currency as the balance, so the two can be compared at a glance.
 */
export default function PriceTag({ value, label = 'Preço', className = '' }) {
  return (
    <p className={`price-tag ${className}`}>
      <span className="visually-hidden">{`${label}: `}</span>
      <Amount value={value} />
    </p>
  )
}
