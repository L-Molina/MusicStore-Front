import { Link } from "react-router-dom";
import { BRAND_LOGO_URL } from "../../constants/stitchAssets.js";
import { useCart } from "../../hooks/useCart";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";
import "./NavBar.css";

/** Barra superior extraída de `home_musicstore_v6/code.html` */
export default function NavBar() {
  const { count } = useCart();

  return (
    <nav className="navbar-stitch sticky top-0 z-50 border-b border-[#ba203f] bg-black font-sans text-sm font-medium tracking-wide text-[#ba203f]">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-8 py-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="nav-icon-btn text-[#ba203f] hover:text-white"
            aria-label="Abrir menú"
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
          <label className="nav-search-pill ml-4 hidden items-center rounded-full border border-[#ba203f] bg-[#1A1A1A] px-4 py-2 md:flex">
            <MaterialSymbol className="mr-2 text-lg text-[#ba203f] hover:text-white">
              search
            </MaterialSymbol>
            <input
              className="w-48 border-none bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-0"
              placeholder="Buscar instrumentos..."
              type="search"
            />
          </label>
          <Link
            to="/catalogo"
            className="hidden text-xs font-semibold uppercase tracking-wide text-[#ba203f] transition-colors hover:text-white lg:inline"
          >
            Catálogo
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/carrito"
            className="relative flex items-center gap-2 text-[#ba203f] transition-colors hover:text-white"
            aria-label="Carrito de compras"
          >
            <MaterialSymbol>shopping_cart</MaterialSymbol>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-[#ba203f] text-[10px] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
          <Link
            to="/login"
            className="group flex items-center gap-3 text-[#ba203f] transition-colors hover:text-white"
            aria-label="Acceder a la cuenta"
          >
            <button
              type="button"
              className="group flex items-center gap-3 text-[#ba203f] transition-colors hover:text-white"
            >
              <span className="nav-account-copy hidden text-right uppercase leading-tight lg:block">
                ACCEDE A TU CUENTA
                <br />O REGÍSTRATE
              </span>
              <MaterialSymbol>person</MaterialSymbol>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
