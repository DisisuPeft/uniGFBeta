import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";
import {
  MiInscripcion,
  MiProgresoTema,
  MiResultadoEvaluacion,
  CursoPlataforma,
  ModuloPlataforma,
  TemaPlataforma,
  BloqueContenido,
  EvaluacionPlataforma,
  PreguntaConOpciones,
} from "../types/capacitacion/plataforma-types";

const plataformaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- Catálogo de cursos (vista del colaborador, incluye inscrito + competencias) ---

    getCursosPlataforma: builder.query<PaginatedResponse<CursoPlataforma>, void>({
      query: () => "/capacitacion/ver/cursos/",
      providesTags: [{ type: "Curso", id: "PLATAFORMA-LIST" }],
    }),

    getCursoPlataforma: builder.query<CursoPlataforma, number>({
      query: (id) => `/capacitacion/ver/cursos/${id}/`,
      providesTags: (_, __, id) => [{ type: "Curso", id: `PLATAFORMA-${id}` }],
    }),

    getMisCursos: builder.query<PaginatedResponse<CursoPlataforma>, void>({
      query: () => "/capacitacion/mis-cursos/",
      providesTags: [{ type: "Curso", id: "MIS-CURSOS" }],
    }),

    // --- Contenido del curso (solo lectura) ---

    getModulos: builder.query<PaginatedResponse<ModuloPlataforma>, { curso: number }>({
      query: ({ curso }) => `/capacitacion/ver/modulos/?curso=${curso}`,
      providesTags: (_, __, { curso }) => [{ type: "Modulo", id: `PLATAFORMA-CURSO-${curso}` }],
    }),

    getTemas: builder.query<PaginatedResponse<TemaPlataforma>, { modulo: number }>({
      query: ({ modulo }) => `/capacitacion/ver/temas/?modulo=${modulo}`,
      providesTags: (_, __, { modulo }) => [{ type: "Tema", id: `PLATAFORMA-MODULO-${modulo}` }],
    }),

    getTema: builder.query<TemaPlataforma, number>({
      query: (id) => `/capacitacion/ver/temas/${id}/`,
      providesTags: (_, __, id) => [{ type: "Tema", id: `PLATAFORMA-${id}` }],
    }),

    getBloques: builder.query<PaginatedResponse<BloqueContenido>, { tema: number }>({
      query: ({ tema }) => `/capacitacion/ver/bloques/?tema=${tema}`,
      providesTags: (_, __, { tema }) => [
        { type: "ContenidoBloque", id: `PLATAFORMA-TEMA-${tema}` },
      ],
    }),

    getEvaluaciones: builder.query<
      PaginatedResponse<EvaluacionPlataforma>,
      { curso?: number; modulo?: number }
    >({
      query: ({ curso, modulo }) => {
        if (curso) return `/capacitacion/ver/evaluaciones/?curso=${curso}`;
        if (modulo) return `/capacitacion/ver/evaluaciones/?modulo=${modulo}`;
        return `/capacitacion/ver/evaluaciones/`;
      },
      providesTags: [{ type: "Evaluacion", id: "PLATAFORMA-LIST" }],
    }),

    getEvaluacion: builder.query<EvaluacionPlataforma, number>({
      query: (id) => `/capacitacion/ver/evaluaciones/${id}/`,
      providesTags: (_, __, id) => [{ type: "Evaluacion", id: `PLATAFORMA-${id}` }],
    }),

    // Preguntas con opciones anidadas — no hay endpoint separado para opciones
    getPreguntas: builder.query<PaginatedResponse<PreguntaConOpciones>, { evaluacion: number }>({
      query: ({ evaluacion }) => `/capacitacion/ver/preguntas/?evaluacion=${evaluacion}`,
      providesTags: (_, __, { evaluacion }) => [
        { type: "Pregunta", id: `PLATAFORMA-EVAL-${evaluacion}` },
      ],
    }),

    // --- Inscripciones ---

    getMisInscripciones: builder.query<PaginatedResponse<MiInscripcion>, void>({
      query: () => "/capacitacion/mis-inscripciones/",
      providesTags: [{ type: "MiInscripcion", id: "LIST" }],
    }),

    inscribirseACurso: builder.mutation<MiInscripcion, { curso: number }>({
      query: (body) => ({ url: "/capacitacion/mis-inscripciones/", method: "POST", body }),
      invalidatesTags: (_, __, { curso }) => [
        { type: "MiInscripcion", id: "LIST" },
        // Refrescar cursos para que inscrito:true se refleje sin recargar
        { type: "Curso", id: "PLATAFORMA-LIST" },
        { type: "Curso", id: "MIS-CURSOS" },
        { type: "Curso", id: `PLATAFORMA-${curso}` },
      ],
    }),

    marcarCursoCompletado: builder.mutation<
      MiInscripcion,
      { id: number; completado_at: string }
    >({
      query: ({ id, completado_at }) => ({
        url: `/capacitacion/mis-inscripciones/${id}/`,
        method: "PATCH",
        body: { completado_at },
      }),
      invalidatesTags: [
        { type: "MiInscripcion", id: "LIST" },
        { type: "Curso", id: "PLATAFORMA-LIST" },
        { type: "Curso", id: "MIS-CURSOS" },
        { type: "MiPerfil", id: "GAP" },
      ],
    }),

    // --- Progreso de temas ---

    getMisProgresos: builder.query<PaginatedResponse<MiProgresoTema>, void>({
      query: () => "/capacitacion/mis-progresos/",
      providesTags: [{ type: "MiProgreso", id: "LIST" }],
    }),

    // completado_at lo pone el backend con auto_now_add
    marcarTemaCompletado: builder.mutation<MiProgresoTema, { tema: number; curso: number }>({
      query: ({ tema }) => ({ url: "/capacitacion/mis-progresos/", method: "POST", body: { tema } }),
      invalidatesTags: (_, __, { curso }) => [
        { type: "MiProgreso", id: "LIST" },
        { type: "Curso", id: "PLATAFORMA-LIST" },
        { type: "Curso", id: "MIS-CURSOS" },
        { type: "Curso", id: `PLATAFORMA-${curso}` },
        { type: "Modulo" },
      ],
    }),

    // --- Resultados de evaluación ---

    getMisResultados: builder.query<PaginatedResponse<MiResultadoEvaluacion>, void>({
      query: () => "/capacitacion/mis-resultados/",
      providesTags: [{ type: "MiResultado", id: "LIST" }],
    }),

    enviarResultado: builder.mutation<
      MiResultadoEvaluacion,
      { evaluacion: number; respuestas: Array<{ pregunta: number; opcion: number }>; cursoId?: number }
    >({
      query: ({ evaluacion, respuestas }) => ({
        url: "/capacitacion/mis-resultados/",
        method: "POST",
        body: { evaluacion, respuestas },
      }),
      invalidatesTags: (_, __, { cursoId }) => [
        { type: "MiResultado", id: "LIST" },
        ...(cursoId
          ? ([
              { type: "Curso", id: "PLATAFORMA-LIST" },
              { type: "Curso", id: `PLATAFORMA-${cursoId}` },
              { type: "Modulo", id: `PLATAFORMA-CURSO-${cursoId}` },
            ] as const)
          : []),
      ],
    }),
  }),
});

export const {
  // catálogo
  useGetCursosPlataformaQuery,
  useGetCursoPlataformaQuery,
  useGetMisCursosQuery,
  // contenido
  useGetModulosQuery,
  useGetTemasQuery,
  useGetTemaQuery,
  useGetBloquesQuery,
  useGetEvaluacionesQuery,
  useGetEvaluacionQuery,
  useGetPreguntasQuery,
  // inscripciones
  useGetMisInscripcionesQuery,
  useInscribirseACursoMutation,
  useMarcarCursoCompletadoMutation,
  // progreso
  useGetMisProgresosQuery,
  useMarcarTemaCompletadoMutation,
  // resultados
  useGetMisResultadosQuery,
  useEnviarResultadoMutation,
} = plataformaApiSlice;