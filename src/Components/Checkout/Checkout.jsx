import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RELATED_SUGGESTIONS } from "../../data/products.js";
import { checkoutCart } from "../../../redux/cartSlice.js";
import { formatPriceEUR } from "../../utils/formatPrice.js";
import { useCart } from "../../hooks/useCart.js";

import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";

const SHIPPING = 25;

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items, total, checkoutLoading, error } = useCart();

  const [selectedPayment, setSelectedPayment] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  async function handleCheckout() {
    if (!isAuthenticated || !user?.id) {
      setCheckoutError("Debes iniciar sesión para finalizar la compra.");
      navigate("/login");
      return;
    }

    const result = await dispatch(checkoutCart(user.id));

    if (checkoutCart.fulfilled.match(result)) {
      navigate("/");
    } else {
      setCheckoutError(result.payload || "No se pudo finalizar la compra.");
    }
  }

  const subtotalProductos = total;
  const conEnvío = items.length > 0 ? SHIPPING : 0;
  const granTotal = subtotalProductos + conEnvío;

  const paymentMethods = [
    {
      id: "credito",
      title: "Tarjeta de Crédito",
      icon: "credit_card",
    },
    {
      id: "debito",
      title: "Tarjeta de Débito",
      icon: "payment_card",
    },
    {
      id: "mercadopago",
      title: "Mercado Pago",
      icon: "handshake",
    },
    {
      id: "efectivo",
      title: "Efectivo (Retirar en el local)",
      icon: "attach_money",
    },
    {
      id: "transferencia",
      title: "Transferencia electrónica",
      icon: "account_balance",
    },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-8 pb-24 pt-32 font-sans">
      <div className="mb-12 flex flex-col gap-2">
        <h1 className="text-5xl font-extrabold uppercase tracking-tighter text-[#e2e2e2]">
          Checkout
        </h1>

        <p className="text-zinc-500">Cómo querés pagar?</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* MÉTODOS DE PAGO */}
        <div className="space-y-4 lg:col-span-8">
          {paymentMethods.map((method) => {
            const isSelected = selectedPayment === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedPayment(method.id)}
                className={`group relative flex w-full flex-col gap-4 rounded-lg border p-6 text-left transition-all duration-300 md:flex-row
                  ${
                    isSelected
                      ? "border-[#ba203f] bg-[#242628]"
                      : "border-zinc-800 bg-[#1a1c1c] hover:border-zinc-500"
                  }
                `}
              >
                <div className="flex items-center justify-center rounded bg-zinc-900 p-4">
                  <MaterialSymbol>{method.icon}</MaterialSymbol>
                </div>

                <div className="flex grow items-center justify-between gap-4">
                  <span className="font-sans text-2xl font-bold text-[#e2e2e2]">
                    {method.title}
                  </span>

                  <div
                    className={`size-6 rounded-full border-2 transition-all
                      ${
                        isSelected
                          ? "border-[#ba203f] bg-[#ba203f]"
                          : "border-zinc-500"
                      }
                    `}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* RESUMEN */}
        <div className="lg:sticky lg:top-24 lg:col-span-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="mb-8 border-b border-zinc-800 pb-4 font-sans text-2xl font-bold uppercase tracking-widest text-[#e2e2e2]">
              Resumen
            </h2>

            {/* PRODUCTOS */}
            <div className="mb-8 max-h-[420px] space-y-4 overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-zinc-800 bg-[#1a1c1c] p-4"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-zinc-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 grow flex-col justify-between">
                    <div>
                      <p className="line-clamp-2 font-sans text-sm font-bold text-[#e2e2e2]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
                        {item.cartLine ?? item.category}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        x{item.quantity}
                      </span>

                      <span className="font-sans text-sm font-bold text-[#e2e2e2]">
                        {formatPriceEUR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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

            {(checkoutError || error) && (
              <p className="mb-4 text-sm text-[#ba203f]">
                {checkoutError || error}
              </p>
            )}

            <div className="space-y-4">
              <button
                type="button"
                disabled={!selectedPayment || checkoutLoading}
                onClick={handleCheckout}
                className="w-full bg-[#ba203f] py-4 font-sans text-2xl font-bold uppercase tracking-widest text-white brightness-110 transition-all duration-150 hover:brightness-125 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutLoading ? "Procesando..." : "Finalizar compra"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUGERENCIAS */}
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
