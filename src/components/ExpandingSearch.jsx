import { useEffect, useRef } from 'react'
import Icon from './Icon.jsx'
import './ExpandingSearch.css'

/**
 * Search that starts as a magnifier icon and stretches into a full field.
 * Positioned absolutely inside its (position: relative) row, anchored on the
 * right, so expanding never changes the row's height. `open` is controlled:
 * the parent hides whatever the field grows over (e.g. the section title).
 * It closes on Escape, or when it loses focus while empty.
 */
export default function ExpandingSearch({ open, onOpenChange, value, onChange, placeholder = 'search', label }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  const close = () => {
    onChange('')
    onOpenChange(false)
    inputRef.current?.blur()
  }

  return (
    <div className={`expanding-search${open ? ' expanding-search--open' : ''}`} role="search">
      <button
        type="button"
        className="expanding-search__toggle"
        aria-label={label}
        aria-expanded={open}
        // Keep focus in the field while it's open, so tapping the icon doesn't blur-close it
        onMouseDown={(event) => open && event.preventDefault()}
        onClick={() => (open ? inputRef.current?.focus() : onOpenChange(true))}
      >
        <Icon name="search" size={26} />
      </button>
      <input
        ref={inputRef}
        className="expanding-search__input"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={label}
        tabIndex={open ? 0 : -1}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === 'Escape' && close()}
        onBlur={() => !value && onOpenChange(false)}
      />
    </div>
  )
}
