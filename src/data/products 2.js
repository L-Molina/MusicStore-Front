/**
 * Catálogo alineado a taxonomía de mocks Stitch (home / cat_logo v6).
 * HTML de referencia: design-mocks/stitch_musicstore_e_commerce_platform/
 */

const STITCH_IMG_PEDAL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwe-1CyhDlNLgOS9NVrqIrDkJhpdVwBd_gNWlFT9XVXew5hZYCrqON035Jv6JAr1JtAO2F10YNfWwjehtFW_b3-xy12WCfzn7SN6wmfDocPTjI_BlHdhe8GX_SJ9_vUF07B1_LGm1gU-Fl7aZ8xmXr5ZSmCAZHjG26RoGFwEXGp9TpDq9Do5wIiicsE0W8DbvLlkPUjrb00idybrynCTA0fZJJA8y3Z1PEMTDecy_CpsdEAs8d_J5Pv50iF0VitVzR774oKcadYoE'
const STITCH_IMG_CORREA =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBHXQUD0FVV-tfVdO6tRw5BpBIjMvTgxBEBPq_r9nyml0VyL0fcqzl5oqJsxvgw90GqWiK1heGq0LFXTlbC9JAHuobcAcDDTJQCv_LrLjpqMKMR8IafcoCckhvARy7Iskpel0cwEKPx7Co5qbrUP_6XQ8Wj_qDHpaVLiB5uxU_wMaywAUX4T-hkzOkRFmN3b2u2Wn2wayPBtclub0zEWO1D-kfraHQSUS9pK4TJSQEgMyzyQAD8bsd6ZniQUZgvPGk8EkoHDIq0rH4'
const STITCH_IMG_STAND =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAPSPLZcVvzeQnGL83Zrwd1YtvT0EhmGqXccNCIWeDp6OkUJ4takEfbeqzDv1Jw_Wp0gzRJiCgLeFV8mwmJEUMGjVwbDcjY33o6eTf7l6YrKMhm_tzCAx1MWJK5TuQBrHCXEh1NlWKUQuqpSrc9A5bA5SWryY6OR6zmhFIsqw6SXCiF0Ie1ZvzOpuh3EXW-zb9UkFBMH7jGHnWXgfcXyPN2USuAut1E5jp2f2ZAGlP72fa85oaybWBucFgttJ9LAvoqvJjbgP90JrQ'
const STITCH_IMG_HEADPHONE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpBH5j9A7qZiBzFsp-TMxNVqGz1xEh1Rzvrb2sV5GSXHEX5Uil4rPZAc3M_h30dQ830-7qPNVOpZHWlpjCDiiUtUGirsVEQeT2dZ0NimWnqunJFXC0JRdbVMUM6yyQKZrecft8vA0wZTlmqY64dKAfmd_5x4tHcNvCNmwkM7bvknd1jYOZ60rP2rLqc-swt2hqi-xyUs4kuOG0bTkTi3b1gcH7wyjmZZ63870rC_9lxuZfiNtCVVxp9WqgMEezbp0of_wtZjecvo'

export const CATEGORY_FILTERS = [
  'Todos',
  'Guitarras',
  'Bajos',
  'Baterías',
  'Altavoces',
  'Amplificadores',
  'Audio Pro',
  'Teclados',
  'Efectos',
  'Accesorios',
  'Viento',
]

/** @typedef {{ id: string, name: string, category: string, price: number, image: string, description: string, badge?: string, featured?: boolean, catalogSubtitle?: string, cartLine?: string, sellerLine?: string, galleryExtras?: string[], specs?: Record<string,string> }} Product */

/** @type {Product[]} */
export const PRODUCTS = [
  {
    id: '1',
    name: 'Dark Series Stratocaster',
    category: 'Guitarras',
    price: 1499,
    badge: 'NUEVO',
    featured: true,
    catalogSubtitle: 'Guitarra eléctrica — acabado mate',
    cartLine: 'Instrumentos / Guitarras Eléctricas',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDG8yHR51avEx8aY2LRw4sbUMd3bkdbY-24o1f--h-j7R3hMSWeLv9-5fxSsGT-PM6GiJXkYMllR7Hd8R5STH4APy4oHYe9_MFi-yJyl2FTiz2EGb94dMG8qRDN0uLPd-nWtEhmxJq24upi1DfAo9Ep21vA5YZpdm8lWkMWVgQ1NW2pYJk0SA5jMyuo1djHRDDua17lkjIG_YDlCc8NmcJxrPM7LB9kwSiuFjGvnIMOLTJXPlYdcOREUAB8JEGVXVHpyYwm_X4wyks',
    description:
      'Strat moderno con electrónica Noiseless y acabado negro satinado tipo mock Home Novedades Stitch.',
  },
  {
    id: '2',
    name: 'Overdrive Precision V3',
    category: 'Efectos',
    price: 249,
    featured: true,
    catalogSubtitle: 'Pedal boutique — tres bandas EQ',
    cartLine: 'Efectos / Drive',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfhLOu98mpsrekQOzCMgrZZ_q72CXHx2MCqXNNpZZFQjK8TczstalSATIGW1ULneKC-OzSFKfCd5k21i9khR2M0Qvnrg-3GnstCgSVwtoiAvqgnz34Shp3z2bo3mCu_jbW9F7RMd6ws0TeS0iFE66_M0s4-YtL-P6GfOpFZyVuUIWYZ5Vg-r6mPXkMBbGsBzZKLKTCqn10oFgCF9tEr6CZxsDIjgacNMFkrbby3hvzMlt4C2LK7TRFht5g5Q3yVtdZF5DTV1IH2qg',
    description:
      'Pedal de distorsión clase A con clipping asimétrico y LEDs de nivel como en mock Novedades.',
  },
  {
    id: '3',
    name: 'Custom Shop Head 50W',
    category: 'Amplificadores',
    price: 2199,
    badge: 'Pro',
    featured: true,
    catalogSubtitle: 'Cabezal a válvulas — canal dual',
    cartLine: 'Amplificación / Cabezales',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwxMRpFmEIXBColqJymzdNAJzJzAfb8cal24lA5G7SleCUmmFoUVYvJG-HG6f2G3Lvgvyp9E-MmL8B3bdoOHHfCUVz1EKZejrURs3KED-3ar5FBDMJbKU4RtlbqPVps1twQmwBNbDB0z3hUqME9xMlQCUChszvRJ9302XIrQ5XYZVTHQ8RFrhsIMeIuxADIKwDiMbNClimRpbkdhIPDE31LfzN678XnWX2kzUGPOjiRXHmPj1iJRuqEXucd1Jogno2i35frip6OhY',
    description:
      'Dos canales independientes con loop de efectos y salida DI emulada inspirado en tarjeta Novedades.',
  },
  {
    id: '4',
    name: 'Correa Artisan Cuero Pro',
    category: 'Accesorios',
    price: 89,
    featured: true,
    catalogSubtitle: 'Cuero perforado — hebillas níquel',
    cartLine: 'Accesorios / Correas',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Ki9P45dD3i5ugb242G4vLb5SlDU2_6893t88AvWY8KaOqQfOJy0rTbkSxC3TnECxeF4UzD57mz7HaDFyUncrUPtae-ZIpMkAXc4hOq1Ki1NUa9-o6bm6OM9U7uXVbR3VCLzgz_hvSmknoneWMPtToI4Y_1X1KaLEEXiNzrQtySscWT2Uj2q5GzQ9Tp8GeNvW6NzPhQgxri9ulrX-RpN1Y6bcpcBqBcHwqypDeURhcVuUpwZIEGps4FL5E_sSlIq-LPxn9oTqJWNM',
    description:
      'Correa de cuero grueso para giras prolongadas como en showcase Stitch.',
  },
  {
    id: '5',
    name: 'American Professional II Bass',
    category: 'Bajos',
    price: 1899,
    badge: 'MÁS VENDIDO',
    catalogSubtitle: 'Precision Bass — Olympic White',
    cartLine: 'Instrumentos / Bajos Eléctricos',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLLsuNPdEwk82jkYKdbObSkskMXqf3Du9FH08QckppYEDR4XnBC8wZ0k79ObFVQFtQVpxV966cqldBYTXt9IxEGfndNjUg7tHoKrvocAOOTKXKhMeCmXBXO6M7hRuc-uwRV-SVy2jZshEOx-PtWHLcBjELB7E8TRwe9RgD8-_8lqkEImNXElQSzOcl-Ih4eRFdXSacVzFf9ilmuBZge1cidqMtIwFKr-d35kxGao5q_HvnLVBNfs0-m5ad5JRtxImXVjnAKBYE3hI',
    description:
      'Bajo profesional escala 34″ con pickups V-Mod II y herrajes cromados.',
  },
  {
    id: '6',
    name: 'JVM410H 100W Tube Head',
    category: 'Amplificadores',
    price: 2150,
    catalogSubtitle: 'El estándar del rock británico',
    cartLine: 'Amplificación / Cabezales',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCeyBLshooRHhW9zGv6EuBi6vv3UmX6B7_pMgHk6Mau_9rWmqcKE-xDrbp-0gRa10-B6X7bh_5N92l7ulq8h_hhK0xnm8TRgTYeuzJBHwgLlIEJ8BDxFEKWdDxQ6SDi79RrAIOkIe0rZ15n0dIQNgqb4RRPLJ6PD6nt9WJylfWMykNtq2Urrqk0FP2u_MRNzBMhhBKii0_8c_CtGhOka6Dy7_neGpuFtxfs5k6r79JhYbwhhZ0xbsJArXQ_9paHKWWPSy1-u0RQ4oI',
    description:
      'Cabezal a válvulas cuatro canales con reverb paralelo desde mock cat_logo.',
  },
  {
    id: '7',
    name: 'Batería compacta Live Stage',
    category: 'Baterías',
    price: 1299,
    catalogSubtitle: 'Shell pack 4 piezas • hardware plegable',
    cartLine: 'Percusión / Baterías',
    image:
      'https://images.unsplash.com/photo-1519892300165-cb5882f43c65?auto=format&fit=crop&w=900&q=80',
    description:
      'Configuración versátil para ensayo y sala mediana.',
  },
  {
    id: '8',
    name: 'Sintetizador workstation Aurora',
    category: 'Teclados',
    price: 2199,
    catalogSubtitle: '88 teclas contrapesadas',
    cartLine: 'Teclados / Workstations',
    image:
      'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=900&q=80',
    description:
      'Motores virtuales duales y secuenciador integral.',
  },
  {
    id: '9',
    name: 'Monitores nearfield pair',
    category: 'Altavoces',
    price: 389,
    catalogSubtitle: 'Par activo campo cercano',
    cartLine: 'Audio / Monitores',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80',
    description:
      'Respuesta extendida para mezclas críticas.',
  },
  {
    id: '10',
    name: 'Interfaz Thunder 8×8',
    category: 'Audio Pro',
    price: 529,
    catalogSubtitle: '192 kHz • preamps clase A',
    cartLine: 'Audio / Interfaces',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfepfsDVrGIcofmnE06xbd9QBw040XggVvKcrKrJUJHJW5TnV4BThUDMmcPOid2CatsscPt2_fkIXjxYF3YFf1s9KwvNOchIXfteDAtZ2yQvmTIvfoBRz95bnNaFjZQp6PsCGQg3cdtta715rD0npM0sv1iGxxpjouaHe5tiWOfB5BYJuPjydNOCOhmIMzM8zkL2v4juZaglnmRxNTv65QCW155HzV2Tfm5GZrwFdbAC2tfumVY_ngfcVOB9ObVXSkBTYs2MwIml8',
    description:
      'Baja latencia y loopback stereo para streaming.',
  },
  {
    id: '11',
    name: 'Saxofón alto Stage Brass',
    category: 'Viento',
    price: 1699,
    catalogSubtitle: 'Eb • estuche incluido',
    cartLine: 'Viento / Metales',
    image:
      'https://images.unsplash.com/photo-1573871669414-60a78448aa0b?auto=format&fit=crop&w=900&q=80',
    description:
      'Lacado dorado y mecánica fluida inspirado en colección anterior.',
  },
  {
    id: '13',
    name: 'TubeMaster Pro 100W MKII',
    category: 'Amplificadores',
    price: 2499,
    badge: 'Edición Limitada',
    sellerLine: 'MasterAudio Store',
    catalogSubtitle: 'Cabezal válvulas • MKII revisión',
    cartLine: 'Amplificación / Cabezales',
    galleryExtras: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMxxF9dcdXCq8On5tHVhL9ZiZow-x83T30OYNh1RTBFh3shyxp3UccLwP1DIlrq3p3DPv6XFEkK9EN2LOh803TBhnN22YEwiXQ5osrpssbsp8HmQsf2kOiBiZVKRKMEiKsyCmH9hZhHh-eEBLVnJczHPy3El_aqhw-Q2wSmpZK80gFNEThkb3c9USP_Jn2WxslSYmRrJMuYpD6da_YeM6EWC92LReVlQaGy54BIJgXSAkMcVGbucDlnB_nUrylgrBBYXP040ge2JM',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCW1z-DFM8ydvRtoGzzoxWRGiAGdu133PKfiikjAdsEV8khiZoGhwLZweeqIZVfHJCE822bcHXGS-4NPj6ZUzR64QEQovWVZI2AEFpM8dmT0hp9CGPGPclUaJrnAy2wQDlu6ovv83P-4vLQDAZtF1jiyNk9GL5hhQy8pHlJZ5FKC6yRTO3m3rL3VjB_o4cnYqxj-EocTDa7vjh8KYuVrD-9lKj7UQNKanl-Fb9rieiImb8amFj1nOzasdwXrFUMe7ZW1IbPyCzO4Yc',
    ],
    specs: {
      Potencia: '100W (Conmutable a 50W)',
      Válvulas: '4x ECC83, 4x EL34',
      Entradas: '2 x Jack 1/4" (High/Low)',
      Salidas: 'DI Out (XLR), Emulated',
      Canales:
        'Clean, Crunch, Lead 1, Lead 2 (Independientes)',
    },
    descriptionLong: [
      'El TubeMaster Pro 100W MKII representa el pináculo de la ingeniería valvular moderna. Diseñado para el músico de gira que no acepta compromisos en su tono, este amplificador ofrece una respuesta dinámica sin precedentes y una claridad armónica que corta cualquier mezcla.',
      'Desde limpios cristalinos tipo California hasta la saturación británica más agresiva, sus cuatro canales han sido ajustados meticulosamente para proporcionar una paleta sonora completa.',
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDB25Rizvfqc70z8mvs9Ex-mYz7c2-dHhFTGN2yf6XOF_8AE9g9V-ZmpyTuLQ-2DxvJhLjLfj4YasSe5K9os4tmX4mednn8UedEbrPAjekK7KVvBOOgKwPXLnqBr2j8nJowYnh9Zd1AFQSRgmbki1aZSemeT8P9_5orZziMUyYvTuDNbfBdubiczj3IJR_iNR_FgAuyEzJDIKaspyerKqeMe0sO8eu4W6LZX76OJn1J0ZvhO1rFlZdtZCuWWGWo_kshg65fTQ9HUVs',
    description:
      'Cabezal a válvulas de referencia Stitch detalle_de_producto_musicstore_v6.',
  },
]

export const RELATED_SUGGESTIONS = [
  { id: 's1', name: 'Ibanez Tube Screamer Mini', price: 79, image: STITCH_IMG_PEDAL },
  { id: 's2', name: 'Correa de Cuero Premium', price: 45, image: STITCH_IMG_CORREA },
  { id: 's3', name: 'Soporte Studio Hércules', price: 55, image: STITCH_IMG_STAND },
  { id: 's4', name: 'Beyerdynamic DT 770 Pro', price: 139, image: STITCH_IMG_HEADPHONE },
]

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id)
}