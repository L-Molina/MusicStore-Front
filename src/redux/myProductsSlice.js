import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


// actions
export const fetchMyProducts = createAsyncThunk('products/fetchMyProducts', async(_, thunkAPI)=>{
    const token = thunkAPI.getState().auth.token
    const {data: myProducts} = await axios.get('http://localhost:8080/productos/mios', {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

    const formmatedProducts = await Promise.all(myProducts.map(async(p)=>
        {
            let fotos = []
            if (p.fotosIds?.length > 0) {
                const { data: fotoData } = await axios.get(`http://localhost:8080/fotos/${p.fotosIds[0]}`)
                fotos = [fotoData]
            }
            return {
                id: p.id,
                name: p.nombre,
                description: p.descripcion,
                price: p.precio,
                discount: p.descuento,
                stock: p.stock,
                category: p.categoria,
                categoryId: p.categoria?.id,
                categoryName: p.categoria?.nombre,
                fotosIds: p.fotosIds,
                fotos}

        }))
    return formmatedProducts
} )

export const addMyProduct = createAsyncThunk('products/addMyProduct', async(newProduct, thunkAPI)=>{
    const token = thunkAPI
            .getState()
            .auth
            .token
    const payload = {
        nombre: newProduct.name,
        descripcion: newProduct.description,
        precio: newProduct.price,
        descuento: newProduct.discount,
        stock: newProduct.stock,
        categoriaId: newProduct.categoryId,
    }
    const {data: savedProduct} = await axios.post('http://localhost:8080/productos', payload, {
        headers:{
            Authorization:`Bearer ${token}`
    }})

    const productId = savedProduct.id
    const formData = new FormData()

    formData.append(
        "productoId",
        productId
    )

    formData.append(
        "file",
        newProduct.image
    )

    await axios.post('http://localhost:8080/fotos',formData,  {
        headers:{
            Authorization:`Bearer ${token}`
        }})

    return {
        id: savedProduct.id,
        name: savedProduct.nombre,
        description: savedProduct.descripcion,
        price: savedProduct.precio,
        discount: savedProduct.descuento,
        stock: savedProduct.stock
    }
} )

export const updateMyProduct = createAsyncThunk('products/updateMyProduct', async({id, changes}, thunkAPI)=>{
    const token = thunkAPI
        .getState()
        .auth
        .token
    const product = thunkAPI
        .getState()
        .myProducts
        .myProducts
        .find(p => p.id === id)

    const payload = {
        nombre: product.name,
        descripcion: product.description,
        precio: product.price,
        stock: changes.stock ?? product.stock,
        descuento: changes.discount ?? product.discount,
        categoriaId: product.categoryId,
    }
    console.log("PAYLOAD UPDATE", payload)
    const {data} = await axios.put(`http://localhost:8080/productos/${id}`,payload, {
        headers:{
            Authorization:`Bearer ${token}`
        }})

    return data
}
)

export const deleteMyProduct = createAsyncThunk('products/deleteMyProduct', async(id, thunkAPI)=>{
    const token = thunkAPI
            .getState()
            .auth
            .token
    await axios.delete(`http://localhost:8080/productos/${id}`, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return id
} )

// slice
const myProductsSlice = createSlice({
    name:'myProducts',
    initialState: {
        myProducts:[],
        error: null,
        loading: false
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchMyProducts.pending, (state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(fetchMyProducts.fulfilled, (state, action)=>{
            state.loading = false
            state.myProducts = action.payload
        })
        .addCase(fetchMyProducts.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
        
        .addCase(addMyProduct.fulfilled, (state, action)=>{
            
            state.myProducts = [...state.myProducts, action.payload]
        })

        .addCase(updateMyProduct.fulfilled, (state, action) => {

            const index = state.myProducts.findIndex(
            product => product.id === action.payload.id
    )

    if(index !== -1){

        state.myProducts[index] = {
            ...state.myProducts[index],
            name: action.payload.nombre,
            description: action.payload.descripcion,
            price: action.payload.precio,
            stock: action.payload.stock,
            discount: action.payload.descuento,
            categoryId: action.payload.categoria.id,
            categoryName: action.payload.categoria.nombre
        }

    }
})

        .addCase(deleteMyProduct.fulfilled, (state, action)=>{

            state.myProducts = state.myProducts.filter(
                product => product.id !== action.payload
            )
        })
        }
    })

export default myProductsSlice.reducer