import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./services/apiSlice";
import authReducer from "./features/auth/authSlice";
import alertReducer from "./features/alert/alertSlice";
import unidadReducer from "./features/crm/changeUnidadSilice";
import { persistUnidadMiddleware } from "./middleware/persistUnidadMiddleware";

// const preload = () => {
//   const raw =
//     typeof window !== "undefined" ? localStorage.getItem("unidadId") : null;
//   const id = raw ? parseInt(raw) : null;
//   return id ? { changeUnidad: { unidadId: id } } : undefined;
// };

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    alert: alertReducer,
    changeUnidad: unidadReducer,
  },
  // preloadedState: preload(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, persistUnidadMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<(typeof store)["getState"]>;
export type AppDispatch = (typeof store)["dispatch"];
