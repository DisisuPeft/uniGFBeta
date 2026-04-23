import { apiSlice } from "@/redux/services/apiSlice";
import { EventoShowInterface } from "../types/control-escolar/type";

const eventosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEventos: builder.query<EventoShowInterface[], void>({
      query: () => "/control-escolar/eventos/geteventos/",
    }),
  }),
});

export const { useGetEventosQuery } = eventosApiSlice;
