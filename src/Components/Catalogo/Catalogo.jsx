import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CATEGORY_FILTERS } from '../../data/products.js'
import { fetchCategories, fetchProducts } from '../../../redux/productSlice.js'
import { formatPriceEUR } from '../../utils/formatPrice.js'
import { useCart } from '../../hooks/useCart.js'
import TarjetaProducto from '../TarjetaProducto/TarjetaProducto'
import './Catalogo.css'

export default function Catalogo() {
  const dispatch = useDispatch()
  const {
    items: products,
    categories,
    loading,
    error,
  } = useSelector((state) => state.products)

  const [params, setParams] = useSearchParams()
  const [onlyStock, setOnlyStock] = useState(false)
  const [onlyDiscounts, setOnlyDiscounts] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const categoryFilters = useMemo(() => {
    if (categories.length === 0) return CATEGORY_FILTERS
    return ['Todos', ...categories.map((category) => category.nombre)]
  }, [categories])

  const catParam = params.get('cat')
  const activeCat =
    catParam && categoryFilters.includes(catParam) ? catParam : 'Todos'

  const { addItem } = useCart()
  const flagship = products.find(
    (product) => product.category === 'Amplificadores' && product.featured,
  ) ?? products.find((product) => product.category === 'Amplificadores')

  function showFlagship(cat) {
    return cat === 'Todos' || cat === 'Amplificadores'
  }

  function pickCat(cat) {
    const next = new URLSearchParams(params)
    if (cat === 'Todos') next.delete('cat')
    else next.set('cat', cat)
    setParams(next, { replace: true })
  }

  function getFinalPrice(product) {
    if (product.finalPrice !== undefined) return product.finalPrice
    const discount = product.discountPercent || 0
    return discount > 0
      ? product.price - (product.price * discount) / 100
      : product.price
  }

  function applyFilters(products) {
    return products
      .filter((p) => activeCat === 'Todos' || p.category === activeCat)
      .filter((p) => {
        if (flagship && p.id === flagship.id && showFlagship(activeCat)) return false
        return true
      })
      .filter((p) => {
        if (!onlyStock) return true
        return p.stock === undefined || p.stock > 0
      })
      .filter((p) => {
        if (!onlyDiscounts) return true
        return p.discountPercent && p.discountPercent > 0
      })
      .filter((p) => {
        const finalPrice = getFinalPrice(p)
        const min = minPrice !== '' ? Number(minPrice) : null
        const max = maxPrice !== '' ? Number(maxPrice) : null

        if (min !== null && finalPrice < min) return false
        if (max !== null && finalPrice > max) return false

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return getFinalPrice(a) - getFinalPrice(b)
        if (sortBy === 'price-desc') return getFinalPrice(b) - getFinalPrice(a)
        if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0)
        if (sortBy === 'new') return Number(b.id) - Number(a.id)

        return Number(Boolean(b.featured)) - Number(Boolean(a.featured))
      })
  }

  function clearFilters() {
    setOnlyStock(false)
    setOnlyDiscounts(false)
    setMinPrice('')
    setMaxPrice('')
    setSortBy('featured')
    pickCat('Todos')
  }

  const filterItems = categoryFilters.filter((c) => c !== 'Todos')
  const list = applyFilters(products)
  const totalInCategory = products.filter(
    (p) => activeCat === 'Todos' || p.category === activeCat,
  ).length

  return (
    <div className="catalogo-shell mx-auto max-w-screen-2xl px-8 pb-24 pt-28 font-sans">
      {loading && (
        <p className="mb-6 text-gray-400">Cargando catálogo...</p>
      )}
      {error && (
        <p className="mb-6 text-[#ba203f]">Error al cargar productos: {error}</p>
      )}
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
            <h3 className="mb-3 font-sans text-sm font-semibold uppercase text-white">
              Stock
            </h3>

            <label className="flex cursor-pointer items-center gap-2 text-[15px] text-gray-400 hover:text-white">
              <input
                type="checkbox"
                checked={onlyStock}
                onChange={(e) => setOnlyStock(e.target.checked)}
              />
              Solo con stock
            </label>
          </section>

          <section>
            <h3 className="mb-3 font-sans text-sm font-semibold uppercase text-white">
              Precio
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Mínimo"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 rounded-sm border border-[#333333] bg-black px-2 py-2 text-sm text-white focus:border-[#ba203f] focus:outline-none"
              />

              <span className="text-gray-500">-</span>

              <input
                type="number"
                min="0"
                placeholder="Máximo"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 rounded-sm border border-[#333333] bg-black px-2 py-2 text-sm text-white focus:border-[#ba203f] focus:outline-none"
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-sans text-sm font-semibold uppercase text-white">
              Ofertas
            </h3>

            <label className="flex cursor-pointer items-center gap-2 text-[15px] text-gray-400 hover:text-white">
              <input
                type="checkbox"
                checked={onlyDiscounts}
                onChange={(e) => setOnlyDiscounts(e.target.checked)}
              />
              Solo con descuento
            </label>
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

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-sm border border-[#333333] px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-300 transition-colors hover:border-[#ba203f] hover:text-white"
          >
            Limpiar filtros
          </button>
        </aside>

        <div className="flex-1">
          <header className="catalogo-toolbar mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-sans text-3xl font-bold text-white">{titleFor(activeCat)}</h1>

              <p className="mt-2 font-sans text-xs uppercase tracking-widest text-gray-500">
                MOSTRANDO {list.length + (flagship && showFlagship(activeCat) ? 1 : 0)} DE {totalInCategory} PRODUCTOS
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Ordenar por:</span>

              <select
                aria-label="Ordenar por"
                className="rounded-sm border border-[#333333] bg-black px-2 py-1 text-xs text-white focus:border-[#ba203f] focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a mayor</option>
                <option value="price-desc">Precio: Mayor a menor</option>
                <option value="discount">Mayor descuento</option>
                <option value="new">Novedades</option>
              </select>
            </div>
          </header>

          <div className="grid gap-2 pb-16 md:grid-cols-2 xl:grid-cols-3">
            {flagship && showFlagship(activeCat) && (
              <ProductoDestacado
                product={flagship}
                getFinalPrice={getFinalPrice}
                addItem={addItem}
              />
            )}

            {list.map((p) => (
              <TarjetaProducto key={p.id} product={p} compactCartIcon />
            ))}
          </div>

          {list.length === 0 && !(flagship && showFlagship(activeCat)) && (
            <div className="rounded-sm border border-[#333333] bg-[#1A1A1A] p-8 text-center text-gray-400">
              No encontramos productos con esos filtros.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ProductoDestacado({ product, getFinalPrice, addItem }) {
  const hasDiscount = product.discountPercent && product.discountPercent > 0
  const finalPrice = getFinalPrice(product)

  return (
    <div className="group relative mb-8 overflow-hidden border border-[#333333] bg-[#1A1A1A] md:col-span-2 xl:col-span-2">
      <div className="absolute left-4 top-4 z-10">
        {hasDiscount ? (
          <span className="rounded-full bg-[#ba203f] px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-white">
            -{product.discountPercent}% descuento
          </span>
        ) : (
          <span className="bg-[#ba203f] px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-white">
            NUEVO
          </span>
        )}
      </div>

      <img
        alt={product.name}
        className="h-[450px] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
        src={product.image}
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8">
        <Link to={`/producto/${product.id}`}>
          <h2 className="font-sans text-2xl font-bold text-white">{product.name}</h2>
        </Link>

        <p className="mb-4 mt-3 max-w-md text-sm text-gray-400">
          {product.catalogSubtitle ?? product.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPriceEUR(product.price)}
              </span>
            )}

            <span className="font-sans text-2xl font-bold text-[#ba203f]">
              {formatPriceEUR(finalPrice)}
            </span>
          </div>

          <button
            type="button"
            className="bg-[#ba203f] px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#8f1a35]"
            onClick={() => addItem({ ...product, price: finalPrice }, 1)}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

function titleFor(cat) {
  if (cat === 'Todos') return 'Catálogo completo'
  return cat === 'Audio Pro' ? 'Audio profesional' : cat
}