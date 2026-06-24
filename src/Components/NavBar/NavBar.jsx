import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { BRAND_LOGO_URL } from "../../constants/stitchAssets.js";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth.js";
import { CATEGORY_FILTERS } from "../../data/products.js";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";
import "./NavBar.css";

export default function NavBar() {
  const { count } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = useMemo(
    () => CATEGORY_FILTERS.filter((c) => c !== "Todos"),
    []
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    if (!isMenuOpen) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <nav className="navbar-stitch sticky top-0 z-50 border-b border-[#ba203f] bg-black font-sans text-sm font-medium tracking-wide text-[#ba203f]">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-8 py-4">

          {/* IZQUIERDA */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="nav-icon-btn text-[#ba203f] hover:text-white"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              <MaterialSymbol>menu</MaterialSymbol>
            </button>

            <Link to="/" className="flex items-center">
              <img
                alt="MusicStore Logo"
                className="h-20 w-auto object-contain"
                src={BRAND_LOGO_URL}
                width={160}
                height={80}
              />
            </Link>

            <Link
              to="/catalogo"
              className="hidden text-xs font-semibold uppercase tracking-wide text-[#ba203f] transition-colors hover:text-white lg:inline"
            >
              Catálogo
            </Link>
          </div>

          {/* DERECHA */}
          <div className="flex items-center gap-6">

            {/* CARRITO */}
            <Link
              to="/carrito"
              className="relative flex items-center gap-2 text-[#ba203f] transition-colors hover:text-white"
            >
              <MaterialSymbol>shopping_cart</MaterialSymbol>

              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-[#ba203f] text-[10px] font-bold text-white">
                  {count > 10 ? "10+" : count}
                </span>
              )}
            </Link>

            {/* LOGIN / USER */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-white lg:block">
                  Hola, {user?.nombre}
                </span>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-[#ba203f] hover:text-white"
                >
                  <MaterialSymbol>logout</MaterialSymbol>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 text-[#ba203f] transition-colors hover:text-white"
              >
                <span className="hidden lg:block uppercase">
                  Accede a tu cuenta
                </span>
                <MaterialSymbol>person</MaterialSymbol>
              </Link>
            )}

          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Cerrar menú"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* panel */}
          <aside className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] border-r border-[#333333] bg-black p-6 text-[#ba203f] shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-white">
                Categorías
              </h3>

              <button
                type="button"
                className="nav-icon-btn text-[#ba203f] hover:text-white"
                aria-label="Cerrar menú"
                onClick={() => setIsMenuOpen(false)}
              >
                <MaterialSymbol>close</MaterialSymbol>
              </button>
            </div>

            <nav aria-label="Categorías">
              <ul className="space-y-3">
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      to={`/catalogo?cat=${encodeURIComponent(c)}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-sm border border-transparent px-1 py-0.5 text-[15px] text-gray-300 transition-colors hover:border-[#333333] hover:text-white"
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
