import BalancePill from './BalancePill.jsx'
import avatar from '../assets/images/avatar.png'
import eyeOff from '../assets/icons/eye-off.svg'
import bell from '../assets/icons/bell.svg'
import menu from '../assets/icons/menu.svg'
import close from '../assets/icons/close.svg'
import './Header.css'

/**
 * App header. Two avatar layouts exist in the design:
 * - "large": 73px avatar with the balance pill overlapping it (Home, Events, Menu)
 * - "small": 44px avatar alone (Wallet)
 */
export default function Header({
  avatarSize = 'large',
  balance = '356.90',
  balanceHidden = false,
  showBell = false,
  onToggleBalance,
  onMenu,
  onClose,
}) {
  return (
    <header className="header">
      {avatarSize === 'large' ? (
        <div className="header__profile">
          <img className="header__avatar" src={avatar} width="73" height="73" alt="Clinton Elvis" />
          <BalancePill value={balance} hidden={balanceHidden} />
        </div>
      ) : (
        <img className="header__avatar header__avatar--small" src={avatar} width="44" height="44" alt="Clinton Elvis" />
      )}

      {onClose ? (
        <button className="header__close" type="button" onClick={onClose} aria-label="Fechar menu">
          <img src={close} width="40" height="40" alt="" />
        </button>
      ) : (
        <div className="header__actions">
          <button type="button" onClick={onToggleBalance} aria-label={balanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'} aria-pressed={balanceHidden}>
            <img src={eyeOff} width="20" height="20" alt="" />
          </button>
          {showBell && (
            <button type="button" aria-label="Notificações">
              <img src={bell} width="24" height="24" alt="" />
            </button>
          )}
          <button type="button" onClick={onMenu} aria-label="Abrir menu">
            <img src={menu} width="34" height="34" alt="" />
          </button>
        </div>
      )}
    </header>
  )
}
