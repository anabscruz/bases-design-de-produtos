import nubankLogo from '../assets/images/nubank-logo.png'
import mastercard from '../assets/images/mastercard.png'
import './CreditCard.css'

/**
 * Nubank card. Collapsed, only its top strip (logo + card number) peeks out
 * from behind the balance card; expanded, it shows the full "Wallet Cards
 * Visible" layout. The two states animate into each other.
 */
export default function CreditCard({ expanded, onClick }) {
  return (
    <button
      type="button"
      className={`credit-card${expanded ? ' credit-card--expanded' : ''}`}
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={expanded ? 'Recolher cartões' : 'Mostrar cartões'}
    >
      <p className="credit-card__peek-number credit-card__number" aria-hidden="true">**** **** **** 1234</p>

      <div className="credit-card__left">
        <div className="credit-card__column">
          <img className="credit-card__logo" src={nubankLogo} width="33" height="18" alt="Nubank" />
          <p className="credit-card__name">Clinton Silva Elvis</p>
          <p className="credit-card__name credit-card__full-number">**** **** **** 1234</p>
        </div>
        <p className="credit-card__small">Venc 12/36</p>
      </div>

      <div className="credit-card__brand">
        <img src={mastercard} width="47" height="33" alt="Mastercard" />
        <p className="credit-card__small">International</p>
      </div>
    </button>
  )
}
