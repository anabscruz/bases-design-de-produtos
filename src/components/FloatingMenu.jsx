import flashActive from '../assets/icons/nav-flash-active.svg'
import flash from '../assets/icons/nav-flash.svg'
import wallet from '../assets/icons/nav-wallet.svg'
import walletActive from '../assets/icons/nav-wallet-active.svg'
import ticket from '../assets/icons/nav-ticket.svg'
import bell from '../assets/icons/bell.svg'
import './FloatingMenu.css'

/** Floating "glass" tab bar. `active` is either "flash" (Home/Events) or "wallet". */
export default function FloatingMenu({ active = 'flash', navigate }) {
  return (
    <nav className="floating-menu" aria-label="Navegação principal">
      <div className="floating-menu__bar">
        <button type="button" onClick={() => navigate('home')} aria-label="Início" aria-current={active === 'flash' ? 'page' : undefined}>
          {active === 'flash' ? (
            <img src={flashActive} width="48" height="46" alt="" />
          ) : (
            <img src={flash} width="27" height="25" alt="" />
          )}
        </button>
        <button type="button" onClick={() => navigate('wallet')} aria-label="Carteira" aria-current={active === 'wallet' ? 'page' : undefined}>
          {active === 'wallet' ? (
            <img src={walletActive} width="47" height="44" alt="" />
          ) : (
            <img src={wallet} width="23" height="20" alt="" />
          )}
        </button>
        <button type="button" onClick={() => navigate('events')} aria-label="Eventos">
          <img src={ticket} width="37" height="21" alt="" />
        </button>
        <button type="button" aria-label="Notificações">
          <img src={bell} width="24" height="24" alt="" />
        </button>
      </div>
    </nav>
  )
}
