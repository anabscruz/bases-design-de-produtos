import BalancePill from './BalancePill.jsx'
import avatar from '../assets/images/avatar.png'
import Icon from './Icon.jsx'
import './Header.css'

/**
 * App header. Two avatar layouts exist in the design:
 * - "large": 73px avatar with the balance pill overlapping it (Home, Events, Menu)
 * - "small": 44px avatar alone (Wallet)
 * With `onBack`, a back chevron takes the avatar's place (Ticket, Wallet); the
 * header keeps the avatar's height so the screen layout doesn't move.
 */
export default function Header({
  avatarSize = 'large',
  balance = '356.90',
  balanceHidden = false,
  showBell = false,
  onToggleBalance,
  onMenu,
  onClose,
  onBack,
}) {
  const backButton = onBack && (
    <button className="header__back" type="button" onClick={onBack} aria-label="Voltar">
      <Icon name="chevron_left" size={40} />
    </button>
  )

  return (
    <header className={`header header--${avatarSize}`}>
      {onBack ? (
        avatarSize === 'large' ? (
          <div className="header__profile header__profile--back">
            {backButton}
            <BalancePill value={balance} hidden={balanceHidden} />
          </div>
        ) : (
          backButton
        )
      ) : avatarSize === 'large' ? (
        <div className="header__profile">
          <img className="header__avatar" src={avatar} width="73" height="73" alt="Clinton Elvis" />
          <BalancePill value={balance} hidden={balanceHidden} />
        </div>
      ) : (
        <img className="header__avatar header__avatar--small" src={avatar} width="44" height="44" alt="Clinton Elvis" />
      )}

      {onClose ? (
        <button className="header__close" type="button" onClick={onClose} aria-label="Fechar menu">
          <Icon name="close" size={36} />
        </button>
      ) : (
        <div className="header__actions">
          <button type="button" onClick={onToggleBalance} aria-label={balanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'} aria-pressed={balanceHidden}>
            <Icon name={balanceHidden ? 'visibility' : 'visibility_off'} size={24} />
          </button>
          {showBell && (
            <button type="button" aria-label="Notificações">
              <Icon name="notifications" size={24} />
            </button>
          )}
          <button type="button" onClick={onMenu} aria-label="Abrir menu">
            <Icon name="menu" size={34} />
          </button>
        </div>
      )}
    </header>
  )
}
