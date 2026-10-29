import Amount from './Amount.jsx'
import './TransactionItem.css'

export default function TransactionItem({ title, date, source, amount, type, spaced = false, hidden }) {
  return (
    <li className={`transaction${spaced ? ' transaction--spaced' : ''}`}>
      <div className="transaction__info">
        <p className="transaction__title">{title}</p>
        <div className="transaction__meta">
          <p className="transaction__date">{date}</p>
          <p className="transaction__source">{source}</p>
        </div>
      </div>
      <p className={`transaction__amount transaction__amount--${type}`}>
        <Amount prefix={type === 'credit' ? '+ ' : '- '} value={` ${amount}`} separator="" hidden={hidden} />
      </p>
    </li>
  )
}
