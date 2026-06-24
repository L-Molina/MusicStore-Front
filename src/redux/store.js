import { configureStore } from "@reduxjs/toolkit";
import myProductsSlice from './myProductsSlice'
import authSlice from './authSlice'
import cartSlice from './cartSlice'
import productsSlice from './productsSlice'
import categoriesSlice from './categoriesSlice'
import productDetailSlice from "./productDetailSlice";

export const store = configureStore(
    {
        reducer:{auth: authSlice,
            myProducts: myProductsSlice,
            cart: cartSlice,
            products: productsSlice,
            categories: categoriesSlice,
            productDetail: productDetailSlice
        }
    }
)