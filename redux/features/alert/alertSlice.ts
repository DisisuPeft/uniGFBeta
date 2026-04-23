import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertState {
  type: AlertType;
  message: string;
}

const initialState: AlertState | null = null;

const alertSlice = createSlice({
  name: "alert",
  initialState: initialState as AlertState | null,
  reducers: {
    setAlert: (_, action: PayloadAction<AlertState>) => action.payload,
    clearAlert: () => null,
  },
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
