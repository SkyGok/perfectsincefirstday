import { useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { useGesture } from '@use-gesture/react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/dome-gallery.css'

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35
}

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const normalizeAngle = d => ((d % 360) + 360) % 360
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360
  return a - 180
}

const getDataNumber = (el, name, fallback) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`)
  const n = attr == null ? NaN : parseFloat(attr)
  return Number.isFinite(n) ? n : fallback
}

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2)
  const evenYs = [-4, -2, 0, 2, 4]
  const oddYs = [-3, -1, 1, 3, 5]
  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }))
  })
  const totalSlots = coords.length

  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '', note: '' }))
  }

  if (pool.length > totalSlots) {
    console.warn(
      `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${totalSlots}). Some images will not be shown.`
    )
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '', note: '' }
    }
    return { 
      src: image.image || image.src || '', 
      alt: image.alt || '', 
      note: image.note || image.message || '',
      id: image.id
    }
  })

  const usedImages = Array.from({ length: totalSlots }, (_, i) => 
    normalizedImages[i % normalizedImages.length]
  )

  // Shuffle to avoid duplicates next to each other
  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i]
          usedImages[i] = usedImages[j]
          usedImages[j] = tmp
          break
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt,
    note: usedImages[i].note
  }))
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2
  const rotateY = unit * (offsetX + (sizeX - 1) / 2)
  const rotateX = unit * (offsetY - (sizeY - 1) / 2)
  return { rotateX, rotateY }
}

// Detect mobile device
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export default function DomeGallery({
  items = [],
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#060010',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  autoRotate = false,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = '400px',
  openedImageHeight = '400px',
  imageBorderRadius = '30px',
  openedImageBorderRadius = '30px',
  grayscale = true
}) {
  // Reduce segments on mobile for better performance
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const effectiveSegments = isMobileDevice ? Math.max(20, Math.floor(segments * 0.6)) : segments
  const effectiveDragSensitivity = isMobileDevice ? dragSensitivity * 1.5 : dragSensitivity

  useEffect(() => {
    setIsMobileDevice(isMobile())
    const handleResize = () => setIsMobileDevice(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const rootRef = useRef(null)
  const mainRef = useRef(null)
  const sphereRef = useRef(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const rotationRef = useRef({ x: 0, y: 0 })
  const startRotRef = useRef({ x: 0, y: 0 })
  const startPosRef = useRef(null)
  const draggingRef = useRef(false)
  const cancelTapRef = useRef(false)
  const movedRef = useRef(false)
  const inertiaRAF = useRef(null)
  const pointerTypeRef = useRef('mouse')
  const tapTargetRef = useRef(null)
  const openingRef = useRef(false)
  const openStartedAtRef = useRef(0)
  const lastDragEndAt = useRef(0)
  const scrollLockedRef = useRef(false)
  const lockedRadiusRef = useRef(null)

  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return
    scrollLockedRef.current = true
    document.body.classList.add('dg-scroll-lock')
  }, [])

  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return
    if (selectedItem) return
    scrollLockedRef.current = false
    document.body.classList.remove('dg-scroll-lock')
  }, [selectedItem])

  const galleryItems = useMemo(() => buildItems(items, effectiveSegments), [items, effectiveSegments])

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`
    }
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect
      const w = Math.max(1, cr.width)
      const h = Math.max(1, cr.height)
      const minDim = Math.min(w, h)
      const maxDim = Math.max(w, h)
      const aspect = w / h

      let basis
      switch (fitBasis) {
        case 'min':
          basis = minDim
          break
        case 'max':
          basis = maxDim
          break
        case 'width':
          basis = w
          break
        case 'height':
          basis = h
          break
        default:
          basis = aspect >= 1.3 ? w : minDim
      }

      let radius = basis * fit
      const heightGuard = h * 1.35
      radius = Math.min(radius, heightGuard)
      radius = clamp(radius, minRadius, maxRadius)

      lockedRadiusRef.current = Math.round(radius)
      const viewerPad = Math.max(8, Math.round(minDim * padFactor))

      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`)
      root.style.setProperty('--viewer-pad', `${viewerPad}px`)
      root.style.setProperty('--overlay-blur-color', overlayBlurColor)
      root.style.setProperty('--tile-radius', imageBorderRadius)
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius)
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none')

      applyTransform(rotationRef.current.x, rotationRef.current.y)
    })

    ro.observe(root)
    return () => ro.disconnect()
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius
  ])

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y)
  }, [])

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current)
      inertiaRAF.current = null
    }
  }, [])

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4
      let vX = clamp(vx, -MAX_V, MAX_V) * 80
      let vY = clamp(vy, -MAX_V, MAX_V) * 80
      let frames = 0
      const d = clamp(dragDampening ?? 0.6, 0, 1)
      const frictionMul = 0.94 + 0.055 * d
      const stopThreshold = 0.015 - 0.01 * d
      const maxFrames = Math.round(90 + 270 * d)

      const step = () => {
        vX *= frictionMul
        vY *= frictionMul
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null
          return
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null
          return
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg)
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200)
        rotationRef.current = { x: nextX, y: nextY }
        applyTransform(nextX, nextY)
        inertiaRAF.current = requestAnimationFrame(step)
      }

      stopInertia()
      inertiaRAF.current = requestAnimationFrame(step)
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  )

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (selectedItem) return
        stopInertia()
        pointerTypeRef.current = event.pointerType || 'mouse'
        if (pointerTypeRef.current === 'touch') event.preventDefault()
        if (pointerTypeRef.current === 'touch') lockScroll()
        draggingRef.current = true
        cancelTapRef.current = false
        movedRef.current = false
        startRotRef.current = { ...rotationRef.current }
        startPosRef.current = { x: event.clientX, y: event.clientY }
        const potential = event.target.closest?.('.item__image')
        tapTargetRef.current = potential || null
      },
      onDrag: ({ event, last, velocity: velArr = [0, 0], direction: dirArr = [0, 0], movement }) => {
        if (selectedItem || !draggingRef.current || !startPosRef.current) return
        if (pointerTypeRef.current === 'touch') event.preventDefault()

        const dxTotal = event.clientX - startPosRef.current.x
        const dyTotal = event.clientY - startPosRef.current.y
        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal
          if (dist2 > 16) movedRef.current = true
        }

        const nextX = clamp(
          startRotRef.current.x - dyTotal / effectiveDragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        )
        const nextY = startRotRef.current.y + dxTotal / effectiveDragSensitivity
        const cur = rotationRef.current
        if (cur.x !== nextX || cur.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY }
          applyTransform(nextX, nextY)
        }

        if (last) {
          draggingRef.current = false
          let isTap = false
          if (startPosRef.current) {
            const dx = event.clientX - startPosRef.current.x
            const dy = event.clientY - startPosRef.current.y
            const dist2 = dx * dx + dy * dy
            const TAP_THRESH_PX = pointerTypeRef.current === 'touch' ? 10 : 6
            if (dist2 <= TAP_THRESH_PX * TAP_THRESH_PX) {
              isTap = true
            }
          }

          let [vMagX, vMagY] = velArr
          const [dirX, dirY] = dirArr
          let vx = vMagX * dirX
          let vy = vMagY * dirY

          if (!isTap && Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement
            vx = (mx / dragSensitivity) * 0.02
            vy = (my / dragSensitivity) * 0.02
          }

          if (!isTap && (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)) {
            startInertia(vx, vy)
          }

          startPosRef.current = null
          cancelTapRef.current = !isTap
          if (isTap && tapTargetRef.current && !selectedItem) {
            const itemElement = tapTargetRef.current.closest('[data-item-index]')
            if (itemElement) {
              const index = parseInt(itemElement.getAttribute('data-item-index'))
              if (galleryItems[index] && galleryItems[index].note) {
                setSelectedItem(galleryItems[index])
                lockScroll()
              }
            }
          }
          tapTargetRef.current = null
          if (cancelTapRef.current) setTimeout(() => (cancelTapRef.current = false), 120)
          if (movedRef.current) lastDragEndAt.current = performance.now()
          movedRef.current = false
          if (pointerTypeRef.current === 'touch') unlockScroll()
        }
      }
    },
    { target: mainRef, eventOptions: { passive: false } }
  )

  const closeNote = useCallback(() => {
    setSelectedItem(null)
    setTimeout(() => unlockScroll(), 300)
  }, [unlockScroll])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape' && selectedItem) {
        closeNote()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedItem, closeNote])

  useEffect(() => {
    return () => {
      document.body.classList.remove('dg-scroll-lock')
    }
  }, [])

  const handleImageClick = (item, index, e) => {
    e.stopPropagation()
    if (draggingRef.current) return
    if (movedRef.current) return
    if (performance.now() - lastDragEndAt.current < 80) return
    if (openingRef.current) return
    if (item.note) {
      setSelectedItem(item)
      lockScroll()
    }
  }

  return (
    <>
      <div
        ref={rootRef}
        className="dome-gallery-root"
        style={{
          ['--segments-x']: effectiveSegments,
          ['--segments-y']: effectiveSegments,
          ['--overlay-blur-color']: overlayBlurColor,
          ['--tile-radius']: imageBorderRadius,
          ['--enlarge-radius']: openedImageBorderRadius,
          ['--image-filter']: grayscale ? 'grayscale(1)' : 'none'
        }}
      >
        <main
          ref={mainRef}
          className="dome-gallery-main"
        >
          <div className="dome-gallery-stage">
            <div ref={sphereRef} className="dome-gallery-sphere">
              {galleryItems.map((it, i) => {
                const baseRot = computeItemBaseRotation(it.x, it.y, it.sizeX, it.sizeY, effectiveSegments)
                return (
                  <div
                    key={`${it.x},${it.y},${i}`}
                    className="dome-gallery-item"
                    data-item-index={i}
                    data-offset-x={it.x}
                    data-offset-y={it.y}
                    data-size-x={it.sizeX}
                    data-size-y={it.sizeY}
                    style={{
                      ['--offset-x']: it.x,
                      ['--offset-y']: it.y,
                      ['--item-size-x']: it.sizeX,
                      ['--item-size-y']: it.sizeY
                    }}
                  >
                    <div
                      className="item__image"
                      role="button"
                      tabIndex={0}
                      aria-label={it.alt || 'Open image'}
                      onClick={(e) => handleImageClick(it, i, e)}
                      onPointerUp={(e) => {
                        if (e.pointerType === 'touch') {
                          handleImageClick(it, i, e)
                        }
                      }}
                    >
                      {it.src && (
                        <img
                          src={it.src}
                          draggable={false}
                          alt={it.alt}
                          loading="lazy"
                          decoding="async"
                          style={{
                            filter: grayscale ? 'grayscale(1)' : 'none',
                            transform: 'translateZ(0)',
                            willChange: 'transform'
                          }}
                        />
                      )}
                      {it.note && (
                        <div className="dome-hint-overlay">
                          <span>Click to read 💕</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Overlay gradients */}
          <div className="dome-overlay-gradient-top" />
          <div className="dome-overlay-gradient-bottom" />
        </main>
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              className="dome-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeNote}
            />
            <motion.div
              className="dome-note-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button className="dome-close-button" onClick={closeNote}>
                ×
              </button>
              <div className="dome-note-content">
                {selectedItem.src && (
                  <div className="dome-note-image">
                    <img src={selectedItem.src} alt={selectedItem.alt || "Selected image"} />
                  </div>
                )}
                <div className="dome-note-message">
                  <h3 className="dome-note-title">💕 A Special Note 💕</h3>
                  <p className="dome-note-text">{selectedItem.note}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
