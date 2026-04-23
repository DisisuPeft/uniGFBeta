import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";

export interface User {
  nombre: string;
}

export interface Maestro {
  user: User;
}

export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  duracion_horas: number;
  status: number;
  instructor: Maestro[];
}

const cursosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCursos: builder.query<PaginatedResponse<Curso>, void>({
      query: () => `/farrera/cursos/`,
    }),
    getCurso: builder.query<Curso, number>({
      query: (id) => `/farrera/cursos/${id}/`,
    }),
  }),
});

export const { useGetCursosQuery, useGetCursoQuery } = cursosApiSlice;
