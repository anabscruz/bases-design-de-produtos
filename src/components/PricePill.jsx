import Amount from './Amount.jsx'
import coinSmall from '../assets/icons/coin-small.svg'
import './PricePill.css'

export default function PricePill({ value }) {
  return (
    <div className="price-pill">
      <img src={coinSmall} width="17" height="15" alt="" />
      <p>
        <Amount value={value} />
      </p>
    </div>
  )
}
