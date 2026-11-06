import { createContext, useContext } from 'react'

/** Current theme and its toggle, shared by the header button and the menu switch. */
export const ThemeContext = createContext({ darkMode: false, toggleDarkMode: () => {} })

export const useTheme = () => useContext(ThemeContext)
