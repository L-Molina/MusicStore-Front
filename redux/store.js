import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import cartReducer from "./cartSlice.js";
import postReducer from "./postSlice.js";
import productReducer from "./productSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    posts: postReducer,
    products: productReducer,
  },
});
