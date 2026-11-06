import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './FeaturedSlider.css'

/*
 * Full-width featured slider with a staggered strip wipe, run sideways.
 * The incoming slide is cut into horizontal bands; each band slides its slice of
 * the new photo in over the current one, one after another (top band first),
 * so the change goes straight from one photo to the next.
 * Next slide: bands enter from the right; previous: from the left.
 * Built on the Web Animations API (no animation library).
 */

const STRIPS = 6
const DURATION = 650 // ms per band
const STAGGER = 70 // ms between bands
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const AUTOPLAY = 5000
const SWIPE = 40 // px

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Band i covers its own horizontal slice; only its left/right inset animates
const bandClip = (i, left, right) => {
  const top = (i * 100) / STRIPS
  const bottom = 100 - ((i + 1) * 100) / STRIPS
  // the 1px overlap keeps hairline seams from showing between bands
  return `inset(calc(${top}% - 1px) ${right}% calc(${bottom}% - 1px) ${left}%)`
}

function SlideContent({ slide }) {
  return (
    <>
      <img className="featured-slider__image" src={slide.image} alt="" draggable={false} />
      <div className="featured-slider__shade" />
      <div className="featured-slider__caption">
        <h3 className="featured-slider__title">{slide.title}</h3>
        <p className="featured-slider__subtitle">{slide.subtitle}</p>
      </div>
    </>
  )
}

export default function FeaturedSlider({ slides, label = 'Destaques' }) {
  const [active, setActive] = useState(0)
  const [incoming, setIncoming] = useState(null) // { index, direction } while a wipe runs
  const [paused, setPaused] = useState(false)
  const bandsRef = useRef([])
  const swipe = useRef(null)

  const goTo = (index, direction = index > active ? 1 : -1) => {
    if (incoming || index === active) return
    if (reducedMotion()) setActive(index)
    else setIncoming({ index, direction })
  }

  // Run the wipe as soon as the bands are in the DOM (before paint, so no flash)
  useLayoutEffect(() => {
    if (!incoming) return undefined
    const fromRight = incoming.direction > 0
    const animations = bandsRef.current.filter(Boolean).map((band, i) =>
      band.animate(
        [
          { clipPath: fromRight ? bandClip(i, 100, 0) : bandClip(i, 0, 100) },
          { clipPath: bandClip(i, 0, 0) },
        ],
        { duration: DURATION, delay: i * STAGGER, easing: EASE, fill: 'both' },
      ),
    )
    let cancelled = false
    Promise.all(animations.map((a) => a.finished))
      .then(() => {
        if (cancelled) return
        setActive(incoming.index)
        setIncoming(null)
      })
      .catch(() => {})
    return () => {
      cancelled = true
      animations.forEach((a) => a.cancel())
    }
  }, [incoming])

  const next = () => goTo((active + 1) % slides.length, 1)
  const prev = () => goTo((active - 1 + slides.length) % slides.length, -1)

  // Autoplay: waits while the user is touching / focused, and never with reduced motion
  useEffect(() => {
    if (paused || incoming || slides.length < 2 || reducedMotion()) return undefined
    const timer = setTimeout(next, AUTOPLAY)
    return () => clearTimeout(timer)
  })

  // Swipe (touch or mouse drag): only the horizontal gesture is ours, vertical scroll stays native
  const onPointerDown = (e) => {
    swipe.current = { x: e.clientX, y: e.clientY }
    setPaused(true)
  }
  const onPointerUp = (e) => {
    const start = swipe.current
    swipe.current = null
    setPaused(false)
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next()
      else prev()
    }
  }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }

  const shown = incoming ? incoming.index : active

  return (
    <div
      className="featured-slider"
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipe.current = null
        setPaused(false)
      }}
      onKeyDown={onKeyDown}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          className={`featured-slider__slide${index === active ? ' is-active' : ''}`}
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} de ${slides.length}`}
          aria-hidden={index !== shown}
        >
          <SlideContent slide={slide} />
        </div>
      ))}

      {/* The wipe: the incoming slide, sliced into bands that slide in over the current one */}
      {incoming && (
        <div className="featured-slider__bands" aria-hidden="true">
          {Array.from({ length: STRIPS }, (_, i) => (
            <div
              className="featured-slider__band"
              key={i}
              ref={(el) => {
                bandsRef.current[i] = el
              }}
            >
              <SlideContent slide={slides[incoming.index]} />
            </div>
          ))}
        </div>
      )}

      {/* Page dots: the active one stretches into a pill (moves as soon as the wipe starts) */}
      <div className="featured-slider__dots">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.id}
            className={`featured-slider__dot${index === shown ? ' is-active' : ''}`}
            aria-label={`Ir para o destaque ${index + 1}: ${slide.title}`}
            aria-current={index === shown ? 'true' : undefined}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
