import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";

export interface Role {
  uuid: string;
  nombre: string;
  id: number;
}

const roleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<
      PaginatedResponse<Role>,
      { q: string; page: number }
    >({
      query: ({ q, page }) => `/sistema/roles/?q=${q}&page=${page}`,
    }),
  }),
});

export const { useGetRolesQuery } = roleApiSlice;
