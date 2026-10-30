import BalancePill from '../components/BalancePill.jsx'
import avatar from '../assets/images/avatar.png'
import '../components/Header.css'
import './Menu.css'

const ITEMS = [
  { label: 'Home', route: 'home' },
  { label: 'Wallet', route: 'wallet' },
  { label: 'Tickets', route: 'ticket' },
  { label: 'Saved Events' },
  { label: 'Invite' },
  { label: 'Profile' },
  { label: 'Logout' },
]

/**
 * Side menu. It sits *under* the current screen: opening it pushes the screen
 * to the right (see PhoneFrame) while the items slide in from the left. The
 * item for the current screen is emphasised.
 */
export default function Menu({ open, active, navigate, balanceHidden }) {
  return (
    <aside className={`menu${open ? ' menu--open' : ''}`} aria-label="Menu" aria-hidden={!open} inert={!open}>
      <div className="header__profile menu__profile">
        <img className="header__avatar" src={avatar} width="73" height="73" alt="Clinton Elvis" />
        <BalancePill value="356.90" hidden={balanceHidden} />
      </div>

      <nav className="menu__list">
        {ITEMS.map(({ label, route }, index) => {
          const isActive = route === active
          return (
            <button
              key={label}
              type="button"
              className={`menu__item${isActive ? ' menu__item--active' : ''}`}
              style={{ '--i': index }}
              onClick={route ? () => navigate(route) : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
