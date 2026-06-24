import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import guitarAmpBg from "../../assets/guitar-amp-bg.jpg";
import { getProductImageUrl } from "../../utils/images";
import "./Home.css";

const API_URL = "http://localhost:8080";

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

  if (product?.discountedPrice !== undefined) {
    const discounted = Number(product.discountedPrice || 0);

    if (discounted >= 0 && discounted < price) {
      return price - discounted;
    }
  }

  const discountPercent = Number(product?.discount || 0);

  if (discountPercent > 0 && discountPercent <= 100) {
    return Math.min((price * discountPercent) / 100, price);
  }

  return 0;
}

function getFinalPrice(product) {
  const price = Number(product?.price || 0);
  const discountAmount = getDiscountAmount(product);

  return Math.max(price - discountAmount, 0);
}

function getDiscountPercent(product) {
  const price = Number(product?.price || 0);
  const discountAmount = getDiscountAmount(product);

  if (!price || !discountAmount) return 0;

  return Math.round((discountAmount / price) * 100);
}

export default function Home() {
  const [logoutMessage, setLogoutMessage] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const message = localStorage.getItem("logoutMessage");

    if (message) {
      setLogoutMessage(message);
      localStorage.removeItem("logoutMessage");

      setTimeout(() => {
        setLogoutMessage("");
      }, 3000);
    }
  }, []);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoadingProducts(true);

        const res = await fetch(`${API_URL}/productos`);

        if (!res.ok) {
          throw new Error("No se pudieron cargar los productos destacados");
        }

        const data = await res.json();

        const formatted = await Promise.all(
          data.map(async (p) => {
            let fotos = [];

            if (p.fotosIds?.length > 0) {
              try {
                const fotoRes = await fetch(`${API_URL}/fotos/${p.fotosIds[0]}`);

                if (fotoRes.ok) {
                  const fotoData = await fotoRes.json();
                  fotos = [fotoData];
                }
              } catch (error) {
                console.error("Error trayendo foto de producto:", error);
              }
            }

            const price = Number(p.precio || 0);
            const discountAmount = Math.min(Number(p.descuento || 0), price);
            const finalPrice = Math.max(price - discountAmount, 0);
            const discountPercent =
              price > 0 && discountAmount > 0
                ? Math.round((discountAmount / price) * 100)
                : 0;

            return {
              id: p.id,
              name: p.nombre,
              description: p.descripcion,
              price,
              discountedPrice: finalPrice,
              discountAmount,
              discount: discountPercent,
              descuento: discountAmount,
              stock: p.stock,
              category: p.categoria?.nombre ?? "Sin categoría",
              categoryId: p.categoria?.id,
              fotosIds: p.fotosIds,
              fotos,
            };
          })
        );

        const availableProducts = formatted.filter(
          (product) => Number(product.stock || 0) > 0
        );

        setFeaturedProducts(availableProducts.slice(0, 10));
      } catch (error) {
        console.error("Error cargando productos destacados:", error);
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  const carouselProducts =
    featuredProducts.length > 0
      ? [...featuredProducts, ...featuredProducts]
      : [];

  return (
    <>
      <div className="promo-bar">
        <div className="promo-track">
          🚚 ENVÍOS A TODO EL PAÍS • 🎸 GUITARRAS PREMIUM • 🔥 HASTA 20% OFF •
          🎧 AUDIO PROFESIONAL • 💿 VINILOS EXCLUSIVOS • 🚚 ENVÍOS A TODO EL
          PAÍS • 🎸 GUITARRAS PREMIUM • 🔥 HASTA 20% OFF • 🎧 AUDIO
          PROFESIONAL • 💿 VINILOS EXCLUSIVOS •
        </div>
      </div>

      <header className="relative flex h-[min(870px,90vh)] w-full items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            alt=""
            className="size-full object-cover opacity-60"
            src={guitarAmpBg}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-8">
          {logoutMessage && (
            <div className="mb-6 max-w-md rounded-lg border border-green-600 bg-green-900/40 px-4 py-3 text-green-300 shadow-lg">
              {logoutMessage}
            </div>
          )}

          <div className="max-w-4xl home-enter">
            <span className="mb-6 block font-sans text-lg font-semibold uppercase tracking-[0.25em] text-[#ba203f]">
              EQUIPAMIENTO DE ÉLITE
            </span>

            <h1 className="mb-8 font-sans text-6xl font-extrabold uppercase leading-none tracking-tight text-white md:text-8xl lg:text-9xl">
              LA PRECISIÓN
              <br />
              DEL SONIDO
              <br />
              PURO.
            </h1>

            <p className="mb-10 max-w-2xl font-sans text-xl leading-relaxed text-[#c8c6c5]">
              Explorá nuestra colección curada de instrumentos y herramientas
              de audio para el músico profesional contemporáneo.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="home-enter-delay bg-[#ba203f] px-10 py-5 font-sans text-base font-bold uppercase tracking-wider text-white transition-all hover:scale-105 hover:bg-[#8f1a35]"
              >
                EXPLORAR CATÁLOGO
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-black py-14 text-white">
        <div className="mx-auto mb-8 max-w-screen-2xl px-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ba203f]">
            Selección destacada
          </p>

          <h2 className="mt-2 text-4xl font-extrabold uppercase">
            Lo más buscado en MusicStore
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Descubrí instrumentos, vinilos y accesorios seleccionados para llevar tu sonido al próximo nivel.
          </p>
        </div>

        {loadingProducts ? (
          <div className="mx-auto max-w-screen-2xl px-8 py-10 text-zinc-400">
            Cargando productos destacados...
          </div>
        ) : carouselProducts.length > 0 ? (
          <div className="marquee-container">
            <div className="marquee-track">
              {carouselProducts.map((product, index) => {
                const finalPrice = getFinalPrice(product);
                const discountPercent = getDiscountPercent(product);
                const hasDiscount = discountPercent > 0;

                return (
                  <Link
                    to={`/producto/${product.id}`}
                    className="product-card"
                    key={`${product.id}-${index}`}
                  >
                    <div className="product-card-image">
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                      />

                      {hasDiscount && (
                        <span className="product-discount-badge">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-[#ba203f]">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <div className="product-card-price">
                      <p>{money(finalPrice)}</p>

                      {hasDiscount && (
                        <span>{money(product.price)}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-screen-2xl px-8 py-10 text-zinc-400">
            Todavía no hay productos disponibles para mostrar.
          </div>
        )}
      </section>
    </>
  );
}