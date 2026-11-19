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
    getPipelines: builder.query<Pipeline[], WithInstituto | void>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        qs.set("pagination", "false");
        return `/crm/catalogos/pipelines/?${qs.toString()}`;
      },
    }),

    getPipeline: builder.query<Pipeline, number>({
      query: (id) => `/crm/catalogos/pipelines/${id}/`,
    }),

    // Sin consumidores actuales en el frontend; se deja con paginación por
    // defecto (no confirmado si solo alimenta selects).
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
      TipoInteraccion[],
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        qs.set("pagination", "false");
        return `/crm/catalogos/tipos-interaccion/?${qs.toString()}`;
      },
    }),

    getEstadosInteraccion: builder.query<
      EstadoInteraccion[],
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        qs.set("pagination", "false");
        return `/crm/catalogos/estados-interaccion/?${qs.toString()}`;
      },
    }),

    getTiposSeguimiento: builder.query<
      TipoSeguimiento[],
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        qs.set("pagination", "false");
        return `/crm/catalogos/tipos-seguimiento/?${qs.toString()}`;
      },
    }),

    getNivelesTemperatura: builder.query<
      NivelTemperatura[],
      WithInstituto | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.instituto) qs.set("instituto", String(params.instituto));
        qs.set("pagination", "false");
        return `/crm/catalogos/niveles-temperatura/?${qs.toString()}`;
      },
    }),

    // Sin consumidores actuales en el frontend; se deja con paginación por
    // defecto (no confirmado si solo alimenta selects).
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

    // Sin consumidores actuales en el frontend; se deja con paginación por
    // defecto (no confirmado si solo alimenta selects).
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

    getOrigenesPago: builder.query<OrigenPago[], void>({
      query: () => `/crm/catalogos/origenes-pago/?pagination=false`,
      transformResponse: (response: OrigenPago[] | PaginatedResponse<OrigenPago>) =>
        Array.isArray(response) ? response : response.results,
    }),

    getEstadosPlan: builder.query<EstadoPlan[], void>({
      query: () => `/crm/catalogos/estados-plan/?pagination=false`,
      transformResponse: (response: EstadoPlan[] | PaginatedResponse<EstadoPlan>) =>
        Array.isArray(response) ? response : response.results,
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
