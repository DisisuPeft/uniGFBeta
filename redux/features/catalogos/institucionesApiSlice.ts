import { apiSlice } from "@/redux/services/apiSlice";
import { Instituciones } from "../types/catalagos/cat";

const institucionesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstituciones: builder.query<Instituciones[], void>({
      query: () => "/catalogos/instituciones/?pagination=false",
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
