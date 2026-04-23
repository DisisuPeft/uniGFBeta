import { apiSlice } from "@/redux/services/apiSlice";
import { Genero } from "../types/auth/auth-types";
import { PaginatedResponse } from "../types/paginated";

const generoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneros: builder.query<PaginatedResponse<Genero>, void>({
      query: () => "/catalogos/generos/",
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
