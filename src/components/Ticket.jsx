import './Ticket.css'

/**
 * Home "Upcoming events" ticket (Figma "Home -alterntiva", 264:1796): a white
 * card with the event and its date/time, next to a separate yellow stub that
 * reads "Usar ingresso" sideways. The whole ticket opens the ticket screen.
 */
export default function Ticket({ title, date, time, onOpen }) {
  return (
    <button
      type="button"
      className="ticket"
      onClick={onOpen}
      aria-label={`${title}, ${date}${time ? ` às ${time}` : ''}: abrir ingresso`}
    >
      <span className="ticket__card">
        <span className="ticket__title">{title}</span>
        <span className="ticket__when">
          {date}
          {time && <span className="ticket__time">{time}</span>}
        </span>
      </span>
      <span className="ticket__stub" aria-hidden="true">
        <span className="ticket__stub-label">Usar ingresso</span>
      </span>
    </button>
  )
}
