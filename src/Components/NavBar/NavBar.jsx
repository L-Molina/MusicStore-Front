import { Link } from "react-router-dom"
import logoText from "../../assets/logo-text.png"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../hooks/useCart"
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol"
import "./NavBar.css"

export default function NavBar() {
  const { count } = useCart()
  const { isAuthenticated, user, logout } = useAuth()

  const canManageProducts = user?.rol === "VENDEDOR" || user?.rol === "ADMIN"

  return (
    <nav className="navbar-stitch sticky top-0 z-50 border-b border-[#ba203f] bg-black font-sans font-medium tracking-wide text-[#ba203f]">
      <div className="navbar-inner mx-auto flex w-full max-w-screen-2xl items-center justify-between px-8 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img
              alt="MusicStore Logo"
              className="navbar-logo object-contain"
              src={logoText}
            />
          </Link>

          <Link
            to="/catalogo"
            className="navbar-link hidden font-semibold uppercase tracking-wide text-[#ba203f] hover:text-white lg:inline"
          >
            Catálogo
          </Link>

          {canManageProducts && (
            <Link
              to="/vendedor"
              className="navbar-link hidden font-semibold uppercase tracking-wide text-[#ba203f] hover:text-white lg:inline"
            >
              Panel vendedor
            </Link>
          )}
        </div>

        <div className="flex items-center gap-7">
          {isAuthenticated && (
            <Link
              to="/perfil"
              className="navbar-link hidden font-semibold uppercase tracking-wide text-[#ba203f] hover:text-white lg:inline"
            >
              Mi perfil
            </Link>
          )}

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

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/perfil"
                className="navbar-user hidden text-white transition-colors hover:text-[#ba203f] lg:block"
              >
                Hola, {user?.nombre || user?.nombreUsuario}
              </Link>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 text-[#ba203f] hover:text-white"
              >
                <MaterialSymbol>logout</MaterialSymbol>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="navbar-link flex items-center gap-3 text-[#ba203f] transition-colors hover:text-white"
            >
              <span className="hidden uppercase lg:block">
                Iniciar sesión
              </span>

              <MaterialSymbol>person</MaterialSymbol>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}