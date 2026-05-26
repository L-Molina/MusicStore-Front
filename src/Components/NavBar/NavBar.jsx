import { Link } from "react-router-dom";
import { BRAND_LOGO_URL } from "../../constants/stitchAssets.js";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";
import "./NavBar.css";

export default function NavBar() {
  const { count } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
const isSeller = user?.rol === "VENDEDOR";

  return (
    <nav className="navbar-stitch sticky top-0 z-50 border-b border-[#ba203f] bg-black font-sans text-sm font-medium tracking-wide text-[#ba203f]">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-8 py-4">

        {/* IZQUIERDA */}
        <div className="flex items-center gap-6">
          

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
  className="hidden text-xs font-semibold uppercase tracking-wide text-[#ba203f] hover:text-white lg:inline"
>
  Catálogo
</Link>

{isSeller && (
  <Link
    to="/vendedor"
    className="hidden text-xs font-semibold uppercase tracking-wide text-[#ba203f] hover:text-white lg:inline"
  >
    Panel vendedor
  </Link>
)}
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
                Iniciar sesión 
              </span>
              <MaterialSymbol>person</MaterialSymbol>
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}
