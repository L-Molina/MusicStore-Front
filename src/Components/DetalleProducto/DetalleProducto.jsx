import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { addCartItem } from "../../redux/cartSlice";
import { fetchProductById } from "../../redux/productDetailSlice";
import { getProductImageUrl } from "../../utils/images";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";

import "./DetalleProducto.css";

function money(value) {
  const number = Number(value || 0);

  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function normalizeProduct(product) {
  if (!product) return null;

  const price = Number(product.price ?? product.precio ?? 0);
  const discountAmount = Math.min(
    Number(product.discountAmount ?? product.descuento ?? 0),
    price
  );
  const finalPrice = Math.max(price - discountAmount, 0);
  const discountPercent =
    price > 0 && discountAmount > 0
      ? Math.round((discountAmount / price) * 100)
      : 0;

  return {
    ...product,
    id: product.id,
    name: product.name ?? product.nombre ?? "Producto",
    nombre: product.nombre ?? product.name ?? "Producto",
    description: product.description ?? product.descripcion ?? "",
    descripcion: product.descripcion ?? product.description ?? "",
    price,
    precio: price,
    discountedPrice: finalPrice,
    discountAmount,
    discountPercent,
    discount: discountPercent,
    descuento: discountAmount,
    stock: Number(product.stock || 0),
    category:
      product.category ??
      product.categoria?.nombre ??
      product.categoriaNombre ??
      "Sin categoría",
    categoryId: product.categoryId ?? product.categoria?.id,
    fotos: product.fotos || [],
    fotosIds: product.fotosIds || [],
  };
}

function getDiscountAmount(product) {
  const price = Number(product?.price || product?.precio || 0);
  const discount = Number(product?.discountAmount ?? product?.descuento ?? 0);

  if (!price || !discount || discount < 0) return 0;

  return Math.min(discount, price);
}

function getDiscountPercent(product) {
  const price = Number(product?.price || product?.precio || 0);
  const discountAmount = getDiscountAmount(product);

  if (!price || !discountAmount) return 0;

  return Math.round((discountAmount / price) * 100);
}

function getFinalPrice(product) {
  const price = Number(product?.price || product?.precio || 0);
  const discountAmount = getDiscountAmount(product);

  return Math.max(price - discountAmount, 0);
}

export default function DetalleProducto() {
  const dispatch = useDispatch();

  const { id } = useParams();
  const productId = Number(id);

  const { token } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const {
    product: rawProduct,
    loading,
    error,
  } = useSelector((state) => state.productDetail);

  const isAuthenticated = !!token;
  const product = normalizeProduct(rawProduct);

  const [qty, setQty] = useState("1");

  const productInCart = items.find((item) => {
    const itemProductId = item.id || item.productId || item.productoId;
    return String(itemProductId) === String(product?.id);
  });

  const quantityInCart = Number(productInCart?.quantity || 0);
  const stockDisponible = Math.max(Number(product?.stock || 0) - quantityInCart, 0);

  const outOfStock = stockDisponible <= 0;
  const disabledCart = outOfStock || !isAuthenticated;

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
  }, [stockDisponible, qty]);

  if (loading) {
    return <div className="p-10 text-white">Cargando...</div>;
  }

  if (error) {
    return <div className="p-10 text-white">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-10 text-white">Producto no encontrado</div>;
  }

  const discountAmount = getDiscountAmount(product);
  const discountPercent = getDiscountPercent(product);
  const finalPrice = getFinalPrice(product);
  const hasDiscount = discountAmount > 0;

  function handleAddToCart() {
    if (disabledCart) return;

    const safeQuantity = Math.min(
      Math.max(Number(qty || 1), 1),
      stockDisponible
    );

    dispatch(
      addCartItem({
        product: {
          ...product,
          price: product.price,
          discountedPrice: finalPrice,
          discount: discountPercent,
          discountAmount,
          descuento: discountAmount,
        },
        quantity: safeQuantity,
      })
    );
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
                      {money(finalPrice)}
                    </span>

                    <span className="rounded-md bg-[#ba203f] px-3 py-1 text-sm font-bold text-white shadow-md">
                      {discountPercent}% OFF
                    </span>
                  </div>

                  <span className="text-gray-400 line-through opacity-70">
                    {money(product.price)}
                  </span>

                  <span className="mt-1 text-sm text-[#c8c6c5]">
                    Ahorrás {money(discountAmount)}
                  </span>
                </div>
              ) : (
                <span className="text-[32px] font-bold text-[#ba203f]">
                  {money(product.price)}
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
                    disabled={disabledCart}
                    onClick={() =>
                      setQty((q) => String(Math.max(Number(q || 1) - 1, 1)))
                    }
                    className={`flex flex-1 items-center justify-center text-white ${
                      disabledCart
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-[#222222]"
                    }`}
                  >
                    <MaterialSymbol className="text-sm">remove</MaterialSymbol>
                  </button>

                  <input
                    id={`qty-${product.id}`}
                    type="text"
                    disabled={disabledCart}
                    className="w-14 bg-transparent text-center font-semibold text-white outline-none disabled:opacity-50"
                    value={qty}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "") {
                        setQty("");
                        return;
                      }

                      if (!/^\d+$/.test(value)) return;

                      setQty(
                        String(
                          Math.max(1, Math.min(Number(value), stockDisponible))
                        )
                      );
                    }}
                  />

                  <button
                    type="button"
                    disabled={disabledCart}
                    onClick={() =>
                      setQty((q) =>
                        String(Math.min(Number(q || 1) + 1, stockDisponible))
                      )
                    }
                    className={`flex flex-1 items-center justify-center text-white ${
                      disabledCart
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-[#222222]"
                    }`}
                  >
                    <MaterialSymbol className="text-sm">add</MaterialSymbol>
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={disabledCart}
                className={`mt-[22px] flex min-h-[56px] flex-[3] basis-[200px] items-center justify-center gap-2 px-8 font-semibold uppercase tracking-wide text-white transition-all active:scale-95 ${
                  disabledCart
                    ? "cursor-not-allowed bg-gray-600 opacity-60"
                    : "bg-[#ba203f] hover:bg-[#8f1a35]"
                }`}
                onClick={handleAddToCart}
              >
                <MaterialSymbol>shopping_cart</MaterialSymbol>
                {product.stock === 0 ? "Sin stock" : "Añadir al carrito"}
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
  );
}