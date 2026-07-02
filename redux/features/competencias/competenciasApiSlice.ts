import { apiSlice } from "@/redux/services/apiSlice";
import {
  Competencia,
  CompetenciaForm,
  CompetenciaCurso,
  CompetenciaCursoForm,
  CompetenciaPuesto,
  CompetenciaPuestoForm,
  RutaAprendizaje,
  RutaAprendizajeForm,
  MiPerfilCompetencia,
  CompetenciaColaborador,
  CompetenciaColaboradorForm,
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

    // ==========================================================
    // GAP ANALYSIS (colaborador autenticado)  — /competencias/mi-perfil/
    // ==========================================================

    getMiPerfil: builder.query<MiPerfilCompetencia[], void>({
      query: () => `/competencias/mi-perfil/`,
      providesTags: [{ type: "MiPerfil", id: "GAP" }],
    }),

    // ==========================================================
    // RUTAS DE APRENDIZAJE  — /competencias/rutas-aprendizaje/
    // ==========================================================

    getRutasAprendizaje: builder.query<
      PaginatedResponse<RutaAprendizaje>,
      { competencia?: number } | void
    >({
      query: (args) => {
        const qs = args?.competencia ? `?competencia=${args.competencia}` : "";
        return `/competencias/rutas-aprendizaje/${qs}`;
      },
      providesTags: [{ type: "RutaAprendizaje", id: "LIST" }],
    }),
    getRutaAprendizaje: builder.query<RutaAprendizaje, number>({
      query: (id) => `/competencias/rutas-aprendizaje/${id}/`,
      providesTags: (_, __, id) => [{ type: "RutaAprendizaje", id }],
    }),
    createRutaAprendizaje: builder.mutation<RutaAprendizaje, RutaAprendizajeForm>({
      query: (body) => ({
        url: `/competencias/rutas-aprendizaje/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "RutaAprendizaje", id: "LIST" }],
    }),
    updateRutaAprendizaje: builder.mutation<
      RutaAprendizaje,
      { id: number; body: Partial<RutaAprendizajeForm> }
    >({
      query: ({ id, body }) => ({
        url: `/competencias/rutas-aprendizaje/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "RutaAprendizaje", id },
        { type: "RutaAprendizaje", id: "LIST" },
      ],
    }),
    deleteRutaAprendizaje: builder.mutation<void, number>({
      query: (id) => ({
        url: `/competencias/rutas-aprendizaje/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "RutaAprendizaje", id: "LIST" }],
    }),

    // ==========================================================
    // NIVEL DE COLABORADOR (admin)  — /competencias/competencias-colaborador/
    // ==========================================================

    getCompetenciasColaborador: builder.query<
      PaginatedResponse<CompetenciaColaborador>,
      number
    >({
      query: (colaboradorId) =>
        `/competencias/competencias-colaborador/?colaborador=${colaboradorId}`,
      providesTags: (_, __, id) => [{ type: "CompetenciaColaborador", id }],
    }),
    updateCompetenciaColaborador: builder.mutation<
      CompetenciaColaborador,
      { id: number; body: CompetenciaColaboradorForm }
    >({
      query: ({ id, body }) => ({
        url: `/competencias/competencias-colaborador/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "CompetenciaColaborador", id },
      ],
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

  // — gap analysis (colaborador) —
  useGetMiPerfilQuery,

  // — rutas de aprendizaje —
  useGetRutasAprendizajeQuery,
  useGetRutaAprendizajeQuery,
  useCreateRutaAprendizajeMutation,
  useUpdateRutaAprendizajeMutation,
  useDeleteRutaAprendizajeMutation,

  // — nivel colaborador (admin) —
  useGetCompetenciasColaboradorQuery,
  useUpdateCompetenciaColaboradorMutation,
} = competenciasApiSlice;