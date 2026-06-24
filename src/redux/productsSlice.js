import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// actions
export const fetchProducts = createAsyncThunk("products/fetchProducts", async(range) => {
    let url = "http://localhost:8080/productos";

    const min = range.min !== "" ? range.min : null;
    const max = range.max !== "" ? range.max : null;

    if(min !== null || max !== null){
        const params = new URLSearchParams();

        if(min !== null) params.append("min", min);
        if(max !== null) params.append("max", max);

        url = `http://localhost:8080/productos/precio?${params}`;
    }


    const {data: products} = await axios.get(url);


    const formatted = await Promise.all(
        products.map(async(p)=>{

        let fotos=[];

        if(p.fotosIds?.length > 0){

            const {data:fotodata}= await axios.get(`http://localhost:8080/fotos/${p.fotosIds[0]}`
            )

            fotos=[fotodata];
        }


        return {
            id:p.id,
            name:p.nombre,
            description:p.descripcion,
            price:p.precio,
            discountedPrice:p.precioConDescuento,
            discount:p.descuento,
            stock:p.stock,
            category:p.categoria?.nombre,
            categoryId:p.categoria?.id,
            fotos
        }

        })
    )


    return formatted;
    }
)

//slice
const productsSlice = createSlice({
    name:"products",
    initialState:{
        products:[],
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProducts.pending,(state)=>{
            state.loading=true;
        })

        .addCase(fetchProducts.fulfilled,(state,action)=>{
        state.loading=false;
        state.products=action.payload;
        })

        .addCase(fetchProducts.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.error.message;
        })

    }

})

export default productsSlice.reducer;