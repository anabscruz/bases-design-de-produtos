import Amount from './Amount.jsx'
import coin from '../assets/icons/coin.svg'
import './BalancePill.css'

export default function BalancePill({ value, hidden }) {
  return (
    <div className="balance-pill">
      <img src={coin} width="25" height="22" alt="" />
      <p className="balance-pill__value">
        <Amount value={value} hidden={hidden} />
      </p>
    </div>
  )
}
