import './Ticket.css'

export default function Ticket({ title, date }) {
  return (
    <article className="ticket">
      <div className="ticket__info">
        <p className="ticket__title">{title}</p>
        <p className="ticket__date">{date}</p>
      </div>
      <button className="ticket__stub" type="button">
        <span>Use ticket</span>
      </button>
    </article>
  )
}
