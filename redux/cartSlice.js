import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "./api.js";
import { mapCarritoItem } from "./productMapper.js";
import { logout } from "./authSlice.js";

function mapCartItems(items = []) {
  return items.map(mapCarritoItem);
}

function addLocalItem(items, product, qty) {
  const index = items.findIndex((item) => item.id === product.id);

  if (index === -1) {
    return [...items, { ...product, quantity: qty }];
  }

  const next = [...items];
  next[index] = {
    ...next[index],
    quantity: next[index].quantity + qty,
  };
  return next;
}

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/carrito/usuario/${userId}`);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al cargar el carrito";
      return rejectWithValue(message);
    }
  },
);

export const addItem = createAsyncThunk(
  "cart/addItem",
  async ({ product, qty = 1 }, { getState, rejectWithValue }) => {
    const { auth, cart } = getState();

    if (auth.isAuthenticated && auth.user?.id) {
      try {
        const { data } = await api.post("/carrito/agregar", {
          usuarioId: auth.user.id,
          productoId: Number(product.id),
          cantidad: qty,
        });
        return { source: "api", cart: data };
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Error al agregar al carrito";
        return rejectWithValue(message);
      }
    }

    return {
      source: "local",
      items: addLocalItem(cart.items, product, qty),
    };
  },
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (id, { getState, rejectWithValue }) => {
    const { auth, cart } = getState();
    const item = cart.items.find((entry) => entry.id === id);

    if (auth.isAuthenticated && item?.backendItemId) {
      try {
        await api.delete(`/carrito/item/${item.backendItemId}`);
        const { data } = await api.get(`/carrito/usuario/${auth.user.id}`);
        return { source: "api", cart: data };
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Error al eliminar del carrito";
        return rejectWithValue(message);
      }
    }

    return {
      source: "local",
      items: cart.items.filter((entry) => entry.id !== id),
    };
  },
);

export const setQuantity = createAsyncThunk(
  "cart/setQuantity",
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    const { auth, cart } = getState();
    const item = cart.items.find((entry) => entry.id === id);

    if (auth.isAuthenticated && item?.backendItemId) {
      try {
        const { data } = await api.put(`/carrito/item/${item.backendItemId}`, {
          cantidad: quantity,
        });
        return { source: "api", cart: data };
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Error al actualizar cantidad";
        return rejectWithValue(message);
      }
    }

    const items =
      quantity < 1
        ? cart.items.filter((entry) => entry.id !== id)
        : cart.items.map((entry) =>
            entry.id === id ? { ...entry, quantity } : entry,
          );

    return { source: "local", items };
  },
);

export const checkoutCart = createAsyncThunk(
  "cart/checkout",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/carrito/checkout/${userId}`);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al finalizar la compra";
      return rejectWithValue(message);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    checkoutLoading: false,
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.items = [];
      state.error = null;
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = mapCartItems(action.payload.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.source === "api") {
          state.items = mapCartItems(action.payload.cart.items);
        } else {
          state.items = action.payload.items;
        }
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        if (action.payload.source === "api") {
          state.items = mapCartItems(action.payload.cart.items);
        } else {
          state.items = action.payload.items;
        }
      })
      .addCase(setQuantity.fulfilled, (state, action) => {
        if (action.payload.source === "api") {
          state.items = mapCartItems(action.payload.cart.items);
        } else {
          state.items = action.payload.items;
        }
      })
      .addCase(checkoutCart.pending, (state) => {
        state.checkoutLoading = true;
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.checkoutLoading = false;
        state.items = [];
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload;
      })
      .addCase(logout, (state) => {
        state.items = [];
        state.error = null;
      });
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;