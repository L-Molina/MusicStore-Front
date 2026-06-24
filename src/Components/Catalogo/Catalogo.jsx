import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TarjetaProducto from "../TarjetaProducto/TarjetaProducto";
import "./Catalogo.css";

function getDiscountAmount(price, discount) {
  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discount || 0);

  if (!numericPrice || !numericDiscount || numericDiscount < 0) return 0;

  // El backend guarda el descuento como MONTO, no como porcentaje.
  // Ejemplo: precio 15000, descuento 1000 => descuento real $1000.
  return Math.min(numericDiscount, numericPrice);
}

function getDiscountPercent(price, discountAmount) {
  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discountAmount || 0);

  if (!numericPrice || !numericDiscount) return 0;

  return Math.round((numericDiscount / numericPrice) * 100);
}

function getFinalPrice(price, discountAmount) {
  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discountAmount || 0);

  return Math.max(numericPrice - numericDiscount, 0);
}

export default function Catalogo() {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [appliedRange, setAppliedRange] = useState({ min: "", max: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [params, setParams] = useSearchParams();
  const catParam = params.get("cat");
  const activeCat = catParam ?? "Todos";

  const list = products
    .filter((p) => activeCat === "Todos" || p.category === activeCat)
    .filter((p) => {
      const name = (p.name || "").toLowerCase();
      const description = (p.description || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      return name.includes(term) || description.includes(term);
    })
    .filter((p) => {
      if (!onlyAvailable) return true;
      return Number(p.stock || 0) > 0;
    });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/categorias");

        if (!res.ok) {
          throw new Error("No se pudieron cargar las categorías");
        }

        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error trayendo categorías:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = "http://localhost:8080/productos";

        const min = appliedRange.min !== "" ? appliedRange.min : null;
        const max = appliedRange.max !== "" ? appliedRange.max : null;

        if (min !== null || max !== null) {
          const queryParams = new URLSearchParams();

          if (min !== null) queryParams.append("min", min);
          if (max !== null) queryParams.append("max", max);

          url = `http://localhost:8080/productos/precio?${queryParams.toString()}`;
        }

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("No se pudieron cargar los productos");
        }

        const data = await res.json();

        const formatted = await Promise.all(
          data.map(async (p) => {
            let fotos = [];

            if (p.fotosIds?.length > 0) {
              try {
                const fotoRes = await fetch(
                  `http://localhost:8080/fotos/${p.fotosIds[0]}`
                );

                if (fotoRes.ok) {
                  const fotoData = await fotoRes.json();
                  fotos = [fotoData];
                }
              } catch (error) {
                console.error("Error trayendo foto:", error);
              }
            }

            const price = Number(p.precio || 0);
            const discountAmount = getDiscountAmount(price, p.descuento);
            const discountPercent = getDiscountPercent(price, discountAmount);
            const finalPrice = getFinalPrice(price, discountAmount);

            return {
              id: p.id,
              name: p.nombre,
              description: p.descripcion,
              price,
              discountedPrice: finalPrice,

              // Para que TarjetaProducto muestre bien el porcentaje.
              discount: discountPercent,

              // Dejamos también el monto por si otro componente lo necesita.
              discountAmount,
              descuento: discountAmount,
              discountPercent,

              stock: p.stock,
              category: p.categoria?.nombre ?? "Sin categoría",
              categoryId: p.categoria?.id,
              fotosIds: p.fotosIds,
              fotos,
            };
          })
        );

        setProducts(formatted);
      } catch (error) {
        console.error("Error trayendo productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [appliedRange]);

  function pickCat(cat) {
    const next = new URLSearchParams(params);

    if (cat === "Todos") next.delete("cat");
    else next.set("cat", cat);

    setParams(next, { replace: true });
  }

  return (
    <div className="catalogo-shell mx-auto max-w-screen-2xl px-8 pb-24 pt-28 font-sans">
      <main className="flex flex-col gap-8 md:flex-row md:gap-10">
        <aside className="w-full shrink-0 space-y-8 md:w-64 md:space-y-10">
          <section>
            <h3 className="mb-2 font-sans text-sm font-semibold uppercase text-white">
              Categorías
            </h3>

            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  className={`w-full rounded-sm border border-transparent px-1 py-0.5 text-left text-[15px] transition-colors hover:text-white ${
                    activeCat === "Todos"
                      ? "border-[#333] text-[#ba203f]"
                      : "text-gray-400"
                  }`}
                  onClick={() => pickCat("Todos")}
                >
                  Todos
                </button>
              </li>

              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`w-full rounded-sm border border-transparent px-1 py-0.5 text-left text-[15px] transition-colors hover:text-white ${
                      activeCat === c.nombre
                        ? "border-[#333] text-[#ba203f]"
                        : "text-gray-400"
                    }`}
                    onClick={() => pickCat(c.nombre)}
                  >
                    {c.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 font-sans text-sm font-semibold uppercase text-white">
              Filtros especiales
            </h3>

            <button
              type="button"
              className={`mt-3 block text-left text-[15px] transition-colors ${
                onlyAvailable
                  ? "text-[#ba203f]"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setOnlyAvailable((prev) => !prev)}
            >
              {onlyAvailable
                ? "✔ Solo disponibles"
                : "Solo productos disponibles"}
            </button>

            <div className="mt-4 space-y-2">
              <p className="text-[12px] uppercase tracking-widest text-gray-500">
                Rango de precio
              </p>

              <input
                type="number"
                placeholder="Mínimo"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({
                    ...prev,
                    min: e.target.value,
                  }))
                }
                className="w-full rounded-sm border border-[#333333] bg-black px-2 py-1 text-sm text-white"
              />

              <input
                type="number"
                placeholder="Máximo"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({
                    ...prev,
                    max: e.target.value,
                  }))
                }
                className="w-full rounded-sm border border-[#333333] bg-black px-2 py-1 text-sm text-white"
              />

              <button
                className="mt-2 w-full rounded bg-[#ba203f] py-2 text-sm text-white transition-all duration-150 hover:scale-[1.02] hover:bg-[#8f1a35] active:scale-95"
                onClick={() => setAppliedRange(priceRange)}
              >
                Aplicar filtro
              </button>
            </div>
          </section>
        </aside>

        <div className="flex-1">
          <header className="catalogo-toolbar mb-8">
            <div>
              <h1 className="font-sans text-3xl font-bold text-white">
                {titleFor(activeCat)}
              </h1>

              <p className="mt-2 font-sans text-xs uppercase tracking-widest text-gray-500">
                {loading
                  ? "CARGANDO PRODUCTOS..."
                  : `MOSTRANDO ${list.length} DE ${products.length} PRODUCTOS`}
              </p>
            </div>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm rounded-sm border border-[#333333] bg-black px-3 py-2 text-sm text-white focus:border-[#ba203f] focus:outline-none"
              />
            </div>
          </header>

          {loading ? (
            <div className="py-10 text-white">Cargando productos...</div>
          ) : (
            <div className="grid gap-2 pb-16 md:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
                <TarjetaProducto key={p.id} product={p} compactCartIcon />
              ))}

              {list.length === 0 && (
                <p className="col-span-full py-10 text-gray-400">
                  No hay productos para mostrar.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function titleFor(cat) {
  if (cat === "Todos") return "Catálogo completo";
  return cat === "Audio Pro" ? "Audio profesional" : cat;
}