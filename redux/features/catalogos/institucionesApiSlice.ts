import { apiSlice } from "@/redux/services/apiSlice";
import { Instituciones } from "../types/catalagos/cat";
import { PaginatedResponse } from "../types/paginated";

const institucionesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstituciones: builder.query<Instituciones[], void>({
      query: () => "/catalogos/instituciones/?pagination=false",
      transformResponse: (response: Instituciones[] | PaginatedResponse<Instituciones>) =>
        Array.isArray(response) ? response : response.results,
    }),
    addInstituciones: builder.mutation({
      query: (formData) => ({
        url: "/catalogos/instituciones/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useAddInstitucionesMutation, useGetInstitucionesQuery } =
  institucionesApiSlice;
