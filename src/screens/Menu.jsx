import Header from '../components/Header.jsx'
import '../components/Screen.css'
import './Menu.css'

const ITEMS = [
  { label: 'Home', route: 'home' },
  { label: 'Wallet', route: 'wallet' },
  { label: 'Tickets', route: 'events' },
  { label: 'Saved Events' },
  { label: 'Invite' },
  { label: 'Profile' },
  { label: 'Logout' },
]

export default function Menu({ navigate, onClose, balanceHidden }) {
  return (
    <main className="screen screen--padded menu">
      <Header balanceHidden={balanceHidden} onClose={onClose} />

      <nav className="menu__list" aria-label="Menu">
        {ITEMS.map(({ label, route }) => (
          <button key={label} type="button" className="menu__item" onClick={route ? () => navigate(route) : undefined}>
            {label}
          </button>
        ))}
      </nav>
    </main>
  )
}
