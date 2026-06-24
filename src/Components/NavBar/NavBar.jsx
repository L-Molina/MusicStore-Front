import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { BRAND_LOGO_URL } from "../../constants/stitchAssets.js";
import { useFavorites } from "../../context/FavoritesProvider";
import { logout } from "../../redux/authSlice";
import { clearCart } from "../../redux/cartSlice";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";
import "./NavBar.css";

export default function NavBar() {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const { favorites } = useFavorites();

  const count = items.reduce((acc, item) => {
    return acc + Number(item.quantity || 0);
  }, 0);

  const isAuthenticated = !!token;
  const isSeller = user?.rol === "VENDEDOR";
  const isAdmin = user?.rol === "ADMIN";
  const isBuyer = user?.rol === "COMPRADOR";

  function handleLogout() {
    localStorage.setItem("logoutMessage", "✅ Sesión cerrada correctamente");
    dispatch(logout());
    dispatch(clearCart());
    window.location.href = "/";
  }

  return (
    <nav className="navbar-stitch sticky top-0 z-50 border-b border-[#ba203f] bg-black font-sans text-sm font-medium tracking-wide text-[#ba203f]">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-8 py-4">
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
              Gestión de inventario
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="hidden text-xs font-semibold uppercase tracking-wide text-[#ba203f] hover:text-white lg:inline"
            >
              Panel admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated && isBuyer && (
            <Link
              to="/favoritos"
              className="relative flex items-center gap-2 text-[#ba203f] transition-colors hover:text-white"
              title="Favoritos"
            >
              <span className="text-xl">❤️</span>

              {favorites.length > 0 && (
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-[#ba203f] text-[10px] font-bold text-white">
                  {favorites.length > 10 ? "10+" : favorites.length}
                </span>
              )}
            </Link>
          )}

          {!isAdmin && (
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
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/perfil"
                className="hidden text-xs font-semibold uppercase tracking-wide text-white hover:text-[#ba203f] lg:inline"
              >
                Mi perfil
              </Link>

              <span className="hidden text-white lg:block">
                Hola, {user?.nombre || "usuario"}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[#ba203f] hover:text-white"
                title="Cerrar sesión"
              >
                <MaterialSymbol>logout</MaterialSymbol>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-3 text-[#ba203f] transition-colors hover:text-white"
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
  );
}