import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../../hooks/useCart.js'
import { getProductImageUrl } from '../../utils/images'
import MaterialSymbol from '../MaterialSymbol/MaterialSymbol'
import './DetalleProducto.css'

export default function DetalleProducto() {
  const { id } = useParams()
  const productId = Number(id)

  const { addItem, items } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState('1')

  const productInCart = items.find((item) => item.id === product?.id)
  const quantityInCart = productInCart?.quantity || 0

  const stockDisponible = Math.max((product?.stock || 0) - quantityInCart, 0)
  const outOfStock = stockDisponible <= 0

  const price = Number(product?.price ?? 0)
  const discount = Number(product?.discount ?? 0)
  const discountedPrice = Number(product?.discountedPrice ?? price)

  const hasDiscount = discount > 0 && discountedPrice < price

  const discountPercentage =
    hasDiscount && price > 0 ? Math.round((discount / price) * 100) : 0

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        const res = await fetch(`http://localhost:8080/productos/${productId}`)

        if (!res.ok) {
          setProduct(null)
          return
        }

        const p = await res.json()

        let fotos = []

        if (p.fotosIds?.length > 0) {
          const fotoRes = await fetch(
            `http://localhost:8080/fotos/${p.fotosIds[p.fotosIds.length - 1]}`
          )

          if (fotoRes.ok) {
            const fotoData = await fotoRes.json()
            fotos = [fotoData]
          }
        }

        const formatted = {
          id: p.id,
          name: p.nombre,
          description: p.descripcion,
          price: p.precio,
          discountedPrice: p.precioConDescuento,
          discount: p.descuento,
          stock: p.stock,
          category: p.categoria?.nombre ?? 'Sin categoría',
          categoryId: p.categoria?.id,
          fotos,
        }

        setProduct(formatted)
      } catch (err) {
        console.error('Error trayendo producto:', err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  useEffect(() => {
    if (stockDisponible <= 0) {
      setQty('1')
      return
    }

    if (Number(qty) > stockDisponible) {
      setQty(String(stockDisponible))
    }
  }, [stockDisponible, qty])

  const handleAddToCart = () => {
    if (outOfStock) return

    const selectedQty = Math.min(Number(qty) || 1, stockDisponible)

    addItem(product, selectedQty)
  }

  if (loading) {
    return <div className="p-10 text-white">Cargando...</div>
  }

  if (!product) {
    return <div className="p-10 text-white">Producto no encontrado</div>
  }

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
          <div className="col-span-6 aspect-square overflow-hidden rounded border border-[#333333] bg-[#1A1A1A]">
            <img
              alt={product.name}
              className="size-full object-cover transition-transform duration-500"
              src={getProductImageUrl(product)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-5">
          <div>
            <h1 className="mb-2 text-[48px] font-extrabold leading-[1.1] tracking-tight text-white">
              {product.name}
            </h1>

            <p className="text-sm font-semibold uppercase tracking-wide text-[#c8c6c5]">
              {product.category}
            </p>
          </div>

          <div className="border-y border-[#333333] py-6">
            <div className="mt-2">
              {hasDiscount ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="text-[32px] font-bold text-[#ba203f]">
                      ${discountedPrice.toFixed(2)}
                    </span>

                    <span className="rounded-md bg-[#ba203f] px-3 py-1 text-sm font-bold text-white shadow-md">
                      -{discountPercentage}% OFF
                    </span>
                  </div>

                  <span className="text-gray-400 line-through opacity-70">
                    ${price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-[32px] font-bold text-[#ba203f]">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-2 text-base leading-relaxed text-[#c8c6c5]">
              {product.stock === 0 ? (
                <span className="font-semibold text-red-400">
                  Producto agotado
                </span>
              ) : (
                <>En stock ({stockDisponible} disponibles).</>
              )}
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
                    disabled={outOfStock}
                    onClick={() =>
                      setQty((q) => String(Math.max(Number(q) - 1, 1)))
                    }
                    className={`flex flex-1 items-center justify-center text-white ${
                      outOfStock
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-[#222222]'
                    }`}
                  >
                    <MaterialSymbol className="text-sm">remove</MaterialSymbol>
                  </button>

                  <input
                    id={`qty-${product.id}`}
                    type="text"
                    disabled={outOfStock}
                    className="w-14 bg-transparent text-center font-semibold text-white outline-none disabled:opacity-50"
                    value={qty}
                    onChange={(e) => {
                      const value = e.target.value

                      if (value === '') {
                        setQty('')
                        return
                      }

                      if (!/^\d+$/.test(value)) return

                      setQty(
                        String(
                          Math.max(1, Math.min(Number(value), stockDisponible))
                        )
                      )
                    }}
                  />

                  <button
                    type="button"
                    disabled={outOfStock}
                    onClick={() =>
                      setQty((q) =>
                        String(Math.min(Number(q) + 1, stockDisponible))
                      )
                    }
                    className={`flex flex-1 items-center justify-center text-white ${
                      outOfStock
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-[#222222]'
                    }`}
                  >
                    <MaterialSymbol className="text-sm">add</MaterialSymbol>
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={outOfStock}
                className={`mt-[22px] flex min-h-[56px] flex-[3] basis-[200px] items-center justify-center gap-2 px-8 font-semibold uppercase tracking-wide text-white transition-all active:scale-95 ${
                  outOfStock
                    ? 'cursor-not-allowed bg-gray-600 opacity-60'
                    : 'bg-[#ba203f] hover:bg-[#8f1a35]'
                }`}
                onClick={handleAddToCart}
              >
                <MaterialSymbol>shopping_cart</MaterialSymbol>
                {product.stock === 0 ? 'Sin stock' : 'Añadir al carrito'}
              </button>

              {outOfStock && (
                <div className="mt-2">
                  {product.stock > 0 && (
                    <>
                      <p className="text-sm font-semibold text-red-400">
                        No hay más unidades disponibles.
                      </p>

                      <p className="mt-1 text-sm text-[#c8c6c5]">
                        Ya tenés toda la cantidad disponible ({quantityInCart})
                        en el carrito.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <div className="mb-8 border-b border-[#333333] pb-4">
          <h2 className="font-semibold uppercase tracking-wide text-white">
            Descripción
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="text-lg leading-relaxed text-[#c8c6c5]">
            {product.description}
          </div>
        </div>
      </section>
    </main>
  )
}