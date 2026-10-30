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

/**
 * Floating "glass" tab bar. The active pill behaves like liquid: its leading
 * edge shoots to the tapped tab while the trailing edge follows a moment later,
 * so it stretches across the bar, then contracts and settles with a squish.
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
      <div className="floating-menu__bar" ref={barRef}>
        {pill && (
          <span
            className={`floating-menu__pill floating-menu__pill--${pill.direction}`}
            style={{ left: pill.left, right: pill.right }}
            aria-hidden="true"
          >
            <span className="floating-menu__pill-body" key={pill.moves} />
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
