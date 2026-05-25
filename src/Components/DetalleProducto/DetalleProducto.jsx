import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PRODUCTS, getProductById } from '../../data/products.js'
import { useCart } from '../../hooks/useCart.js'
import { formatPriceEUR } from '../../utils/formatPrice.js'
import MaterialSymbol from '../MaterialSymbol/MaterialSymbol'
import './DetalleProducto.css'

export default function DetalleProducto() {
  const { id } = useParams()
  const product = getProductById(id)
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')

  const recomendados = useMemo(
    () => PRODUCTS.filter((p) => p.id !== id).slice(0, 4),
    [id],
  )

  if (!product) {
    return <Navigate to="/" replace />
  }

  const thumbs = product.galleryExtras ?? []

  const hasDiscount = product.discountPercent && product.discountPercent > 0

  const finalPrice = hasDiscount
    ? product.price - (product.price * product.discountPercent) / 100
    : product.price

  const ahorro = product.price - finalPrice

  const stockDisponible = product.stock ?? 12

  const longText =
    Array.isArray(product.descriptionLong) && product.descriptionLong.length > 0
      ? product.descriptionLong
      : [product.description]

  return (
    <main className="mx-auto max-w-screen-2xl px-8 pb-24 pt-12 font-sans">
      <nav
        className="mb-8 flex flex-wrap items-center gap-2 pb-8 text-[12px] font-medium uppercase tracking-widest text-[#474746]"
        aria-label="Migas de pan"
      >
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <MaterialSymbol className="text-xs">chevron_right</MaterialSymbol>
        <Link
          to={`/catalogo?cat=${encodeURIComponent(product.category)}`}
          className="hover:text-white"
        >
          {product.category}
        </Link>
        <MaterialSymbol className="text-xs">chevron_right</MaterialSymbol>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="grid h-fit grid-cols-6 gap-4 lg:col-span-7">
          <div className="relative col-span-6 aspect-square overflow-hidden rounded border border-[#333333] bg-[#1A1A1A]">
            {hasDiscount && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-[#ba203f] px-4 py-1 text-xs font-bold uppercase text-white">
                -{product.discountPercent}% descuento
              </span>
            )}

            <img
              alt={product.name}
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
              src={product.image}
            />
          </div>

          {thumbs[0] && (
            <div className="col-span-2 aspect-square overflow-hidden rounded border border-[#333333]">
              <img alt="" src={thumbs[0]} className="size-full object-cover hover:opacity-80" />
            </div>
          )}

          {thumbs[1] && (
            <div className="col-span-2 aspect-square overflow-hidden rounded border border-[#333333]">
              <img alt="" src={thumbs[1]} className="size-full object-cover hover:opacity-80" />
            </div>
          )}

          <div className="col-span-2 flex aspect-square cursor-pointer items-center justify-center rounded border border-[#333333] bg-black hover:bg-[#222222]">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#c8c6c5]">
              +4 imágenes
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
              {hasDiscount ? (
                <span className="font-sans text-sm font-semibold uppercase text-[#ba203f]">
                  Oferta especial
                </span>
              ) : (
                product.badge && (
                  <span className="font-sans text-sm font-semibold uppercase text-[#ba203f]">
                    {product.badge}
                  </span>
                )
              )}

              {product.sellerLine && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c8c6c5]">
                  Vendido por: {product.sellerLine}
                </span>
              )}
            </div>

            <h1 className="mb-2 text-[48px] leading-[1.1] font-extrabold tracking-tight text-white">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex text-[#ba203f]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <MaterialSymbol key={String(i)} filled>
                    star
                  </MaterialSymbol>
                ))}
              </div>
              <span className="text-[12px] font-medium text-[#c8c6c5]">(48 reseñas)</span>
            </div>
          </div>

          <div className="border-y border-[#333333] py-6">
            {hasDiscount && (
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <span className="text-lg text-gray-500 line-through">
                  {formatPriceEUR(product.price)}
                </span>

                <span className="rounded-full bg-[#ba203f] px-3 py-1 text-xs font-bold uppercase text-white">
                  Ahorrás {formatPriceEUR(ahorro)}
                </span>
              </div>
            )}

            <div className="text-[36px] font-bold text-[#ba203f]">
              {formatPriceEUR(finalPrice)}
            </div>

            <p className="mt-2 text-base leading-relaxed text-[#c8c6c5]">
              {stockDisponible > 0
                ? `En stock: ${stockDisponible} unidades disponibles.`
                : 'Sin stock disponible.'}
            </p>

            <p className="mt-1 text-sm leading-relaxed text-[#888]">
              Revisá coste de envío en el paso siguiente del carrito.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex max-w-[120px] flex-1 flex-col gap-1.5">
                <label
                  htmlFor={`qty-${product.id}`}
                  className="px-1 text-[10px] font-bold uppercase tracking-widest text-[#c8c6c5]"
                >
                  Cantidad
                </label>

                <div className="flex h-[56px] border border-[#333333] bg-[#1A1A1A]">
                  <button
                    type="button"
                    aria-label="Reducir"
                    className="flex flex-1 items-center justify-center text-white hover:bg-[#222222]"
                    onClick={() => setQty((q) => Math.max(q - 1, 1))}
                  >
                    <MaterialSymbol className="text-sm">remove</MaterialSymbol>
                  </button>

                  <input
                    id={`qty-${product.id}`}
                    readOnly
                    className="w-14 border-none bg-transparent p-0 text-center font-semibold text-white outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    inputMode="numeric"
                    min={1}
                    value={qty}
                  />

                  <button
                    type="button"
                    aria-label="Aumentar"
                    className="flex flex-1 items-center justify-center text-white hover:bg-[#222222]"
                    onClick={() => setQty((q) => Math.min(q + 1, stockDisponible))}
                  >
                    <MaterialSymbol className="text-sm">add</MaterialSymbol>
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={stockDisponible <= 0}
                className="mt-[22px] flex min-h-[56px] flex-[3] basis-[200px] items-center justify-center gap-2 bg-[#ba203f] px-8 font-semibold uppercase tracking-wide text-white transition-all hover:bg-[#8f1a35] active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-700"
                onClick={() => addItem({ ...product, price: finalPrice }, qty)}
              >
                <MaterialSymbol>shopping_cart</MaterialSymbol>
                Añadir al carrito
              </button>
            </div>

            <button
              type="button"
              disabled={stockDisponible <= 0}
              className="w-full border border-[#333333] py-4 font-semibold uppercase tracking-wide text-white transition-colors hover:border-white active:scale-95 disabled:cursor-not-allowed disabled:text-gray-600"
            >
              Comprar ahora
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded border border-[#333333] bg-[#1A1A1A] p-4">
              <MaterialSymbol className="mb-2 text-[#ba203f]">local_shipping</MaterialSymbol>
              <p className="text-xs font-semibold uppercase text-white">Envío seguro</p>
              <p className="mt-1 text-xs text-[#888]">Despacho protegido.</p>
            </div>

            <div className="rounded border border-[#333333] bg-[#1A1A1A] p-4">
              <MaterialSymbol className="mb-2 text-[#ba203f]">verified</MaterialSymbol>
              <p className="text-xs font-semibold uppercase text-white">Garantía</p>
              <p className="mt-1 text-xs text-[#888]">Producto verificado.</p>
            </div>

            <div className="rounded border border-[#333333] bg-[#1A1A1A] p-4">
              <MaterialSymbol className="mb-2 text-[#ba203f]">credit_card</MaterialSymbol>
              <p className="text-xs font-semibold uppercase text-white">Pago online</p>
              <p className="mt-1 text-xs text-[#888]">Compra protegida.</p>
            </div>
          </div>

          {product.specs && (
            <div className="flex flex-col gap-6 rounded border border-[#333333] bg-[#1A1A1A] p-6">
              <h3 className="font-sans text-2xl font-bold text-white">
                Especificaciones técnicas
              </h3>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(product.specs).map(([label, val]) => (
                  <div key={label} className={label === 'Canales' ? 'col-span-2' : ''}>
                    <span className="font-sans text-xs font-semibold uppercase text-[#c8c6c5]/70">
                      {label}
                    </span>
                    <p className="mt-1 font-sans text-base text-white">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="mt-20">
        <div className="mb-8 flex gap-12 overflow-x-auto border-b border-[#333333]">
          {[
            ['desc', 'Descripción'],
            ['audio', 'Audio samples'],
            ['man', 'Manuales'],
            ['reviews', 'Reseñas (48)'],
          ].map(([key, lab]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`border-b-2 whitespace-nowrap px-2 pb-4 font-semibold uppercase tracking-wide transition-colors ${
                tab === key ? 'border-[#ba203f] text-white' : 'border-transparent text-[#c8c6c5] hover:text-white'
              }`}
            >
              {lab}
            </button>
          ))}
        </div>

        {tab === 'desc' ? (
          <div className="grid gap-12 md:grid-cols-2">
            <div className="text-lg leading-relaxed text-[#c8c6c5]">
              {longText.map((p, i) => (
                <p key={String(i)} className={i > 0 ? 'mt-4' : ''}>
                  {p}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded border border-[#333333] bg-[#0A0A0A] p-6">
                <MaterialSymbol className="mb-4 text-[#ba203f]">settings_input_component</MaterialSymbol>
                <h4 className="mb-2 font-semibold uppercase text-white">Construcción premium</h4>
                <p className="text-[12px] text-[#c8c6c5]">
                  Componentes pensados para rendimiento estable y sonido profesional.
                </p>
              </div>

              <div className="rounded border border-[#333333] bg-[#0A0A0A] p-6">
                <MaterialSymbol className="mb-4 text-[#ba203f]">equalizer</MaterialSymbol>
                <h4 className="mb-2 font-semibold uppercase text-white">Sonido optimizado</h4>
                <p className="text-[12px] text-[#c8c6c5]">
                  Ideal para músicos que buscan precisión, potencia y confiabilidad.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[#888]">
            Contenido disponible próximamente.
          </p>
        )}
      </section>

      <section className="mt-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-bold tracking-tight text-white">Completa tu rig</h2>
            <p className="mt-2 text-base text-[#c8c6c5]">
              Otros productos recomendados del catálogo.
            </p>
          </div>

          <Link
            to="/catalogo"
            className="text-xs font-semibold uppercase tracking-widest text-[#ba203f] hover:underline"
          >
            Ver todo
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recomendados.map((p) => {
            const recommendedHasDiscount = p.discountPercent && p.discountPercent > 0

            const recommendedFinalPrice = recommendedHasDiscount
              ? p.price - (p.price * p.discountPercent) / 100
              : p.price

            return (
              <Link
                key={p.id}
                to={`/producto/${p.id}`}
                className="group overflow-hidden rounded border border-[#333333] bg-[#1A1A1A]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {recommendedHasDiscount && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-[#ba203f] px-3 py-1 text-[10px] font-bold uppercase text-white">
                      -{p.discountPercent}%
                    </span>
                  )}

                  <img
                    alt={p.name}
                    src={p.image}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <span className="font-sans text-xs uppercase tracking-widest text-[#c8c6c5]/70">
                    {p.category}
                  </span>

                  <h3 className="my-2 font-semibold text-white">{p.name}</h3>

                  {recommendedHasDiscount && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPriceEUR(p.price)}
                    </div>
                  )}

                  <div className="font-semibold text-[#ba203f]">
                    {formatPriceEUR(recommendedFinalPrice)}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}