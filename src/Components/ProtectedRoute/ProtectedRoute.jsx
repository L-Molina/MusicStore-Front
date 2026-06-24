import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const { user, token } = useSelector((state) => state.auth);

  // 1. 🔒 No logueado
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // 2. 🚫 Sin permisos de rol (si se define restricción)
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
