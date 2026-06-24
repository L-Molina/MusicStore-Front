import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "./api.js";
import { mapProductoDTO } from "./productMapper.js";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/productos");
      return data.map(mapProductoDTO);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al cargar productos";
      return rejectWithValue(message);
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/productos/${id}`);
      return mapProductoDTO(data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al cargar el producto";
      return rejectWithValue(message);
    }
  },
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/categorias");
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al cargar categorías";
      return rejectWithValue(message);
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    categories: [],
    selectedProduct: null,
    loading: false,
    detailLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;