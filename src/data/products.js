import fenderPlayerIIStrat from '../assets/fender_strat.jpg'
import bossBD2 from '../assets/boss_bd2.jpg'
import marshallOrigin50 from '../assets/marshall_origin_50.jpg'
import ernieBallStrap from '../assets/ernie_ball_strap.jpg'
import fenderProReverb from '../assets/fender_pro_reverb.jpg'
import ampegVT40 from '../assets/ampeg_vt_40.jpg'

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

export const PRODUCTS = [
  {
    id: '1',
    name: 'Fender Player II Stratocaster',
    category: 'Guitarras',
    price: 879.99,
    discountPercent: 10,
    badge: 'NUEVO',
    featured: true,
    catalogSubtitle: 'Guitarra eléctrica — Hecha en México',
    cartLine: 'Instrumentos / Guitarras Eléctricas',
    image: fenderPlayerIIStrat,
    description:
      'Strat moderna con pickups Single Coil. Hecha en México.',
  },

  {
    id: '2',
    name: 'Boss BD-2 Blues Driver',
    category: 'Efectos',
    price: 149.99,
    featured: true,
    catalogSubtitle: 'Pedal de Overdrive — Hecho en Japón',
    cartLine: 'Efectos / Drive',
    image: bossBD2,
    description:
      'Pedal de Overdrive con clipping y LEDs de alta gama. Hecho en Japón.',
  },

  {
    id: '3',
    name: 'Marshall Origin 50W',
    category: 'Amplificadores',
    price: 799.99,
    discountPercent: 15,
    badge: 'Pro',
    featured: true,
    catalogSubtitle: 'Cabezal a válvulas — Hecho en Reino Unido',
    cartLine: 'Amplificación / Cabezales',
    image: marshallOrigin50,
    description:
      'Amplificador digital con dos canales independientes. Hecho en Reino Unido.',
  },

  {
    id: '4',
    name: 'Ernie Ball Strap',
    category: 'Accesorios',
    price: 29.99,
    featured: true,
    catalogSubtitle: 'Correa de cuero — Hecha en Estados Unidos',
    cartLine: 'Accesorios / Correas',
    image: ernieBallStrap,
    description:
      'Correa de cuero para guitarra. Hecha en Estados Unidos.',
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
    name: 'Fender Pro Reverb 1966',
    category: 'Amplificadores',
    price: 2299.99,
    discountPercent: 20,
    catalogSubtitle: 'Amplificador a válvulas — Hecho en USA',
    cartLine: 'Amplificación / Cabezales',
    image: fenderProReverb,
    description:
      'Amplificador a válvulas Vintage. Hecho en USA.',
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
    name: 'Ampeg VT-40',
    category: 'Amplificadores',
    price: 2499.99,
    discountPercent: 25,
    catalogSubtitle: 'Amplificador a válvulas — Hecho en USA',
    cartLine: 'Amplificadores',
    featured: true,
    image: ampegVT40,
    description:
      'Amplificador a válvulas Vintage. Hecho en USA.',
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