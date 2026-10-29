import Amount from './Amount.jsx'
import flash from '../assets/icons/flash-white.svg'
import './BalanceCard.css'

export default function BalanceCard({ value, hidden }) {
  return (
    <section className="balance-card" aria-label="Account balance">
      <div className="balance-card__top">
        <img src={flash} width="27" height="25" alt="" />
        <p>Account Balance</p>
      </div>
      <p className="balance-card__value">
        <Amount value={value} separator="" hidden={hidden} />
      </p>
      <div className="balance-card__actions">
        <button type="button">Deposit</button>
        <button type="button">Transfer</button>
        <button type="button">Pay</button>
      </div>
      <button type="button" className="balance-card__footer">Transactions</button>
    </section>
  )
}
