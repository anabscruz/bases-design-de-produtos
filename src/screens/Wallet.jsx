import { useState } from 'react'
import Header from '../components/Header.jsx'
import CreditCard from '../components/CreditCard.jsx'
import BalanceCard from '../components/BalanceCard.jsx'
import TransactionItem from '../components/TransactionItem.jsx'
import Icon from '../components/Icon.jsx'
import '../components/Screen.css'
import './Wallet.css'

const TRANSACTIONS = [
  { id: 1, title: 'Bar do Afropunk', date: '28 de outubro • 13h34', source: 'Carteira', amount: '500,00', type: 'debit' },
  { id: 2, title: 'Transferência recebida', date: '28 de outubro • 9h', source: 'Carteira', amount: '500,00', type: 'credit' },
  { id: 3, title: 'Bole Festival', date: '28 de outubro • 23h', source: 'Nubank Mastercard', amount: '3.000,00', type: 'debit' },
]

const BALANCE = '356,90'

/**
 * One layout for both Figma frames — "Wallet Cards Collapsed" and "Wallet Cards
 * Visible" — so tapping either card slides the stack open/closed with CSS transitions.
 */
export default function Wallet({ navigate, onBack, balanceHidden, onToggleBalance }) {
  const [cardsVisible, setCardsVisible] = useState(false)
  const toggleCards = () => setCardsVisible((visible) => !visible)

  return (
    <main className={`screen screen--padded wallet${cardsVisible ? ' wallet--cards-visible' : ''}`}>
      <Header
        avatarSize="small"
        onBack={onBack}
        balanceHidden={balanceHidden}
        onToggleBalance={onToggleBalance}
        onMenu={() => navigate('menu')}
      />

      <div className="greeting">
        <p>Olá,</p>
        <p>Clinton Elvis</p>
      </div>

      <section className="wallet__cards">
        <div className="wallet__add-method-slot" inert={!cardsVisible}>
          <div className="wallet__add-method-clip">
            <button type="button" className="wallet__add-method">Adicionar forma de pagamento</button>
          </div>
        </div>
        <CreditCard expanded={cardsVisible} onClick={toggleCards} />
        <BalanceCard value={BALANCE} hidden={balanceHidden} onCardClick={toggleCards} />
      </section>

      <section className="wallet__transactions">
        <div className="section-header">
          <h2 className="section-title">Transações</h2>
          <button type="button" className="wallet__filter" aria-label="Filtrar transações" tabIndex={cardsVisible ? -1 : undefined}>
            <Icon name="tune" size={30} />
          </button>
        </div>
        <ul className="wallet__list">
          {TRANSACTIONS.map((transaction) => (
            <TransactionItem key={transaction.id} {...transaction} hidden={balanceHidden} />
          ))}
        </ul>
      </section>
    </main>
  )
}
