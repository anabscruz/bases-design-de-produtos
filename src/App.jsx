import { useEffect, useRef, useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import FloatingMenu from './components/FloatingMenu.jsx'
import Home from './screens/Home.jsx'
import Events from './screens/Events.jsx'
import Menu from './screens/Menu.jsx'
import Wallet from './screens/Wallet.jsx'
import TicketDetails from './screens/TicketDetails.jsx'

const SCREENS = { home: Home, events: Events, menu: Menu, wallet: Wallet, ticket: TicketDetails }

// Tab order, used to slide the next screen in from the side of the tapped tab
const TAB_ORDER = ['home', 'wallet', 'events']

function readRoute() {
  const route = window.location.hash.replace(/^#\/?/, '')
  return SCREENS[route] ? route : 'home'
}

function transitionBetween(from, to) {
  if (from === 'menu' || to === 'menu') return 'fade'
  // The ticket screen is a step deeper than the tabs: it enters forward, leaves back
  if (to === 'ticket') return 'forward'
  if (from === 'ticket') return 'back'
  return TAB_ORDER.indexOf(to) >= TAB_ORDER.indexOf(from) ? 'forward' : 'back'
}

function initialState() {
  const route = readRoute()
  return { route, lastTab: TAB_ORDER.includes(route) ? route : 'home', transition: 'none', backTo: null }
}

export default function App() {
  const [{ route, lastTab, transition, backTo }, setNav] = useState(initialState)
  const [balanceHidden, setBalanceHidden] = useState(false)
  const goingBack = useRef(false)

  useEffect(() => {
    const onHashChange = () => {
      const next = readRoute()
      const isBack = goingBack.current
      goingBack.current = false
      setNav((current) =>
        current.route === next
          ? current
          : {
              route: next,
              lastTab: TAB_ORDER.includes(next) ? next : current.lastTab,
              transition: isBack ? 'back' : transitionBetween(current.route, next),
              // Screen the back button returns to; the menu is skipped over
              backTo: current.route === 'menu' ? current.backTo : current.route,
            },
      )
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (next) => {
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
      overlay={<FloatingMenu active={lastTab} hidden={route === 'menu'} navigate={navigate} />}
    >
      <Screen
        navigate={navigate}
        onClose={() => navigate(lastTab)}
        onBack={goBack}
        balanceHidden={balanceHidden}
        onToggleBalance={() => setBalanceHidden((hidden) => !hidden)}
      />
    </PhoneFrame>
  )
}
