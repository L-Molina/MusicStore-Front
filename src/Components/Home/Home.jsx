import { Link } from 'react-router-dom'
import { HOME_HERO_IMAGE, STITCH_CATEGORY_TILES } from '../../constants/stitchAssets.js'
import { PRODUCTS } from '../../data/products.js'
import { useCart } from '../../hooks/useCart.js'
import { formatPriceEUR } from '../../utils/formatPrice.js'
import MaterialSymbol from '../MaterialSymbol/MaterialSymbol'
import './Home.css'

const bundles = [
  {
    n: '01',
    title: 'The Soloist Bundle',
    body: 'El set definitivo para el guitarrista moderno: Guitarra, Amplificador de 20W y cable de alta fidelidad.',
    icon: 'trending_up',
  },
  {
    n: '02',
    title: 'Studio Master Set',
    body: 'Audio interface de 4 canales junto con monitores de campo cercano para una mezcla perfecta.',
    icon: 'mic_external_on',
  },
  {
    n: '03',
    title: 'Bass Foundation',
    body: 'Bajo activo de 5 cuerdas con funda rígida y afinador de precisión integrado.',
    icon: 'music_note',
  },
]

/** Home según mock `design-mocks/.../home_musicstore_v6/code.html`. */
export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured)
  const { addItem } = useCart()

  return (
    <>
      <header className="relative flex h-[min(870px,90vh)] w-full items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img alt="" className="size-full object-cover opacity-60" src={HOME_HERO_IMAGE} />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-8">
          <div className="max-w-2xl">
            <span className="mb-4 block font-sans text-sm font-semibold uppercase tracking-[0.15em] text-[#ba203f]">
              EQUIPAMIENTO DE ÉLITE
            </span>
            <h1 className="home-hero-title mb-6 font-sans font-extrabold uppercase tracking-tighter text-white">
              La Precisión del Sonido Puro.
            </h1>
            <p className="mb-8 max-w-lg font-sans text-lg font-normal leading-relaxed text-[#c8c6c5]">
              Explora nuestra colección curada de instrumentos y herramientas de audio para el músico
              profesional contemporáneo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="bg-[#ba203f] px-8 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#8f1a35] active:scale-95 active:opacity-80"
              >
                EXPLORAR CATÁLOGO
              </Link>
              <a
                href="#novedades"
                className="border border-[#333333] px-8 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-white active:scale-95 active:opacity-80"
              >
                NOVEDADES
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-screen-2xl bg-black px-8 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="home-section-title mb-2 font-sans font-bold uppercase tracking-tight text-white">
              Categorías Principales
            </h2>
            <div className="h-1 w-12 bg-[#ba203f]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {STITCH_CATEGORY_TILES.map(({ cat, label, img }) => (
            <Link
              key={cat}
              to={`/catalogo?cat=${encodeURIComponent(cat)}`}
              className="group relative aspect-[4/5] cursor-pointer overflow-hidden border border-[#333333] bg-[#1A1A1A]"
            >
              <img
                alt=""
                className="size-full object-cover opacity-50 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                src={img}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                <p className="font-sans text-sm font-semibold uppercase tracking-wide text-white">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="novedades" className="border-y border-[#333333] bg-[#1A1A1A] py-20">
        <div className="mx-auto max-w-screen-2xl px-8">
          <div className="mb-12 flex items-center gap-4">
            <h2 className="home-section-title font-sans font-bold uppercase text-white">Novedades</h2>
            <div className="h-px flex-grow bg-[#333333]" />
            <Link
              to="/catalogo"
              className="font-sans text-xs font-medium uppercase tracking-wide text-[#ba203f] transition-colors hover:text-white"
            >
              VER TODO
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {featured.slice(0, 4).map((p) => (
              <div key={p.id} className="group flex flex-col">
                <div className="relative mb-6 flex aspect-square items-center justify-center overflow-hidden border border-[#333333] bg-black p-8 transition-colors group-hover:border-white">
                  <img
                    alt={p.name}
                    className="h-auto max-w-full object-contain"
                    src={p.image}
                  />
                  {p.badge && (
                    <span className="absolute left-4 top-4 bg-[#ba203f] px-3 py-1 font-sans text-xs font-medium text-white">
                      {p.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      aria-label={`Añadir ${p.name} al carrito`}
                      className="rounded-full bg-white p-4 text-black hover:bg-[#f0f0f0]"
                      onClick={() => addItem(p, 1)}
                    >
                      <MaterialSymbol>shopping_cart</MaterialSymbol>
                    </button>
                  </div>
                </div>
                <Link
                  to={`/producto/${p.id}`}
                  className="font-sans text-xs font-semibold uppercase tracking-wide text-[#ba203f]"
                >
                  {p.category}
                </Link>
                <h3 className="mt-1 font-sans text-xl font-bold leading-tight text-white">
                  <Link to={`/producto/${p.id}`} className="hover:text-[#ba203f]">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-2 font-sans text-base text-[#c8c6c5]">{formatPriceEUR(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl bg-black px-8 py-20">
        <h2 className="home-section-title mb-12 text-center font-sans font-bold uppercase text-white">
          Equipamiento Recomendado
        </h2>
        <div className="grid grid-cols-1 gap-0 border border-[#333333] md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((b, i) => (
            <div
              key={b.n}
              className={`group border-[#333333] p-10 transition-colors hover:bg-[#1A1A1A] lg:border-r ${
                i === 2 ? '' : 'border-b md:border-b-0'
              } ${i === 0 ? 'md:border-r lg:border-r' : ''} ${i === 1 ? 'lg:border-r' : ''}`}
            >
              <div className="mb-10 flex items-start justify-between">
                <div>
                  <p className="mb-1 font-sans text-xs text-gray-500">{b.n}</p>
                  <h4 className="font-sans text-2xl font-bold text-white">{b.title}</h4>
                </div>
                <MaterialSymbol className="text-[#ba203f]">{b.icon}</MaterialSymbol>
              </div>
              <p className="mb-8 font-sans text-base leading-relaxed text-[#c8c6c5]">{b.body}</p>
              <Link
                to="/catalogo"
                className="font-sans text-sm font-semibold uppercase tracking-wide text-white transition-colors group-hover:text-[#ba203f]"
              >
                CONFIGURAR{' '}
                <MaterialSymbol className="align-middle text-sm">arrow_forward</MaterialSymbol>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
