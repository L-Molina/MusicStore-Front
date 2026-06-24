import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart.js";
import { getProductImageUrl } from "../../utils/images";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";

const SHIPPING_OPTIONS = [
  {
    id: "retiro",
    label: "Retiro en tienda",
    description: "Sin costo de envío",
    price: 0,
  },
  {
    id: "estandar",
    label: "Envío estándar",
    description: "Entrega estimada 3 a 5 días hábiles",
    price: 2500,
  },
  {
    id: "express",
    label: "Envío express",
    description: "Entrega estimada 24 a 48 hs",
    price: 4500,
  },
];

function money(value) {
  const number = Number(value || 0);

  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getDiscountAmount(item) {
  const price = Number(item?.price || 0);

  if (!price) return 0;

  if (item?.discountAmount !== undefined) {
    return Math.min(Number(item.discountAmount || 0), price);
  }

  if (item?.descuento !== undefined) {
    return Math.min(Number(item.descuento || 0), price);
  }

  if (item?.discountedPrice !== undefined) {
    const discounted = Number(item.discountedPrice || 0);
    if (discounted >= 0 && discounted < price) {
      return price - discounted;
    }
  }

  const discountPercent = Number(item?.discount || 0);

  if (discountPercent > 0 && discountPercent <= 100) {
    return Math.min((price * discountPercent) / 100, price);
  }

  return 0;
}

function getFinalUnitPrice(item) {
  const price = Number(item?.price || 0);
  const discountAmount = getDiscountAmount(item);

  return Math.max(price - discountAmount, 0);
}

function getLineTotal(item) {
  return getFinalUnitPrice(item) * Number(item?.quantity || 0);
}

export default function Carrito() {
  const { isAuthenticated } = useAuth();
  const { items, removeItem, setQuantity } = useCart();

  const selectedShippingId =
    localStorage.getItem("musicstore_shipping_method") || "estandar";

  const selectedShipping =
    SHIPPING_OPTIONS.find((option) => option.id === selectedShippingId) ||
    SHIPPING_OPTIONS[1];

  const subtotalProductos = items.reduce(
    (acc, item) => acc + getLineTotal(item),
    0
  );

  const envio = items.length > 0 ? selectedShipping.price : 0;
  const granTotal = subtotalProductos + envio;

  function updateShipping(methodId) {
    localStorage.setItem("musicstore_shipping_method", methodId);
    window.location.reload();
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-8 pb-32 pt-32 text-center font-sans">
        <MaterialSymbol className="mb-4 text-6xl text-zinc-600">
          shopping_cart
        </MaterialSymbol>

        <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-[#e2e2e2]">
          Tu carrito está vacío
        </h1>

        {isAuthenticated ? (
          <p className="mt-3 text-zinc-500">
            Explorá el catálogo y agregá productos antes de finalizar tu compra.
          </p>
        ) : (
          <p className="mt-3 text-zinc-500">
            Iniciá sesión para empezar a llenar tu carrito.
          </p>
        )}

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
          Tu carrito
        </h1>
        <p className="text-zinc-500">
          Revisá tus productos antes de finalizar la compra.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {items.map((item) => {
            const unitPrice = getFinalUnitPrice(item);
            const discountAmount = getDiscountAmount(item);
            const lineTotal = getLineTotal(item);
            const hasDiscount = discountAmount > 0;

            return (
              <div
                key={item.itemId || item.id}
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
                        {item.cartLine ?? item.category?.nombre ?? item.category}
                      </p>

                      {hasDiscount && (
                        <p className="mt-2 text-sm text-[#ba203f]">
                          Ahorrás {money(discountAmount)} por unidad
                        </p>
                      )}
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
                          const value = e.target.value;

                          if (value === "") {
                            setQuantity(item.itemId, 1);
                            return;
                          }

                          if (!/^\d+$/.test(value)) return;

                          const cantidad = Math.max(
                            1,
                            Math.min(Number(value), item.stock)
                          );

                          setQuantity(item.itemId, cantidad);
                        }}
                      />

                      <button
                        type="button"
                        disabled={item.quantity >= item.stock}
                        className={`px-3 py-1 ${
                          item.quantity >= item.stock
                            ? "cursor-not-allowed text-zinc-500 opacity-50"
                            : "text-zinc-400 hover:bg-zinc-800"
                        }`}
                        onClick={() =>
                          setQuantity(
                            item.itemId,
                            Math.min(item.quantity + 1, item.stock)
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-sans text-2xl font-bold text-[#e2e2e2]">
                        {money(lineTotal)}
                      </span>

                      {hasDiscount && (
                        <p className="text-sm text-zinc-500">
                          {money(unitPrice)} c/u
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
                  {money(subtotalProductos)}
                </span>
              </div>

              <div className="space-y-3 rounded-lg border border-zinc-800 bg-black/30 p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                  Método de entrega
                </p>

                {SHIPPING_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateShipping(option.id)}
                    className={`w-full rounded-md border p-3 text-left transition ${
                      selectedShipping.id === option.id
                        ? "border-[#ba203f] bg-[#ba203f]/10"
                        : "border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex justify-between gap-4">
                      <span className="font-semibold text-[#e2e2e2]">
                        {option.label}
                      </span>
                      <span className="font-semibold text-[#e2e2e2]">
                        {money(option.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-zinc-400">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Envío
                </span>
                <span className="text-sm font-semibold text-[#e2e2e2] tabular-nums">
                  {money(envio)}
                </span>
              </div>
            </div>

            <div className="mb-10 flex items-end justify-between border-t border-zinc-800 pt-6">
              <span className="font-sans text-2xl font-bold uppercase text-[#e2e2e2]">
                Total
              </span>
              <span className="font-sans text-3xl font-bold text-[#ba203f] tabular-nums">
                {money(granTotal)}
              </span>
            </div>

            <div className="space-y-4">
              <Link to="/checkout">
                <button
                  type="button"
                  className="w-full bg-[#ba203f] py-4 font-sans text-2xl font-bold uppercase tracking-widest text-white brightness-110 transition-all duration-150 hover:brightness-125 active:scale-95"
                >
                  Ir al checkout
                </button>
              </Link>

              <Link
                to="/catalogo"
                className="block w-full border border-zinc-800 py-4 text-center font-sans text-sm font-semibold uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-500 hover:text-white"
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