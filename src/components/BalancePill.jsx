import Amount from './Amount.jsx'
import coin from '../assets/icons/coin.svg'
import './BalancePill.css'

/** Account balance: yellow pill with the coin (Figma "Account balance", 278:779). */
export default function BalancePill({ value, hidden }) {
  return (
    <div className="balance-pill">
      <img className="balance-pill__coin" src={coin} width="21" height="19" alt="" />
      <p className="balance-pill__value">
        <span className="visually-hidden">Saldo: </span>
        <Amount value={value} hidden={hidden} />
      </p>
    </div>
  )
}
