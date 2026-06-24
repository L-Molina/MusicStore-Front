import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import App from "./App.jsx";
import { fetchCart } from "../redux/cartSlice.js";
import { store } from "../redux/store.js";
import "./index.css";

function AppBootstrap() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppBootstrap />
    </Provider>
  </StrictMode>,
);
