import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "./api.js";

function readStoredAuth() {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  return {
    token,
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: Boolean(token),
  };
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password, remember }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/autenticar", {
        email,
        password,
      });

      if (remember) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      return { ...data, remember };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al iniciar sesión";
      return rejectWithValue(message);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ userData, remember }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/registrar", userData);

      if (remember) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      return { ...data, remember };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al registrarse";
      return rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...readStoredAuth(),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
