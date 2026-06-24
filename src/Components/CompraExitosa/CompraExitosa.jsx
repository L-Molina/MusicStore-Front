import { CheckCircle, ClipboardList, Package, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { getProductImageUrl } from "../../utils/images";

function money(value) {
  const number = Number(value || 0);

  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  if (!date) return "Sin fecha";

  try {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

function getLastOrderFromStorage(user) {
  const possibleKeys = [
    user?.id ? `orders_user_${user.id}` : null,
    user?.mail ? `orders_user_${user.mail}` : null,
    user?.email ? `orders_user_${user.email}` : null,
    "orders",
    "compras",
  ].filter(Boolean);

  for (const key of possibleKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    } catch {
      // Ignoramos claves inválidas
    }
  }

  return null;
}

function getOrderItems(order) {
  return (
    order?.items ||
    order?.productos ||
    order?.detalles ||
    order?.detallePedidos ||
    []
  );
}

function getItemName(item) {
  return item.nombre || item.name || item.producto?.nombre || "Producto";
}

function getItemQuantity(item) {
  return Number(item.cantidad || item.quantity || 1);
}

function getEstimatedDeliveryDate(order) {
  const base = order?.fecha ? new Date(order.fecha) : new Date();

  const method = String(order?.metodoEnvio || "").toLowerCase();

  if (method.includes("retiro")) {
    base.setDate(base.getDate() + 1);
  } else if (method.includes("express")) {
    base.setDate(base.getDate() + 2);
  } else {
    base.setDate(base.getDate() + 5);
  }

  return base;
}

export default function CompraExitosa() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const order = location.state?.order || getLastOrderFromStorage(user);

  if (!order) {
    return <Navigate to="/catalogo" replace />;
  }

  const items = getOrderItems(order);
  const estimatedDelivery = getEstimatedDeliveryDate(order);

  const firstItem = items[0];

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white lg:px-16">
      <section className="mx-auto max-w-5xl text-center">
        <div className="mx-auto mb-8 flex h-36 w-36 items-center justify-center overflow-hidden bg-white">
          {firstItem ? (
            <img
              src={getProductImageUrl(firstItem)}
              alt={getItemName(firstItem)}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package size={56} className="text-zinc-700" />
          )}
        </div>

        <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#ba203f]">
          <CheckCircle size={30} className="text-white" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          ¡Gracias por tu compra, {user?.nombre || "cliente"}!
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
          Tu pedido ha sido procesado con éxito y ya quedó registrado en
          MusicStore.
        </p>
      </section>

      <section className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-zinc-900/80 p-6">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-200">
            <ClipboardList size={16} />
            Información del pedido
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Número de pedido
              </p>
              <p className="mt-1 text-2xl font-extrabold text-white">
                #{order.id}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Fecha de compra
              </p>
              <p className="mt-1 text-white">{formatDate(order.fecha)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Fecha estimada de entrega
              </p>
              <p className="mt-1 text-white">
                {formatDate(estimatedDelivery)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Método de entrega
              </p>
              <p className="mt-1 text-white">
                {order.metodoEnvio || "Envío estándar"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Estado del pago
              </p>
              <p className="mt-1 text-white">
                {order.estadoPago || "Pago aprobado"}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-white/10 bg-zinc-900/80 p-6">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-200">
            <ShoppingBag size={16} />
            Resumen de artículos
          </h2>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.id || item.productoId || index}`}
                className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-white">
                    {getItemName(item)}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Cantidad: x{getItemQuantity(item)}
                  </p>
                </div>

                <p className="text-sm font-semibold text-zinc-300">
                  {money(item.subtotal || item.precioUnitario * getItemQuantity(item))}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span>{money(order.subtotal)}</span>
            </div>

            <div className="mt-3 flex justify-between text-sm text-zinc-400">
              <span>Envío</span>
              <span>{money(order.envio)}</span>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <span className="text-sm font-bold uppercase tracking-widest text-white">
                Total
              </span>
              <span className="text-3xl font-extrabold text-white">
                {money(order.total)}
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto mt-10 flex max-w-5xl flex-col justify-center gap-4 sm:flex-row">
        <Link
          to="/perfil"
          className="bg-[#ba203f] px-10 py-4 text-center text-sm font-bold uppercase tracking-widest text-white transition hover:bg-red-700"
        >
          Ver pedido
        </Link>

        <Link
          to="/catalogo"
          className="border border-white/15 px-10 py-4 text-center text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white/10"
        >
          Volver a la tienda
        </Link>
      </section>
    </main>
  );
}