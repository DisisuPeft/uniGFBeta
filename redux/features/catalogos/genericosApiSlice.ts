import { apiSlice } from "@/redux/services/apiSlice";
import {
  Instituciones,
  NivelEducativo,
  EstadoRepublica,
  Localidad,
  MetodoPago,
  NivelCompetencia,
  NivelCompetenciaForm,
  StatusCurso,
  StatusCursoForm,
  TipoTema,
  TipoTemaForm,
  TipoBloque,
  TipoBloqueForm,
  TipoEvaluacion,
  TipoEvaluacionForm,
} from "../types/catalagos/cat";
import { PaginatedResponse } from "../types/paginated";

const generoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveInstituciones: builder.query<Instituciones[], void>({
      query: () => "/catalagos/genericos/instituciones/",
    }),
    retrieveNivelEducativo: builder.query<NivelEducativo[], void>({
      query: () => "/catalagos/genericos/niveles-educativos/",
    }),
    retrieveEstados: builder.query<EstadoRepublica[], void>({
      query: () => "/catalagos/genericos/estados/",
    }),
    retrieveLocalidades: builder.query<Localidad[], number>({
      query: (estado) => `/catalagos/genericos/localidades/?estado=${estado}`,
    }),
    getMetodoPago: builder.query<MetodoPago[], void>({
      query: () => "/catalagos/genericos/metodo-pago/",
    }),
    // ==========================================================
    // NIVELES DE COMPETENCIA  — /catalogos/niveles-competencia/
    // ==========================================================

    getNivelesCompetencia: builder.query<PaginatedResponse<NivelCompetencia>, void>({
      query: () => "/catalogos/niveles-competencia/",
      providesTags: [{ type: "NivelCompetencia", id: "LIST" }],
    }),
    getNivelCompetencia: builder.query<NivelCompetencia, number>({
      query: (id) => `/catalogos/niveles-competencia/${id}/`,
      providesTags: (_, __, id) => [{ type: "NivelCompetencia", id }],
    }),
    createNivelCompetencia: builder.mutation<NivelCompetencia, NivelCompetenciaForm>({
      query: (body) => ({ url: "/catalogos/niveles-competencia/", method: "POST", body }),
      invalidatesTags: [{ type: "NivelCompetencia", id: "LIST" }],
    }),
    updateNivelCompetencia: builder.mutation<NivelCompetencia, { id: number; body: Partial<NivelCompetenciaForm> }>({
      query: ({ id, body }) => ({
        url: `/catalogos/niveles-competencia/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "NivelCompetencia", id },
        { type: "NivelCompetencia", id: "LIST" },
      ],
    }),
    deleteNivelCompetencia: builder.mutation<void, number>({
      query: (id) => ({ url: `/catalogos/niveles-competencia/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "NivelCompetencia", id: "LIST" }],
    }),

    // ==========================================================
    // CATÁLOGOS DE CAPACITACIÓN  (lookup lists, sin paginación)
    // ==========================================================

    // ==========================================================
    // STATUS DE CURSO  — /catalogos/status/
    // ==========================================================

    getStatusCurso: builder.query<PaginatedResponse<StatusCurso>, void>({
      query: () => "/catalogos/status/",
      providesTags: [{ type: "StatusCurso", id: "LIST" }],
    }),
    createStatusCurso: builder.mutation<StatusCurso, StatusCursoForm>({
      query: (body) => ({ url: "/catalogos/status/", method: "POST", body }),
      invalidatesTags: [{ type: "StatusCurso", id: "LIST" }],
    }),
    updateStatusCurso: builder.mutation<StatusCurso, { id: number; body: Partial<StatusCursoForm> }>({
      query: ({ id, body }) => ({ url: `/catalogos/status/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "StatusCurso", id: "LIST" }],
    }),
    deleteStatusCurso: builder.mutation<void, number>({
      query: (id) => ({ url: `/catalogos/status/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "StatusCurso", id: "LIST" }],
    }),

    // ==========================================================
    // TIPOS DE TEMA  — /catalogos/tipos-tema/
    // ==========================================================

    getTiposTema: builder.query<PaginatedResponse<TipoTema>, void>({
      query: () => "/catalogos/tipos-tema/",
      providesTags: [{ type: "TipoTema", id: "LIST" }],
    }),
    createTipoTema: builder.mutation<TipoTema, TipoTemaForm>({
      query: (body) => ({ url: "/catalogos/tipos-tema/", method: "POST", body }),
      invalidatesTags: [{ type: "TipoTema", id: "LIST" }],
    }),
    updateTipoTema: builder.mutation<TipoTema, { id: number; body: Partial<TipoTemaForm> }>({
      query: ({ id, body }) => ({ url: `/catalogos/tipos-tema/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "TipoTema", id: "LIST" }],
    }),
    deleteTipoTema: builder.mutation<void, number>({
      query: (id) => ({ url: `/catalogos/tipos-tema/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "TipoTema", id: "LIST" }],
    }),

    // ==========================================================
    // TIPOS DE BLOQUE  — /catalogos/tipos-bloque/
    // ==========================================================

    getTiposBloque: builder.query<PaginatedResponse<TipoBloque>, void>({
      query: () => "/catalogos/tipos-bloque/",
      providesTags: [{ type: "TipoBloque", id: "LIST" }],
    }),
    createTipoBloque: builder.mutation<TipoBloque, TipoBloqueForm>({
      query: (body) => ({ url: "/catalogos/tipos-bloque/", method: "POST", body }),
      invalidatesTags: [{ type: "TipoBloque", id: "LIST" }],
    }),
    updateTipoBloque: builder.mutation<TipoBloque, { id: number; body: Partial<TipoBloqueForm> }>({
      query: ({ id, body }) => ({ url: `/catalogos/tipos-bloque/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "TipoBloque", id: "LIST" }],
    }),
    deleteTipoBloque: builder.mutation<void, number>({
      query: (id) => ({ url: `/catalogos/tipos-bloque/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "TipoBloque", id: "LIST" }],
    }),

    // ==========================================================
    // TIPOS DE EVALUACIÓN  — /catalogos/tipos-evaluacion/
    // ==========================================================

    getTiposEvaluacion: builder.query<PaginatedResponse<TipoEvaluacion>, void>({
      query: () => "/catalogos/tipos-evaluacion/",
      providesTags: [{ type: "TipoEvaluacion", id: "LIST" }],
    }),
    createTipoEvaluacion: builder.mutation<TipoEvaluacion, TipoEvaluacionForm>({
      query: (body) => ({ url: "/catalogos/tipos-evaluacion/", method: "POST", body }),
      invalidatesTags: [{ type: "TipoEvaluacion", id: "LIST" }],
    }),
    updateTipoEvaluacion: builder.mutation<TipoEvaluacion, { id: number; body: Partial<TipoEvaluacionForm> }>({
      query: ({ id, body }) => ({ url: `/catalogos/tipos-evaluacion/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "TipoEvaluacion", id: "LIST" }],
    }),
    deleteTipoEvaluacion: builder.mutation<void, number>({
      query: (id) => ({ url: `/catalogos/tipos-evaluacion/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "TipoEvaluacion", id: "LIST" }],
    }),
  }),
});

export const {
  useRetrieveInstitucionesQuery,
  useRetrieveNivelEducativoQuery,
  useRetrieveEstadosQuery,
  useRetrieveLocalidadesQuery,
  useGetMetodoPagoQuery,
  useGetNivelesCompetenciaQuery,
  useGetNivelCompetenciaQuery,
  useCreateNivelCompetenciaMutation,
  useUpdateNivelCompetenciaMutation,
  useDeleteNivelCompetenciaMutation,
  useGetStatusCursoQuery,
  useCreateStatusCursoMutation,
  useUpdateStatusCursoMutation,
  useDeleteStatusCursoMutation,
  useGetTiposTemaQuery,
  useCreateTipoTemaMutation,
  useUpdateTipoTemaMutation,
  useDeleteTipoTemaMutation,
  useGetTiposBloqueQuery,
  useCreateTipoBloqueMutation,
  useUpdateTipoBloqueMutation,
  useDeleteTipoBloqueMutation,
  useGetTiposEvaluacionQuery,
  useCreateTipoEvaluacionMutation,
  useUpdateTipoEvaluacionMutation,
  useDeleteTipoEvaluacionMutation,
} = generoApiSlice;
