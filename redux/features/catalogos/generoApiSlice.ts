import { apiSlice } from "@/redux/services/apiSlice";
import { Genero } from "../types/auth/auth-types";
import { PaginatedResponse } from "../types/paginated";

const generoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneros: builder.query<Genero[], void>({
      query: () => "/catalogos/generos/?pagination=false",
      transformResponse: (response: Genero[] | PaginatedResponse<Genero>) =>
        Array.isArray(response) ? response : response.results,
    }),
    addGeneros: builder.mutation({
      query: (formData) => ({
        url: "/catalogos/generos/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useGetGenerosQuery, useAddGenerosMutation } = generoApiSlice;
