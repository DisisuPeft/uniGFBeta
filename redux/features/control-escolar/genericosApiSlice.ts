import { apiSlice } from "@/redux/services/apiSlice";
import {
  ModalidadesGenerico,
  TipoProgramaGenerico,
  ProgramaSimple,
  TipoPago,
  CampaniaPrograma,
} from "../types/control-escolar/type";

const genericoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getModalidades: builder.query<ModalidadesGenerico[], void>({
      query: () => "/control-escolar/genericos/modalidades/",
    }),
    getTiposProgramas: builder.query<TipoProgramaGenerico[], void>({
      query: () => "/control-escolar/genericos/tipos-programas/",
    }),
    getProgramasGenerico: builder.query<ProgramaSimple[], void>({
      query: () => "/control-escolar/genericos/programas/",
    }),
    getTipoPago: builder.query<TipoPago[], void>({
      query: () => "/control-escolar/genericos/tipo-pago/",
    }),
    getCampanias: builder.query<CampaniaPrograma[], string>({
      query: (id) => `/control-escolar/genericos/campanias/?e=${id}`,
    }),
  }),
});

export const {
  useGetModalidadesQuery,
  useGetTiposProgramasQuery,
  useGetProgramasGenericoQuery,
  useGetTipoPagoQuery,
  useGetCampaniasQuery,
} = genericoApiSlice;
