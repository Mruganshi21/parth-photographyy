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

const categoryPhotos: Record<string, { id: number; src: string; title: string; category: string }[]> = {
  'Live Events': [
    { id: 2001, src: '/categories/Live Events/23-DSC02359.jpg',   title: 'DSC02359', category: 'Live Events' },
    { id: 2002, src: '/categories/Live Events/87-DSC04896.jpg',   title: 'DSC04896', category: 'Live Events' },
    { id: 2003, src: '/categories/Live Events/88-DSC04884.jpg',   title: 'DSC04884', category: 'Live Events' },
    { id: 2004, src: '/categories/Live Events/91-DSC04746.jpg',   title: 'DSC04746', category: 'Live Events' },
    { id: 2005, src: '/categories/Live Events/92-DSC04598.jpg',   title: 'DSC04598', category: 'Live Events' },
    { id: 2006, src: '/categories/Live Events/93-DSC04592.jpg',   title: 'DSC04592', category: 'Live Events' },
    { id: 2007, src: '/categories/Live Events/94-DSC04579.jpg',   title: 'DSC04579', category: 'Live Events' },
    { id: 2008, src: '/categories/Live Events/99-DSC03329.jpg',   title: 'DSC03329', category: 'Live Events' },
    { id: 2009, src: '/categories/Live Events/100-DSC03323.jpg',  title: 'DSC03323', category: 'Live Events' },
    { id: 2010, src: '/categories/Live Events/101-DSC03299.jpg',  title: 'DSC03299', category: 'Live Events' },
    { id: 2011, src: '/categories/Live Events/102-DSC03118.jpg',  title: 'DSC03118', category: 'Live Events' },
    { id: 2012, src: '/categories/Live Events/103-DSC03103.jpg',  title: 'DSC03103', category: 'Live Events' },
    { id: 2013, src: '/categories/Live Events/104-DSC03093.jpg',  title: 'DSC03093', category: 'Live Events' },
    { id: 2014, src: '/categories/Live Events/105-DSC03070.jpg',  title: 'DSC03070', category: 'Live Events' },
  ],
  'Portraits': [
    { id: 2015, src: '/categories/Portraits/24-DSC02322.jpg',   title: 'DSC02322', category: 'Portraits' },
    { id: 2016, src: '/categories/Portraits/25-DSC02292.jpg',   title: 'DSC02292', category: 'Portraits' },
    { id: 2017, src: '/categories/Portraits/26-DSC02189.jpg',   title: 'DSC02189', category: 'Portraits' },
    { id: 2018, src: '/categories/Portraits/27-DSC02178.jpg',   title: 'DSC02178', category: 'Portraits' },
    { id: 2019, src: '/categories/Portraits/46-DSC08734.jpg',   title: 'DSC08734', category: 'Portraits' },
    { id: 2020, src: '/categories/Portraits/47-DSC08731.jpg',   title: 'DSC08731', category: 'Portraits' },
    { id: 2021, src: '/categories/Portraits/55-DSC08217.jpg',   title: 'DSC08217', category: 'Portraits' },
    { id: 2022, src: '/categories/Portraits/59-DSC07906.jpg',   title: 'DSC07906', category: 'Portraits' },
    { id: 2023, src: '/categories/Portraits/60-DSC07839.jpg',   title: 'DSC07839', category: 'Portraits' },
    { id: 2024, src: '/categories/Portraits/79-DSC05133.jpg',   title: 'DSC05133', category: 'Portraits' },
    { id: 2025, src: '/categories/Portraits/80-DSC05127.jpg',   title: 'DSC05127', category: 'Portraits' },
    { id: 2026, src: '/categories/Portraits/81-DSC05022.jpg',   title: 'DSC05022', category: 'Portraits' },
    { id: 2027, src: '/categories/Portraits/82-DSC05013.jpg',   title: 'DSC05013', category: 'Portraits' },
    { id: 2028, src: '/categories/Portraits/83-DSC05010.jpg',   title: 'DSC05010', category: 'Portraits' },
    { id: 2029, src: '/categories/Portraits/84-DSC05008.jpg',   title: 'DSC05008', category: 'Portraits' },
    { id: 2030, src: '/categories/Portraits/85-DSC05006.jpg',   title: 'DSC05006', category: 'Portraits' },
    { id: 2031, src: '/categories/Portraits/86-DSC04903.jpg',   title: 'DSC04903', category: 'Portraits' },
    { id: 2032, src: '/categories/Portraits/89-DSC04880.jpg',   title: 'DSC04880', category: 'Portraits' },
    { id: 2033, src: '/categories/Portraits/90-DSC04874.jpg',   title: 'DSC04874', category: 'Portraits' },
    { id: 2034, src: '/categories/Portraits/95-DSC04336.jpg',   title: 'DSC04336', category: 'Portraits' },
    { id: 2035, src: '/categories/Portraits/96-DSC04287.jpg',   title: 'DSC04287', category: 'Portraits' },
    { id: 2036, src: '/categories/Portraits/97-DSC04286.jpg',   title: 'DSC04286', category: 'Portraits' },
    { id: 2037, src: '/categories/Portraits/98-DSC03428.jpg',   title: 'DSC03428', category: 'Portraits' },
    { id: 2038, src: '/categories/Portraits/116-DSC08736.jpg',  title: 'DSC08736', category: 'Portraits' },
    { id: 2039, src: '/categories/Portraits/120-DSC07946.jpg',  title: 'DSC07946', category: 'Portraits' },
    { id: 2040, src: '/categories/Portraits/123-DSC07803.jpg',  title: 'DSC07803', category: 'Portraits' },
  ],
  'Product Spotlight': [
    { id: 2041, src: '/categories/Product Spotlight/1-DSC03703.jpg',     title: 'DSC03703',   category: 'Product Spotlight' },
    { id: 2042, src: '/categories/Product Spotlight/2-DSC03677.jpg',     title: 'DSC03677',   category: 'Product Spotlight' },
    { id: 2043, src: '/categories/Product Spotlight/3-DSC03672.jpg',     title: 'DSC03672',   category: 'Product Spotlight' },
    { id: 2044, src: '/categories/Product Spotlight/4-DSC03671.jpg',     title: 'DSC03671',   category: 'Product Spotlight' },
    { id: 2045, src: '/categories/Product Spotlight/5-DSC03654.jpg',     title: 'DSC03654',   category: 'Product Spotlight' },
    { id: 2046, src: '/categories/Product Spotlight/6-DSC03651.jpg',     title: 'DSC03651',   category: 'Product Spotlight' },
    { id: 2047, src: '/categories/Product Spotlight/7-DSC03614.jpg',     title: 'DSC03614',   category: 'Product Spotlight' },
    { id: 2048, src: '/categories/Product Spotlight/8-DSC03607.jpg',     title: 'DSC03607',   category: 'Product Spotlight' },
    { id: 2049, src: '/categories/Product Spotlight/9-DSC03574.jpg',     title: 'DSC03574',   category: 'Product Spotlight' },
    { id: 2050, src: '/categories/Product Spotlight/10-DSC03564.jpg',    title: 'DSC03564',   category: 'Product Spotlight' },
    { id: 2051, src: '/categories/Product Spotlight/11-DSC03561.jpg',    title: 'DSC03561',   category: 'Product Spotlight' },
    { id: 2052, src: '/categories/Product Spotlight/12-DSC03560.jpg',    title: 'DSC03560',   category: 'Product Spotlight' },
    { id: 2053, src: '/categories/Product Spotlight/13-DSC03543.jpg',    title: 'DSC03543',   category: 'Product Spotlight' },
    { id: 2054, src: '/categories/Product Spotlight/14-DSC03540.jpg',    title: 'DSC03540',   category: 'Product Spotlight' },
    { id: 2055, src: '/categories/Product Spotlight/15-DSC03537.jpg',    title: 'DSC03537',   category: 'Product Spotlight' },
    { id: 2056, src: '/categories/Product Spotlight/16-DSC03536.jpg',    title: 'DSC03536',   category: 'Product Spotlight' },
    { id: 2057, src: '/categories/Product Spotlight/17-DSC03526.jpg',    title: 'DSC03526',   category: 'Product Spotlight' },
    { id: 2058, src: '/categories/Product Spotlight/18-DSC03525.jpg',    title: 'DSC03525',   category: 'Product Spotlight' },
    { id: 2059, src: '/categories/Product Spotlight/19-DSC03524.jpg',    title: 'DSC03524',   category: 'Product Spotlight' },
    { id: 2060, src: '/categories/Product Spotlight/20-DSC03522.jpg',    title: 'DSC03522',   category: 'Product Spotlight' },
    { id: 2061, src: '/categories/Product Spotlight/21-DSC03521.jpg',    title: 'DSC03521',   category: 'Product Spotlight' },
    { id: 2062, src: '/categories/Product Spotlight/22-DSC03513.jpg',    title: 'DSC03513',   category: 'Product Spotlight' },
    { id: 2063, src: '/categories/Product Spotlight/28-DSC01906.jpg',    title: 'DSC01906',   category: 'Product Spotlight' },
    { id: 2064, src: '/categories/Product Spotlight/29-DSC01889.jpg',    title: 'DSC01889',   category: 'Product Spotlight' },
    { id: 2065, src: '/categories/Product Spotlight/30-DSC01857.jpg',    title: 'DSC01857',   category: 'Product Spotlight' },
    { id: 2066, src: '/categories/Product Spotlight/31-DSC01853.jpg',    title: 'DSC01853',   category: 'Product Spotlight' },
    { id: 2067, src: '/categories/Product Spotlight/32-DSC01847.jpg',    title: 'DSC01847',   category: 'Product Spotlight' },
    { id: 2068, src: '/categories/Product Spotlight/33-DSC01844.jpg',    title: 'DSC01844',   category: 'Product Spotlight' },
    { id: 2069, src: '/categories/Product Spotlight/34-DSC01841.jpg',    title: 'DSC01841',   category: 'Product Spotlight' },
    { id: 2070, src: '/categories/Product Spotlight/35-DSC01839.jpg',    title: 'DSC01839',   category: 'Product Spotlight' },
    { id: 2071, src: '/categories/Product Spotlight/62-DSC06745.jpg',    title: 'DSC06745',   category: 'Product Spotlight' },
    { id: 2072, src: '/categories/Product Spotlight/63-DSC06703.jpg',    title: 'DSC06703',   category: 'Product Spotlight' },
    { id: 2073, src: '/categories/Product Spotlight/64-DSC06693.jpg',    title: 'DSC06693',   category: 'Product Spotlight' },
    { id: 2074, src: '/categories/Product Spotlight/65-DSC06691.jpg',    title: 'DSC06691',   category: 'Product Spotlight' },
    { id: 2075, src: '/categories/Product Spotlight/66-DSC06629.jpg',    title: 'DSC06629',   category: 'Product Spotlight' },
    { id: 2076, src: '/categories/Product Spotlight/67-DSC06685.jpg',    title: 'DSC06685',   category: 'Product Spotlight' },
    { id: 2077, src: '/categories/Product Spotlight/68-DSC06617.jpg',    title: 'DSC06617',   category: 'Product Spotlight' },
    { id: 2078, src: '/categories/Product Spotlight/127-DSC03575.jpg',   title: 'DSC03575',   category: 'Product Spotlight' },
    { id: 2079, src: '/categories/Product Spotlight/128-DSC03136.jpg',   title: 'DSC03136',   category: 'Product Spotlight' },
    { id: 2080, src: '/categories/Product Spotlight/129-DSC03135.jpg',   title: 'DSC03135',   category: 'Product Spotlight' },
    { id: 2081, src: '/categories/Product Spotlight/130-DSC03132.jpg',   title: 'DSC03132',   category: 'Product Spotlight' },
    { id: 2082, src: '/categories/Product Spotlight/131-DSC03128.jpg',   title: 'DSC03128',   category: 'Product Spotlight' },
    { id: 2083, src: '/categories/Product Spotlight/132-DSC03127.jpg',   title: 'DSC03127',   category: 'Product Spotlight' },
    { id: 2084, src: '/categories/Product Spotlight/133-DSC03123.jpg',   title: 'DSC03123',   category: 'Product Spotlight' },
    { id: 2085, src: '/categories/Product Spotlight/134-DSC03117.jpg',   title: 'DSC03117',   category: 'Product Spotlight' },
    { id: 2086, src: '/categories/Product Spotlight/135-DSC03103_1.jpg', title: 'DSC03103',   category: 'Product Spotlight' },
    { id: 2087, src: '/categories/Product Spotlight/136-DSC03009.jpg',   title: 'DSC03009',   category: 'Product Spotlight' },
    { id: 2088, src: '/categories/Product Spotlight/137-DSC03007.jpg',   title: 'DSC03007',   category: 'Product Spotlight' },
    { id: 2089, src: '/categories/Product Spotlight/138-DSC02999.jpg',   title: 'DSC02999',   category: 'Product Spotlight' },
    { id: 2090, src: '/categories/Product Spotlight/139-DSC02983.jpg',   title: 'DSC02983',   category: 'Product Spotlight' },
  ],
  'Wedding Stories': [
    { id: 2091, src: '/categories/Wedding Stories/36-DSC00725.jpg',   title: 'DSC00725', category: 'Wedding Stories' },
    { id: 2092, src: '/categories/Wedding Stories/37-DSC09763.jpg',   title: 'DSC09763', category: 'Wedding Stories' },
    { id: 2093, src: '/categories/Wedding Stories/38-DSC08949.jpg',   title: 'DSC08949', category: 'Wedding Stories' },
    { id: 2094, src: '/categories/Wedding Stories/39-DSC08947.jpg',   title: 'DSC08947', category: 'Wedding Stories' },
    { id: 2095, src: '/categories/Wedding Stories/40-DSC08908.jpg',   title: 'DSC08908', category: 'Wedding Stories' },
    { id: 2096, src: '/categories/Wedding Stories/41-DSC08902.jpg',   title: 'DSC08902', category: 'Wedding Stories' },
    { id: 2097, src: '/categories/Wedding Stories/42-DSC08883.jpg',   title: 'DSC08883', category: 'Wedding Stories' },
    { id: 2098, src: '/categories/Wedding Stories/43-DSC08882.jpg',   title: 'DSC08882', category: 'Wedding Stories' },
    { id: 2099, src: '/categories/Wedding Stories/44-DSC08753.jpg',   title: 'DSC08753', category: 'Wedding Stories' },
    { id: 2100, src: '/categories/Wedding Stories/45-DSC08748.jpg',   title: 'DSC08748', category: 'Wedding Stories' },
    { id: 2101, src: '/categories/Wedding Stories/48-DSC08725.jpg',   title: 'DSC08725', category: 'Wedding Stories' },
    { id: 2102, src: '/categories/Wedding Stories/49-DSC08650.jpg',   title: 'DSC08650', category: 'Wedding Stories' },
    { id: 2103, src: '/categories/Wedding Stories/50-DSC08636.jpg',   title: 'DSC08636', category: 'Wedding Stories' },
    { id: 2104, src: '/categories/Wedding Stories/51-DSC08614.jpg',   title: 'DSC08614', category: 'Wedding Stories' },
    { id: 2105, src: '/categories/Wedding Stories/52-DSC08562.jpg',   title: 'DSC08562', category: 'Wedding Stories' },
    { id: 2106, src: '/categories/Wedding Stories/53-DSC08307.jpg',   title: 'DSC08307', category: 'Wedding Stories' },
    { id: 2107, src: '/categories/Wedding Stories/54-DSC08256.jpg',   title: 'DSC08256', category: 'Wedding Stories' },
    { id: 2108, src: '/categories/Wedding Stories/56-DSC08179.jpg',   title: 'DSC08179', category: 'Wedding Stories' },
    { id: 2109, src: '/categories/Wedding Stories/57-DSC08051.jpg',   title: 'DSC08051', category: 'Wedding Stories' },
    { id: 2110, src: '/categories/Wedding Stories/58-DSC08027.jpg',   title: 'DSC08027', category: 'Wedding Stories' },
    { id: 2111, src: '/categories/Wedding Stories/61-DSC07668.jpg',   title: 'DSC07668', category: 'Wedding Stories' },
    { id: 2112, src: '/categories/Wedding Stories/69-DSC06225.jpg',   title: 'DSC06225', category: 'Wedding Stories' },
    { id: 2113, src: '/categories/Wedding Stories/70-DSC06084.jpg',   title: 'DSC06084', category: 'Wedding Stories' },
    { id: 2114, src: '/categories/Wedding Stories/71-DSC06059.jpg',   title: 'DSC06059', category: 'Wedding Stories' },
    { id: 2115, src: '/categories/Wedding Stories/72-DSC06048.jpg',   title: 'DSC06048', category: 'Wedding Stories' },
    { id: 2116, src: '/categories/Wedding Stories/73-DSC05980.jpg',   title: 'DSC05980', category: 'Wedding Stories' },
    { id: 2117, src: '/categories/Wedding Stories/74-DSC05974.jpg',   title: 'DSC05974', category: 'Wedding Stories' },
    { id: 2118, src: '/categories/Wedding Stories/75-DSC05723.jpg',   title: 'DSC05723', category: 'Wedding Stories' },
    { id: 2119, src: '/categories/Wedding Stories/76-DSC05712.jpg',   title: 'DSC05712', category: 'Wedding Stories' },
    { id: 2120, src: '/categories/Wedding Stories/77-DSC05290.jpg',   title: 'DSC05290', category: 'Wedding Stories' },
    { id: 2121, src: '/categories/Wedding Stories/78-DSC05284.jpg',   title: 'DSC05284', category: 'Wedding Stories' },
    { id: 2122, src: '/categories/Wedding Stories/106-DSC02447.jpg',  title: 'DSC02447', category: 'Wedding Stories' },
    { id: 2123, src: '/categories/Wedding Stories/107-DSC01213.jpg',  title: 'DSC01213', category: 'Wedding Stories' },
    { id: 2124, src: '/categories/Wedding Stories/108-DSC01066.jpg',  title: 'DSC01066', category: 'Wedding Stories' },
    { id: 2125, src: '/categories/Wedding Stories/109-DSC00943.jpg',  title: 'DSC00943', category: 'Wedding Stories' },
    { id: 2126, src: '/categories/Wedding Stories/110-DSC09564.jpg',  title: 'DSC09564', category: 'Wedding Stories' },
    { id: 2127, src: '/categories/Wedding Stories/111-DSC09438.jpg',  title: 'DSC09438', category: 'Wedding Stories' },
    { id: 2128, src: '/categories/Wedding Stories/112-DSC09376.jpg',  title: 'DSC09376', category: 'Wedding Stories' },
    { id: 2129, src: '/categories/Wedding Stories/113-DSC09185.jpg',  title: 'DSC09185', category: 'Wedding Stories' },
    { id: 2130, src: '/categories/Wedding Stories/114-DSC09184.jpg',  title: 'DSC09184', category: 'Wedding Stories' },
    { id: 2131, src: '/categories/Wedding Stories/115-DSC09108.jpg',  title: 'DSC09108', category: 'Wedding Stories' },
    { id: 2132, src: '/categories/Wedding Stories/117-DSC08590.jpg',  title: 'DSC08590', category: 'Wedding Stories' },
    { id: 2133, src: '/categories/Wedding Stories/118-DSC08418.jpg',  title: 'DSC08418', category: 'Wedding Stories' },
    { id: 2134, src: '/categories/Wedding Stories/119-DSC08361.jpg',  title: 'DSC08361', category: 'Wedding Stories' },
    { id: 2135, src: '/categories/Wedding Stories/121-DSC07888.jpg',  title: 'DSC07888', category: 'Wedding Stories' },
    { id: 2136, src: '/categories/Wedding Stories/122-DSC07809.jpg',  title: 'DSC07809', category: 'Wedding Stories' },
    { id: 2137, src: '/categories/Wedding Stories/124-DSC07788.jpg',  title: 'DSC07788', category: 'Wedding Stories' },
    { id: 2138, src: '/categories/Wedding Stories/125-DSC06030.jpg',  title: 'DSC06030', category: 'Wedding Stories' },
    { id: 2139, src: '/categories/Wedding Stories/126-DSC05893.jpg',  title: 'DSC05893', category: 'Wedding Stories' },
  ],
}

const categories = [
  { name: 'Live Events',       count: 14, src: '/categories/Live Events/100-DSC03323.jpg'       },
  { name: 'Portraits',         count: 26, src: '/categories/Portraits/116-DSC08736.jpg'          },
  { name: 'Product Spotlight', count: 50, src: '/categories/Product Spotlight/10-DSC03564.jpg'  },
  { name: 'Wedding Stories',   count: 49, src: '/categories/Wedding Stories/106-DSC02447.jpg'   },
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
  const spotRef      = useRef<HTMLDivElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLSpanElement>(null)
  const isInView     = useInView(containerRef, { once: true, amount: 0.1 })
  const [isHovered, setIsHovered] = useState(false)

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
              alt={photo.title}
              loading="lazy"
              animate={{ scale: isHovered ? 1.09 : 1.0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
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
  photos: { id: number; src: string; title: string; category: string }[]
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

  const cursorRef   = useRef<HTMLDivElement>(null)
  const dotRef      = useRef<HTMLDivElement>(null)
  const mousePos    = useRef({ x: 0, y: 0 })
  const cursorPos   = useRef({ x: 0, y: 0 })
  const cursorAngle = useRef(45)
  const cursorLabelRef = useRef<HTMLSpanElement>(null)

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

      // Rotate the diamond toward the direction of travel; spring back to 45° at rest
      const targetAngle = speed > 2 ? Math.atan2(dy, dx) * (180 / Math.PI) + 45 : 45
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

  const setCursorType = useCallback((t: CursorType) => {
    const el = cursorRef.current
    if (!el) return
    el.className = `cursor cursor-${t}`
  }, [])

  // Group photos: every 3 → [left, right, center-large]
  const groups: Photo[][] = []
  for (let i = 0; i < photos.length; i += 3) groups.push(photos.slice(i, i + 3))

  const cv = (t: CursorType) => () => setCursorType(t)

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
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={cv('default')}
                onClick={() => setSelectedCategory(cat.name)}
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
