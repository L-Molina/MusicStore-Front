import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App.jsx";
import "./index.css";

import { FavoritesProvider } from "./context/FavoritesProvider.jsx";
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </Provider>
  </StrictMode>
);