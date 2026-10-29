import { useState } from 'react'
import Header from '../components/Header.jsx'
import CreditCard from '../components/CreditCard.jsx'
import BalanceCard from '../components/BalanceCard.jsx'
import TransactionItem from '../components/TransactionItem.jsx'
import FloatingMenu from '../components/FloatingMenu.jsx'
import filterIcon from '../assets/icons/filter.svg'
import '../components/Screen.css'
import './Wallet.css'

const TRANSACTIONS = [
  { id: 1, title: 'Transfer to Paul', date: 'October 28th • 1:34 PM', source: 'Wallet', amount: '500.00', type: 'debit' },
  { id: 2, title: 'Transfer received', date: 'October 28th • 9 AM', source: 'Wallet', amount: '500.00', type: 'credit' },
  { id: 3, title: 'Bole Festival', date: 'October 28th • 11 PM', source: 'Nubank mastercard', amount: '3,000.00', type: 'debit' },
]

const BALANCE = '356.90'

export default function Wallet({ navigate, balanceHidden, onToggleBalance }) {
  // "Wallet Cards Collapsed" ↔ "Wallet Cards Visible": tap the card stack to toggle
  const [cardsVisible, setCardsVisible] = useState(false)

  const header = (
    <Header
      avatarSize="small"
      balanceHidden={balanceHidden}
      onToggleBalance={onToggleBalance}
      onMenu={() => navigate('menu')}
      showBell
    />
  )

  const greeting = (
    <div className="greeting">
      <p>Hello,</p>
      <p>Clinton Elvis</p>
    </div>
  )

  const transactions = TRANSACTIONS.map((transaction) => (
    <TransactionItem key={transaction.id} {...transaction} spaced={cardsVisible} hidden={balanceHidden} />
  ))

  if (cardsVisible) {
    return (
      <main className="screen screen--padded wallet">
        {header}
        {greeting}

        <section className="wallet__cards wallet__cards--visible">
          <button type="button" className="wallet__add-method">Add payment method</button>
          <CreditCard variant="full" onClick={() => setCardsVisible(false)} />
          <BalanceCard value={BALANCE} hidden={balanceHidden} />
        </section>

        <section className="wallet__transactions wallet__transactions--visible">
          <h2 className="wallet__transactions-title">Transactions</h2>
          <ul className="wallet__list">{transactions}</ul>
        </section>

        <FloatingMenu active="wallet" navigate={navigate} />
      </main>
    )
  }

  return (
    <main className="screen wallet">
      <div className="screen__inset">{header}</div>
      <div className="screen__inset">{greeting}</div>

      <section className="wallet__cards">
        <CreditCard variant="stacked" onClick={() => setCardsVisible(true)} />
        <BalanceCard value={BALANCE} hidden={balanceHidden} />
      </section>

      <section className="wallet__transactions">
        <div className="section-header">
          <h2 className="wallet__transactions-title">Transactions</h2>
          <button type="button" className="wallet__filter" aria-label="Filtrar transações">
            <img src={filterIcon} width="26" height="22" alt="" />
          </button>
        </div>
        <ul className="wallet__list">{transactions}</ul>
      </section>

      <FloatingMenu active="wallet" navigate={navigate} />
    </main>
  )
}
