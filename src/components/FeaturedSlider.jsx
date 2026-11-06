import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import './FeaturedSlider.css'

/*
 * Full-width featured slider with a staggered strip wipe, run sideways.
 * The incoming slide is cut into horizontal bands; each band slides its slice of
 * the new photo in over the current one, one after another (top band first),
 * so the change goes straight from one photo to the next.
 * Next slide: bands enter from the right; previous: from the left.
 * Built on the Web Animations API (no animation library).
 */

/*
 * Two transitions, picked with the `transition` prop:
 *   'wipe' (default): staggered strip wipe, described above
 *   'tv': TV interference. Thin bands of the new slide flicker in with random
 *         sideways jumps over static noise and a brightness flash, then lock in place.
 *   'glitch': digital screen glitch. RGB channels split (red/cyan ghosts), slices of
 *         both pictures jump sideways and the image stutters between old and new.
 */

// 'wipe' settings
const STRIPS = 6
const DURATION = 650 // ms per band
const STAGGER = 70 // ms between bands
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

// 'tv' settings
const TV_STRIPS = 14
const TV_DURATION = 650 // ms, whole glitch
const TV_FRAMES = 9 // jumps per band
const TV_SHIFT = 36 // px, widest sideways jump (shrinks as the signal locks)

// 'glitch' settings
const GLITCH_DURATION = 560 // ms, whole glitch
const GLITCH_FRAMES = 14 // frames (each one a hard cut)
const GLITCH_RGB = 22 // px, widest red/blue split
const GLITCH_BLOCKS = 7 // displaced slices
const GLITCH_BLOCK_SHIFT = 70 // px, widest block jump

const AUTOPLAY = 5000
const SWIPE = 40 // px
const TAP = 8 // px: moved less than this, it's a tap

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const random = (min, max) => min + Math.random() * (max - min)
// Hard cuts between keyframes. The easing has to sit on each keyframe: set on the
// animation's options, steps(1) would apply to the whole run and freeze it on frame 0.
const hard = (frames) => frames.map((frame) => ({ easing: 'steps(1, end)', ...frame }))

// Band i of `count` covers its own horizontal slice; only its left/right inset animates
const bandClip = (i, left, right, count = STRIPS) => {
  const top = (i * 100) / count
  const bottom = 100 - ((i + 1) * 100) / count
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

// Wipe: each band slides its slice in from one side, one after another
function wipeAnimations(bands, direction) {
  const fromRight = direction > 0
  return bands.map((band, i) =>
    band.animate(
      [{ clipPath: fromRight ? bandClip(i, 100, 0) : bandClip(i, 0, 100) }, { clipPath: bandClip(i, 0, 0) }],
      { duration: DURATION, delay: i * STAGGER, easing: EASE, fill: 'both' },
    ),
  )
}

// TV interference: bands blink on and off with sideways jumps until the picture locks
function tvAnimations(bands, root, noise) {
  const hold = { duration: TV_DURATION, fill: 'both' }
  const animations = bands.map((band, i) => {
    band.style.clipPath = bandClip(i, 0, 0, TV_STRIPS)
    const frames = Array.from({ length: TV_FRAMES }, (_, k) => {
      const settle = 1 - k / TV_FRAMES // jumps get smaller as the signal locks
      const visible = Math.random() < 0.3 + 0.7 * (k / TV_FRAMES)
      return {
        offset: k / TV_FRAMES,
        transform: `translateX(${random(-TV_SHIFT, TV_SHIFT) * settle}px)`,
        opacity: visible ? 1 : 0,
      }
    })
    return band.animate(hard([...frames, { offset: 1, transform: 'none', opacity: 1 }]), hold)
  })
  // Static noise: jumps around and flickers, gone by the end
  if (noise) {
    const noiseFrames = Array.from({ length: TV_FRAMES }, (_, k) => ({
      offset: k / TV_FRAMES,
      backgroundPosition: `${Math.round(random(0, 200))}px ${Math.round(random(0, 200))}px`,
      opacity: k === 0 ? 0 : random(0.35, 0.75) * (1 - k / TV_FRAMES),
    }))
    animations.push(noise.animate(hard([...noiseFrames, { offset: 1, opacity: 0 }]), hold))
  }
  // Picture flash: brightness/contrast spikes like a tube losing sync
  if (root) {
    animations.push(
      root.animate(
        hard([
          { filter: 'none' },
          { filter: 'brightness(1.7) contrast(1.4)', offset: 0.15 },
          { filter: 'brightness(0.7) contrast(1.8)', offset: 0.3 },
          { filter: 'brightness(1.3)', offset: 0.55 },
          { filter: 'none' },
        ]),
        hold,
      ),
    )
  }
  return animations
}

// Digital glitch: RGB channels tear apart, blocks of both pictures jump sideways,
// and the picture stutters between old and new before snapping clean
function glitchAnimations(container) {
  const hold = { duration: GLITCH_DURATION, fill: 'both' }
  const F = GLITCH_FRAMES
  const intensity = (k) => Math.sin((Math.PI * k) / F) // 0 → peak mid-way → 0
  const animations = []

  // Old picture until the middle, new one after; a few stutter frames around the cut
  const showsNew = Array.from({ length: F }, (_, k) => {
    const near = Math.abs(k - F / 2) <= 2
    return near ? Math.random() < 0.5 : k >= F / 2
  })
  const sets = { from: container.querySelector('[data-set="from"]'), to: container.querySelector('[data-set="to"]') }
  Object.entries(sets).forEach(([name, set]) => {
    if (!set) return
    const frames = showsNew.map((isNew, k) => ({ offset: k / F, opacity: (name === 'to') === isNew ? 1 : 0 }))
    animations.push(set.animate(hard([...frames, { offset: 1, opacity: name === 'to' ? 1 : 0 }]), hold))
  })

  // Chromatic aberration: red one way, blue the other, sometimes a small vertical slip
  const shifts = Array.from({ length: F }, (_, k) => ({
    x: random(GLITCH_RGB / 4, GLITCH_RGB) * intensity(k) * (Math.random() < 0.5 ? -1 : 1),
    y: Math.random() < 0.25 ? random(-4, 4) * intensity(k) : 0,
  }))
  container.querySelectorAll('[data-channel]').forEach((channel) => {
    const sign = { r: 1, g: 0, b: -1 }[channel.dataset.channel]
    const frames = shifts.map((s, k) => ({ offset: k / F, transform: `translate(${s.x * sign}px, ${s.y * sign}px)` }))
    animations.push(channel.animate(hard([...frames, { offset: 1, transform: 'none' }]), hold))
  })

  // Displaced blocks: random slices that flash in, shifted sideways
  container.querySelectorAll('[data-block]').forEach((block) => {
    const frames = Array.from({ length: F }, (_, k) => {
      const top = random(0, 92)
      const height = random(2, 16)
      const left = Math.random() < 0.6 ? 0 : random(0, 50)
      const right = Math.random() < 0.6 ? 0 : random(0, 50)
      return {
        offset: k / F,
        opacity: Math.random() < 0.85 * intensity(k) ? 1 : 0,
        clipPath: `inset(${top}% ${right}% ${Math.max(0, 100 - top - height)}% ${left}%)`,
        transform: `translateX(${random(-GLITCH_BLOCK_SHIFT, GLITCH_BLOCK_SHIFT) * intensity(k)}px)`,
      }
    })
    animations.push(block.animate(hard([...frames, { offset: 1, opacity: 0 }]), hold))
  })
  return animations
}

// onOpen(slide): called on a tap (not a swipe) or Enter, e.g. to open the event page
export default function FeaturedSlider({ slides, label = 'Destaques', transition = 'wipe', onOpen }) {
  const [active, setActive] = useState(0)
  const [incoming, setIncoming] = useState(null) // { index, direction } while a transition runs
  const [paused, setPaused] = useState(false)
  const bandsRef = useRef([])
  const rootRef = useRef(null)
  const noiseRef = useRef(null)
  const swipe = useRef(null)
  const glitchRef = useRef(null)
  const filterId = `fs${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const tv = transition === 'tv'
  const glitch = transition === 'glitch'
  const bandCount = tv ? TV_STRIPS : STRIPS

  const goTo = (index, direction = index > active ? 1 : -1) => {
    if (incoming || index === active) return
    if (reducedMotion()) setActive(index)
    else setIncoming({ index, direction })
  }

  // Run the wipe as soon as the bands are in the DOM (before paint, so no flash)
  useLayoutEffect(() => {
    if (!incoming) return undefined
    const bands = bandsRef.current.slice(0, bandCount).filter(Boolean)
    const animations = glitch
      ? glitchAnimations(glitchRef.current)
      : tv
        ? tvAnimations(bands, rootRef.current, noiseRef.current)
        : wipeAnimations(bands, incoming.direction)
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
    } else if (onOpen && !incoming && Math.hypot(dx, dy) < TAP) {
      onOpen(slides[active])
    }
  }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'Enter' && onOpen && e.target === e.currentTarget) onOpen(slides[active])
  }

  const shown = incoming ? incoming.index : active

  return (
    <div
      className="featured-slider"
      ref={rootRef}
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

      {/* 'glitch': both pictures split into R/G/B layers (screen blend), plus displaced blocks */}
      {incoming && glitch && (
        <div className="featured-slider__glitch" ref={glitchRef} aria-hidden="true">
          {[
            ['to', slides[incoming.index]],
            ['from', slides[active]],
          ].map(([set, slide]) => (
            <div className="featured-slider__rgb" data-set={set} key={set}>
              {['r', 'g', 'b'].map((channel) => (
                <div
                  className="featured-slider__channel"
                  data-channel={channel}
                  key={channel}
                  style={{ filter: `url(#${filterId}-${channel})` }}
                >
                  <SlideContent slide={slide} />
                </div>
              ))}
            </div>
          ))}
          {Array.from({ length: GLITCH_BLOCKS }, (_, i) => (
            <div className="featured-slider__block" data-block key={i}>
              <SlideContent slide={i % 2 ? slides[active] : slides[incoming.index]} />
            </div>
          ))}
        </div>
      )}

      {/* Channel filters for the glitch: each keeps one of R, G or B */}
      {glitch && (
        <svg className="featured-slider__filters" aria-hidden="true" focusable="false">
          {[
            ['r', '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'],
            ['g', '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'],
            ['b', '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'],
          ].map(([channel, matrix]) => (
            <filter id={`${filterId}-${channel}`} key={channel} colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values={matrix} />
            </filter>
          ))}
        </svg>
      )}

      {/* 'wipe' / 'tv': the incoming slide, sliced into bands over the current one */}
      {incoming && !glitch && (
        <div className="featured-slider__bands" aria-hidden="true">
          {tv && <div className="featured-slider__noise" ref={noiseRef} />}
          {Array.from({ length: bandCount }, (_, i) => (
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
