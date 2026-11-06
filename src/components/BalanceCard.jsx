import Amount from './Amount.jsx'
import Icon from './Icon.jsx'
import './BalanceCard.css'

export default function BalanceCard({ value, hidden, onCardClick }) {
  // Tapping the card itself toggles the card stack; its own buttons keep their action
  const handleClick = (event) => {
    if (onCardClick && !event.target.closest('button')) onCardClick()
  }

  return (
    <section
      className={`balance-card${onCardClick ? ' balance-card--clickable' : ''}`}
      aria-label="Saldo da conta"
      onClick={handleClick}
    >
      <div className="balance-card__top">
        <Icon name="bolt" size={30} className="balance-card__bolt" />
        <p>Saldo da conta</p>
      </div>
      <p className="balance-card__value">
        <Amount value={value} hidden={hidden} />
      </p>
      <div className="balance-card__actions">
        <button type="button">Depositar</button>
        <button type="button">Transferir</button>
        <button type="button">Pagar</button>
      </div>
    </section>
  )
}
