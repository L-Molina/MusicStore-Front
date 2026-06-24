import { Link } from "react-router-dom";
import { RELATED_SUGGESTIONS } from "../../data/products.js";
import { formatPriceEUR } from "../../utils/formatPrice.js";
import { useCart } from "../../hooks/useCart.js";
import { useAuth } from "../../context/AuthContext.jsx";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";

const SHIPPING = 25;

export default function Carrito() {
  const { items, total, removeItem, setQuantity, addItem } = useCart();
  const { isAuthenticated } = useAuth();
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
          to={isAuthenticated ? "/catalogo" : "/login"}
          className="mt-8 inline-flex bg-[#ba203f] px-8 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-white hover:brightness-110"
        >
          {isAuthenticated ? "Ir al catálogo" : "Iniciar sesión"}
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
                      {item.cartLine ?? item.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Eliminar ${item.name}`}
                    className="text-zinc-600 hover:text-[#ba203f]"
                    onClick={() => removeItem(item.id)}
                  >
                    <MaterialSymbol>delete</MaterialSymbol>
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center rounded border border-zinc-800">
                    <button
                      type="button"
                      className="border-r border-zinc-800 px-3 py-1 text-zinc-400 hover:bg-zinc-800"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="border-r border-zinc-800 px-4 py-1 font-bold text-[#e2e2e2]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1 text-zinc-400 hover:bg-zinc-800"
                      onClick={() => addItem(item, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-sans text-2xl font-bold text-[#e2e2e2]">
                    {formatPriceEUR(item.price * item.quantity)}
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
                  {formatPriceEUR(subtotalProductos)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Envío (Asegurado)
                </span>
                <span className="text-sm font-semibold text-[#e2e2e2] tabular-nums">
                  {formatPriceEUR(conEnvío)}
                </span>
              </div>
            </div>
            <div className="mb-10 flex items-end justify-between border-t border-zinc-800 pt-6">
              <span className="font-sans text-2xl font-bold uppercase text-[#e2e2e2]">
                Total
              </span>
              <span className="font-sans text-3xl font-bold text-[#ba203f] tabular-nums">
                {formatPriceEUR(granTotal)}
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
            <div className="mt-8 border-t border-zinc-800 pt-8">
              <div className="mb-4 flex items-center gap-3 text-zinc-500">
                <MaterialSymbol className="text-sm">lock</MaterialSymbol>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Pago seguro encriptado
                </span>
              </div>
              <div className="flex gap-4 opacity-50 grayscale transition-all hover:grayscale-0">
                <MaterialSymbol>credit_card</MaterialSymbol>
                <MaterialSymbol>account_balance</MaterialSymbol>
                <MaterialSymbol>payments</MaterialSymbol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="mb-8 font-sans text-2xl font-bold uppercase tracking-widest text-[#e2e2e2]">
          También te podría interesar
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {RELATED_SUGGESTIONS.map((s) => (
            <div key={s.id} className="group cursor-pointer">
              <Link to="/catalogo" className="block">
                <div className="mb-4 aspect-square overflow-hidden rounded bg-zinc-900">
                  <img
                    alt={s.name}
                    className="size-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    src={s.image}
                  />
                </div>
                <p className="font-sans text-sm font-semibold text-[#e2e2e2]">
                  {s.name}
                </p>
                <p className="font-sans font-bold text-[#ba203f]">
                  {formatPriceEUR(s.price)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
