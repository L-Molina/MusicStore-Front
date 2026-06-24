import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
//actions
export const login = createAsyncThunk("auth/login", async({email, password}) => {
    const {data} = await axios.post("http://localhost:8080/api/auth/autenticar",{
        email,
        password
    })

    return data
})
export const register = createAsyncThunk("auth/register", async(userData) => {
    const {data} = await axios.post("http://localhost:8080/api/auth/registrar", userData)
    return data
})

//slice
const authSlice = createSlice({
    name:'auth',
    initialState: {
        user: null,
        token: null,
        error: null,
        loading: false
    },
    reducers:{
        logout: (state) => {
            state.user = null
            state.token = null
            state.error = null
        }
    },
    extraReducers:(builder)=>{
        builder
        //login
        .addCase(login.pending, (state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(login.fulfilled, (state, action)=>{
            state.user = action.payload.user
            state.token = action.payload.token
            state.loading = false
            state.error = null
        })
        .addCase(login.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
        //register
        .addCase(register.pending, (state)=>{
            state.loading = true
            state.error = null
        })

        .addCase(register.fulfilled, (state, action)=>{
            state.loading = false
            state.user = action.payload.user
            state.token = action.payload.token
        })

        .addCase(register.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
    }
})
export const { logout } = authSlice.actions
export default authSlice.reducer