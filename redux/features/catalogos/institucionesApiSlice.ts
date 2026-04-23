import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";
import { Instituciones } from "../types/catalagos/cat";

const institucionesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstituciones: builder.query<PaginatedResponse<Instituciones>, void>({
      query: () => "/catalogos/instituciones/",
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
