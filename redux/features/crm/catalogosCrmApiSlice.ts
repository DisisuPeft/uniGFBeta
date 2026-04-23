import { apiSlice } from "@/redux/services/apiSlice";
import {
  Pipeline,
  Etapa,
  TipoInteraccion,
  EstadoInteraccion,
  TipoSeguimiento,
  NivelTemperatura,
  FuenteLead,
  EstatusLead,
  OrigenPago,
  EstadoPlan,
} from "../types/crm/lead-types";
import { PaginatedResponse } from "../types/paginated";

interface WithInstituto {
  instituto?: number;
}

const catalogosCrmApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPipelines: builder.query<
      PaginatedResponse<Pipeline>,
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        return `/crm/catalogos/pipelines/?${qs.toString()}`;
      },
    }),

    getPipeline: builder.query<Pipeline, number>({
      query: (id) => `/crm/catalogos/pipelines/${id}/`,
    }),

    getEtapas: builder.query<
      PaginatedResponse<Etapa>,
      { pipeline?: number; instituto?: number } | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.pipeline) qs.set("pipeline", String(params.pipeline));
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        return `/crm/catalogos/etapas/?${qs.toString()}`;
      },
    }),

    getTiposInteraccion: builder.query<
      PaginatedResponse<TipoInteraccion>,
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        return `/crm/catalogos/tipos-interaccion/?${qs.toString()}`;
      },
    }),

    getEstadosInteraccion: builder.query<
      PaginatedResponse<EstadoInteraccion>,
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        return `/crm/catalogos/estados-interaccion/?${qs.toString()}`;
      },
    }),

    getTiposSeguimiento: builder.query<
      PaginatedResponse<TipoSeguimiento>,
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        return `/crm/catalogos/tipos-seguimiento/?${qs.toString()}`;
      },
    }),

    getNivelesTemperatura: builder.query<
      PaginatedResponse<NivelTemperatura>,
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        return `/crm/catalogos/niveles-temperatura/?${qs.toString()}`;
      },
    }),

    getFuentes: builder.query<
      PaginatedResponse<FuenteLead>,
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        return `/crm/catalogos/fuentes/?${qs.toString()}`;
      },
    }),

    getEstatus: builder.query<
      PaginatedResponse<EstatusLead>,
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        return `/crm/catalogos/estatus/?${qs.toString()}`;
      },
    }),

    getOrigenesPago: builder.query<PaginatedResponse<OrigenPago>, void>({
      query: () => `/crm/catalogos/origenes-pago/`,
    }),

    getEstadosPlan: builder.query<PaginatedResponse<EstadoPlan>, void>({
      query: () => `/crm/catalogos/estados-plan/`,
    }),
  }),
});

export const {
  useGetPipelinesQuery,
  useGetFuentesQuery,
  useGetEstatusQuery,
  useGetPipelineQuery,
  useGetEtapasQuery,
  useGetTiposInteraccionQuery,
  useGetEstadosInteraccionQuery,
  useGetTiposSeguimientoQuery,
  useGetNivelesTemperaturaQuery,
  useGetOrigenesPagoQuery,
  useGetEstadosPlanQuery,
} = catalogosCrmApiSlice;
