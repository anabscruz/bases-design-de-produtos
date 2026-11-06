import { useEffect, useRef } from 'react'
import Icon from '../components/Icon.jsx'
import logo from '../assets/images/logo-moov.png'
import './Menu.css'

const ITEMS = [
  { label: 'Home', route: 'home' },
  { label: 'Carteira', route: 'wallet' },
  { label: 'Ingressos', route: 'ticket' },
  { label: 'Eventos', route: 'events' },
  { label: 'Convite' },
  { label: 'Perfil' },
  { label: 'Sair' },
]

/**
 * Full-screen menu, Figma 293:2701: a giant MOOV logo on white and a lime
 * panel with the items in big type, one per row. Opening keeps the original
 * motion: the screen behind blurs and washes out, then the logo, the panel
 * and the items fade in one after another; closing runs it backwards.
 * Escape also closes (handled in App).
 */
const LOGO_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * The MOOV logo grows out of the header's small logo into the giant one (and
 * shrinks back on close), so the menu reads as the header unfolding (FLIP).
 */
function useLogoGrow(open) {
  const logoRef = useRef(null)
  const animation = useRef(null)
  const opened = useRef(false)

  useEffect(() => {
    const logo = logoRef.current
    if (!open && !opened.current) return // first render, menu closed
    opened.current = true
    animation.current?.cancel()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // The small logo in the header of the screen behind the menu
    const menu = logo.closest('.menu')
    const source = menu.parentElement.querySelector('.phone__viewport .header__logo')
    if (!source) {
      if (open) animation.current = logo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, delay: 280, fill: 'backwards' })
      return
    }
    const from = source.getBoundingClientRect()
    const box = menu.getBoundingClientRect()
    const small = `translate(${from.left - box.left - logo.offsetLeft}px, ${from.top - box.top - logo.offsetTop}px) scale(${from.width / logo.offsetWidth})`

    animation.current = open
      ? logo.animate([{ transform: small }, { transform: 'none' }], {
          duration: 750,
          delay: 60,
          easing: LOGO_EASE,
          fill: 'backwards',
        })
      : // Closing: shrinks back onto the header logo, then the menu hides
        logo.animate([{ transform: 'none' }, { transform: small }], {
          duration: 450,
          easing: 'cubic-bezier(0.5, 0, 0.2, 1)',
          fill: 'forwards',
        })
  }, [open])

  return logoRef
}

export default function Menu({ open, active, navigate, onClose }) {
  // An event page belongs to Eventos
  const current = active === 'event' ? 'events' : active
  const logoRef = useLogoGrow(open)
  return (
    <aside className={`menu${open ? ' menu--open' : ''}`} aria-label="Menu" aria-hidden={!open} inert={!open}>
      {/* Same as the header: the logo goes home (and closes the menu) */}
      <button type="button" className="menu__home" onClick={() => navigate('home')}>
        <img className="menu__logo" ref={logoRef} src={logo} width="1660" height="386" alt="MOOV: ir para a Home" />
      </button>

      <div className="menu__panel">
        <div className="menu__top">
          <button type="button" className="menu__close" onClick={onClose} aria-label="Fechar menu">
            <Icon name="close" size={28} />
          </button>
        </div>

        <nav className="menu__list">
          {ITEMS.map(({ label, route }, index) => {
            const isActive = route === current
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
      </div>
    </aside>
  )
}
