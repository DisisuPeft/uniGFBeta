import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface unidadState {
  unidadId: number | undefined;
}
const preload = () => {
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("unidadId") : null;
  return raw ? parseInt(raw) : null;
};
// console.log(preload());
const initialState = {
  unidadId: preload(),
} as unidadState;

const changeUnidadSlice = createSlice({
  name: "changeUnidad",
  initialState,
  reducers: {
    setUnidad: (state, action: PayloadAction<number | undefined>) => {
      state.unidadId = action.payload;
    },
    clearUnidad: (state) => {
      state.unidadId = undefined;
    },
  },
});

export const { setUnidad, clearUnidad } = changeUnidadSlice.actions;

export default changeUnidadSlice.reducer;
