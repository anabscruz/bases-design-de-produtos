import { useState } from 'react'
import BalancePill from './BalancePill.jsx'
import avatar from '../assets/images/avatar.png'
import Icon from './Icon.jsx'
import { useTheme } from '../theme.js'
import './Header.css'

/**
 * App header. Two avatar layouts exist in the design:
 * - "large": 73px avatar with the balance pill overlapping it (Home, Events, Menu)
 * - "small": 44px avatar alone (Wallet)
 * With `onBack`, a back chevron takes the avatar's place (Ticket, Wallet); the
 * header keeps the avatar's height so the screen layout doesn't move.
 * `showBalance={false}` is for screens without any balance (Ticket): it drops
 * the balance pill and the show/hide balance toggle.
 * `tone="light"` draws the icons in white, for headers over a dark photo (Event).
 */
export default function Header({
  avatarSize = 'large',
  balance = '356,90',
  balanceHidden = false,
  onToggleBalance,
  onMenu,
  onBack,
  showBalance = true,
  tone = 'dark',
}) {
  const { darkMode, toggleDarkMode } = useTheme()
  // Only spin the icon after a tap, not every time a screen mounts the header
  const [switched, setSwitched] = useState(false)
  const backButton = onBack && (
    <button className="header__back" type="button" onClick={onBack} aria-label="Voltar">
      <Icon name="chevron_left" size={40} />
    </button>
  )

  return (
    <header className={`header header--${avatarSize}${tone === 'light' ? ' header--light' : ''}`}>
      {onBack ? (
        avatarSize === 'large' && showBalance ? (
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

      <div className="header__actions">
        {/* Moon in light mode, sun in dark mode: the icon turns as it swaps */}
        <button
          type="button"
          className={`header__theme${switched ? ' is-switching' : ''}`}
          onClick={() => {
            setSwitched(true)
            toggleDarkMode()
          }}
          aria-label="Modo escuro"
          aria-pressed={darkMode}
        >
          <Icon key={darkMode ? 'sun' : 'moon'} name={darkMode ? 'light_mode' : 'dark_mode'} size={24} />
        </button>
        {showBalance && (
          <button type="button" onClick={onToggleBalance} aria-label={balanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'} aria-pressed={balanceHidden}>
            <Icon name={balanceHidden ? 'visibility' : 'visibility_off'} size={24} />
          </button>
        )}
        <button type="button" onClick={onMenu} aria-label="Abrir menu">
          <Icon name="menu" size={34} />
        </button>
      </div>
    </header>
  )
}
