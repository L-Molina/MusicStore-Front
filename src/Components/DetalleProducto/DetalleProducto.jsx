import {useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import MaterialSymbol from '../MaterialSymbol/MaterialSymbol'
import './DetalleProducto.css'
import { useSelector, useDispatch } from "react-redux";
import { getProductImageUrl } from "../../utils/images"
import { fetchProductById } from "../../redux/productDetailSlice";
import { addCartItem } from "../../redux/cartSlice";

export default function DetalleProducto() {
  const dispatch = useDispatch();

  const {token } = useSelector(
      state => state.auth
  );

  const { items } = useSelector(
    state => state.cart
  );

  const { product, loading, error } = useSelector(
    state => state.productDetail
  );
  const isAuthenticated = !!token;

  const { id } = useParams()
  const productId = Number(id)

  const [qty, setQty] = useState("1")

  const productInCart = items.find(item => item.id === product?.id)

  const quantityInCart = productInCart?.quantity || 0

  const stockDisponible = (product?.stock || 0) - quantityInCart

  const outOfStock = stockDisponible <= 0
  const disabledCart = outOfStock || !isAuthenticated

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (stockDisponible <= 0) {
      setQty("1");
      return;
    }

    if (Number(qty) > stockDisponible) {
      setQty(String(stockDisponible));
    }
  }, [stockDisponible]);

if (loading) {
  return <div className="text-white p-10">Cargando...</div>
}
if (error) {
  return (
    <div className="text-white p-10">
      Error: {error}
    </div>
  );
}

if (!product) {
  return <div className="text-white p-10">Producto no encontrado</div>
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
            
            <h1 className="mb-2 text-[48px] leading-[1.1] font-extrabold tracking-tight text-white">
              {product.name}
            </h1>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#c8c6c5]">
  {product.category}
</p>
            
          </div>

          <div className="border-y border-[#333333] py-6">
  <div className="mt-2">
    {product.discount > 0 ? (
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
  <span className="text-[32px] font-bold text-[#ba203f]">
    ${Number(product.discountedPrice).toFixed(2)}
  </span>

  <span className="rounded-md bg-[#ba203f] px-3 py-1 text-sm font-bold text-white shadow-md">
  -{product.discount}% OFF
</span>
</div>

        <span className="text-gray-400 line-through opacity-70">
          ${Number(product.price).toFixed(2)}
        </span>
      </div>
    ) : (
      <span className="text-[32px] font-bold text-[#ba203f]">
        ${Number(product.price).toFixed(2)}
      </span>
    )}
  </div>

<p className="mt-2 text-base leading-relaxed text-[#c8c6c5]">
  {product.stock === 0 ? (
    <span className="text-red-400 font-semibold">
      Producto agotado
    </span>
  ) : (
    <>
      En stock ({stockDisponible} disponibles).
    </>
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
            disabled={disabledCart}
            onClick={() =>
  setQty((q) => String(Math.max(Number(q) - 1, 1)))
}
            className={`flex flex-1 items-center justify-center text-white
  ${disabledCart
    ? 'cursor-not-allowed opacity-50'
    : 'hover:bg-[#222222]'
  }`}
          >
            <MaterialSymbol className="text-sm">remove</MaterialSymbol>
          </button>

          <input
  type="text"
  disabled={disabledCart}
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
            disabled={disabledCart}
           onClick={() =>
  setQty((q) =>
    String(Math.min(Number(q) + 1, stockDisponible))
  )
}
            className={`flex flex-1 items-center justify-center text-white
  ${disabledCart
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
  disabled={disabledCart}
  className={`mt-[22px] flex min-h-[56px] flex-[3] basis-[200px] items-center justify-center gap-2 px-8 font-semibold uppercase tracking-wide text-white transition-all active:scale-95
    ${disabledCart
  ? 'bg-gray-600 cursor-not-allowed opacity-60'
  : 'bg-[#ba203f] hover:bg-[#8f1a35]'
}`
  }
  onClick={() => {
  if (outOfStock) return

  dispatch(
    addCartItem({
      product,
      quantity: Math.min(Number(qty), stockDisponible)
    })
  )
}}
>
  <MaterialSymbol>shopping_cart</MaterialSymbol>
  {
  product.stock === 0
    ? 'Sin stock'
    : 'Añadir al carrito'
}
</button>
{!isAuthenticated && product.stock > 0 && (
  <p className="mt-2 text-sm text-yellow-400">
    Debés iniciar sesión para agregar productos al carrito.
  </p>
)}
    {outOfStock && (
  <div className="mt-2">
    {product.stock > 0 && (
      <>
        <p className="text-sm font-semibold text-red-400">
          No hay más unidades disponibles.
        </p>

        <p className="mt-1 text-sm text-[#c8c6c5]">
          Ya tenés toda la cantidad disponible ({quantityInCart}) en el carrito.
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
