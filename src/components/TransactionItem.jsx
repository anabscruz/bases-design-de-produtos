import Amount from './Amount.jsx'
import './TransactionItem.css'

/** `collapsed` shrinks the row to zero height (used when the list is filtered). */
export default function TransactionItem({ title, date, source, amount, type, hidden, collapsed = false }) {
  return (
    <li className={`transaction-row${collapsed ? ' transaction-row--collapsed' : ''}`} aria-hidden={collapsed}>
      <div className="transaction-row__clip">
        <div className="transaction">
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
        </div>
      </div>
    </li>
  )
}
