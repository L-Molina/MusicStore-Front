import { useDispatch, useSelector } from "react-redux";
import { login as loginAction, logout as logoutAction } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";

export function AuthProvider({ children }) {
  return children;
}

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;

  async function login(email, password, remember = true) {
    return dispatch(loginAction({ email, password, remember })).unwrap();
  }

  function logout() {
    dispatch(logoutAction());
    dispatch(clearCart());
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  };
}