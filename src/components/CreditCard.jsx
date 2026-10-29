import nubankLogo from '../assets/images/nubank-logo.png'
import mastercard from '../assets/images/mastercard.png'
import './CreditCard.css'

/**
 * Nubank card. "stacked" is the compact version peeking behind the balance card,
 * "full" is the expanded card shown in "Wallet Cards Visible".
 */
export default function CreditCard({ variant = 'full', onClick }) {
  const logo = <img className="credit-card__logo" src={nubankLogo} width="33" height="18" alt="Nubank" />
  const brand = <img src={mastercard} width="47" height="33" alt="Mastercard" />

  if (variant === 'stacked') {
    return (
      <button type="button" className="credit-card credit-card--stacked" onClick={onClick} aria-label="Mostrar cartões">
        <div className="credit-card__column">
          <div className="credit-card__row">
            {logo}
            <p className="credit-card__number">**** **** **** 1234</p>
          </div>
          <p className="credit-card__name">Clinton Silva Elvis</p>
          <p className="credit-card__small">Venc 12/36</p>
        </div>
        <div className="credit-card__brand">
          <p className="credit-card__small">International</p>
          {brand}
        </div>
      </button>
    )
  }

  return (
    <button type="button" className="credit-card credit-card--full" onClick={onClick} aria-label="Recolher cartões">
      <div className="credit-card__left">
        <div className="credit-card__column">
          {logo}
          <p className="credit-card__name">Clinton Silva Elvis</p>
          <p className="credit-card__name">**** **** **** 1234</p>
        </div>
        <p className="credit-card__small">Venc 12/36</p>
      </div>
      <div className="credit-card__brand credit-card__brand--bottom">
        {brand}
        <p className="credit-card__small">International</p>
      </div>
    </button>
  )
}
