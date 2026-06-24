import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

//actions
export const fetchCategories = createAsyncThunk("categories/fetchCategories", async()=>{
    const {data}=await axios.get("http://localhost:8080/categorias");
    return data;
});

//slice
const categoriesSlice=createSlice({
    name:"categories",
    initialState:{
        categories:[],
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCategories.fulfilled,(state,action)=>{
            state.categories=action.payload;
        })
    }

})

export default categoriesSlice.reducer;
