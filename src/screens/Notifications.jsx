import { useState } from 'react'
import Header from '../components/Header.jsx'
import Icon from '../components/Icon.jsx'
import SwipeToDismiss from '../components/SwipeToDismiss.jsx'
import kim from '../assets/images/notification-kim.png'
import jessica from '../assets/images/notification-jessica.png'
import carl from '../assets/images/notification-carl.png'
import '../components/Screen.css'
import './Notifications.css'

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    photo: kim,
    date: 'november 2, 2026 - 2pm',
    message: 'Kim saved Afropunk to her list',
    route: 'events',
    read: false,
  },
  {
    id: 2,
    photo: jessica,
    date: 'november 2, 2026 - 2pm',
    message: 'Jessica will attend to RTM 2026',
    route: 'event',
    read: false,
  },
  {
    id: 3,
    photo: carl,
    date: 'november 2, 2026 - 2pm',
    message: 'Carl thinks you’d like Coachella',
    route: 'events',
    read: false,
  },
]

const FILTERS = [
  { id: 'unread', label: 'unread' },
  { id: 'read', label: 'read' },
]

/** Figma "Notification" (239:1373): opened from the bell in the tab bar. */
export default function Notifications({ navigate, balanceHidden, onToggleBalance }) {
  const [filter, setFilter] = useState('unread')
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const visible = notifications.filter((notification) => notification.read === (filter === 'read'))
  const hasUnread = notifications.some((notification) => !notification.read)

  const update = (id, changes) =>
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)))

  const dismiss = (id) => setNotifications((current) => current.filter((item) => item.id !== id))

  const markAllAsRead = () => setNotifications((current) => current.map((item) => ({ ...item, read: true })))

  const openEvent = (notification) => {
    update(notification.id, { read: true })
    navigate(notification.route)
  }

  return (
    <main className="screen notifications">
      <div className="screen__inset">
        <Header
          balanceHidden={balanceHidden}
          onToggleBalance={onToggleBalance}
          onMenu={() => navigate('menu')}
        />
      </div>

      <h1 className="visually-hidden">Notificações</h1>

      <div className="screen__inset notifications__filters" role="group" aria-label="Filtrar notificações">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`filter-chip${filter === id ? ' is-active' : ''}`}
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="screen__inset notifications__list">
        {visible.length === 0 && (
          <li className="notifications__empty">
            {filter === 'unread' ? 'You’re all caught up' : 'No read notifications yet'}
          </li>
        )}
        {/* Swipe a card sideways (or tap the X) to remove it */}
        {visible.map((notification) => (
          <SwipeToDismiss
            as="li"
            itemClassName="notification"
            key={notification.id}
            onDismiss={() => dismiss(notification.id)}
          >
            {(animateDismiss) => (
              <>
                <span className="notification__avatar">
                  <img src={notification.photo} width="62" height="62" alt="" />
                </span>

                <div className="notification__body">
                  <p className="notification__date">{notification.date}</p>
                  <p className="notification__message">{notification.message}</p>
                  <button type="button" className="notification__link" onClick={() => openEvent(notification)}>
                    See event ›
                  </button>
                </div>

                <button
                  type="button"
                  className="notification__close"
                  onClick={animateDismiss}
                  aria-label="Remover notificação"
                >
                  <Icon name="close" size={20} />
                </button>
              </>
            )}
          </SwipeToDismiss>
        ))}
      </ul>

      {filter === 'unread' && hasUnread && (
        <button type="button" className="notifications__mark-all" onClick={markAllAsRead}>
          Mark all as read
        </button>
      )}
    </main>
  )
}
