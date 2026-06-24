import { Link } from "react-router-dom";
import { getProductImageUrl } from "../../utils/images";
import "./TarjetaProducto.css";

function money(value) {
  const number = Number(value || 0);

  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getDiscountAmount(product) {
  const price = Number(product?.price || 0);

  if (!price) return 0;

  if (product?.discountAmount !== undefined) {
    return Math.min(Number(product.discountAmount || 0), price);
  }

  if (product?.descuento !== undefined) {
    return Math.min(Number(product.descuento || 0), price);
  }

  const discountPercent = Number(product?.discount || 0);

  if (!discountPercent || discountPercent < 0) return 0;

  if (discountPercent <= 100) {
    return Math.min((price * discountPercent) / 100, price);
  }

  return 0;
}

function getDiscountPercent(product) {
  const price = Number(product?.price || 0);
  const discountAmount = getDiscountAmount(product);

  if (!price || !discountAmount) return 0;

  return Math.round((discountAmount / price) * 100);
}

function getFinalPrice(product) {
  const price = Number(product?.price || 0);
  const discountAmount = getDiscountAmount(product);

  return Math.max(price - discountAmount, 0);
}

export default function TarjetaProducto({ product }) {
  const price = Number(product.price || 0);
  const discountAmount = getDiscountAmount(product);
  const discountPercent = getDiscountPercent(product);
  const finalPrice = getFinalPrice(product);
  const hasDiscount = discountAmount > 0;

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group flex flex-col overflow-hidden border border-[#333333] bg-[#1A1A1A] p-2 transition-colors hover:border-[#555]"
    >
      <div className="relative mb-4 h-64 overflow-hidden bg-black">
        <img
          src={getProductImageUrl(product)}
          alt={product.name}
          className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-110"
        />

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded bg-[#ba203f] px-2 py-1 text-xs font-bold text-white">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      <h3 className="mb-1 font-sans text-sm font-semibold text-white group-hover:text-[#ba203f] md:text-base">
        {product.name}
      </h3>

      {product.catalogSubtitle && (
        <p className="mb-4 text-xs text-gray-500">{product.catalogSubtitle}</p>
      )}

      <div className="mt-auto border-t border-[#222] pt-3">
        <div className="flex min-h-[58px] flex-col justify-start">
          <span className="font-sans font-bold text-white">
            {money(hasDiscount ? finalPrice : price)}
          </span>

          {hasDiscount && (
            <>
              <span className="text-gray-400 line-through opacity-70">
                {money(price)}
              </span>

              <span className="text-xs text-[#ba203f]">
                Ahorrás {money(discountAmount)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}