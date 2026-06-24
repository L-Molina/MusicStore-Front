import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductById = createAsyncThunk("productDetail/fetchProductById", async (productId) => {
    const { data: p } = await axios.get(`http://localhost:8080/productos/${productId}`);
    let fotos = [];
    if (p.fotosIds?.length > 0) {
        const { data: foto } = await axios.get(`http://localhost:8080/fotos/${p.fotosIds[0]}`
        );

        fotos = [foto];
    }

    return {
        id: p.id,
        name: p.nombre,
        description: p.descripcion,
        price: p.precio,
        discountedPrice: p.precioConDescuento,
        discount: p.descuento,
        stock: p.stock,
        category: p.categoria?.nombre ?? "Sin categoría",
        categoryId: p.categoria?.id,
        fotos
    };
    }
);

const productDetailSlice = createSlice({
    name: "productDetail",

    initialState: {
        product: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchProductById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(fetchProductById.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
        })

        .addCase(fetchProductById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default productDetailSlice.reducer;