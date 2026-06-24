import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../../redux/authSlice.js";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    logout: () => dispatch(logoutAction()),
  };
}
