import './Ticket.css'

export default function Ticket({ title, date, onOpen }) {
  return (
    <button type="button" className="ticket" onClick={onOpen} aria-label={`${title}, ${date}: abrir ingresso`}>
      <span className="ticket__info">
        <span className="ticket__title">{title}</span>
        <span className="ticket__date">{date}</span>
      </span>
      <span className="ticket__stub">
        <span>Use ticket</span>
      </span>
    </button>
  )
}
