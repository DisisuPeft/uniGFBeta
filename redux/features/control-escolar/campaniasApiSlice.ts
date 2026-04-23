import { apiSlice } from "@/redux/services/apiSlice";
import { Campania } from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";
const campaniasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCampanias: builder.mutation({
      query: (formData) => ({
        url: "/control-escolar/campanias/",
        method: "POST",
        body: formData,
      }),
    }),
    retrieveCampanias: builder.query<
      PaginatedResponse<Campania>,
      { page?: number; search?: string } | void
    >({
      query: (params = {}) => {
        const { page = 1, search } = params as { page?: number; search?: string };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        return `/control-escolar/campanias/?${qs.toString()}`;
      },
    }),
    howManyCampanias: builder.query<number, void>({
      query: () => "/control-escolar/campanias/howmanycampanias/",
    }),
  }),
});

export const {
  useCreateCampaniasMutation,
  useRetrieveCampaniasQuery,
  useHowManyCampaniasQuery,
} = campaniasApiSlice;
