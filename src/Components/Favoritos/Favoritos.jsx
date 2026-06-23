import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesProvider";
import { useCart } from "../../hooks/useCart";
import { getProductImageUrl } from "../../utils/images";

export default function Favoritos() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addItem } = useCart();

  return (
    <main className="min-h-screen bg-black px-8 py-12 text-white">
      <section className="mx-auto max-w-screen-xl">
        <h1 className="mb-2 text-4xl font-bold">Mis favoritos</h1>
        <p className="mb-8 text-sm uppercase tracking-[0.2em] text-zinc-500">
          {favorites.length} productos guardados
        </p>

        {favorites.length === 0 ? (
          <div className="border border-[#333] bg-[#1A1A1A] p-8">
            <p className="mb-4 text-zinc-400">
              Todavía no agregaste productos a favoritos.
            </p>

            <Link
              to="/catalogo"
              className="inline-block bg-[#ba203f] px-5 py-3 text-sm font-bold uppercase text-white hover:bg-[#d4284b]"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((product) => (
              <article
                key={product.id}
                className="border border-[#333] bg-[#1A1A1A] p-4"
              >
                <img
                  src={getProductImageUrl(product)}
                  alt={product.name}
                  className="mb-4 h-56 w-full object-cover bg-black"
                />

                <h2 className="mb-2 font-bold">{product.name}</h2>

                <p className="mb-4 text-zinc-400">
                  ${Number(product.price ?? 0).toFixed(2)}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => addItem(product)}
                    className="bg-[#ba203f] px-4 py-2 text-sm font-bold text-white"
                  >
                    Agregar al carrito
                  </button>

                  <button
                    onClick={() => toggleFavorite(product)}
                    className="border border-[#555] px-4 py-2 text-sm text-white"
                  >
                    Quitar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}