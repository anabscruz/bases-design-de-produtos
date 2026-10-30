import './Icon.css'

/**
 * Material Symbols (Rounded) icon from Google Fonts, rendered by ligature.
 * The icon set is subset in index.html (`icon_names=`): add new names there.
 */
export default function Icon({ name, size = 24, className = '' }) {
  return (
    <span
      className={`icon ${className}`}
      style={{ '--icon-size': `${size}px`, '--icon-opsz': Math.min(48, Math.max(20, size)) }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
