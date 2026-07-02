import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";
import {
  Curso, CursoForm,
  Modulo, ModuloForm,
  Tema, TemaForm,
  ContenidoBloque, BloqueForm,
  Evaluacion, EvaluacionForm,
  Pregunta, PreguntaForm,
  OpcionPregunta, OpcionPreguntaForm,
} from "../types/capacitacion/types";

const capacitacionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================================
    // CURSOS  — /capacitacion/cursos/
    // ==========================================================

    getCursos: builder.query<PaginatedResponse<Curso>, void>({
      query: () => "/capacitacion/cursos/",
      providesTags: [{ type: "Curso", id: "LIST" }],
    }),
    getCurso: builder.query<Curso, number>({
      query: (id) => `/capacitacion/cursos/${id}/`,
      providesTags: (_, __, id) => [{ type: "Curso", id }],
    }),
    createCurso: builder.mutation<Curso, CursoForm>({
      query: (body) => ({ url: "/capacitacion/cursos/", method: "POST", body }),
      invalidatesTags: [{ type: "Curso", id: "LIST" }],
    }),
    updateCurso: builder.mutation<Curso, { id: number; body: Partial<CursoForm> }>({
      query: ({ id, body }) => ({ url: `/capacitacion/cursos/${id}/`, method: "PATCH", body }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Curso", id },
        { type: "Curso", id: "LIST" },
      ],
    }),
    deleteCurso: builder.mutation<void, number>({
      query: (id) => ({ url: `/capacitacion/cursos/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Curso", id: "LIST" }],
    }),

    // ==========================================================
    // MÓDULOS  — /capacitacion/modulos/
    // ==========================================================

    getModulosByCurso: builder.query<PaginatedResponse<Modulo>, number>({
      query: (cursoId) => `/capacitacion/modulos/?curso=${cursoId}`,
      providesTags: [{ type: "Modulo", id: "LIST" }],
    }),
    createModulo: builder.mutation<Modulo, ModuloForm>({
      query: (body) => ({ url: "/capacitacion/modulos/", method: "POST", body }),
      invalidatesTags: [{ type: "Modulo", id: "LIST" }],
    }),
    updateModulo: builder.mutation<Modulo, { id: number; body: Partial<ModuloForm> }>({
      query: ({ id, body }) => ({ url: `/capacitacion/modulos/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "Modulo", id: "LIST" }],
    }),
    deleteModulo: builder.mutation<void, number>({
      query: (id) => ({ url: `/capacitacion/modulos/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Modulo", id: "LIST" }],
    }),

    // ==========================================================
    // TEMAS  — /capacitacion/temas/
    // ==========================================================

    getTemasByModulo: builder.query<PaginatedResponse<Tema>, number>({
      query: (moduloId) => `/capacitacion/temas/?modulo=${moduloId}`,
      providesTags: [{ type: "Tema", id: "LIST" }],
    }),
    createTema: builder.mutation<Tema, TemaForm>({
      query: (body) => ({ url: "/capacitacion/temas/", method: "POST", body }),
      invalidatesTags: [{ type: "Tema", id: "LIST" }],
    }),
    updateTema: builder.mutation<Tema, { id: number; body: Partial<TemaForm> }>({
      query: ({ id, body }) => ({ url: `/capacitacion/temas/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "Tema", id: "LIST" }],
    }),
    deleteTema: builder.mutation<void, number>({
      query: (id) => ({ url: `/capacitacion/temas/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Tema", id: "LIST" }],
    }),

    // ==========================================================
    // BLOQUES DE CONTENIDO  — /capacitacion/bloques/
    // ==========================================================

    getBloquesByTema: builder.query<PaginatedResponse<ContenidoBloque>, number>({
      query: (temaId) => `/capacitacion/bloques/?tema=${temaId}`,
      providesTags: [{ type: "ContenidoBloque", id: "LIST" }],
    }),
    createBloque: builder.mutation<ContenidoBloque, BloqueForm | FormData>({
      query: (body) => ({ url: "/capacitacion/bloques/", method: "POST", body }),
      invalidatesTags: [{ type: "ContenidoBloque", id: "LIST" }],
    }),
    updateBloque: builder.mutation<ContenidoBloque, { id: number; body: Partial<BloqueForm> | FormData }>({
      query: ({ id, body }) => ({ url: `/capacitacion/bloques/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "ContenidoBloque", id: "LIST" }],
    }),
    deleteBloque: builder.mutation<void, number>({
      query: (id) => ({ url: `/capacitacion/bloques/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "ContenidoBloque", id: "LIST" }],
    }),

    // ==========================================================
    // EVALUACIONES  — /capacitacion/evaluaciones/
    // ==========================================================

    getEvaluacionesByCurso: builder.query<PaginatedResponse<Evaluacion>, number>({
      query: (cursoId) => `/capacitacion/evaluaciones/?curso=${cursoId}`,
      providesTags: [{ type: "Evaluacion", id: "LIST" }],
    }),
    getEvaluacionesByModulo: builder.query<PaginatedResponse<Evaluacion>, number>({
      query: (moduloId) => `/capacitacion/evaluaciones/?modulo=${moduloId}`,
      providesTags: [{ type: "Evaluacion", id: "LIST" }],
    }),
    createEvaluacion: builder.mutation<Evaluacion, EvaluacionForm>({
      query: (body) => ({ url: "/capacitacion/evaluaciones/", method: "POST", body }),
      invalidatesTags: [{ type: "Evaluacion", id: "LIST" }],
    }),
    updateEvaluacion: builder.mutation<Evaluacion, { id: number; body: Partial<EvaluacionForm> }>({
      query: ({ id, body }) => ({ url: `/capacitacion/evaluaciones/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "Evaluacion", id: "LIST" }],
    }),
    deleteEvaluacion: builder.mutation<void, number>({
      query: (id) => ({ url: `/capacitacion/evaluaciones/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Evaluacion", id: "LIST" }],
    }),

    // ==========================================================
    // PREGUNTAS  — /capacitacion/preguntas/
    // ==========================================================

    getPreguntasByEvaluacion: builder.query<PaginatedResponse<Pregunta>, number>({
      query: (evaluacionId) => `/capacitacion/preguntas/?evaluacion=${evaluacionId}`,
      providesTags: [{ type: "Pregunta", id: "LIST" }],
    }),
    createPregunta: builder.mutation<Pregunta, PreguntaForm>({
      query: (body) => ({ url: "/capacitacion/preguntas/", method: "POST", body }),
      invalidatesTags: [{ type: "Pregunta", id: "LIST" }],
    }),
    updatePregunta: builder.mutation<Pregunta, { id: number; body: Partial<PreguntaForm> }>({
      query: ({ id, body }) => ({ url: `/capacitacion/preguntas/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "Pregunta", id: "LIST" }],
    }),
    deletePregunta: builder.mutation<void, number>({
      query: (id) => ({ url: `/capacitacion/preguntas/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Pregunta", id: "LIST" }],
    }),

    // ==========================================================
    // OPCIONES DE PREGUNTA  — /capacitacion/opciones/
    // ==========================================================

    getOpcionesByPregunta: builder.query<PaginatedResponse<OpcionPregunta>, number>({
      query: (preguntaId) => `/capacitacion/opciones/?pregunta=${preguntaId}`,
      providesTags: [{ type: "OpcionPregunta", id: "LIST" }],
    }),
    createOpcion: builder.mutation<OpcionPregunta, OpcionPreguntaForm>({
      query: (body) => ({ url: "/capacitacion/opciones/", method: "POST", body }),
      invalidatesTags: [{ type: "OpcionPregunta", id: "LIST" }],
    }),
    updateOpcion: builder.mutation<OpcionPregunta, { id: number; body: Partial<OpcionPreguntaForm> }>({
      query: ({ id, body }) => ({ url: `/capacitacion/opciones/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "OpcionPregunta", id: "LIST" }],
    }),
    deleteOpcion: builder.mutation<void, number>({
      query: (id) => ({ url: `/capacitacion/opciones/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "OpcionPregunta", id: "LIST" }],
    }),
  }),
});

export const {
  // — cursos —
  useGetCursosQuery,
  useGetCursoQuery,
  useCreateCursoMutation,
  useUpdateCursoMutation,
  useDeleteCursoMutation,

  // — módulos —
  useGetModulosByCursoQuery,
  useCreateModuloMutation,
  useUpdateModuloMutation,
  useDeleteModuloMutation,

  // — temas —
  useGetTemasByModuloQuery,
  useCreateTemaMutation,
  useUpdateTemaMutation,
  useDeleteTemaMutation,

  // — bloques —
  useGetBloquesByTemaQuery,
  useCreateBloqueMutation,
  useUpdateBloqueMutation,
  useDeleteBloqueMutation,

  // — evaluaciones —
  useGetEvaluacionesByCursoQuery,
  useGetEvaluacionesByModuloQuery,
  useCreateEvaluacionMutation,
  useUpdateEvaluacionMutation,
  useDeleteEvaluacionMutation,

  // — preguntas —
  useGetPreguntasByEvaluacionQuery,
  useCreatePreguntaMutation,
  useUpdatePreguntaMutation,
  useDeletePreguntaMutation,

  // — opciones —
  useGetOpcionesByPreguntaQuery,
  useCreateOpcionMutation,
  useUpdateOpcionMutation,
  useDeleteOpcionMutation,
} = capacitacionApiSlice;