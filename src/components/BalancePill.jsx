import Amount from './Amount.jsx'
import Icon from './Icon.jsx'
import './BalancePill.css'

export default function BalancePill({ value, hidden }) {
  return (
    <div className="balance-pill">
      <Icon name="paid" size={26} className="balance-pill__coin" />
      <p className="balance-pill__value">
        <Amount value={value} hidden={hidden} />
      </p>
    </div>
  )
}
