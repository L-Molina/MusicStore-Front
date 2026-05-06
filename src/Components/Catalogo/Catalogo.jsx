import { Link, useSearchParams } from 'react-router-dom'
import { PRODUCTS, CATEGORY_FILTERS, getProductById } from '../../data/products.js'
import { formatPriceEUR } from '../../utils/formatPrice.js'
import { useCart } from '../../hooks/useCart.js'
import TarjetaProducto from '../TarjetaProducto/TarjetaProducto'
import './Catalogo.css'

/**
 * Versión compacta del mock `cat_logo_musicstore_v6/code.html`:
 * filtros lateral + rejilla principal (omitimos demo player inferior).
 */
export default function Catalogo() {
  const [params, setParams] = useSearchParams()
  const catParam = params.get('cat')
  const activeCat =
    catParam && CATEGORY_FILTERS.includes(catParam) ? catParam : 'Todos'
  const { addItem } = useCart()

  const flagship = getProductById('13')

  const list = PRODUCTS.filter((p) => activeCat === 'Todos' || p.category === activeCat).filter((p) => {
    /* evitar repetir destacado cuando es el mismo producto grande */
    if (flagship && p.id === flagship.id && showFlagship(activeCat)) return false
    return true
  })

  function showFlagship(cat) {
    return cat === 'Todos' || cat === 'Amplificadores'
  }

  function pickCat(cat) {
    const next = new URLSearchParams(params)
    if (cat === 'Todos') next.delete('cat')
    else next.set('cat', cat)
    setParams(next, { replace: true })
  }

  const filterItems = CATEGORY_FILTERS.filter((c) => c !== 'Todos')

  return (
    <div className="catalogo-shell mx-auto max-w-screen-2xl px-8 pb-24 pt-28 font-sans">
      <main className="flex flex-col gap-8 md:flex-row md:gap-10">
        <aside className="w-full shrink-0 space-y-8 md:w-64 md:space-y-10">
          <section>
            <h3 className="mb-2 font-sans text-sm font-semibold uppercase text-white">
              Categorías
            </h3>
            <ul className="space-y-3">
              {filterItems.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    className={`w-full rounded-sm border border-transparent px-1 py-0.5 text-left text-[15px] transition-colors hover:text-white ${
                      activeCat === c ? 'border-[#333] text-[#ba203f]' : 'text-gray-400'
                    }`}
                    onClick={() => pickCat(c)}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 font-sans text-sm font-semibold uppercase text-white">
              Filtros especiales
            </h3>
            <button
              type="button"
              className="text-left text-[15px] text-gray-400 hover:text-white"
              onClick={() => pickCat('Amplificadores')}
            >
              Ofertas destacadas → Amplificadores
            </button>
          </section>
        </aside>

        <div className="flex-1">
          <header className="catalogo-toolbar mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-sans text-3xl font-bold text-white">{titleFor(activeCat)}</h1>
              <p className="mt-2 font-sans text-xs uppercase tracking-widest text-gray-500">
                MOSTRANDO {visibleCount(activeCat)} DE {PRODUCTS.length} PRODUCTOS
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Ordenar por:</span>
              <select
                aria-label="Ordenar por"
                className="rounded-sm border border-[#333333] bg-black px-2 py-1 text-xs text-white focus:border-[#ba203f] focus:outline-none"
                defaultValue="featured"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a mayor</option>
                <option value="new">Novedades</option>
              </select>
            </div>
          </header>

          <div className="grid gap-2 pb-16 md:grid-cols-2 xl:grid-cols-3">
            {flagship && showFlagship(activeCat) && (
              <div className="group relative mb-8 overflow-hidden border border-[#333333] bg-[#1A1A1A] md:col-span-2 xl:col-span-2">
                <div className="absolute left-4 top-4 z-10">
                  <span className="bg-[#ba203f] px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-white">
                    NUEVO
                  </span>
                </div>
                <img
                  alt={flagship.name}
                  className="h-[450px] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
                  src={flagship.image}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8">
                  <Link to={`/producto/${flagship.id}`}>
                    <h2 className="font-sans text-2xl font-bold text-white">{flagship.name}</h2>
                  </Link>
                  <p className="mb-4 mt-3 max-w-md text-sm text-gray-400">
                    {flagship.catalogSubtitle ?? flagship.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="font-sans text-2xl font-bold text-[#ba203f]">
                      {formatPriceEUR(flagship.price)}
                    </span>
                    <button
                      type="button"
                      className="bg-[#ba203f] px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#8f1a35]"
                      onClick={() => addItem(flagship, 1)}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            )}

            {list.map((p) => (
              <TarjetaProducto key={p.id} product={p} compactCartIcon />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function titleFor(cat) {
  if (cat === 'Todos') return 'Catálogo completo'
  return cat === 'Audio Pro' ? 'Audio profesional' : cat
}

function visibleCount(cat) {
  return PRODUCTS.filter((p) => cat === 'Todos' || p.category === cat).length
}
