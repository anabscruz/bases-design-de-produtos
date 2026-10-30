import Amount from './Amount.jsx'
import Icon from './Icon.jsx'
import './BalanceCard.css'

export default function BalanceCard({ value, hidden, onCardClick, onTransactionsClick, transactionsActive = false }) {
  // Tapping the card itself toggles the card stack; its own buttons keep their action
  const handleClick = (event) => {
    if (onCardClick && !event.target.closest('button')) onCardClick()
  }

  return (
    <section
      className={`balance-card${onCardClick ? ' balance-card--clickable' : ''}`}
      aria-label="Account balance"
      onClick={handleClick}
    >
      <div className="balance-card__top">
        <Icon name="bolt" size={30} className="balance-card__bolt" />
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
      <button
        type="button"
        className="balance-card__footer"
        onClick={onTransactionsClick}
        aria-pressed={onTransactionsClick ? transactionsActive : undefined}
      >
        Transactions
      </button>
    </section>
  )
}
