import { useState, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import './index.css'

const galleryImages = [
  { id: 1, category: 'Portrait', src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', title: 'Ethereal Glow', camera: 'Sony A7IV', lens: '85mm f/1.4', settings: 'f/1.8 · 1/250s · ISO 200', location: 'Mumbai', colors: ['#f4a6b8', '#ffd6ba', '#c9b6e4'], likes: 248 },
  { id: 2, category: 'Landscape', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', title: 'Mountain Dawn', camera: 'Canon R5', lens: '24-70mm f/2.8', settings: 'f/8 · 1/125s · ISO 100', location: 'Himalayas', colors: ['#b8e0d2', '#c9b6e4', '#ffd6ba'], likes: 312 },
  { id: 3, category: 'Urban', src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', title: 'City Lights', camera: 'Sony A7III', lens: '35mm f/1.4', settings: 'f/2 · 1/60s · ISO 800', location: 'Tokyo', colors: ['#c9b6e4', '#f4a6b8', '#4a3f4a'], likes: 189 },
  { id: 4, category: 'Portrait', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', title: 'Natural Beauty', camera: 'Fuji X-T5', lens: '56mm f/1.2', settings: 'f/2 · 1/500s · ISO 400', location: 'Studio', colors: ['#ffd6ba', '#f4a6b8', '#b8e0d2'], likes: 421 },
  { id: 5, category: 'Nature', src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', title: 'Morning Fields', camera: 'Nikon Z7', lens: '70-200mm f/2.8', settings: 'f/4 · 1/1000s · ISO 200', location: 'Goa', colors: ['#b8e0d2', '#ffd6ba', '#c9b6e4'], likes: 267 },
  { id: 6, category: 'Street', src: 'https://images.unsplash.com/photo-1519608487953-e999c86aa745?w=800&q=80', title: 'Urban Tales', camera: 'Leica Q2', lens: '28mm f/1.7', settings: 'f/2.8 · 1/250s · ISO 400', location: 'Mumbai', colors: ['#4a3f4a', '#f4a6b8', '#ffd6ba'], likes: 198 },
  { id: 7, category: 'Portrait', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', title: 'Golden Hour', camera: 'Canon R6', lens: '50mm f/1.2', settings: 'f/1.8 · 1/200s · ISO 100', location: 'Jaipur', colors: ['#ffd6ba', '#f4a6b8', '#c9b6e4'], likes: 356 },
  { id: 8, category: 'Landscape', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', title: 'Forest Light', camera: 'Sony A7R V', lens: '16-35mm f/2.8', settings: 'f/11 · 1/30s · ISO 100', location: 'Kerala', colors: ['#b8e0d2', '#c9b6e4', '#4a3f4a'], likes: 289 },
  { id: 9, category: 'Urban', src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80', title: 'Night Skyline', camera: 'Sony A7S III', lens: '24mm f/1.4', settings: 'f/2.8 · 15s · ISO 1600', location: 'Dubai', colors: ['#4a3f4a', '#c9b6e4', '#f4a6b8'], likes: 445 },
  { id: 10, category: 'Portrait', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', title: 'Portrait Dreams', camera: 'Hasselblad X2D', lens: '80mm f/1.9', settings: 'f/2 · 1/320s · ISO 100', location: 'Studio', colors: ['#f4a6b8', '#ffd6ba', '#b8e0d2'], likes: 512 },
  { id: 11, category: 'Nature', src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', title: 'Waterfall', camera: 'Nikon Z9', lens: '14-24mm f/2.8', settings: 'f/16 · 1/4s · ISO 64', location: 'Coorg', colors: ['#b8e0d2', '#c9b6e4', '#ffd6ba'], likes: 378 },
  { id: 12, category: 'Street', src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', title: 'City Pulse', camera: 'Fuji X-Pro3', lens: '23mm f/2', settings: 'f/4 · 1/125s · ISO 800', location: 'Delhi', colors: ['#4a3f4a', '#f4a6b8', '#ffd6ba'], likes: 234 },
]

const services = [
  { icon: '📷', title: 'Portrait Photography', description: 'Professional portrait sessions capturing your unique personality.' },
  { icon: '🏔️', title: 'Landscape & Nature', description: 'Breathtaking captures of natural landscapes.' },
  { icon: '🌆', title: 'Urban & Street', description: 'Dynamic city photography.' },
  { icon: '💍', title: 'Events & Weddings', description: 'Documenting your special moments.' },
  { icon: '🎬', title: 'Video Production', description: 'Cinematic video creation.' },
  { icon: '🎨', title: 'Photo Editing', description: 'Professional post-processing.' },
]

const skills = [
  { name: 'Portrait Photography', icon: '📸' },
  { name: 'Landscape & Nature', icon: '🏔️' },
  { name: 'Urban Photography', icon: '🏙️' },
  { name: 'Photo Editing', icon: '🎨' },
  { name: 'Video Production', icon: '🎬' },
  { name: 'Event Coverage', icon: '🎥' },
]

const testimonials = [
  { name: 'Sarah Johnson', role: 'Wedding Client', text: 'Parth captured our special day beautifully!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
  { name: 'Michael Chen', role: 'Commercial Client', text: 'Incredible professional work!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
  { name: 'Emily Davis', role: 'Portrait Client', text: 'Best photographer ever!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' },
]

function App() {
  console.log('Build:', new Date().toISOString())
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)
  const [shutterOpen, setShutterOpen] = useState(true)
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(galleryImages.map(img => [img.id, img.likes]))
  )

  const { scrollYProgress } = useScroll()
  const navBg = useTransform(scrollYProgress, [0, 0.1], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)'])

  const toggleLike = (id: number, e: ReactMouseEvent) => {
    e.stopPropagation()
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))
    setLikeCounts(prev => ({
      ...prev,
      [id]: prev[id] + (liked[id] ? -1 : 1)
    }))
  }

  const handlePrev = () => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    setSelectedImage(filteredImages[prevIndex])
  }

  const handleNext = () => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % filteredImages.length
    setSelectedImage(filteredImages[nextIndex])
  }

  const handleDownload = async () => {
    if (!selectedImage) return
    try {
      const response = await fetch(selectedImage.src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedImage.title.replace(/\s+/g, '-').toLowerCase()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      window.open(selectedImage.src, '_blank')
    }
  }

  const handleShare = async () => {
    if (!selectedImage) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedImage.title,
          text: `Check out "${selectedImage.title}" by Parth Photography`,
          url: window.location.href,
        })
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setShutterOpen(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!selectedImage) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'Escape') setSelectedImage(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedImage, activeFilter])

  const filters = ['All', 'Portrait', 'Landscape', 'Urban', 'Nature', 'Street']
  const filteredImages = activeFilter === 'All' ? galleryImages : galleryImages.filter(img => img.category === activeFilter)

  const apertureShapes = Array.from({ length: 8 }, (_, i) => ({ id: i, angle: i * 45, delay: i * 0.1 }))

  return (
    <>
      <AnimatePresence>
        {shutterOpen && (
          <motion.div className="shutter-overlay" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            {apertureShapes.map((shape) => (
              <motion.div key={shape.id} className="shutter-blade" initial={{ rotate: 0 }} exit={{ rotate: shape.angle * 2 }} transition={{ duration: 0.6, delay: shape.delay }} style={{ transform: `rotate(${shape.angle}deg)` }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="hero" id="home">
        <div className="hero-bg" />

        <div className="lens-effect">
          {apertureShapes.map((shape) => (
            <motion.div key={shape.id} className="lens-ring" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: shape.delay }} style={{ transform: `rotate(${shape.angle}deg) scale(${1 + shape.id * 0.15})` }} />
          ))}
        </div>

        <motion.div className="focus-indicator">
          <motion.div className="focus-corner tl" animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.div className="focus-corner tr" animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
          <motion.div className="focus-corner bl" animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
          <motion.div className="focus-corner br" animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} />
        </motion.div>

        <motion.div className="hero-content">
          <motion.span className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>Visual Storyteller</motion.span>
          <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>Capturing Moments<br /><span>Creating Memories</span></motion.h1>
          <motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>Professional photography that tells your unique story.</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <motion.a href="#gallery" className="hero-cta" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>View Gallery</motion.a>
            <motion.a href="#contact" className="hero-cta hero-cta-outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Contact Me</motion.a>
          </motion.div>
        </motion.div>

        <motion.div className="scroll-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>Scroll</motion.span>
        </motion.div>
      </section>

      <motion.nav className="navbar" style={{ background: navBg }} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 2 }}>
        <motion.div className="logo" whileHover={{ scale: 1.1, rotate: 3 }}>PARTH</motion.div>
        <ul className="nav-links">
          {['Home', 'Gallery', 'About', 'Services', 'Contact'].map((item, i) => (
            <motion.li key={item} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 2.2 }}>
              <motion.a href={`#${item.toLowerCase()}`} whileHover={{ color: '#f4a6b8', scale: 1.05 }}>{item}</motion.a>
            </motion.li>
          ))}
        </ul>
        <button className="mobile-menu-btn">☰</button>
      </motion.nav>

      <section className="gallery" id="gallery">
        <motion.div className="section-header" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="section-subtitle">Portfolio</p>
          <h2 className="section-title">Featured Work</h2>
        </motion.div>
        <motion.div className="filters" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {filters.map((filter, index) => (
            <motion.button key={filter} onClick={() => setActiveFilter(filter)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className={activeFilter === filter ? 'filter-btn active' : 'filter-btn'}>{filter}</motion.button>
          ))}
        </motion.div>
        <motion.div className="gallery-grid" layout>
          <AnimatePresence mode='popLayout'>
            {filteredImages.map((image, index) => (
              <motion.div key={image.id} className="gallery-item" layout initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.03, zIndex: 10 }} onClick={() => setSelectedImage(image)}>
                <img src={image.src} alt={image.title} />
                <div className="gallery-badge">{image.category}</div>
                <button className={`gallery-like ${liked[image.id] ? 'liked' : ''}`} onClick={(e) => toggleLike(image.id, e)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={liked[image.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>{likeCounts[image.id]}</span>
                </button>
                <div className="gallery-overlay">
                  <h3>{image.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)}>
            <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); handlePrev() }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); handleNext() }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <motion.div className="lightbox-content" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setSelectedImage(null)}>X</button>
              <div className="lightbox-counter">
                {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
              </div>
              <img src={selectedImage.src} alt={selectedImage.title} />
              <div className="lightbox-details">
                <div className="lightbox-header">
                  <div>
                    <h3>{selectedImage.title}</h3>
                    <p className="lightbox-category">{selectedImage.category} · {selectedImage.location}</p>
                  </div>
                  <div className="lightbox-actions">
                    <button className={`lightbox-action ${liked[selectedImage.id] ? 'liked' : ''}`} onClick={(e) => toggleLike(selectedImage.id, e)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={liked[selectedImage.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      <span>{likeCounts[selectedImage.id]}</span>
                    </button>
                    <button className="lightbox-action" onClick={handleShare} title="Share">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                    </button>
                    <button className="lightbox-action" onClick={handleDownload} title="Download">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="about" id="about">
        <motion.div className="about-container" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <motion.div className="about-image" initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <img src="https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80" alt="Photographer" />
            <motion.div className="image-accent" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }} />
          </motion.div>
          <div className="about-content">
            <motion.p className="section-subtitle" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>About Me</motion.p>
            <motion.h2 initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>Hi, I am Parth</motion.h2>
            <motion.p initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>A passionate photographer with over 5 years of experience capturing beautiful moments.</motion.p>
            <motion.div className="skills-container" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <h3>Skills</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <motion.div key={index} className="skill-card" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + index * 0.1 }} whileHover={{ scale: 1.05 }}>
                    <span className="skill-icon">{skill.icon}</span>
                    <span className="skill-name">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div className="about-stats" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
              {[{ number: '500+', label: 'Sessions' }, { number: '5+', label: 'Years' }, { number: '50+', label: 'Awards' }, { number: '1000+', label: 'Clients' }].map((stat, i) => (
                <motion.div key={i} className="stat-item" whileInView={{ scale: [0.5, 1.2, 1] }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.1 }}>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="services" id="services">
        <motion.div className="section-header" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="section-subtitle">Services</p>
          <h2 className="section-title">What I Offer</h2>
        </motion.div>
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div key={index} className="service-card" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -15 }}>
              <motion.div className="service-icon" whileHover={{ scale: 1.2, rotate: 15 }}>{service.icon}</motion.div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <motion.div className="section-header" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="section-subtitle">Testimonials</p>
          <h2 className="section-title">Client Reviews</h2>
        </motion.div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} className="testimonial-card" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} whileHover={{ y: -10 }}>
              <div className="testimonial-quote">"</div>
              <p>{testimonial.text}</p>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.name} />
                <div><h4>{testimonial.name}</h4><span>{testimonial.role}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <motion.div className="contact-container" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="section-subtitle">Get In Touch</p>
          <h2>Let Work Together</h2>
          <p>Have a project in mind? Send me a message.</p>
          <motion.form className="contact-form" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <motion.button type="submit" className="submit-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Send Message</motion.button>
          </motion.form>
        </motion.div>
      </section>

      <footer className="footer">
        <motion.div className="footer-content" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="footer-logo">PARTH</div>
          <ul className="footer-links">
            {['Instagram', 'Twitter', 'LinkedIn', 'Behance'].map(social => (
              <motion.li key={social} whileHover={{ scale: 1.2, color: '#f4a6b8' }}><a href="#">{social}</a></motion.li>
            ))}
          </ul>
          <p className="footer-copyright">© 2024 Parth Photography. All rights reserved.</p>
        </motion.div>
      </footer>
    </>
  )
}

export default App