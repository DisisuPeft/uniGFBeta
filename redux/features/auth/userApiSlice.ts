import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";
import { UserFormData } from "@/hooks/users/user-create-form";

export interface User {
  uuid: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  genero: number;
  genero_name: string;
  edad: number;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  status: number;
}

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      PaginatedResponse<User>,
      { q: string; page: number }
    >({
      query: ({ q, page }) => `/sistema/usuarios/?q=${q}&page=${page}`,
    }),
    addUser: builder.mutation({
      query: (formData) => ({
        url: "/sistema/usuarios/",
        method: "POST",
        body: formData,
      }),
    }),
    getUser: builder.query<UserFormData, string | null | undefined>({
      query: (uuid) => `/sistema/usuarios/${uuid}/`,
    }),
    editUser: builder.mutation<
      string,
      { formData: UserFormData; id: string | null | undefined }
    >({
      query: ({ formData, id }) => ({
        url: `/sistema/usuarios/${id}/`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useGetUserQuery,
  useEditUserMutation,
} = userApiSlice;
