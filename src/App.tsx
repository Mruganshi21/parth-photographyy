import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import './index.css'

const ease = [0.65, 0, 0.35, 1] as const
const spring = { type: 'spring' as const, stiffness: 400, damping: 60, mass: 1 }

const loaderSlides = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
]

const photos = [
  { id: 1,  src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',  title: 'Ethereal Glow',   category: 'Portrait'      },
  { id: 2,  src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80',  title: 'City Streets',   category: 'Street'        },
  { id: 3,  src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1400&q=80', title: 'Mountain Lake',  category: 'Landscape'     },
  { id: 4,  src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=80',  title: 'Golden Light',   category: 'Portrait'      },
  { id: 5,  src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=900&q=80',  title: 'Night Skyline',  category: 'Architecture'  },
  { id: 6,  src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1400&q=80', title: 'Golden Fields',  category: 'Landscape'     },
  { id: 7,  src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80',  title: 'Warm Portrait',  category: 'Portrait'      },
  { id: 8,  src: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=900&q=80',  title: 'Street Light',   category: 'Street'        },
  { id: 9,  src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1400&q=80', title: 'Waterfall',      category: 'Landscape'     },
  { id: 10, src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80',  title: 'Misty Forest',   category: 'Landscape'     },
  { id: 11, src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80',  title: 'City Pulse',     category: 'Architecture'  },
  { id: 12, src: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1400&q=80', title: 'Desert Road',    category: 'Travel'        },
]

const categories = [
  { name: 'Portrait',      count: 48, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&q=80' },
  { name: 'Landscape',     count: 36, src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&q=80' },
  { name: 'Street',        count: 24, src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=700&q=80' },
  { name: 'Travel',        count: 62, src: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=700&q=80' },
  { name: 'Architecture',  count: 18, src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=700&q=80' },
  { name: 'Events',        count: 30, src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=80' },
]


const navLinks = [
  { label: 'Gallery',    href: '#gallery'    },
  { label: 'Categories', href: '#categories' },
  { label: 'About',      href: '#about'      },
]

type Photo = typeof photos[0]
type CursorType = 'default' | 'hover' | 'view'

function PhotoCard({
  photo, outerClass, delay = 0, titleLarge = false, onOpen, setCursor, photoIdx = 0,
}: {
  photo: Photo
  outerClass: string
  delay?: number
  titleLarge?: boolean
  onOpen: () => void
  setCursor: (t: CursorType) => void
  photoIdx?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tiltRef      = useRef<HTMLDivElement>(null)
  const isInView     = useInView(containerRef, { once: true, amount: 0.1 })
  const [revealed, setRevealed] = useState(false)
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [spot, setSpot]   = useState({ x: 50, y: 50, on: false })

  // even-index cards zoom in (0.86→1), odd-index cards zoom out (1.14→1)
  const zoomIn = photoIdx % 2 === 0

  function onMove(e: React.MouseEvent) {
    const el = tiltRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setTiltX(((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -6)
    setTiltY(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6)
    setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true })
  }

  function onLeave() {
    setTiltX(0); setTiltY(0)
    setSpot(s => ({ ...s, on: false }))
    setCursor('default')
  }

  return (
    <div ref={containerRef} className={outerClass}>
      <motion.div
        initial={{ opacity: 0, y: 48, scale: zoomIn ? 0.86 : 1.14, clipPath: 'inset(0 0 100% 0)' }}
        animate={isInView
          ? { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0 0 0% 0)' }
          : { opacity: 0, y: 48, scale: zoomIn ? 0.86 : 1.14, clipPath: 'inset(0 0 100% 0)' }
        }
        transition={{ duration: 1.15, delay, ease }}
        onAnimationComplete={() => isInView && setRevealed(true)}
      >
        <div
          ref={tiltRef}
          className="g-tilt"
          style={{
            transform: `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${spot.on ? 1.02 : 1})`,
            transition: spot.on ? 'transform 0.1s linear' : 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
          onMouseMove={onMove}
          onMouseEnter={() => setCursor('view')}
          onMouseLeave={onLeave}
          onClick={onOpen}
        >
          <div className="g-inner">
            <motion.img
              src={photo.src}
              alt={photo.title}
              loading="lazy"
              animate={
                spot.on  ? { scale: 1.09 } :
                revealed ? { scale: [1.0, 1.08, 1.0] } :
                           { scale: 1.0 }
              }
              transition={
                spot.on  ? { duration: 0.9,  ease: [0.25, 0.46, 0.45, 0.94] } :
                revealed ? { duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } :
                           { duration: 0 }
              }
            />
            <div
              className="g-spotlight"
              style={{
                background: `radial-gradient(circle 240px at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.18) 0%, transparent 70%)`,
                opacity: spot.on ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
            <div className="g-overlay" style={{ opacity: spot.on ? 1 : 0, transition: 'opacity 0.4s ease' }}>
              <span className="g-cat">{photo.category}</span>
              <span
                className={`g-title${titleLarge ? ' g-title-lg' : ''}`}
                style={{ transform: spot.on ? 'translateY(0)' : 'translateY(6px)', transition: 'transform 0.4s ease' }}
              >{photo.title}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function App() {
  const [loading, setLoading]         = useState(true)
  const [loaderPhase, setLoaderPhase] = useState(0)
  const [slideIndex, setSlideIndex]   = useState(0)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [lightbox, setLightbox]       = useState<Photo | null>(null)
  const [cursorType, setCursorType]   = useState<CursorType>('default')

  const cursorRef   = useRef<HTMLDivElement>(null)
  const dotRef      = useRef<HTMLDivElement>(null)
  const mousePos    = useRef({ x: 0, y: 0 })
  const cursorPos   = useRef({ x: 0, y: 0 })
  const cursorAngle = useRef(45)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
    if (dotRef.current) {
      dotRef.current.style.left = `${e.clientX}px`
      dotRef.current.style.top  = `${e.clientY}px`
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      const dx = mousePos.current.x - cursorPos.current.x
      const dy = mousePos.current.y - cursorPos.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)

      cursorPos.current.x += dx * 0.13
      cursorPos.current.y += dy * 0.13

      // Rotate the diamond toward the direction of travel; spring back to 45° at rest
      const targetAngle = speed > 2 ? Math.atan2(dy, dx) * (180 / Math.PI) + 45 : 45
      let diff = targetAngle - cursorAngle.current
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      cursorAngle.current += diff * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPos.current.x}px`
        cursorRef.current.style.top  = `${cursorPos.current.y}px`
        cursorRef.current.style.setProperty('--cursor-r', `${cursorAngle.current}deg`)
      }
      requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', handleMouseMove)
    const frame = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(frame) }
  }, [handleMouseMove])

  // Loader phases
  useEffect(() => {
    const t1 = setTimeout(() => setLoaderPhase(1), 1500)
    const t2 = setTimeout(() => setLoaderPhase(2), 3000)
    const t3 = setTimeout(() => setLoaderPhase(3), 3800)
    const t4 = setTimeout(() => setLoading(false), 7000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  useEffect(() => {
    if (loaderPhase < 3) return
    const iv = setInterval(() => setSlideIndex(p => (p + 1) % loaderSlides.length), 550)
    return () => clearInterval(iv)
  }, [loaderPhase])

  // Escape to close lightbox
  useEffect(() => {
    if (!lightbox) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [lightbox])

  // Group photos: every 3 → [left, right, center-large]
  const groups: Photo[][] = []
  for (let i = 0; i < photos.length; i += 3) groups.push(photos.slice(i, i + 3))

  const cv = (t: CursorType) => () => setCursorType(t)

  return (
    <>
      {/* ── CURSOR ── */}
      <div ref={cursorRef} className={`cursor cursor-${cursorType}`}>
        {cursorType === 'view' && <span className="cursor-label">VIEW</span>}
      </div>
      <div ref={dotRef} className="cursor-dot" />

      {/* ── LOADER ── */}
      <AnimatePresence>
        {loading && (
          <motion.div className="loader" exit={{ opacity: 0 }} transition={{ duration: 0.85, ease }}>
            <div className="loader-inner">
              <motion.div
                className="loader-word loader-word-l"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: loaderPhase >= 1 ? -170 : 0 }}
                transition={{ opacity: { duration: 0.5 }, x: spring }}
              >
                <span className="loader-text">PARTH</span>
              </motion.div>

              <div className={`loader-frame ${loaderPhase >= 2 ? 'visible' : ''}`}>
                <div className="loader-frame-inner">
                  {loaderSlides.map((src, i) => (
                    <img key={i} src={src} alt=""
                      className={`loader-slide ${loaderPhase >= 3 && i === slideIndex ? 'active' : ''}`} />
                  ))}
                </div>
              </div>

              <motion.div
                className="loader-word loader-word-r"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: loaderPhase >= 1 ? 170 : 0 }}
                transition={{ opacity: { duration: 0.5, delay: 0.1 }, x: spring }}
              >
                <span className="loader-text">SHOOTS</span>
              </motion.div>
            </div>

            <motion.div className="loader-copy-wrap"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: loaderPhase >= 1 ? 0 : 1 }}
              transition={{ ...spring, delay: 0.5 }}
            >
              <span className="loader-copy">(c) 2024 Parth Shoots</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NAVBAR ── */}
      {!loading && (
        <motion.nav className="navbar"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <a href="#home" className="nav-logo">PS</a>

          <button className="menu-btn"
            onClick={() => setMenuOpen(true)}
            onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
          >
            <span className="menu-btn-text">Menu</span>
            <div className="menu-btn-bars"><span /><span /></div>
          </button>
        </motion.nav>
      )}

      {/* ── MENU OVERLAY ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="menu-overlay"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
          >
            <button className="menu-close"
              onClick={() => setMenuOpen(false)}
              onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
            >
              <span>Close</span>
              <div className="menu-close-x"><span /><span /></div>
            </button>

            <nav className="menu-nav">
              {navLinks.map((l, i) => (
                <motion.a key={l.label} href={l.href} className="menu-nav-link"
                  onClick={() => setMenuOpen(false)}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease }}
                  onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                >
                  <span className="menu-nav-num">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <div className="menu-footer">
              <span>India · Available Worldwide</span>
              <span>hello@parthshoots.com</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      {!loading && (
        <section className="hero" id="home">
          <div className="hero-bg">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80" alt="" />
            <div className="hero-bg-veil" />
          </div>

          <div className="hero-content">
            <div className="hero-titles">
              <div className="hero-overflow">
                <motion.h1 className="hero-word"
                  initial={{ y: 130 }} animate={{ y: 0 }}
                  transition={{ ...spring, delay: 0.1 }}
                >PARTH</motion.h1>
              </div>
              <div className="hero-overflow">
                <motion.h1 className="hero-word hero-word-indent"
                  initial={{ y: 130 }} animate={{ y: 0 }}
                  transition={{ ...spring, delay: 0.2 }}
                >SHOOTS</motion.h1>
              </div>
            </div>

            <motion.div className="hero-tag"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.75, ease }}
            >
              <span className="hero-tag-line" />
              <span>Photographer · Visual Storyteller</span>
            </motion.div>
          </div>

          <motion.div className="hero-foot"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9 }}
          >
            <span className="hero-meta">India · 2024</span>
            <div className="hero-scroll">
              <div className="hero-scroll-bar" />
              <span>Scroll</span>
            </div>
            <span className="hero-meta">Available Worldwide</span>
          </motion.div>
        </section>
      )}

      {/* ── MARQUEE ── */}
      {!loading && (
        <div className="marquee-wrap">
          <div className="marquee-track">
            {Array.from({ length: 2 }, (_, s) =>
              ['Portrait', 'Landscape', 'Street Photography', 'Travel', 'Architecture', 'Events', 'Wildlife'].map((item, i) => (
                <span key={`${s}-${i}`} className="marquee-item">
                  {item} <span className="marquee-dot">·</span>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── GALLERY ── */}
      {!loading && (
        <section className="gallery-section" id="gallery">
          <div className="sec-head">
            <motion.div className="sec-label"
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            >
              <span className="sec-num">01</span><span>Selected Work</span>
            </motion.div>
            <div className="sec-title-wrap">
              <motion.h2 className="sec-title"
                initial={{ y: 110 }} whileInView={{ y: 0 }}
                viewport={{ once: true }} transition={{ ...spring, delay: 0.1 }}
              >Gallery</motion.h2>
            </div>
          </div>

          <div className="gallery-body">
            {groups.map((grp, gi) => (
              <div key={gi} className="gallery-group">
                <div className="gallery-sides">
                  {grp[0] && (
                    <PhotoCard
                      photo={grp[0]}
                      outerClass="g-item g-left"
                      onOpen={() => setLightbox(grp[0])}
                      setCursor={setCursorType}
                      photoIdx={gi * 3}
                    />
                  )}
                  {grp[1] && (
                    <PhotoCard
                      photo={grp[1]}
                      outerClass="g-item g-right"
                      delay={0.15}
                      onOpen={() => setLightbox(grp[1])}
                      setCursor={setCursorType}
                      photoIdx={gi * 3 + 1}
                    />
                  )}
                </div>
                {grp[2] && (
                  <PhotoCard
                    photo={grp[2]}
                    outerClass="g-center"
                    delay={0.28}
                    titleLarge
                    onOpen={() => setLightbox(grp[2])}
                    setCursor={setCursorType}
                    photoIdx={gi * 3 + 2}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="lightbox"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => { setLightbox(null); setCursorType('default') }}
          >
            <motion.div className="lb-content"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              onClick={e => e.stopPropagation()}
            >
              <img src={lightbox.src.replace('w=900', 'w=1600').replace('w=1400', 'w=1800')} alt={lightbox.title} />
              <div className="lb-info">
                <span className="lb-title">{lightbox.title}</span>
                <span className="lb-cat">{lightbox.category}</span>
              </div>
            </motion.div>
            <button className="lb-close"
              onClick={() => { setLightbox(null); setCursorType('default') }}
              onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
            >
              <span /><span />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CATEGORIES ── */}
      {!loading && (
        <section className="cats-section" id="categories">
          <div className="sec-head sec-head-dark">
            <motion.div className="sec-label sec-label-dark"
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            >
              <span className="sec-num sec-num-dark">02</span><span>Browse By Type</span>
            </motion.div>
            <div className="sec-title-wrap">
              <motion.h2 className="sec-title sec-title-dark"
                initial={{ y: 110 }} whileInView={{ y: 0 }}
                viewport={{ once: true }} transition={{ ...spring, delay: 0.1 }}
              >Categories</motion.h2>
            </div>
          </div>

          <div className="cats-grid">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} className="cat-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
              >
                <div className="cat-img">
                  <img src={cat.src} alt={cat.name} loading="lazy" />
                  <div className="cat-veil" />
                </div>
                <div className="cat-info">
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-count">{cat.count} Photos</span>
                </div>
                <div className="cat-arrow">→</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── ABOUT ── */}
      {!loading && (
        <section className="about-section" id="about">
          <div className="sec-head">
            <motion.div className="sec-label"
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            >
              <span className="sec-num">03</span><span>The Story</span>
            </motion.div>
            <div className="sec-title-wrap">
              <motion.h2 className="sec-title"
                initial={{ y: 110 }} whileInView={{ y: 0 }}
                viewport={{ once: true }} transition={{ ...spring, delay: 0.1 }}
              >About Me</motion.h2>
            </div>
          </div>

          <div className="about-body">
            <motion.div className="about-img-wrap"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease }}
            >
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80" alt="Parth" />
              <div className="about-img-tag">
                <span>Parth</span>
                <span>Photographer</span>
              </div>
            </motion.div>

            <div className="about-text">
              {[
                'A photographer with a passion for capturing fleeting moments — the quiet light before dawn, the raw energy of city streets, and the intimate stories hidden in everyday life.',
                'Every frame is a conversation between light, shadow, and emotion. I believe in letting scenes breathe, finding the extraordinary in the ordinary.',
                'Based in India, available worldwide for portraits, landscapes, events, and editorial work.',
              ].map((para, i) => (
                <motion.p key={i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.14, ease }}
                >{para}</motion.p>
              ))}

              <div className="about-stats">
                {[{ n: '5+', l: 'Years' }, { n: '200+', l: 'Projects' }, { n: '12+', l: 'Countries' }].map((s, i) => (
                  <motion.div key={i} className="a-stat"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.45 + i * 0.1, ease }}
                  >
                    <span className="a-stat-n">{s.n}</span>
                    <span className="a-stat-l">{s.l}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* ── FOOTER ── */}
      {!loading && (
        <footer className="footer">
          <div className="footer-top">
            <div className="footer-brand">PARTH SHOOTS</div>
            <div className="footer-nav">
              {navLinks.map(l => (
                <a key={l.label} href={l.href}
                  onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                >{l.label}</a>
              ))}
            </div>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
              >Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
              >X (Twitter)</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>(c) 2024 Parth Shoots</span>
            <span>Built and Designed by Parth</span>
          </div>
        </footer>
      )}
    </>
  )
}
