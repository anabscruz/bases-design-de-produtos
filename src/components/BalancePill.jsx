import Amount from './Amount.jsx'
import coin from '../assets/icons/coin.svg'
import './BalancePill.css'

/**
 * Account balance: yellow pill with the coin (Figma "Account balance", 278:779).
 * It's a button (3D, like "Finalizar compra") that opens the Wallet.
 */
export default function BalancePill({ value, hidden }) {
  return (
    <a className="balance-pill" href="#/wallet">
      <img className="balance-pill__coin" src={coin} width="21" height="19" alt="" />
      <span className="balance-pill__value">
        <span className="visually-hidden">Saldo: </span>
        <Amount value={value} hidden={hidden} />
        <span className="visually-hidden"> (abrir carteira)</span>
      </span>
    </a>
  )
}
