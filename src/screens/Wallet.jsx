import { useState } from 'react'
import Header from '../components/Header.jsx'
import CreditCard from '../components/CreditCard.jsx'
import BalanceCard from '../components/BalanceCard.jsx'
import TransactionItem from '../components/TransactionItem.jsx'
import Icon from '../components/Icon.jsx'
import '../components/Screen.css'
import './Wallet.css'

const TRANSACTIONS = [
  { id: 1, title: 'Afropunk bar', date: 'October 28th • 1:34 PM', source: 'Wallet', amount: '500.00', type: 'debit' },
  { id: 2, title: 'Transfer received', date: 'October 28th • 9 AM', source: 'Wallet', amount: '500.00', type: 'credit' },
  { id: 3, title: 'Bole Festival', date: 'October 28th • 11 PM', source: 'Nubank mastercard', amount: '3,000.00', type: 'debit' },
]

const BALANCE = '356.90'

/**
 * One layout for both Figma frames — "Wallet Cards Collapsed" and "Wallet Cards
 * Visible" — so tapping either card slides the stack open/closed with CSS transitions.
 */
export default function Wallet({ navigate, onBack, balanceHidden, onToggleBalance }) {
  const [cardsVisible, setCardsVisible] = useState(false)
  const toggleCards = () => setCardsVisible((visible) => !visible)
  // "Transactions" on the balance card filters the list down to wallet transactions
  const [walletOnly, setWalletOnly] = useState(false)

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
        <p>Hello,</p>
        <p>Clinton Elvis</p>
      </div>

      <section className="wallet__cards">
        <div className="wallet__add-method-slot" inert={!cardsVisible}>
          <div className="wallet__add-method-clip">
            <button type="button" className="wallet__add-method">Add payment method</button>
          </div>
        </div>
        <CreditCard expanded={cardsVisible} onClick={toggleCards} />
        <BalanceCard
          value={BALANCE}
          hidden={balanceHidden}
          onCardClick={toggleCards}
          onTransactionsClick={() => setWalletOnly((only) => !only)}
          transactionsActive={walletOnly}
        />
      </section>

      <section className="wallet__transactions">
        <div className="section-header">
          <h2 className="wallet__transactions-title">Transactions</h2>
          <button type="button" className="wallet__filter" aria-label="Filtrar transações" tabIndex={cardsVisible ? -1 : undefined}>
            <Icon name="tune" size={30} />
          </button>
        </div>
        <ul className="wallet__list">
          {TRANSACTIONS.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              {...transaction}
              hidden={balanceHidden}
              collapsed={walletOnly && transaction.source !== 'Wallet'}
            />
          ))}
        </ul>
      </section>
    </main>
  )
}
