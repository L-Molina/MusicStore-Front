import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart.js";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";
import { getProductImageUrl } from "../../utils/images"
const SHIPPING = 25;

export default function Carrito() {
  const { items, total, removeItem, setQuantity, addItem } = useCart();

  const subtotalProductos = total;
  const conEnvío = items.length > 0 ? SHIPPING : 0;
  const granTotal = subtotalProductos + conEnvío;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-8 pb-32 pt-32 text-center font-sans">
        <MaterialSymbol className="mb-4 text-6xl text-zinc-600">
          shopping_cart
        </MaterialSymbol>
        <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-[#e2e2e2]">
          Tu Carrito está vacío
        </h1>
        <p className="mt-3 text-zinc-500">
          Explorá el catálogo y agregá instrumentos antes de finalizar tu
          compra.
        </p>
        <Link
          to="/catalogo"
          className="mt-8 inline-flex bg-[#ba203f] px-8 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-white hover:brightness-110"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-8 pb-24 pt-32 font-sans">
      <div className="mb-12 flex flex-col gap-2">
        <h1 className="text-5xl font-extrabold uppercase tracking-tighter text-[#e2e2e2]">
          Tu Carrito
        </h1>
        <p className="text-zinc-500">
          Revisá tus productos antes de finalizar la compra profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col gap-6 rounded-lg border border-zinc-800 bg-[#1a1c1c] p-6 transition-all duration-300 hover:border-zinc-500 md:flex-row"
            >
              <div className="h-40 w-full shrink-0 overflow-hidden rounded bg-zinc-900 md:w-40">
                <Link to={`/producto/${item.id}`}>
                  <img
                    src={getProductImageUrl(item)}
                    alt={item.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="flex grow flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      to={`/producto/${item.id}`}
                      className="font-sans text-2xl font-bold text-[#e2e2e2]"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm uppercase tracking-widest text-zinc-500">
                      {item.cartLine ?? item.category?.nombre}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Eliminar ${item.name}`}
                    className="text-zinc-600 hover:text-[#ba203f]"
                    onClick={() => removeItem(item.itemId)}
                  >
                    <MaterialSymbol>delete</MaterialSymbol>
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center rounded border border-zinc-800">
  <button
  type="button"
  className="border-r border-zinc-800 px-3 py-1 text-zinc-400 hover:bg-zinc-800"
  onClick={() => setQuantity(item.itemId, item.quantity - 1)}
>
  −
</button>

  <input
    type="text"
    value={item.quantity}
    className="w-14 border-r border-zinc-800 bg-transparent text-center font-bold text-[#e2e2e2] outline-none"
    onChange={(e) => {
      const value = e.target.value

      if (value === "") {
        setQuantity(item.itemId, 1)
        return
      }

      if (!/^\d+$/.test(value)) return

      const cantidad = Math.max(
        1,
        Math.min(Number(value), item.stock)
      )

      setQuantity(item.itemId, cantidad)
    }}
  />

  <button
    type="button"
    disabled={item.quantity >= item.stock}
    className={`px-3 py-1
      ${
        item.quantity >= item.stock
          ? "cursor-not-allowed opacity-50 text-zinc-500"
          : "text-zinc-400 hover:bg-zinc-800"
      }`}
    onClick={() =>
      setQuantity(item.itemId, Math.min(item.quantity + 1, item.stock))
    }
  >
    +
  </button>
</div>
                  <span className="font-sans text-2xl font-bold text-[#e2e2e2]">
                    $
{(
  (item.discount > 0 ? item.discountedPrice : item.price)
  * item.quantity
).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky top-32 lg:col-span-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="mb-8 border-b border-zinc-800 pb-4 font-sans text-2xl font-bold uppercase tracking-widest text-[#e2e2e2]">
              Resumen
            </h2>
            <div className="mb-8 space-y-4">
              <div className="flex justify-between text-zinc-400">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Subtotal
                </span>
                <span className="text-sm font-semibold text-[#e2e2e2] tabular-nums">
                  ${subtotalProductos.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Envío (Asegurado)
                </span>
                <span className="text-sm font-semibold text-[#e2e2e2] tabular-nums">
                  ${conEnvío.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mb-10 flex items-end justify-between border-t border-zinc-800 pt-6">
              <span className="font-sans text-2xl font-bold uppercase text-[#e2e2e2]">
                Total
              </span>
              <span className="font-sans text-3xl font-bold text-[#ba203f] tabular-nums">
                ${granTotal.toFixed(2)}
              </span>
            </div>
            <div className="space-y-4">
              <Link to="/checkout">
                <button
                  type="button"
                  className="w-full bg-[#ba203f] py-4 font-sans text-2xl font-bold uppercase tracking-widest text-white brightness-110 transition-all duration-150 hover:brightness-125 active:scale-95"
                >
                  Ir al Checkout
                </button>
              </Link>
              <Link
                to="/catalogo"
                className={`block w-full border border-zinc-800 py-4 text-center font-sans text-sm font-semibold uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-500 hover:text-white ${""}`}
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
