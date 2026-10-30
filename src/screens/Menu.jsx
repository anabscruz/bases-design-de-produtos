import Icon from '../components/Icon.jsx'
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
 * Full-screen frosted menu. Opening blurs the current screen behind a light
 * frosted layer, then the title, close button and items fade in one after
 * another; closing runs it backwards. Escape also closes (handled in App).
 */
export default function Menu({ open, active, navigate, onClose }) {
  return (
    <aside className={`menu${open ? ' menu--open' : ''}`} aria-label="Menu" aria-hidden={!open} inert={!open}>
      <div className="menu__top">
        <p className="menu__title">Menu</p>
        <button type="button" className="menu__close" onClick={onClose} aria-label="Fechar menu">
          <Icon name="close" size={28} />
        </button>
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
