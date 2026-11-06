import Icon from './Icon.jsx'
import './SaveButton.css'

/**
 * Heart toggle for saving an event. One component for the Events list and the
 * event page, so "Save" looks and behaves the same everywhere. Saving fills the
 * heart with a short pop; unsaving just empties it.
 */
export default function SaveButton({ saved, onToggle, size = 24, label = 'Salvar evento', className = '' }) {
  return (
    <button
      type="button"
      className={`save-button${saved ? ' is-saved' : ''} ${className}`}
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={label}
    >
      <Icon name="favorite" size={size} />
    </button>
  )
}
