import { useRef } from 'react'
import './SwipeToDismiss.css'

const START_DISTANCE = 8 // px before deciding between a swipe and a scroll
const FLICK_SPEED = 0.5 // px/ms: a fast flick dismisses even if short

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Swipe an item sideways to dismiss it: past `threshold` (share of its width)
 * or with a quick flick it slides out and the list closes the gap; otherwise
 * it springs back. Vertical drags are left to the page scroll.
 * `children` can be a function receiving `dismiss()`, so a close button can run
 * the same exit animation.
 */
export default function SwipeToDismiss({
  as: Tag = 'div',
  className = '',
  itemClassName = '',
  threshold = 0.35,
  onDismiss,
  children,
}) {
  const outerRef = useRef(null)
  const itemRef = useRef(null)
  const gesture = useRef(null)
  const offset = useRef(0)
  const leaving = useRef(false)
  const suppressClick = useRef(false)

  const opacityAt = (x) => Math.max(0.2, 1 - (Math.abs(x) / itemRef.current.offsetWidth) * 0.8)

  const setOffset = (x, animate = false) => {
    const item = itemRef.current
    offset.current = x
    item.style.transition = animate ? 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease' : 'none'
    item.style.transform = x ? `translateX(${x}px)` : ''
    item.style.opacity = x ? String(opacityAt(x)) : ''
  }

  const dismiss = (direction = 1) => {
    if (leaving.current) return
    leaving.current = true
    if (prefersReducedMotion()) {
      onDismiss()
      return
    }

    const item = itemRef.current
    const outer = outerRef.current
    const from = offset.current
    item.style.transition = 'none'

    item
      .animate(
        [
          { transform: `translateX(${from}px)`, opacity: from ? opacityAt(from) : 1 },
          { transform: `translateX(${direction * item.offsetWidth * 1.1}px)`, opacity: 0 },
        ],
        { duration: 220, easing: 'ease-in', fill: 'forwards' },
      )
      .finished.then(() => {
        // Close the gap, including the list's gap below this item
        const gap = parseFloat(getComputedStyle(outer.parentElement).rowGap) || 0
        outer.style.overflow = 'hidden'
        return outer.animate(
          [
            { height: `${outer.offsetHeight}px`, marginBottom: '0px' },
            { height: '0px', marginBottom: `${-gap}px` },
          ],
          { duration: 240, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
        ).finished
      })
      .then(() => onDismiss())
  }

  const onPointerDown = (event) => {
    suppressClick.current = false
    if (event.button !== 0 || leaving.current) return
    gesture.current = {
      id: event.pointerId,
      x0: event.clientX,
      y0: event.clientY,
      dx: 0,
      dragging: false,
      lastX: event.clientX,
      lastT: event.timeStamp,
      speed: 0,
    }
  }

  const onPointerMove = (event) => {
    const g = gesture.current
    if (!g || event.pointerId !== g.id) return
    const dx = event.clientX - g.x0
    const dy = event.clientY - g.y0

    if (!g.dragging) {
      if (Math.abs(dx) > START_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
        g.dragging = true
        event.currentTarget.setPointerCapture(event.pointerId)
      } else {
        if (Math.abs(dy) > START_DISTANCE) gesture.current = null // it's a scroll
        return
      }
    }

    const dt = event.timeStamp - g.lastT
    if (dt > 0) g.speed = (event.clientX - g.lastX) / dt
    g.lastX = event.clientX
    g.lastT = event.timeStamp
    g.dx = dx
    setOffset(dx)
  }

  const onPointerUp = (event) => {
    const g = gesture.current
    gesture.current = null
    if (!g || event.pointerId !== g.id || !g.dragging) return
    suppressClick.current = true // the drag shouldn't also "click" what's under it

    const width = itemRef.current.offsetWidth
    const flick = Math.abs(g.speed) > FLICK_SPEED && Math.sign(g.speed) === Math.sign(g.dx)
    if (Math.abs(g.dx) > width * threshold || flick) dismiss(Math.sign(g.dx) || 1)
    else setOffset(0, true)
  }

  const onPointerCancel = () => {
    if (gesture.current?.dragging) setOffset(0, true)
    gesture.current = null
  }

  const onClickCapture = (event) => {
    if (!suppressClick.current) return
    suppressClick.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <Tag className={`swipe-dismiss ${className}`} ref={outerRef}>
      <div
        className={`swipe-dismiss__item ${itemClassName}`}
        ref={itemRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={onClickCapture}
      >
        {typeof children === 'function' ? children(() => dismiss(1)) : children}
      </div>
    </Tag>
  )
}
