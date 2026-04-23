import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/auth/auth-types";

interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  user: User | null;
  hasAccess: boolean | null;
}

const initialState = {
  isAuth: false,
  isLoading: true,
  user: null,
  hasAccess: null,
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
    setUser: (state, payload: PayloadAction<User>) => {
      state.user = payload.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setAccess: (state, action: PayloadAction<boolean>) => {
      state.hasAccess = action.payload;
    },
    clearAccess: (state) => {
      state.hasAccess = null;
    },
  },
});

export const {
  setAuth,
  logout,
  finishInitialLoad,
  setUser,
  clearUser,
  setAccess,
  clearAccess,
} = authSlice.actions;
export default authSlice.reducer;
