import { useEffect, useRef, useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import FloatingMenu from './components/FloatingMenu.jsx'
import Home from './screens/Home.jsx'
import Events from './screens/Events.jsx'
import Menu from './screens/Menu.jsx'
import Wallet from './screens/Wallet.jsx'
import TicketDetails from './screens/TicketDetails.jsx'
import EventDetails from './screens/EventDetails.jsx'
import Notifications from './screens/Notifications.jsx'
import { ThemeContext } from './theme.js'

const SCREENS = { home: Home, events: Events, wallet: Wallet, ticket: TicketDetails, event: EventDetails, notifications: Notifications }

// Tab order, used to slide the next screen in from the side of the tapped tab
const TAB_ORDER = ['home', 'events', 'wallet', 'ticket', 'notifications']

// "#/event/placebo" → { path: 'event/placebo', route: 'event', param: 'placebo' }
function readRoute() {
  const path = window.location.hash.replace(/^#\/?/, '')
  const [route, ...rest] = path.split('/')
  if (!SCREENS[route]) return { path: 'home', route: 'home', param: null }
  return { path, route, param: rest.length ? decodeURIComponent(rest.join('/')) : null }
}

function transitionBetween(from, to) {
  // Screens outside the tab bar (Event) are drilled into, so they come in forward
  if (!TAB_ORDER.includes(to)) return 'forward'
  if (!TAB_ORDER.includes(from)) return 'back'
  return TAB_ORDER.indexOf(to) >= TAB_ORDER.indexOf(from) ? 'forward' : 'back'
}

// New key: the old one saved every visit's theme automatically, so it can't be trusted as a choice
const THEME_KEY = 'moov-theme'

// Dark mode is the default; only a theme the person picked with the toggle overrides it
function initialTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // storage unavailable (private mode, blocked site data)
  }
  return 'dark'
}

function initialState() {
  const { path, route, param } = readRoute()
  // The Event page belongs to the Events tab
  const lastTab = TAB_ORDER.includes(route) ? route : route === 'event' ? 'events' : 'home'
  // Opened straight from a link, the Event page goes back to the list
  return { path, route, param, lastTab, transition: 'none', backTo: route === 'event' ? 'events' : null }
}

export default function App() {
  const [{ path, route, param, lastTab, transition, backTo }, setNav] = useState(initialState)
  const [balanceHidden, setBalanceHidden] = useState(false)
  const [theme, setTheme] = useState(initialTheme)
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
        current.path === next.path
          ? current
          : {
              ...next,
              lastTab: TAB_ORDER.includes(next.route) ? next.route : current.lastTab,
              transition: fromMenu ? 'none' : isBack ? 'back' : transitionBetween(current.route, next.route),
              // Screen the back button returns to
              backTo: current.path,
            },
      )
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#161616' : '#eeeeee')
  }, [theme])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // `next` is a screen ('events') or a screen with a parameter ('event/placebo')
  const navigate = (next) => {
    if (next === 'menu') {
      setMenuOpen(true)
      return
    }
    if (menuOpen) {
      setMenuOpen(false)
      leavingMenu.current = next !== path
    }
    if (next !== path) window.location.hash = `/${next}`
  }

  const goBack = () => {
    const target = backTo && backTo !== path ? backTo : 'home'
    if (target === path) return
    goingBack.current = true
    navigate(target)
  }

  const Screen = SCREENS[route]
  const darkMode = theme === 'dark'
  // Remembered only when the person switches, so the default stays dark for everyone else
  const toggleDarkMode = () =>
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(THEME_KEY, next)
      } catch {
        // storage unavailable: the choice just won't survive a reload
      }
      return next
    })

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <PhoneFrame
        screenKey={path}
        transition={transition}
        overlay={<FloatingMenu active={lastTab} hidden={menuOpen} navigate={navigate} />}
        menu={
          <Menu
            open={menuOpen}
            active={route}
            navigate={navigate}
            onClose={() => setMenuOpen(false)}
          />
        }
        menuOpen={menuOpen}
      >
        <Screen
          param={param}
          navigate={navigate}
          onBack={goBack}
          balanceHidden={balanceHidden}
          onToggleBalance={() => setBalanceHidden((hidden) => !hidden)}
        />
      </PhoneFrame>
    </ThemeContext.Provider>
  )
}
