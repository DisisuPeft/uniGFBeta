import { Middleware } from "@reduxjs/toolkit";
import {
  setUnidad,
  clearUnidad,
} from "@/redux/features/crm/changeUnidadSilice";

export const persistUnidadMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);

    if (setUnidad.match(action) || clearUnidad.match(action)) {
      const unidadId = store.getState().changeUnidad.unidadId;
      if (unidadId != null) localStorage.setItem("unidadId", String(unidadId));
      else localStorage.removeItem("unidadId");
    }
    return result;
  };
