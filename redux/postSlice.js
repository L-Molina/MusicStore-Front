import { axios } from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postSlice from "./postSlice";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/posts",
  );
  return data;
});

export const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const store = configureStore({
  reducer: {
    posts: postSlice,
  },
});
