import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { formatPriceEUR } from '../../utils/formatPrice'
import MaterialSymbol from '../MaterialSymbol/MaterialSymbol'
import './TarjetaProducto.css'

/** Tarjeta estilo mocks cat_logo / novedades (borde `#333333`, superficie `#1A1A1A`). */
export default function TarjetaProducto({ product, compactCartIcon }) {
  const { addItem } = useCart()

  const tieneDescuento = product.discountPercent && product.discountPercent > 0

  const precioConDescuento = tieneDescuento
    ? product.price - (product.price * product.discountPercent) / 100
    : product.price

  return (
    <article className="group relative flex flex-col overflow-hidden border border-[#333333] bg-[#1A1A1A] p-2">
      {tieneDescuento ? (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#ba203f] px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-white">
          -{product.discountPercent}% descuento
        </span>
      ) : (
        product.badge && (
          <span className="absolute left-4 top-4 z-10 bg-[#ba203f] px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-white">
            {product.badge}
          </span>
        )
      )}

      <Link
        to={`/producto/${product.id}`}
        className="relative mb-4 flex h-64 shrink-0 items-center justify-center overflow-hidden bg-black"
      >
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-110"
        />
      </Link>

      <h3 className="mb-1 font-sans text-sm font-semibold text-white md:text-base">
        <Link to={`/producto/${product.id}`} className="hover:text-[#ba203f]">
          {product.name}
        </Link>
      </h3>

      {product.catalogSubtitle && (
        <p className="mb-4 text-xs text-gray-500">{product.catalogSubtitle}</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#222] pt-3">
        <div className="flex flex-col">
          {tieneDescuento && (
            <span className="text-xs text-gray-500 line-through">
              {formatPriceEUR(product.price)}
            </span>
          )}

          <span className="font-sans font-bold text-white">
            {formatPriceEUR(precioConDescuento)}
          </span>
        </div>

        {compactCartIcon ? (
          <button
            type="button"
            className="rounded border border-[#333333] p-2 text-gray-400 transition-all hover:border-white hover:text-white"
            aria-label={`Añadir ${product.name}`}
            onClick={() => addItem({ ...product, price: precioConDescuento }, 1)}
          >
            <MaterialSymbol className="text-sm">shopping_cart</MaterialSymbol>
          </button>
        ) : (
          <button
            type="button"
            className="bg-[#ba203f] px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#8f1a35]"
            onClick={() => addItem({ ...product, price: precioConDescuento }, 1)}
          >
            Añadir al carrito
          </button>
        )}
      </div>
    </article>
  )
}