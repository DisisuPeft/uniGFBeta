import { apiSlice } from "@/redux/services/apiSlice";
import {
  Competencia,
  CompetenciaForm,
  CompetenciaCurso,
  CompetenciaCursoForm,
  CompetenciaPuesto,
  CompetenciaPuestoForm,
} from "../types/competencias/types";
import { PaginatedResponse } from "../types/paginated";

const competenciasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================================
    // CATÁLOGO DE COMPETENCIAS  — /competencias/competencias/
    // ==========================================================

    getCompetencias: builder.query<PaginatedResponse<Competencia>, void>({
      query: () => `/competencias/competencias/`,
      providesTags: [{ type: "Competencia", id: "LIST" }],
    }),
    getCompetencia: builder.query<Competencia, number>({
      query: (id) => `/competencias/competencias/${id}/`,
      providesTags: (_, __, id) => [{ type: "Competencia", id }],
    }),
    createCompetencia: builder.mutation<Competencia, CompetenciaForm>({
      query: (body) => ({
        url: `/competencias/competencias/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Competencia", id: "LIST" }],
    }),
    updateCompetencia: builder.mutation<
      Competencia,
      { id: number; body: Partial<CompetenciaForm> }
    >({
      query: ({ id, body }) => ({
        url: `/competencias/competencias/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Competencia", id },
        { type: "Competencia", id: "LIST" },
      ],
    }),
    deleteCompetencia: builder.mutation<void, number>({
      query: (id) => ({
        url: `/competencias/competencias/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Competencia", id: "LIST" }],
    }),

    // ==========================================================
    // COMPETENCIAS POR CURSO  — /competencias/competencias-cursos/
    // ==========================================================

    getCompetenciasCurso: builder.query<
      PaginatedResponse<CompetenciaCurso>,
      number
    >({
      query: (cursoId) =>
        `/competencias/competencias-cursos/?curso=${cursoId}`,
      providesTags: [{ type: "CompetenciaCurso", id: "LIST" }],
    }),
    createCompetenciaCurso: builder.mutation<
      CompetenciaCurso,
      CompetenciaCursoForm
    >({
      query: (body) => ({
        url: `/competencias/competencias-cursos/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "CompetenciaCurso", id: "LIST" }],
    }),
    deleteCompetenciaCurso: builder.mutation<void, number>({
      query: (id) => ({
        url: `/competencias/competencias-cursos/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CompetenciaCurso", id: "LIST" }],
    }),

    // ==========================================================
    // COMPETENCIAS POR PUESTO  — /competencias/competencias-puestos/
    // Filtro por puesto (para la vista de detalle de un Puesto)
    // Filtro por competencia (para la tab Puestos en detalle de Competencia)
    // ==========================================================

    getCompetenciasPuestoByPuesto: builder.query<
      PaginatedResponse<CompetenciaPuesto>,
      number
    >({
      query: (puestoId) =>
        `/competencias/competencias-puestos/?puesto=${puestoId}`,
      providesTags: [{ type: "CompetenciaPuesto", id: "LIST" }],
    }),
    getCompetenciasPuestoByCompetencia: builder.query<
      PaginatedResponse<CompetenciaPuesto>,
      number
    >({
      query: (competenciaId) =>
        `/competencias/competencias-puestos/?competencia=${competenciaId}`,
      providesTags: [{ type: "CompetenciaPuesto", id: "LIST" }],
    }),
    createCompetenciaPuesto: builder.mutation<
      CompetenciaPuesto,
      CompetenciaPuestoForm
    >({
      query: (body) => ({
        url: `/competencias/competencias-puestos/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "CompetenciaPuesto", id: "LIST" }],
    }),
    updateCompetenciaPuesto: builder.mutation<
      CompetenciaPuesto,
      { id: number; body: Partial<CompetenciaPuestoForm> }
    >({
      query: ({ id, body }) => ({
        url: `/competencias/competencias-puestos/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "CompetenciaPuesto", id: "LIST" }],
    }),
    deleteCompetenciaPuesto: builder.mutation<void, number>({
      query: (id) => ({
        url: `/competencias/competencias-puestos/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CompetenciaPuesto", id: "LIST" }],
    }),
  }),
});

export const {
  // — catálogo —
  useGetCompetenciasQuery,
  useGetCompetenciaQuery,
  useCreateCompetenciaMutation,
  useUpdateCompetenciaMutation,
  useDeleteCompetenciaMutation,

  // — por curso —
  useGetCompetenciasCursoQuery,
  useCreateCompetenciaCursoMutation,
  useDeleteCompetenciaCursoMutation,

  // — por puesto —
  useGetCompetenciasPuestoByPuestoQuery,
  useGetCompetenciasPuestoByCompetenciaQuery,
  useCreateCompetenciaPuestoMutation,
  useUpdateCompetenciaPuestoMutation,
  useDeleteCompetenciaPuestoMutation,
} = competenciasApiSlice;