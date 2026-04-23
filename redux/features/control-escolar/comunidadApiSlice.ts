import { apiSlice } from "@/redux/services/apiSlice";
import {
  EnlaceClase,
  Comentario,
  ComentarioSimple,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";

const comunidadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMisClases: builder.query<EnlaceClase[], void>({
      query: () => "/control-escolar/comunidad/enlaces-clase/mis_clases/",
    }),
    getComentarios: builder.query<
      PaginatedResponse<Comentario>,
      { diplomado?: string; modulo?: number }
    >({
      query: ({ diplomado, modulo } = {}) => {
        const params = new URLSearchParams();
        if (diplomado) params.append("diplomado", diplomado);
        if (modulo) params.append("modulo", String(modulo));
        return `/control-escolar/comunidad/comentarios/?${params.toString()}`;
      },
    }),
    createComentario: builder.mutation<
      Comentario,
      { comentario: string; diplomado?: string; modulo?: number }
    >({
      query: (body) => ({
        url: "/control-escolar/comunidad/comentarios/",
        method: "POST",
        body,
      }),
    }),
    responderComentario: builder.mutation<
      ComentarioSimple,
      { id: number; comentario: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/comunidad/comentarios/${id}/responder/`,
        method: "POST",
        body,
      }),
    }),
    marcarComentarioVisto: builder.mutation<void, { comentario: number }>({
      query: (body) => ({
        url: "/control-escolar/comunidad/comentarios-vistos/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetMisClasesQuery,
  useGetComentariosQuery,
  useCreateComentarioMutation,
  useResponderComentarioMutation,
  useMarcarComentarioVistoMutation,
} = comunidadApiSlice;
