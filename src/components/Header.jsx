import { useState } from 'react'
import BalancePill from './BalancePill.jsx'
import avatar from '../assets/images/avatar.png'
import logo from '../assets/images/logo-moov.png'
import Icon from './Icon.jsx'
import { useTheme } from '../theme.js'
import './Header.css'

/**
 * App header (Figma "heading" + "User", 278:754), full bleed at the top of the screen:
 * - a yellow bar with the MOOV logo and the theme / balance / menu buttons;
 * - a user row: avatar (and "Olá, Clinton Elvis" with `greeting`, Home only),
 *   with the balance pill on the right.
 * `onBack` adds a back chevron before the avatar (inner pages).
 * `showBalance={false}` drops the balance pill and the show/hide balance toggle (Ticket).
 * `tone="light"` draws the user row in white, for headers over a photo (Event).
 */
export default function Header({
  balance = '356,90',
  balanceHidden = false,
  onToggleBalance,
  onMenu,
  onBack,
  greeting = false,
  showBalance = true,
  tone = 'default',
}) {
  const { darkMode, toggleDarkMode } = useTheme()
  // Only spin the icon after a tap, not every time a screen mounts the header
  const [switched, setSwitched] = useState(false)

  return (
    <header className={`header${tone === 'light' ? ' header--light' : ''}`}>
      <div className="header__bar">
        {/* The logo takes you home, like on any website */}
        <a className="header__home" href="#/home">
          <img className="header__logo" src={logo} width="128" height="30" alt="MOOV: ir para a Home" />
        </a>

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
            <button
              type="button"
              onClick={onToggleBalance}
              aria-label={balanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}
              aria-pressed={balanceHidden}
            >
              <Icon name={balanceHidden ? 'visibility' : 'visibility_off'} size={27} />
            </button>
          )}
          <button type="button" onClick={onMenu} aria-label="Abrir menu">
            <Icon name="menu" size={34} />
          </button>
        </div>
      </div>

      <div className="header__user">
        <div className="header__profile">
          {onBack && (
            <button className="header__back" type="button" onClick={onBack} aria-label="Voltar">
              <Icon name="chevron_left" size={32} />
            </button>
          )}
          <img className="header__avatar" src={avatar} width="46" height="46" alt="Clinton Elvis" />
          {greeting && (
            <p className="header__greeting">
              Olá,
              <br />
              Clinton Elvis
            </p>
          )}
        </div>
        {showBalance && <BalancePill value={balance} hidden={balanceHidden} />}
      </div>
    </header>
  )
}
