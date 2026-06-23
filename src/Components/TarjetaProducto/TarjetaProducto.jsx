import { Link } from "react-router-dom";
import "./TarjetaProducto.css";
import { getProductImageUrl } from "../../utils/images";
import { useFavorites } from "../../context/FavoritesProvider";

export default function TarjetaProducto({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const price = Number(product.price ?? 0);
  const discount = Number(product.discount ?? 0);

  const discountedPrice =
    discount > 0 ? price * (1 - discount / 100) : price;

  const fav = isFavorite(product.id);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product);
        }}
        className="favorite-btn absolute right-4 top-4 z-10 text-2xl"
        title="Agregar a favoritos"
      >
        {fav ? "❤️" : "🤍"}
      </button>

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
        </div>

        <h3 className="mb-1 font-sans text-sm font-semibold text-white md:text-base group-hover:text-[#ba203f]">
          {product.name}
        </h3>

        {product.catalogSubtitle && (
          <p className="mb-4 text-xs text-gray-500">
            {product.catalogSubtitle}
          </p>
        )}

        <div className="mt-auto border-t border-[#222] pt-3">
          <div className="flex h-[48px] flex-col justify-start">
            <span className="font-sans font-bold text-white">
              ${(discount > 0 ? discountedPrice : price).toFixed(2)}
            </span>

            {discount > 0 && (
              <span className="text-gray-400 line-through opacity-70">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}