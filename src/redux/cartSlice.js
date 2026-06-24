import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// función auxiliar para transformar la respuesta del backend
async function mapCartItems(carrito) {

    const items = carrito?.items ?? []

    return Promise.all(
        items.map(async(item)=>{

            let fotos = []
            if(item.producto.fotosIds?.length > 0){
                const {data} = await axios.get(`http://localhost:8080/fotos/${item.producto.fotosIds[0]}` )
                fotos = [data]
            }

            return {
                itemId: item.id,
                id: item.producto.id,
                name: item.producto.nombre,
                description: item.producto.descripcion,
                price: item.producto.precio,
                discountedPrice: item.producto.precioConDescuento,
                discount: item.producto.descuento,
                stock: item.producto.stock,
                category: item.producto.categoria?.nombre,
                fotos,
                quantity: item.cantidad
            }
        })
    )
}

// traer carrito
export const fetchCart = createAsyncThunk("cart/fetchCart", async(_, thunkAPI)=>{
        const {token, user} = thunkAPI
            .getState()
            .auth

        const {data: carrito} = await axios.get(`http://localhost:8080/carrito/usuario/${user.id}`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )


        return await mapCartItems(carrito)
    }
)

// agregar item
export const addCartItem = createAsyncThunk("cart/addCartItem", async({product, quantity}, thunkAPI)=>{
        const {token, user} = thunkAPI
            .getState()
            .auth

        const {data: carrito} = await axios.post("http://localhost:8080/carrito/agregar",
            {
                usuarioId:user.id,
                productoId:product.id,
                cantidad:quantity
            },
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )


        return await mapCartItems(carrito)
    }
)


//remover item
export const removeCartItem = createAsyncThunk("cart/removeCartItem", async(itemId, thunkAPI)=>{
        const {token} = thunkAPI
            .getState()
            .auth

        await axios.delete(
            `http://localhost:8080/carrito/item/${itemId}`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )


        return itemId
    }
)

// cambiar cantidad
export const updateQuantity = createAsyncThunk("cart/updateQuantity", async({itemId, quantity}, thunkAPI)=>{
        const {token} = thunkAPI
            .getState()
            .auth
        console.log(quantity)
        const {data: carrito} = await axios.put(`http://localhost:8080/carrito/item/${itemId}`,
            {
                cantidad: quantity
            },
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )


        return await mapCartItems(carrito)
    }
)

// realizar checkout
export const checkout = createAsyncThunk("cart/checkout", async (_, thunkAPI) => {
    const {token, user} = thunkAPI
        .getState()
        .auth

    const {data} = await axios.post(`http://localhost:8080/carrito/checkout/${user.id}`,
        {},
        {
            headers:{
            Authorization:`Bearer ${token}`
        }
        }
    )

    return data
    }
)

//slice
const cartSlice = createSlice({
    name:"cart",
    initialState:{
        items:[],
        loading:false,
        error:null
    },

    reducers:{
        clearCart:(state)=>{
            state.items = []
        }
    },
    extraReducers:(builder)=>{
        builder

        // traer carrito
        .addCase(fetchCart.pending,(state)=>{
            state.loading = true
        })

        .addCase(fetchCart.fulfilled,(state,action)=>{
            state.loading = false
            state.items = action.payload
        })

        .addCase(fetchCart.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })

        // agregar item
        .addCase(addCartItem.fulfilled,(state,action)=>{
            state.items = action.payload
        })

        // remover item
        .addCase(removeCartItem.fulfilled,(state,action)=>{

            state.items = state.items.filter(
                item => item.itemId !== action.payload
            )

        })

        // cambiar cantidad
        .addCase(updateQuantity.fulfilled,(state,action)=>{
            state.items = action.payload
        })

        // realizar checkout
        .addCase(checkout.pending, (state) => {
            state.loading = true
        })
        .addCase(checkout.fulfilled, (state)=>{
            state.items = []
        })
        .addCase(checkout.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }

})


export const {clearCart} = cartSlice.actions

export default cartSlice.reducer