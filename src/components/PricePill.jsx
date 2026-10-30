import Amount from './Amount.jsx'
import Icon from './Icon.jsx'
import './PricePill.css'

export default function PricePill({ value }) {
  return (
    <div className="price-pill">
      <Icon name="paid" size={18} />
      <p>
        <Amount value={value} />
      </p>
    </div>
  )
}
