import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import './index.css'

const ease = [0.65, 0, 0.35, 1] as const
const spring = { type: 'spring' as const, stiffness: 400, damping: 60, mass: 1 }

// Category photo filenames (relative to /categories/<name>/). Actual <img> src is built
// from these via `catThumb`/`catFull`, which point at pre-resized, web-sized copies of
// the originals (see `public/categories-thumb` and `public/categories-full`) — the raw
// camera JPEGs in `public/categories` are 6000x4000px / 3-5MB each, and loading a grid
// of those directly used to freeze the tab (huge decode cost + hover transform on a
// ~96MB decoded bitmap per photo). The resized copies keep the same look at a
// fraction of the memory/CPU cost.
const catThumb = (cat: string, file: string) => `/categories-thumb/${cat}/${file}`
const catFull  = (cat: string, file: string) => `/categories-full/${cat}/${file}`

// Web3Forms delivers contact-form submissions straight to Parth's inbox — the
// destination email is tied server-side to this key, not sent from the client.
// Get one free at https://web3forms.com (enter Parth's email, they reply with the key).
const WEB3FORMS_ACCESS_KEY = 'PASTE_WEB3FORMS_ACCESS_KEY_HERE'

// Loader carousel — the `.loader-frame` box is portrait (280x380, ratio ~0.74), so
// these are deliberately picked from the portrait-oriented shots in each category
// (near that same ratio) rather than the landscape ones used in the Gallery section.
const loaderSlides = [
  catThumb('Wedding Stories', '69-DSC06225.jpg'),
  catThumb('Portraits', '84-DSC05008.jpg'),
  catThumb('Live Events', '87-DSC04896.jpg'),
  catThumb('Wedding Stories', '74-DSC05974.jpg'),
  catThumb('Portraits', '46-DSC08734.jpg'),
  catThumb('Product Spotlight', '12-DSC03560.jpg'),
]

// Hand-picked highlights from the four shoot categories, used in the homepage Gallery
// section. Sourced at "full" resolution (max 2000px) since the gallery's center slot
// renders up to ~60% of the page width.
//
// The grid slots (.g-left/.g-right/.g-center in index.css) are landscape-ish boxes
// (roughly 1:1, 1.15:1 and 1.27:1). Portrait-oriented shots get badly cropped by
// object-fit: cover in those boxes (half the image can vanish top/bottom), so every
// photo below is deliberately picked from the landscape-oriented shots in each
// category — the widest ones are placed in the 3rd slot of each row (.g-center) where
// the box itself is widest.
const photos = [
  { id: 1,  src: catFull('Portraits', '90-DSC04874.jpg'),          title: 'Easy Smile',        category: 'Portraits'         },
  { id: 2,  src: catFull('Live Events', '91-DSC04746.jpg'),        title: 'Fire & Rhythm',     category: 'Live Events'       },
  { id: 3,  src: catFull('Wedding Stories', '58-DSC08027.jpg'),    title: 'Circle Of Joy',     category: 'Wedding Stories'   },
  { id: 4,  src: catFull('Product Spotlight', '7-DSC03614.jpg'),   title: 'Table For Two',     category: 'Product Spotlight' },
  { id: 5,  src: catFull('Portraits', '24-DSC02322.jpg'),          title: 'In The Moment',     category: 'Portraits'         },
  { id: 6,  src: catFull('Live Events', '103-DSC03103.jpg'),       title: 'Colour Riot',       category: 'Live Events'       },
  { id: 7,  src: catFull('Product Spotlight', '9-DSC03574.jpg'),   title: 'Zest & Ice',        category: 'Product Spotlight' },
  { id: 8,  src: catFull('Live Events', '104-DSC03093.jpg'),       title: 'Center Stage',      category: 'Live Events'       },
  { id: 9,  src: catFull('Wedding Stories', '44-DSC08753.jpg'),    title: 'Under Open Sky',    category: 'Wedding Stories'   },
  { id: 10, src: catFull('Live Events', '100-DSC03323.jpg'),       title: 'Confetti Burst',    category: 'Live Events'       },
  { id: 11, src: catFull('Wedding Stories', '51-DSC08614.jpg'),    title: 'Blossom Embrace',   category: 'Wedding Stories'   },
  { id: 12, src: catFull('Product Spotlight', '14-DSC03540.jpg'),  title: 'Citrus Spritz',     category: 'Product Spotlight' },
  { id: 13, src: catFull('Wedding Stories', '56-DSC08179.jpg'),    title: 'Shower Of Colour',  category: 'Wedding Stories'   },
  { id: 14, src: catFull('Live Events', '101-DSC03299.jpg'),       title: 'Beat Of The Crowd', category: 'Live Events'       },
  { id: 15, src: catFull('Product Spotlight', '138-DSC02999.jpg'), title: 'Timeless',          category: 'Product Spotlight' },
]

const categoryFiles: Record<string, { id: number; file: string; title: string }[]> = {
  'Live Events': [
    { id: 2001, file: '23-DSC02359.jpg',   title: 'DSC02359' },
    { id: 2002, file: '87-DSC04896.jpg',   title: 'DSC04896' },
    { id: 2003, file: '88-DSC04884.jpg',   title: 'DSC04884' },
    { id: 2004, file: '91-DSC04746.jpg',   title: 'DSC04746' },
    { id: 2005, file: '92-DSC04598.jpg',   title: 'DSC04598' },
    { id: 2006, file: '93-DSC04592.jpg',   title: 'DSC04592' },
    { id: 2007, file: '94-DSC04579.jpg',   title: 'DSC04579' },
    { id: 2008, file: '99-DSC03329.jpg',   title: 'DSC03329' },
    { id: 2009, file: '100-DSC03323.jpg',  title: 'DSC03323' },
    { id: 2010, file: '101-DSC03299.jpg',  title: 'DSC03299' },
    { id: 2011, file: '102-DSC03118.jpg',  title: 'DSC03118' },
    { id: 2012, file: '103-DSC03103.jpg',  title: 'DSC03103' },
    { id: 2013, file: '104-DSC03093.jpg',  title: 'DSC03093' },
    { id: 2014, file: '105-DSC03070.jpg',  title: 'DSC03070' },
  ],
  'Portraits': [
    { id: 2015, file: '24-DSC02322.jpg',   title: 'DSC02322' },
    { id: 2016, file: '25-DSC02292.jpg',   title: 'DSC02292' },
    { id: 2017, file: '26-DSC02189.jpg',   title: 'DSC02189' },
    { id: 2018, file: '27-DSC02178.jpg',   title: 'DSC02178' },
    { id: 2019, file: '46-DSC08734.jpg',   title: 'DSC08734' },
    { id: 2020, file: '47-DSC08731.jpg',   title: 'DSC08731' },
    { id: 2021, file: '55-DSC08217.jpg',   title: 'DSC08217' },
    { id: 2022, file: '59-DSC07906.jpg',   title: 'DSC07906' },
    { id: 2023, file: '60-DSC07839.jpg',   title: 'DSC07839' },
    { id: 2024, file: '79-DSC05133.jpg',   title: 'DSC05133' },
    { id: 2025, file: '80-DSC05127.jpg',   title: 'DSC05127' },
    { id: 2026, file: '81-DSC05022.jpg',   title: 'DSC05022' },
    { id: 2027, file: '82-DSC05013.jpg',   title: 'DSC05013' },
    { id: 2028, file: '83-DSC05010.jpg',   title: 'DSC05010' },
    { id: 2029, file: '84-DSC05008.jpg',   title: 'DSC05008' },
    { id: 2030, file: '85-DSC05006.jpg',   title: 'DSC05006' },
    { id: 2031, file: '86-DSC04903.jpg',   title: 'DSC04903' },
    { id: 2032, file: '89-DSC04880.jpg',   title: 'DSC04880' },
    { id: 2033, file: '90-DSC04874.jpg',   title: 'DSC04874' },
    { id: 2034, file: '95-DSC04336.jpg',   title: 'DSC04336' },
    { id: 2035, file: '96-DSC04287.jpg',   title: 'DSC04287' },
    { id: 2036, file: '97-DSC04286.jpg',   title: 'DSC04286' },
    { id: 2037, file: '98-DSC03428.jpg',   title: 'DSC03428' },
    { id: 2038, file: '116-DSC08736.jpg',  title: 'DSC08736' },
    { id: 2039, file: '120-DSC07946.jpg',  title: 'DSC07946' },
    { id: 2040, file: '123-DSC07803.jpg',  title: 'DSC07803' },
  ],
  'Product Spotlight': [
    { id: 2041, file: '1-DSC03703.jpg',     title: 'DSC03703' },
    { id: 2042, file: '2-DSC03677.jpg',     title: 'DSC03677' },
    { id: 2043, file: '3-DSC03672.jpg',     title: 'DSC03672' },
    { id: 2044, file: '4-DSC03671.jpg',     title: 'DSC03671' },
    { id: 2045, file: '5-DSC03654.jpg',     title: 'DSC03654' },
    { id: 2046, file: '6-DSC03651.jpg',     title: 'DSC03651' },
    { id: 2047, file: '7-DSC03614.jpg',     title: 'DSC03614' },
    { id: 2048, file: '8-DSC03607.jpg',     title: 'DSC03607' },
    { id: 2049, file: '9-DSC03574.jpg',     title: 'DSC03574' },
    { id: 2050, file: '10-DSC03564.jpg',    title: 'DSC03564' },
    { id: 2051, file: '11-DSC03561.jpg',    title: 'DSC03561' },
    { id: 2052, file: '12-DSC03560.jpg',    title: 'DSC03560' },
    { id: 2053, file: '13-DSC03543.jpg',    title: 'DSC03543' },
    { id: 2054, file: '14-DSC03540.jpg',    title: 'DSC03540' },
    { id: 2055, file: '15-DSC03537.jpg',    title: 'DSC03537' },
    { id: 2056, file: '16-DSC03536.jpg',    title: 'DSC03536' },
    { id: 2057, file: '17-DSC03526.jpg',    title: 'DSC03526' },
    { id: 2058, file: '18-DSC03525.jpg',    title: 'DSC03525' },
    { id: 2059, file: '19-DSC03524.jpg',    title: 'DSC03524' },
    { id: 2060, file: '20-DSC03522.jpg',    title: 'DSC03522' },
    { id: 2061, file: '21-DSC03521.jpg',    title: 'DSC03521' },
    { id: 2062, file: '22-DSC03513.jpg',    title: 'DSC03513' },
    { id: 2063, file: '28-DSC01906.jpg',    title: 'DSC01906' },
    { id: 2064, file: '29-DSC01889.jpg',    title: 'DSC01889' },
    { id: 2065, file: '30-DSC01857.jpg',    title: 'DSC01857' },
    { id: 2066, file: '31-DSC01853.jpg',    title: 'DSC01853' },
    { id: 2067, file: '32-DSC01847.jpg',    title: 'DSC01847' },
    { id: 2068, file: '33-DSC01844.jpg',    title: 'DSC01844' },
    { id: 2069, file: '34-DSC01841.jpg',    title: 'DSC01841' },
    { id: 2070, file: '35-DSC01839.jpg',    title: 'DSC01839' },
    { id: 2071, file: '62-DSC06745.jpg',    title: 'DSC06745' },
    { id: 2072, file: '63-DSC06703.jpg',    title: 'DSC06703' },
    { id: 2073, file: '64-DSC06693.jpg',    title: 'DSC06693' },
    { id: 2074, file: '65-DSC06691.jpg',    title: 'DSC06691' },
    { id: 2075, file: '66-DSC06629.jpg',    title: 'DSC06629' },
    { id: 2076, file: '67-DSC06685.jpg',    title: 'DSC06685' },
    { id: 2077, file: '68-DSC06617.jpg',    title: 'DSC06617' },
    { id: 2078, file: '127-DSC03575.jpg',   title: 'DSC03575' },
    { id: 2079, file: '128-DSC03136.jpg',   title: 'DSC03136' },
    { id: 2080, file: '129-DSC03135.jpg',   title: 'DSC03135' },
    { id: 2081, file: '130-DSC03132.jpg',   title: 'DSC03132' },
    { id: 2082, file: '131-DSC03128.jpg',   title: 'DSC03128' },
    { id: 2083, file: '132-DSC03127.jpg',   title: 'DSC03127' },
    { id: 2084, file: '133-DSC03123.jpg',   title: 'DSC03123' },
    { id: 2085, file: '134-DSC03117.jpg',   title: 'DSC03117' },
    { id: 2086, file: '135-DSC03103_1.jpg', title: 'DSC03103' },
    { id: 2087, file: '136-DSC03009.jpg',   title: 'DSC03009' },
    { id: 2088, file: '137-DSC03007.jpg',   title: 'DSC03007' },
    { id: 2089, file: '138-DSC02999.jpg',   title: 'DSC02999' },
    { id: 2090, file: '139-DSC02983.jpg',   title: 'DSC02983' },
  ],
  'Wedding Stories': [
    { id: 2091, file: '36-DSC00725.jpg',   title: 'DSC00725' },
    { id: 2092, file: '37-DSC09763.jpg',   title: 'DSC09763' },
    { id: 2093, file: '38-DSC08949.jpg',   title: 'DSC08949' },
    { id: 2094, file: '39-DSC08947.jpg',   title: 'DSC08947' },
    { id: 2095, file: '40-DSC08908.jpg',   title: 'DSC08908' },
    { id: 2096, file: '41-DSC08902.jpg',   title: 'DSC08902' },
    { id: 2097, file: '42-DSC08883.jpg',   title: 'DSC08883' },
    { id: 2098, file: '43-DSC08882.jpg',   title: 'DSC08882' },
    { id: 2099, file: '44-DSC08753.jpg',   title: 'DSC08753' },
    { id: 2100, file: '45-DSC08748.jpg',   title: 'DSC08748' },
    { id: 2101, file: '48-DSC08725.jpg',   title: 'DSC08725' },
    { id: 2102, file: '49-DSC08650.jpg',   title: 'DSC08650' },
    { id: 2103, file: '50-DSC08636.jpg',   title: 'DSC08636' },
    { id: 2104, file: '51-DSC08614.jpg',   title: 'DSC08614' },
    { id: 2105, file: '52-DSC08562.jpg',   title: 'DSC08562' },
    { id: 2106, file: '53-DSC08307.jpg',   title: 'DSC08307' },
    { id: 2107, file: '54-DSC08256.jpg',   title: 'DSC08256' },
    { id: 2108, file: '56-DSC08179.jpg',   title: 'DSC08179' },
    { id: 2109, file: '57-DSC08051.jpg',   title: 'DSC08051' },
    { id: 2110, file: '58-DSC08027.jpg',   title: 'DSC08027' },
    { id: 2111, file: '61-DSC07668.jpg',   title: 'DSC07668' },
    { id: 2112, file: '69-DSC06225.jpg',   title: 'DSC06225' },
    { id: 2113, file: '70-DSC06084.jpg',   title: 'DSC06084' },
    { id: 2114, file: '71-DSC06059.jpg',   title: 'DSC06059' },
    { id: 2115, file: '72-DSC06048.jpg',   title: 'DSC06048' },
    { id: 2116, file: '73-DSC05980.jpg',   title: 'DSC05980' },
    { id: 2117, file: '74-DSC05974.jpg',   title: 'DSC05974' },
    { id: 2118, file: '75-DSC05723.jpg',   title: 'DSC05723' },
    { id: 2119, file: '76-DSC05712.jpg',   title: 'DSC05712' },
    { id: 2120, file: '77-DSC05290.jpg',   title: 'DSC05290' },
    { id: 2121, file: '78-DSC05284.jpg',   title: 'DSC05284' },
    { id: 2122, file: '106-DSC02447.jpg',  title: 'DSC02447' },
    { id: 2123, file: '107-DSC01213.jpg',  title: 'DSC01213' },
    { id: 2124, file: '108-DSC01066.jpg',  title: 'DSC01066' },
    { id: 2125, file: '109-DSC00943.jpg',  title: 'DSC00943' },
    { id: 2126, file: '110-DSC09564.jpg',  title: 'DSC09564' },
    { id: 2127, file: '111-DSC09438.jpg',  title: 'DSC09438' },
    { id: 2128, file: '112-DSC09376.jpg',  title: 'DSC09376' },
    { id: 2129, file: '113-DSC09185.jpg',  title: 'DSC09185' },
    { id: 2130, file: '114-DSC09184.jpg',  title: 'DSC09184' },
    { id: 2131, file: '115-DSC09108.jpg',  title: 'DSC09108' },
    { id: 2132, file: '117-DSC08590.jpg',  title: 'DSC08590' },
    { id: 2133, file: '118-DSC08418.jpg',  title: 'DSC08418' },
    { id: 2134, file: '119-DSC08361.jpg',  title: 'DSC08361' },
    { id: 2135, file: '121-DSC07888.jpg',  title: 'DSC07888' },
    { id: 2136, file: '122-DSC07809.jpg',  title: 'DSC07809' },
    { id: 2137, file: '124-DSC07788.jpg',  title: 'DSC07788' },
    { id: 2138, file: '125-DSC06030.jpg',  title: 'DSC06030' },
    { id: 2139, file: '126-DSC05893.jpg',  title: 'DSC05893' },
  ],
}

const categoryPhotos: Record<string, { id: number; src: string; full: string; title: string; category: string }[]> =
  Object.fromEntries(
    Object.entries(categoryFiles).map(([cat, files]) => [
      cat,
      files.map(f => ({
        id: f.id,
        src: catThumb(cat, f.file),
        full: catFull(cat, f.file),
        title: f.title,
        category: cat,
      })),
    ])
  )

const categories = [
  { name: 'Live Events',       count: 14, src: catThumb('Live Events', '100-DSC03323.jpg')       },
  { name: 'Portraits',         count: 26, src: catThumb('Portraits', '116-DSC08736.jpg')          },
  { name: 'Product Spotlight', count: 50, src: catThumb('Product Spotlight', '10-DSC03564.jpg')  },
  { name: 'Wedding Stories',   count: 49, src: catThumb('Wedding Stories', '106-DSC02447.jpg')   },
]


const navLinks = [
  { label: 'Gallery',    href: '#gallery'    },
  { label: 'Categories', href: '#categories' },
  { label: 'About',      href: '#about'      },
  { label: 'Contact',    href: '#contact'    },
]

type Photo = typeof photos[0] & { full?: string }
type CursorType = 'default' | 'hover' | 'view'


function PhotoCard({
  photo, outerClass, delay = 0, titleLarge = false, onOpen, setCursor, photoIdx = 0, paused = false,
}: {
  photo: Photo
  outerClass: string
  delay?: number
  titleLarge?: boolean
  onOpen: () => void
  setCursor: (t: CursorType) => void
  photoIdx?: number
  paused?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tiltRef      = useRef<HTMLDivElement>(null)
  const spotRef      = useRef<HTMLDivElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLSpanElement>(null)
  const inViewRaw    = useInView(containerRef, { once: true, amount: 0.1 })
  const [forceShow, setForceShow] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [revealed, setRevealed]   = useState(false)
  // Safety net: on some mobile browsers the IntersectionObserver behind `useInView`
  // can fail to fire, which would leave the image stuck at opacity 0 (invisible).
  // Force the reveal after a short delay so a photo is NEVER permanently hidden.
  const isInView = inViewRaw || forceShow
  useEffect(() => {
    const t = setTimeout(() => setForceShow(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const zoomIn = photoIdx % 2 === 0

  function onMove(e: React.MouseEvent) {
    const el = tiltRef.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    const tx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -6
    const ty = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  6
    const sx = ((e.clientX - r.left) / r.width)  * 100
    const sy = ((e.clientY - r.top)  / r.height) * 100
    el.style.transform  = `perspective(900px) rotateX(${tx}deg) rotateY(${ty}deg) scale(1.02)`
    el.style.transition = 'transform 0.1s linear'
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(circle 240px at ${sx}% ${sy}%, rgba(255,255,255,0.18) 0%, transparent 70%)`
      spotRef.current.style.opacity    = '1'
    }
  }

  function onEnter() {
    if (overlayRef.current) overlayRef.current.style.opacity = '1'
    if (titleRef.current)   titleRef.current.style.transform = 'translateY(0)'
    setIsHovered(true)
    setCursor('view')
  }

  function onLeave() {
    const el = tiltRef.current
    if (el) {
      el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
      el.style.transition = 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)'
    }
    if (spotRef.current)    spotRef.current.style.opacity    = '0'
    if (overlayRef.current) overlayRef.current.style.opacity = '0'
    if (titleRef.current)   titleRef.current.style.transform = 'translateY(6px)'
    setIsHovered(false)
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
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onClick={onOpen}
        >
          <div className="g-inner">
            <motion.img
              src={photo.src}
              srcSet={`${photo.src.replace('/categories-full/', '/categories-thumb/')} 900w, ${photo.src} 2000w`}
              sizes="(max-width: 900px) 92vw, 50vw"
              alt={photo.title}
              loading="lazy"
              decoding="async"
              animate={
                isHovered            ? { scale: 1.09 } :
                revealed && !paused  ? { scale: [1.0, 1.08, 1.0] } :
                                        { scale: 1.0 }
              }
              transition={
                isHovered            ? { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } :
                revealed && !paused  ? { duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } :
                                        { duration: 0 }
              }
            />
            <div
              ref={spotRef}
              className="g-spotlight"
              style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
            />
            <div
              ref={overlayRef}
              className="g-overlay"
              style={{ opacity: 0 }}
            >
              <span className="g-cat">{photo.category}</span>
              <span
                ref={titleRef}
                className={`g-title${titleLarge ? ' g-title-lg' : ''}`}
                style={{ transform: 'translateY(6px)', transition: 'transform 0.4s ease' }}
              >{photo.title}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function LazyImage({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} loading="lazy" decoding="async" />
}

function CategoryOverlay({
  name, photos, lightboxOpen, onClose, onPhotoClick, setCursor,
}: {
  name: string
  photos: { id: number; src: string; full?: string; title: string; category: string }[]
  lightboxOpen: boolean
  onClose: () => void
  onPhotoClick: (p: Photo) => void
  setCursor: (t: CursorType) => void
}) {
  const [visibleCount, setVisibleCount] = useState(16)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lightboxOpen) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose, lightboxOpen])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(c => Math.min(c + 16, photos.length)) },
      { rootMargin: '400px' }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [photos.length, visibleCount])

  return (
    <motion.div
      className="catov"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className="catov-header">
        <button className="catov-back" onClick={onClose}
          onMouseEnter={() => setCursor('hover')} onMouseLeave={() => setCursor('default')}
        >
          <span className="catov-back-arrow">←</span>
          <span>Back</span>
        </button>
        <div className="catov-title-wrap">
          <h2 className="catov-title">{name}</h2>
          <span className="catov-count">{photos.length} photos</span>
        </div>
        <button className="catov-close" onClick={onClose}
          onMouseEnter={() => setCursor('hover')} onMouseLeave={() => setCursor('default')}
        >
          <span /><span />
        </button>
      </div>

      <div className="catov-grid">
        {photos.slice(0, visibleCount).map((photo, i) => (
          <div
            key={photo.id}
            className="catov-item"
            onClick={() => onPhotoClick(photo as Photo)}
            onMouseEnter={() => setCursor('view')}
            onMouseLeave={() => setCursor('default')}
          >
            <LazyImage src={photo.src} alt={photo.title} />
            <div className="catov-item-overlay">
              <span className="catov-item-num">{String(i + 1).padStart(2, '0')}</span>
            </div>
          </div>
        ))}
        {visibleCount < photos.length && <div ref={sentinelRef} style={{ height: 1 }} />}
      </div>
    </motion.div>
  )
}

export default function App() {
  const [loading, setLoading]         = useState(true)
  const [loaderPhase, setLoaderPhase] = useState(0)
  const [slideIndex, setSlideIndex]   = useState(0)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [lightbox, setLightbox]       = useState<Photo | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  // How far the loader's PARTH/SHOOTS words slide apart to reveal the photo frame.
  // The frame is absolutely positioned at the midpoint of the (tiny, text-only) flex
  // container, so this distance has to clear half the frame's size on whichever axis
  // is currently splitting, or the frame pops in on top of the still-nearby word.
  const [wordShift, setWordShift] = useState(170)
  // Below 600px `.loader-inner` switches to a vertical stack (see index.css) — PARTH
  // above SHOOTS instead of side by side — so the split has to happen on the y-axis
  // instead of x, clearing the frame's *height* (280/240px) rather than its width.
  const [loaderStacked, setLoaderStacked] = useState(false)

  const cursorRef   = useRef<HTMLDivElement>(null)
  const dotRef      = useRef<HTMLDivElement>(null)
  const mousePos    = useRef({ x: 0, y: 0 })
  const cursorPos   = useRef({ x: 0, y: 0 })
  const cursorAngle = useRef(45)
  const cursorLabelRef = useRef<HTMLSpanElement>(null)
  const cursorTypeRef = useRef<CursorType>('default')

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
    if (dotRef.current) {
      dotRef.current.style.setProperty('translate', `${e.clientX}px ${e.clientY}px`)
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      const dx = mousePos.current.x - cursorPos.current.x
      const dy = mousePos.current.y - cursorPos.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)

      cursorPos.current.x += dx * 0.22
      cursorPos.current.y += dy * 0.22

      // Rotate the diamond toward the direction of travel; spring back to 45° at rest.
      // The "view" cursor is a rectangle with a readable label, so keep it level (0°).
      const targetAngle = cursorTypeRef.current === 'view'
        ? 0
        : speed > 2 ? Math.atan2(dy, dx) * (180 / Math.PI) + 45 : 45
      let diff = targetAngle - cursorAngle.current
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      cursorAngle.current += diff * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.setProperty('translate', `${cursorPos.current.x}px ${cursorPos.current.y}px`)
        cursorRef.current.style.setProperty('rotate', `${cursorAngle.current}deg`)
      }
      requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', handleMouseMove)
    const frame = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(frame) }
  }, [handleMouseMove])

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const stacked = w <= 600
      setLoaderStacked(stacked)
      // Stacked frame is 240px tall at ≤430px, 280px at 431–600px (see index.css) —
      // clear half that plus the word's own height and a small buffer. Desktop/tablet
      // frame is 280px wide, and 170 already clears it comfortably.
      setWordShift(stacked ? (w <= 430 ? 165 : 185) : 170)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Loader phases
  useEffect(() => {
    const t1 = setTimeout(() => setLoaderPhase(1), 1500)
    const t2 = setTimeout(() => setLoaderPhase(2), 3000)
    const t3 = setTimeout(() => setLoaderPhase(3), 3800)
    // Gives the (now slower) slide carousel enough room to complete one full cycle
    // through all `loaderSlides` before the loader dismisses — see the interval below.
    const t4 = setTimeout(() => setLoading(false), 8600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  useEffect(() => {
    if (loaderPhase < 3) return
    const iv = setInterval(() => setSlideIndex(p => (p + 1) % loaderSlides.length), 800)
    return () => clearInterval(iv)
  }, [loaderPhase])

  // Escape to close lightbox
  useEffect(() => {
    if (!lightbox) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [lightbox])

  const setCursorType = useCallback((t: CursorType) => {
    cursorTypeRef.current = t
    const el = cursorRef.current
    if (!el) return
    el.className = `cursor cursor-${t}`
  }, [])

  // Group photos: every 3 → [left, right, center-large]
  const groups: Photo[][] = []
  for (let i = 0; i < photos.length; i += 3) groups.push(photos.slice(i, i + 3))

  const cv = (t: CursorType) => () => setCursorType(t)

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setContactStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New shoot inquiry — ${contactForm.subject || 'General'}`,
          from_name: contactForm.name,
          name: contactForm.name,
          email: contactForm.email,
          shoot_type: contactForm.subject,
          message: contactForm.message,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Submission failed')
      setContactStatus('sent')
      setContactForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setContactStatus('error')
    }
  }

  return (
    <>
      {/* ── CURSOR ── */}
      <div ref={cursorRef} className="cursor cursor-default">
        <span ref={cursorLabelRef} className="cursor-label" aria-hidden="true">VIEW</span>
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
                animate={loaderStacked
                  ? { opacity: 1, y: loaderPhase >= 1 ? -wordShift : 0 }
                  : { opacity: 1, x: loaderPhase >= 1 ? -wordShift : 0 }
                }
                transition={{ opacity: { duration: 0.5 }, x: spring, y: spring }}
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
                animate={loaderStacked
                  ? { opacity: 1, y: loaderPhase >= 1 ? wordShift : 0 }
                  : { opacity: 1, x: loaderPhase >= 1 ? wordShift : 0 }
                }
                transition={{ opacity: { duration: 0.5, delay: 0.1 }, x: spring, y: spring }}
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
            <span className="hero-meta">UK · 2023</span>
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
              ['Live Events', 'Portraits', 'Product Spotlight', 'Wedding Stories', 'Live Events', 'Portraits', 'Product Spotlight'].map((item, i) => (
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
                      paused={!!selectedCategory}
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
                      paused={!!selectedCategory}
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
                    paused={!!selectedCategory}
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
              <img
                src={lightbox.full ?? lightbox.src.replace('w=900', 'w=1600').replace('w=1400', 'w=1800')}
                alt={lightbox.title}
              />
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

      {/* ── CATEGORY OVERLAY ── */}
      <AnimatePresence>
        {selectedCategory && (
          <CategoryOverlay
            name={selectedCategory}
            photos={categoryPhotos[selectedCategory] ?? []}
            lightboxOpen={!!lightbox}
            onClose={() => setSelectedCategory(null)}
            onPhotoClick={p => setLightbox(p)}
            setCursor={setCursorType}
          />
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
                onMouseEnter={cv('default')}
                onMouseLeave={cv('default')}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className="cat-img">
                  <img src={cat.src} alt={cat.name} loading="lazy" decoding="async" />
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
              <img src={catFull('Portraits', '95-DSC04336.jpg')} alt="Parth" />
              <div className="about-img-tag">
                <span>Parth Chauhan</span>
                <span>Photographer</span>
              </div>
            </motion.div>

            <div className="about-text">
              {[
                "Welcome to Parth Shoots. I am Parth Chauhan — part photographer, part food critic, part wedding crasher (invited, I promise), part crowd-watcher, and full-time chaser of good light.",
                "Three years, two countries (India and the UK), and one very full memory card later, I've made a habit out of pointing a camera at things that matter: your restaurant's best dish, your wedding's messiest, happiest moments, the electric chaos of a live event, and the one portrait that actually looks like you on a good day.",
                "Started as a passion. Still is. Let's make something worth looking at twice.",
              ].map((para, i) => (
                <motion.p key={i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.14, ease }}
                >{para}</motion.p>
              ))}

              <div className="about-stats">
                {[{ n: '3+', l: 'Years' }, { n: '10+', l: 'Projects' }, { n: '2+', l: 'Countries' }].map((s, i) => (
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

      {/* ── CONTACT ── */}
      {!loading && (
        <section className="contact-section" id="contact">
          <div className="sec-head sec-head-dark">
            <motion.div className="sec-label sec-label-dark"
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            >
              <span className="sec-num sec-num-dark">04</span><span>Get In Touch</span>
            </motion.div>
            <div className="sec-title-wrap">
              <motion.h2 className="sec-title sec-title-dark"
                initial={{ y: 110 }} whileInView={{ y: 0 }}
                viewport={{ once: true }} transition={{ ...spring, delay: 0.1 }}
              >Let's Talk</motion.h2>
            </div>
          </div>

          <div className="contact-body">
            <motion.div className="contact-info"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <div className="contact-lede">
                <p>Have a wedding to cover, a menu to shoot, or a moment you don't want to lose? Tell me about it — I usually reply within a day.</p>
              </div>

              <div className="contact-details">
                <div className="c-detail">
                  <span className="c-detail-l">Email</span>
                  <a className="c-detail-v" href="mailto:parthchauhan33337@gmail.com"
                    onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                  >parthchauhan33337@gmail.com</a>
                </div>
                <div className="c-detail">
                  <span className="c-detail-l">Phone</span>
                  <a className="c-detail-v" href="tel:+917774597725"
                    onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                  >07774597725</a>
                </div>
                <div className="c-detail">
                  <span className="c-detail-l">Based In</span>
                  <span className="c-detail-v c-detail-static"> The UK</span>
                </div>
              </div>

              <div className="contact-social">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                >Instagram</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                >X (Twitter)</a>
              </div>
            </motion.div>

            <motion.form className="contact-form" onSubmit={handleContactSubmit}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <div className="cf-row">
                <div className="cf-field">
                  <label htmlFor="cf-name">Name</label>
                  <input id="cf-name" type="text" placeholder="Your name" required
                    value={contactForm.name}
                    onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                    onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                  />
                </div>
                <div className="cf-field">
                  <label htmlFor="cf-email">Email</label>
                  <input id="cf-email" type="email" placeholder="you@email.com" required
                    value={contactForm.email}
                    onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                    onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                  />
                </div>
              </div>

              <div className="cf-field">
                <label htmlFor="cf-subject">What kind of shoot?</label>
                <input id="cf-subject" type="text" placeholder="Wedding, portrait, event, product..."
                  value={contactForm.subject}
                  onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))}
                  onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                />
              </div>

              <div className="cf-field">
                <label htmlFor="cf-message">Message</label>
                <textarea id="cf-message" rows={4} placeholder="Tell me about the date, place, and vibe you're going for." required
                  value={contactForm.message}
                  onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                  onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
                />
              </div>

              <button type="submit" className="cf-submit" disabled={contactStatus === 'sending'}
                onMouseEnter={cv('hover')} onMouseLeave={cv('default')}
              >
                <span>{contactStatus === 'sending' ? 'Sending…' : 'Send Message'}</span><span>→</span>
              </button>
              {contactStatus === 'sent' && (
                <p className="cf-note cf-note-ok">Message sent — I'll get back to you within a day.</p>
              )}
              {contactStatus === 'error' && (
                <p className="cf-note cf-note-err">Something went wrong. Please email me directly instead.</p>
              )}
              {contactStatus === 'idle' && (
                <p className="cf-note">Sends straight to my inbox.</p>
              )}
            </motion.form>
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
