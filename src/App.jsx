import { useEffect, useState } from 'react'
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
  return { route, lastTab: TAB_ORDER.includes(route) ? route : 'home', transition: 'none' }
}

export default function App() {
  const [{ route, lastTab, transition }, setNav] = useState(initialState)
  const [balanceHidden, setBalanceHidden] = useState(false)

  useEffect(() => {
    const onHashChange = () => {
      const next = readRoute()
      setNav((current) =>
        current.route === next
          ? current
          : {
              route: next,
              lastTab: TAB_ORDER.includes(next) ? next : current.lastTab,
              transition: transitionBetween(current.route, next),
            },
      )
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (next) => {
    if (next !== route) window.location.hash = `/${next}`
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
        balanceHidden={balanceHidden}
        onToggleBalance={() => setBalanceHidden((hidden) => !hidden)}
      />
    </PhoneFrame>
  )
}
