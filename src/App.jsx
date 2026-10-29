import { useEffect, useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import Home from './screens/Home.jsx'
import Events from './screens/Events.jsx'
import Menu from './screens/Menu.jsx'
import Wallet from './screens/Wallet.jsx'

const SCREENS = { home: Home, events: Events, menu: Menu, wallet: Wallet }

function readRoute() {
  const route = window.location.hash.replace(/^#\/?/, '')
  return SCREENS[route] ? route : 'home'
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [previous, setPrevious] = useState('home')
  const [balanceHidden, setBalanceHidden] = useState(false)

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (next) => {
    if (next === route) return
    if (next === 'menu') setPrevious(route)
    window.location.hash = `/${next}`
  }

  const Screen = SCREENS[route]

  return (
    <PhoneFrame screenKey={route}>
      <Screen
        navigate={navigate}
        onClose={() => navigate(previous)}
        balanceHidden={balanceHidden}
        onToggleBalance={() => setBalanceHidden((hidden) => !hidden)}
      />
    </PhoneFrame>
  )
}
