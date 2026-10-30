import { useEffect, useRef, useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import FloatingMenu from './components/FloatingMenu.jsx'
import Home from './screens/Home.jsx'
import Events from './screens/Events.jsx'
import Menu from './screens/Menu.jsx'
import Wallet from './screens/Wallet.jsx'
import TicketDetails from './screens/TicketDetails.jsx'

const SCREENS = { home: Home, events: Events, wallet: Wallet, ticket: TicketDetails }

// Tab order, used to slide the next screen in from the side of the tapped tab
const TAB_ORDER = ['home', 'events', 'wallet', 'ticket']

function readRoute() {
  const route = window.location.hash.replace(/^#\/?/, '')
  return SCREENS[route] ? route : 'home'
}

function transitionBetween(from, to) {
  return TAB_ORDER.indexOf(to) >= TAB_ORDER.indexOf(from) ? 'forward' : 'back'
}

function initialState() {
  const route = readRoute()
  return { route, lastTab: TAB_ORDER.includes(route) ? route : 'home', transition: 'none', backTo: null }
}

export default function App() {
  const [{ route, lastTab, transition, backTo }, setNav] = useState(initialState)
  const [balanceHidden, setBalanceHidden] = useState(false)
  // The menu isn't a route: it's a full-screen layer over the current screen
  const [menuOpen, setMenuOpen] = useState(false)
  const goingBack = useRef(false)
  const leavingMenu = useRef(false)

  useEffect(() => {
    const onHashChange = () => {
      const next = readRoute()
      const isBack = goingBack.current
      // Leaving through the menu, the screen sliding back is the transition
      const fromMenu = leavingMenu.current
      goingBack.current = false
      leavingMenu.current = false
      setNav((current) =>
        current.route === next
          ? current
          : {
              route: next,
              lastTab: TAB_ORDER.includes(next) ? next : current.lastTab,
              transition: fromMenu ? 'none' : isBack ? 'back' : transitionBetween(current.route, next),
              // Screen the back button returns to
              backTo: current.route,
            },
      )
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const navigate = (next) => {
    if (next === 'menu') {
      setMenuOpen(true)
      return
    }
    if (menuOpen) {
      setMenuOpen(false)
      leavingMenu.current = next !== route
    }
    if (next !== route) window.location.hash = `/${next}`
  }

  const goBack = () => {
    const target = backTo && backTo !== route ? backTo : 'home'
    if (target === route) return
    goingBack.current = true
    navigate(target)
  }

  const Screen = SCREENS[route]

  return (
    <PhoneFrame
      screenKey={route}
      transition={transition}
      overlay={<FloatingMenu active={lastTab} hidden={menuOpen} navigate={navigate} />}
      menu={
        <Menu
          open={menuOpen}
          active={route}
          navigate={navigate}
          onClose={() => setMenuOpen(false)}
          balanceHidden={balanceHidden}
        />
      }
      menuOpen={menuOpen}
    >
      <Screen
        navigate={navigate}
        onBack={goBack}
        balanceHidden={balanceHidden}
        onToggleBalance={() => setBalanceHidden((hidden) => !hidden)}
      />
    </PhoneFrame>
  )
}
