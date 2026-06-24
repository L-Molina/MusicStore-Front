import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { checkout, clearCart } from "../../redux/cartSlice";
import { getProductImageUrl } from "../../utils/images";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";

import "./Checkout.css";

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

const TRANSFER_INFO = {
  titular: "MusicStore S.A.",
  banco: "Banco Demo",
  alias: "musicstore.demo",
  cbu: "0000003100010000000001",
  cuit: "30-00000000-1",
};

function money(value) {
  const number = Number(value || 0);

  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

function getItemId(item) {
  return item.itemId || item.id || item.productId || item.productoId;
}

function getItemName(item) {
  return item.name || item.nombre || item.producto?.nombre || "Producto";
}

function getBasePrice(item) {
  return Number(item.price ?? item.precio ?? item.producto?.precio ?? 0);
}

function getDiscountAmount(item) {
  const price = getBasePrice(item);

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
  const price = getBasePrice(item);
  const discountAmount = getDiscountAmount(item);

  return Math.max(price - discountAmount, 0);
}

function getLineTotal(item) {
  return getFinalUnitPrice(item) * Number(item?.quantity || 0);
}

function getCurrentUserFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function getPaymentLabel(paymentMethod) {
  const labels = {
    credito: "Tarjeta de crédito",
    debito: "Tarjeta de débito",
    transferencia: "Transferencia bancaria",
    efectivo: "Efectivo al retirar",
  };

  return labels[paymentMethod] || "Sin método";
}

function validateCard(cardForm) {
  const cardNumber = onlyNumbers(cardForm.cardNumber);
  const cvv = onlyNumbers(cardForm.cvv);
  const dni = onlyNumbers(cardForm.dni);

  if (!cardForm.cardHolder.trim()) {
    return "Ingresá el nombre del titular de la tarjeta.";
  }

  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return "Ingresá un número de tarjeta válido.";
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.expiration)) {
    return "Ingresá el vencimiento con formato MM/AA.";
  }

  if (cvv.length < 3 || cvv.length > 4) {
    return "Ingresá un CVV válido.";
  }

  if (dni.length < 7 || dni.length > 9) {
    return "Ingresá un DNI válido.";
  }

  return "";
}

function saveLocalOrder({
  items,
  subtotal,
  shipping,
  total,
  paymentMethod,
  paymentExtra,
  user,
}) {
  const order = {
    id: `MS-${Date.now()}`,
    fecha: new Date().toISOString(),
    estado: "Procesando",
    status: "Procesando",
    total,
    subtotal,
    envio: shipping.price,
    metodoEnvio: shipping.label,
    metodoPago: paymentMethod,
    metodoPagoNombre: getPaymentLabel(paymentMethod),
    estadoPago:
      paymentMethod === "transferencia"
        ? "Pendiente de acreditación"
        : paymentMethod === "efectivo"
        ? "Pendiente de pago al retirar"
        : "Pago aprobado",
    pago: paymentExtra,
    usuarioId: user?.id,
    usuarioMail: user?.mail || user?.email,
    usuario: user
      ? {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          mail: user.mail || user.email,
          email: user.email || user.mail,
        }
      : null,
    items: items.map((item) => ({
      id: item.id || item.productId || item.productoId,
      productoId: item.id || item.productId || item.productoId,
      itemId: getItemId(item),
      nombre: getItemName(item),
      name: getItemName(item),
      cantidad: Number(item.quantity || item.cantidad || 1),
      quantity: Number(item.quantity || item.cantidad || 1),
      precioUnitario: getFinalUnitPrice(item),
      precioOriginal: getBasePrice(item),
      precio: getFinalUnitPrice(item),
      price: getFinalUnitPrice(item),
      descuento: getDiscountAmount(item),
      subtotal: getLineTotal(item),
      category: item.category,
      categoriaNombre:
        item.categoriaNombre ||
        item.category?.nombre ||
        item.producto?.categoria?.nombre,
      fotos: item.fotos || item.producto?.fotos || [],
      foto: item.foto || item.producto?.foto || null,
      producto: item.producto || {
        id: item.id || item.productId || item.productoId,
        nombre: getItemName(item),
        precio: getBasePrice(item),
        descuento: getDiscountAmount(item),
      },
    })),
  };

  const keys = [
    "orders",
    "compras",
    user?.id ? `orders_user_${user.id}` : null,
    user?.mail ? `orders_user_${user.mail}` : null,
    user?.email ? `orders_user_${user.email}` : null,
  ].filter(Boolean);

  keys.forEach((key) => {
    try {
      const current = JSON.parse(localStorage.getItem(key) || "[]");
      const next = Array.isArray(current) ? [order, ...current] : [order];
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      localStorage.setItem(key, JSON.stringify([order]));
    }
  });

  return order;
}

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.cart);
  const { user: reduxUser } = useSelector((state) => state.auth);

  const user = reduxUser || getCurrentUserFromStorage();

  const [selectedPayment, setSelectedPayment] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [cardForm, setCardForm] = useState({
    cardHolder: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
    dni: "",
  });

  const [transferConfirmed, setTransferConfirmed] = useState(false);

  const [selectedShippingId, setSelectedShippingId] = useState(
    localStorage.getItem("musicstore_shipping_method") || "estandar"
  );

  const selectedShipping =
    SHIPPING_OPTIONS.find((option) => option.id === selectedShippingId) ||
    SHIPPING_OPTIONS[1];

  const subtotalProductos = items.reduce((acc, item) => {
    return acc + getLineTotal(item);
  }, 0);

  const envio = items.length > 0 ? selectedShipping.price : 0;
  const granTotal = subtotalProductos + envio;

  const paymentMethods = [
    {
      id: "credito",
      title: "Tarjeta de crédito",
      icon: "credit_card",
      description: "Completá los datos de la tarjeta para simular el pago.",
    },
    {
      id: "debito",
      title: "Tarjeta de débito",
      icon: "payment_card",
      description: "Completá los datos de la tarjeta para simular el pago.",
    },
    {
      id: "transferencia",
      title: "Transferencia bancaria",
      icon: "account_balance",
      description: "Te mostramos los datos para realizar la transferencia.",
    },
    {
      id: "efectivo",
      title: "Efectivo al retirar en tienda",
      icon: "attach_money",
      description: "Pagás al momento de retirar el pedido.",
    },
  ];

  const isCardPayment =
    selectedPayment === "credito" || selectedPayment === "debito";

  function updateShipping(optionId) {
    localStorage.setItem("musicstore_shipping_method", optionId);
    setSelectedShippingId(optionId);
  }

  function handlePaymentChange(methodId) {
    setSelectedPayment(methodId);
    setPaymentError("");
  }

  function getPaymentExtra() {
    if (isCardPayment) {
      const cleanNumber = onlyNumbers(cardForm.cardNumber);

      return {
        tipo: getPaymentLabel(selectedPayment),
        tarjetaTerminadaEn: cleanNumber.slice(-4),
        titular: cardForm.cardHolder,
        dni: cardForm.dni,
        simulado: true,
      };
    }

    if (selectedPayment === "transferencia") {
      return {
        tipo: "Transferencia bancaria",
        datosTransferencia: TRANSFER_INFO,
        comprobantePendiente: true,
      };
    }

    if (selectedPayment === "efectivo") {
      return {
        tipo: "Efectivo",
        pagoAlRetirar: true,
      };
    }

    return null;
  }

  function validatePayment() {
    if (!selectedPayment) {
      return "Seleccioná un método de pago.";
    }

    if (isCardPayment) {
      return validateCard(cardForm);
    }

    if (selectedPayment === "transferencia" && !transferConfirmed) {
      return "Confirmá que vas a realizar la transferencia bancaria.";
    }

    return "";
  }

  async function handleCheckout() {
    if (items.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const error = validatePayment();

    if (error) {
      setPaymentError(error);
      return;
    }

    try {
      setProcessing(true);
      setPaymentError("");

      const order = saveLocalOrder({
        items,
        subtotal: subtotalProductos,
        shipping: selectedShipping,
        total: granTotal,
        paymentMethod: selectedPayment,
        paymentExtra: getPaymentExtra(),
        user,
      });

      try {
        await dispatch(checkout()).unwrap();
      } catch (error) {
        console.error(
          "El checkout del backend falló, pero el pedido se guardó localmente:",
          error
        );

        dispatch(clearCart());
      }

      navigate("/compra-exitosa", { state: { order } });
    } catch (err) {
      console.error("Error checkout:", err);
      alert("No se pudo finalizar la compra.");
    } finally {
      setProcessing(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-8 pb-24 pt-32 text-center font-sans">
        <MaterialSymbol className="mb-4 text-6xl text-zinc-600">
          shopping_cart
        </MaterialSymbol>

        <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-[#e2e2e2]">
          No hay productos para pagar
        </h1>

        <p className="mt-3 text-zinc-500">
          Agregá productos al carrito antes de finalizar la compra.
        </p>

        <button
          onClick={() => navigate("/catalogo")}
          className="mt-8 bg-[#ba203f] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white hover:brightness-110"
        >
          Ir al catálogo
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-8 pb-24 pt-32 font-sans">
      <div className="mb-12 flex flex-col gap-2">
        <h1 className="text-5xl font-extrabold uppercase tracking-tighter text-[#e2e2e2]">
          Checkout
        </h1>

        <p className="text-zinc-500">
          Elegí cómo querés pagar y recibir tu compra.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide text-[#e2e2e2]">
              Método de pago
            </h2>

            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const isSelected = selectedPayment === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => handlePaymentChange(method.id)}
                    className={`group relative flex w-full flex-col gap-4 rounded-lg border p-6 text-left transition-all duration-300 md:flex-row ${
                      isSelected
                        ? "border-[#ba203f] bg-[#242628]"
                        : "border-zinc-800 bg-[#1a1c1c] hover:border-zinc-500"
                    }`}
                  >
                    <div className="flex items-center justify-center rounded bg-zinc-900 p-4 text-white">
                      <MaterialSymbol>{method.icon}</MaterialSymbol>
                    </div>

                    <div className="flex grow flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <span className="font-sans text-2xl font-bold text-[#e2e2e2]">
                          {method.title}
                        </span>

                        <p className="mt-1 text-sm text-zinc-500">
                          {method.description}
                        </p>
                      </div>

                      <div
                        className={`size-6 rounded-full border-2 transition-all ${
                          isSelected
                            ? "border-[#ba203f] bg-[#ba203f]"
                            : "border-zinc-500"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {paymentError && (
              <div className="mt-4 rounded-lg border border-[#ba203f]/40 bg-[#ba203f]/10 px-4 py-3 text-sm text-red-100">
                {paymentError}
              </div>
            )}

            <PaymentDetails
              selectedPayment={selectedPayment}
              cardForm={cardForm}
              setCardForm={setCardForm}
              transferConfirmed={transferConfirmed}
              setTransferConfirmed={setTransferConfirmed}
            />
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide text-[#e2e2e2]">
              Método de entrega
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {SHIPPING_OPTIONS.map((option) => {
                const isSelected = selectedShipping.id === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateShipping(option.id)}
                    className={`rounded-lg border p-5 text-left transition ${
                      isSelected
                        ? "border-[#ba203f] bg-[#ba203f]/10"
                        : "border-zinc-800 bg-[#1a1c1c] hover:border-zinc-500"
                    }`}
                  >
                    <p className="font-bold text-[#e2e2e2]">{option.label}</p>

                    <p className="mt-2 text-sm text-zinc-500">
                      {option.description}
                    </p>

                    <p className="mt-4 text-xl font-bold text-[#ba203f]">
                      {money(option.price)}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:col-span-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="mb-8 border-b border-zinc-800 pb-4 font-sans text-2xl font-bold uppercase tracking-widest text-[#e2e2e2]">
              Resumen
            </h2>

            <div className="mb-8 max-h-[420px] space-y-4 overflow-y-auto pr-2">
              {items.map((item) => {
                const itemId = getItemId(item);
                const itemName = getItemName(item);
                const unitPrice = getFinalUnitPrice(item);
                const lineTotal = getLineTotal(item);

                return (
                  <div
                    key={itemId}
                    className="flex gap-4 rounded-lg border border-zinc-800 bg-[#1a1c1c] p-4"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-zinc-900">
                      <img
                        src={getProductImageUrl(item)}
                        alt={itemName}
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 grow flex-col justify-between">
                      <div>
                        <p className="line-clamp-2 font-sans text-sm font-bold text-[#e2e2e2]">
                          {itemName}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
                          {item.cartLine ??
                            item.category?.nombre ??
                            item.category ??
                            item.categoriaNombre ??
                            item.producto?.categoria?.nombre ??
                            "Sin categoría"}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          x{item.quantity}
                        </span>

                        <div className="text-right">
                          <span className="font-sans text-sm font-bold text-[#e2e2e2]">
                            {money(lineTotal)}
                          </span>

                          <p className="text-[10px] text-zinc-500">
                            {money(unitPrice)} c/u
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-8 space-y-4">
              <div className="flex justify-between text-zinc-400">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Subtotal
                </span>

                <span className="text-sm font-semibold text-[#e2e2e2] tabular-nums">
                  {money(subtotalProductos)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Envío
                </span>

                <span className="text-sm font-semibold text-[#e2e2e2] tabular-nums">
                  {money(envio)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Pago
                </span>

                <span className="text-right text-sm font-semibold text-[#e2e2e2]">
                  {selectedPayment
                    ? getPaymentLabel(selectedPayment)
                    : "Sin seleccionar"}
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

            <button
              type="button"
              disabled={!selectedPayment || loading || processing}
              onClick={handleCheckout}
              className="w-full bg-[#ba203f] py-4 font-sans text-2xl font-bold uppercase tracking-widest text-white brightness-110 transition-all duration-150 hover:brightness-125 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading || processing ? "Procesando..." : "Finalizar compra"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function PaymentDetails({
  selectedPayment,
  cardForm,
  setCardForm,
  transferConfirmed,
  setTransferConfirmed,
}) {
  if (!selectedPayment) return null;

  if (selectedPayment === "credito" || selectedPayment === "debito") {
    return (
      <div className="mt-6 rounded-lg border border-zinc-800 bg-[#1a1c1c] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded bg-zinc-900 p-3 text-white">
            <MaterialSymbol>credit_card</MaterialSymbol>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#e2e2e2]">
              Datos de la tarjeta
            </h3>
            <p className="text-sm text-zinc-500">
              Pago simulado para la entrega. No se guardan datos sensibles.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
            Titular de la tarjeta
            <input
              value={cardForm.cardHolder}
              onChange={(e) =>
                setCardForm({ ...cardForm, cardHolder: e.target.value })
              }
              placeholder="Nombre como figura en la tarjeta"
              className="rounded-md border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
            Número de tarjeta
            <input
              value={cardForm.cardNumber}
              onChange={(e) =>
                setCardForm({
                  ...cardForm,
                  cardNumber: e.target.value
                    .replace(/[^\d\s]/g, "")
                    .replace(/(.{4})/g, "$1 ")
                    .trim(),
                })
              }
              placeholder="0000 0000 0000 0000"
              maxLength="23"
              className="rounded-md border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Vencimiento
            <input
              value={cardForm.expiration}
              onChange={(e) => {
                let value = e.target.value.replace(/[^\d]/g, "");

                if (value.length > 2) {
                  value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                }

                setCardForm({
                  ...cardForm,
                  expiration: value.slice(0, 5),
                });
              }}
              placeholder="MM/AA"
              maxLength="5"
              className="rounded-md border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            CVV
            <input
              value={cardForm.cvv}
              onChange={(e) =>
                setCardForm({
                  ...cardForm,
                  cvv: onlyNumbers(e.target.value).slice(0, 4),
                })
              }
              placeholder="123"
              maxLength="4"
              className="rounded-md border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
            DNI del titular
            <input
              value={cardForm.dni}
              onChange={(e) =>
                setCardForm({
                  ...cardForm,
                  dni: onlyNumbers(e.target.value).slice(0, 9),
                })
              }
              placeholder="12345678"
              className="rounded-md border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>
        </div>
      </div>
    );
  }

  if (selectedPayment === "transferencia") {
    return (
      <div className="mt-6 rounded-lg border border-zinc-800 bg-[#1a1c1c] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded bg-zinc-900 p-3 text-white">
            <MaterialSymbol>account_balance</MaterialSymbol>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#e2e2e2]">
              Datos para transferir
            </h3>
            <p className="text-sm text-zinc-500">
              El pedido queda pendiente hasta acreditar el pago.
            </p>
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-zinc-800 bg-black/40 p-4 text-sm">
          <PaymentInfoRow label="Titular" value={TRANSFER_INFO.titular} />
          <PaymentInfoRow label="Banco" value={TRANSFER_INFO.banco} />
          <PaymentInfoRow label="Alias" value={TRANSFER_INFO.alias} />
          <PaymentInfoRow label="CBU" value={TRANSFER_INFO.cbu} />
          <PaymentInfoRow label="CUIT" value={TRANSFER_INFO.cuit} />
        </div>

        <label className="mt-5 flex items-start gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={transferConfirmed}
            onChange={(e) => setTransferConfirmed(e.target.checked)}
            className="mt-1"
          />
          Confirmo que voy a realizar la transferencia con los datos indicados.
        </label>
      </div>
    );
  }

  if (selectedPayment === "efectivo") {
    return (
      <div className="mt-6 rounded-lg border border-zinc-800 bg-[#1a1c1c] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded bg-zinc-900 p-3 text-white">
            <MaterialSymbol>attach_money</MaterialSymbol>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#e2e2e2]">
              Pago en efectivo
            </h3>
            <p className="text-sm text-zinc-500">
              Vas a pagar el pedido cuando lo retires en la tienda.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          Recordá acercarte con tu número de pedido y el monto exacto o medio de
          pago disponible en caja.
        </div>
      </div>
    );
  }

  return null;
}

function PaymentInfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-zinc-800 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </span>

      <span className="font-mono text-[#e2e2e2]">{value}</span>
    </div>
  );
}