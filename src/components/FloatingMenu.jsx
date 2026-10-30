import { useLayoutEffect, useRef, useState } from 'react'
import flash from '../assets/icons/nav-flash.svg'
import wallet from '../assets/icons/nav-wallet.svg'
import ticket from '../assets/icons/nav-ticket.svg'
import bell from '../assets/icons/bell.svg'
import './FloatingMenu.css'

const TABS = [
  { id: 'home', label: 'Início', icon: flash, width: 27, height: 25 },
  { id: 'wallet', label: 'Carteira', icon: wallet, width: 23, height: 20 },
  { id: 'events', label: 'Eventos', icon: ticket, width: 37, height: 21 },
  { id: 'notifications', label: 'Notificações', icon: bell, width: 24, height: 24 },
]

const PILL_WIDTH = 48
// The goo layer overflows the bar on every side so the swelling lobe isn't clipped
const GOO_BLEED = 24

/**
 * Floating "glass" tab bar. The active pill behaves like liquid: its leading
 * edge shoots to the tapped tab while the trailing edge follows a moment later,
 * so it stretches across the bar, then contracts and settles with a squish.
 * A second circle (the "lobe") trails at the back edge and swells past the
 * bar's height mid-move; an SVG goo filter melts both into one liquid shape.
 */
export default function FloatingMenu({ active, hidden = false, navigate }) {
  const barRef = useRef(null)
  const tabRefs = useRef({})
  const [pill, setPill] = useState(null)

  // Measure the active tab so the pill follows the real layout
  useLayoutEffect(() => {
    const tab = tabRefs.current[active]
    const bar = barRef.current
    if (!tab || !bar) return
    const left = tab.offsetLeft + tab.offsetWidth / 2 - PILL_WIDTH / 2
    const right = bar.offsetWidth - left - PILL_WIDTH
    setPill((previous) => {
      if (!previous) return { left, right, direction: 'none', moves: 0 }
      if (previous.left === left) return previous
      return { left, right, direction: left > previous.left ? 'right' : 'left', moves: previous.moves + 1 }
    })
  }, [active])

  return (
    <nav className={`floating-menu${hidden ? ' floating-menu--hidden' : ''}`} aria-label="Navegação principal" aria-hidden={hidden}>
      <svg className="floating-menu__defs" aria-hidden="true">
        <filter id="floating-menu-goo" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </svg>

      <div className="floating-menu__bar" ref={barRef}>
        {pill && (
          <span className={`floating-menu__goo floating-menu__goo--${pill.direction}`} aria-hidden="true">
            <span
              className="floating-menu__pill"
              style={{ left: pill.left + GOO_BLEED, right: pill.right + GOO_BLEED }}
            >
              <span className="floating-menu__pill-body" key={pill.moves} />
            </span>
            {/* The trailing end always arrives late, whichever way the pill moves */}
            <span className="floating-menu__lobe" style={{ left: pill.left + GOO_BLEED }}>
              <span className="floating-menu__lobe-body" key={pill.moves} />
            </span>
          </span>
        )}

        {TABS.map((tab) => {
          const isActive = tab.id === active
          const opensScreen = tab.id !== 'notifications'
          return (
            <button
              key={tab.id}
              ref={(node) => (tabRefs.current[tab.id] = node)}
              type="button"
              className={`floating-menu__tab floating-menu__tab--${tab.id}${isActive ? ' is-active' : ''}`}
              onClick={opensScreen ? () => navigate(tab.id) : undefined}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={hidden ? -1 : undefined}
            >
              <span
                className="floating-menu__icon"
                style={{ width: tab.width, height: tab.height, '--icon': `url("${tab.icon}")` }}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
