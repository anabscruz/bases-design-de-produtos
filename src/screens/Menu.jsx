import Icon from '../components/Icon.jsx'
import './Menu.css'

const ITEMS = [
  { label: 'Início', route: 'home' },
  { label: 'Carteira', route: 'wallet' },
  { label: 'Ingressos', route: 'ticket' },
  { label: 'Eventos salvos' },
  { label: 'Convidar' },
  { label: 'Perfil' },
  { label: 'Sair' },
]

/**
 * Full-screen frosted menu. Opening blurs the current screen behind a light
 * frosted layer, then the title, close button and items fade in one after
 * another; closing runs it backwards. Escape also closes (handled in App).
 */
export default function Menu({ open, active, navigate, onClose, darkMode = false, onToggleDarkMode }) {
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

      {/* Light switch: the thumb slides and the whole app changes colour */}
      <button
        type="button"
        role="switch"
        className="menu__theme"
        style={{ '--i': ITEMS.length }}
        aria-checked={darkMode}
        onClick={onToggleDarkMode}
      >
        <Icon name={darkMode ? 'dark_mode' : 'light_mode'} size={24} />
        <span className="menu__theme-label">Modo escuro</span>
        <span className="switch" aria-hidden="true">
          <span className="switch__thumb" />
        </span>
      </button>
    </aside>
  )
}
