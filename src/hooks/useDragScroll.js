import { useEffect } from 'react'

/**
 * Lets a mouse drag a horizontal scroll-snap carousel (touch and trackpads
 * already scroll natively). Snapping is paused while dragging; on release the
 * carousel glides to the nearest item, and a drag never counts as a click.
 */
export default function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    let startX = 0
    let startScroll = 0
    let dragging = false
    let moved = false

    const onPointerDown = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      dragging = true
      moved = false
      startX = event.clientX
      startScroll = el.scrollLeft
    }

    const onPointerMove = (event) => {
      if (!dragging) return
      const dx = event.clientX - startX
      if (!moved && Math.abs(dx) > 4) {
        moved = true
        el.classList.add('is-dragging')
        // Capture only once it's a real drag: capturing on press would steal the
        // click from the poster or ticket under the pointer
        el.setPointerCapture(event.pointerId)
      }
      if (moved) el.scrollLeft = startScroll - dx
    }

    const onPointerUp = () => {
      if (!dragging) return
      dragging = false
      if (!moved) return
      // Glide to the item whose snap position is closest, then hand back to CSS snapping.
      // An item snaps when its left edge sits at the carousel's scroll-padding.
      // (The carousel must be position: relative so offsetLeft is measured from it.)
      const padding = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
      const targets = [...el.children].map((child) => child.offsetLeft - padding)
      const nearest = targets.reduce((best, left) =>
        Math.abs(left - el.scrollLeft) < Math.abs(best - el.scrollLeft) ? left : best,
      )
      el.scrollTo({ left: nearest, behavior: 'smooth' })
      setTimeout(() => el.classList.remove('is-dragging'), 400)
    }

    // Swallow the click that ends a drag, so dragging over a card doesn't activate it
    const onClick = (event) => {
      if (moved) {
        event.stopPropagation()
        event.preventDefault()
        moved = false
      }
    }

    // No ghost image when dragging over a picture
    const onDragStart = (event) => event.preventDefault()

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('dragstart', onDragStart)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('click', onClick, true)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('dragstart', onDragStart)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [ref])
}
