import { apiSlice } from "@/redux/services/apiSlice";
import {
  Empresa,
  Dependencia,
  Departamento,
  DepartamentoForm,
  Puesto,
  PuestoForm,
  ModuloNav,
  ModuloNavForm,
  Pestana,
  PestanaForm,
  SidebarModulo,
  SidebarPestana,
  Permiso,
  Rol,
  RolForm,
  Usuario,
  UsuarioForm,
} from "../types/sistema/types";
import { PaginatedResponse } from "../types/paginated";

const sistemaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================================
    // EMPRESA  — /sistema/empresas/
    // Empresa y Dependencia usan FormData (tienen campo logo)
    // ==========================================================

    // Compatibilidad con uso existente en instituciones-grid / plan-pago-tab
    getEmpresa: builder.query<PaginatedResponse<Empresa>, string>({
      query: (slug) => `/sistema/empresa/?slug=${slug}`,
    }),
    getEmpresas: builder.query<PaginatedResponse<Empresa>, void>({
      query: () => `/sistema/empresa/`,
    }),

    // CRUD admin
    getEmpresasAdmin: builder.query<PaginatedResponse<Empresa>, void>({
      query: () => `/sistema/empresas/`,
      providesTags: [{ type: "Empresa", id: "LIST" }],
    }),
    getEmpresaAdmin: builder.query<Empresa, number>({
      query: (id) => `/sistema/empresas/${id}/`,
      providesTags: (_, __, id) => [{ type: "Empresa", id }],
    }),
    createEmpresa: builder.mutation<Empresa, FormData>({
      query: (body) => ({ url: `/sistema/empresas/`, method: "POST", body }),
      invalidatesTags: [{ type: "Empresa", id: "LIST" }],
    }),
    updateEmpresa: builder.mutation<Empresa, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/sistema/empresas/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Empresa", id },
        { type: "Empresa", id: "LIST" },
      ],
    }),
    deleteEmpresa: builder.mutation<void, number>({
      query: (id) => ({ url: `/sistema/empresas/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Empresa", id: "LIST" }],
    }),

    // ==========================================================
    // DEPENDENCIA  — /sistema/dependencias/
    // ==========================================================

    getDependencias: builder.query<
      PaginatedResponse<Dependencia>,
      number | void
    >({
      query: (empresaId) =>
        empresaId
          ? `/sistema/dependencias/?empresa=${empresaId}`
          : `/sistema/dependencias/`,
      providesTags: [{ type: "Dependencia", id: "LIST" }],
    }),
    getDependencia: builder.query<Dependencia, number>({
      query: (id) => `/sistema/dependencias/${id}/`,
      providesTags: (_, __, id) => [{ type: "Dependencia", id }],
    }),
    createDependencia: builder.mutation<Dependencia, FormData>({
      query: (body) => ({
        url: `/sistema/dependencias/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Dependencia", id: "LIST" }],
    }),
    updateDependencia: builder.mutation<
      Dependencia,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/sistema/dependencias/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Dependencia", id },
        { type: "Dependencia", id: "LIST" },
      ],
    }),
    deleteDependencia: builder.mutation<void, number>({
      query: (id) => ({
        url: `/sistema/dependencias/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Dependencia", id: "LIST" }],
    }),

    // ==========================================================
    // DEPARTAMENTO  — /sistema/departamentos/
    // Soft-delete: el DELETE marca como eliminado, no aparece en listas
    // ==========================================================

    getDepartamentos: builder.query<PaginatedResponse<Departamento>, void>({
      query: () => `/sistema/departamentos/`,
      providesTags: [{ type: "Departamento", id: "LIST" }],
    }),
    getDepartamento: builder.query<PaginatedResponse<Departamento>, number>({
      query: (id) => `/sistema/departamentos/${id}/`,
      providesTags: (_, __, id) => [{ type: "Departamento", id }],
    }),
    createDepartamento: builder.mutation<Departamento, DepartamentoForm>({
      query: (body) => ({
        url: `/sistema/departamentos/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Departamento", id: "LIST" }],
    }),
    updateDepartamento: builder.mutation<
      Departamento,
      { id: number; body: Partial<DepartamentoForm> }
    >({
      query: ({ id, body }) => ({
        url: `/sistema/departamentos/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Departamento", id },
        { type: "Departamento", id: "LIST" },
      ],
    }),
    deleteDepartamento: builder.mutation<void, number>({
      query: (id) => ({
        url: `/sistema/departamentos/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Departamento", id: "LIST" }],
    }),

    // ==========================================================
    // PUESTO  — /sistema/puestos/
    // Soft-delete. codigo único por departamento (validar en form)
    // ==========================================================

    getPuestos: builder.query<PaginatedResponse<Puesto>, number | void>({
      query: (departamentoId) =>
        departamentoId
          ? `/sistema/puestos/?departamento=${departamentoId}`
          : `/sistema/puestos/`,
      providesTags: [{ type: "Puesto", id: "LIST" }],
    }),
    getPuesto: builder.query<Puesto, number>({
      query: (id) => `/sistema/puestos/${id}/`,
      providesTags: (_, __, id) => [{ type: "Puesto", id }],
    }),
    createPuesto: builder.mutation<Puesto, PuestoForm>({
      query: (body) => ({ url: `/sistema/puestos/`, method: "POST", body }),
      invalidatesTags: [{ type: "Puesto", id: "LIST" }],
    }),
    updatePuesto: builder.mutation<
      Puesto,
      { id: number; body: Partial<PuestoForm> }
    >({
      query: ({ id, body }) => ({
        url: `/sistema/puestos/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Puesto", id },
        { type: "Puesto", id: "LIST" },
      ],
    }),
    deletePuesto: builder.mutation<void, number>({
      query: (id) => ({ url: `/sistema/puestos/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Puesto", id: "LIST" }],
    }),

    // ==========================================================
    // MÓDULOS DE NAVEGACIÓN  — /sistema/modulos/
    // La respuesta incluye pestanias[] anidadas (read-only)
    // ==========================================================

    getModulosNav: builder.query<PaginatedResponse<ModuloNav>, void>({
      query: () => `/sistema/modulos/`,
      providesTags: [{ type: "ModuloNav", id: "LIST" }],
    }),
    getModuloNav: builder.query<ModuloNav, number>({
      query: (id) => `/sistema/modulos/${id}/`,
      providesTags: (_, __, id) => [{ type: "ModuloNav", id }],
    }),
    createModuloNav: builder.mutation<ModuloNav, ModuloNavForm>({
      query: (body) => ({ url: `/sistema/modulos/`, method: "POST", body }),
      invalidatesTags: [
        { type: "ModuloNav", id: "LIST" },
        { type: "Sidebar", id: "MODULOS" },
        { type: "User", id: "ME" },
      ],
    }),
    updateModuloNav: builder.mutation<
      ModuloNav,
      { id: number; body: Partial<ModuloNavForm> }
    >({
      query: ({ id, body }) => ({
        url: `/sistema/modulos/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "ModuloNav", id },
        { type: "ModuloNav", id: "LIST" },
        { type: "Sidebar", id: "MODULOS" },
        { type: "User", id: "ME" },
      ],
    }),
    deleteModuloNav: builder.mutation<void, number>({
      query: (id) => ({ url: `/sistema/modulos/${id}/`, method: "DELETE" }),
      invalidatesTags: [
        { type: "ModuloNav", id: "LIST" },
        { type: "Sidebar", id: "MODULOS" },
        { type: "User", id: "ME" },
      ],
    }),

    // ==========================================================
    // PESTAÑAS DE NAVEGACIÓN  — /sistema/pestanias/
    // permission[] → IDs; permission_detail[] → lectura (read-only en respuesta)
    // ==========================================================

    getPestanas: builder.query<PaginatedResponse<Pestana>, number | void>({
      query: (moduloId) =>
        moduloId
          ? `/sistema/pestanias/?modulo=${moduloId}`
          : `/sistema/pestanias/`,
      providesTags: [{ type: "Pestana", id: "LIST" }],
    }),
    getPestana: builder.query<Pestana, number>({
      query: (id) => `/sistema/pestanias/${id}/`,
      providesTags: (_, __, id) => [{ type: "Pestana", id }],
    }),
    createPestana: builder.mutation<Pestana, PestanaForm>({
      query: (body) => ({ url: `/sistema/pestanias/`, method: "POST", body }),
      invalidatesTags: [
        { type: "Pestana", id: "LIST" },
        { type: "ModuloNav", id: "LIST" },
        { type: "Sidebar", id: "MODULOS" },
        { type: "User", id: "ME" },
      ],
    }),
    updatePestana: builder.mutation<
      Pestana,
      { id: number; body: Partial<PestanaForm> }
    >({
      query: ({ id, body }) => ({
        url: `/sistema/pestanias/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Pestana", id },
        { type: "Pestana", id: "LIST" },
        { type: "ModuloNav", id: "LIST" },
        { type: "Sidebar", id: "MODULOS" },
        { type: "User", id: "ME" },
      ],
    }),
    deletePestana: builder.mutation<void, number>({
      query: (id) => ({ url: `/sistema/pestanias/${id}/`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Pestana", id: "LIST" },
        { type: "ModuloNav", id: "LIST" },
        { type: "Sidebar", id: "MODULOS" },
        { type: "User", id: "ME" },
      ],
    }),

    // ==========================================================
    // USUARIOS  — /sistema/usuarios/   (uuid como PK)
    // ==========================================================

    getUsuarios: builder.query<PaginatedResponse<Usuario>, void>({
      query: () => `/sistema/usuarios/`,
      providesTags: [{ type: "Usuario", id: "LIST" }],
    }),
    createUsuario: builder.mutation<Usuario, UsuarioForm>({
      query: (body) => ({ url: `/sistema/usuarios/`, method: "POST", body }),
      invalidatesTags: [{ type: "Usuario", id: "LIST" }],
    }),
    updateUsuario: builder.mutation<Usuario, { uuid: string; body: Partial<UsuarioForm> }>({
      query: ({ uuid, body }) => ({ url: `/sistema/usuarios/${uuid}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "Usuario", id: "LIST" }],
    }),
    deleteUsuario: builder.mutation<void, string>({
      query: (uuid) => ({ url: `/sistema/usuarios/${uuid}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Usuario", id: "LIST" }],
    }),

    // ==========================================================
    // ROLES  — /sistema/roles/
    // permission[] reemplaza todos los permisos en PATCH
    // ==========================================================

    getRoles: builder.query<PaginatedResponse<Rol>, void>({
      query: () => `/sistema/roles/`,
      providesTags: [{ type: "Rol", id: "LIST" }],
    }),
    createRol: builder.mutation<Rol, RolForm>({
      query: (body) => ({ url: `/sistema/roles/`, method: "POST", body }),
      invalidatesTags: [{ type: "Rol", id: "LIST" }],
    }),
    updateRol: builder.mutation<Rol, { id: number; body: Partial<RolForm> }>({
      query: ({ id, body }) => ({ url: `/sistema/roles/${id}/`, method: "PATCH", body }),
      invalidatesTags: [{ type: "Rol", id: "LIST" }],
    }),
    deleteRol: builder.mutation<void, number>({
      query: (id) => ({ url: `/sistema/roles/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Rol", id: "LIST" }],
    }),

    // ==========================================================
    // SIDEBAR  — solo lectura, cualquier usuario autenticado
    // ==========================================================

    getSidebarModulos: builder.query<SidebarModulo[], void>({
      query: () => `/sistema/sidebar/modulos/`,
      providesTags: [{ type: "Sidebar", id: "MODULOS" }],
    }),
    // ref = uuid del módulo
    getSidebarPestanas: builder.query<SidebarPestana[], string>({
      query: (ref) => `/sistema/sidebar/pestanias/?ref=${ref}`,
      providesTags: [{ type: "Sidebar", id: "MODULOS" }],
    }),

    // ==========================================================
    // PERMISOS  — catálogo, solo lectura
    // app: "sistema" | "capacitacion" | "competencias" | undefined
    // ==========================================================

    getPermisos: builder.query<Permiso[], string | void>({
      query: (app) =>
        app ? `/sistema/permisos/?app=${app}` : `/sistema/permisos/`,
    }),
  }),
});

export const {
  // — legacy (mantener para instituciones-grid y plan-pago-tab) —
  useGetEmpresaQuery,
  useGetEmpresasQuery,

  // — empresa admin —
  useGetEmpresasAdminQuery,
  useGetEmpresaAdminQuery,
  useCreateEmpresaMutation,
  useUpdateEmpresaMutation,
  useDeleteEmpresaMutation,

  // — dependencia —
  useGetDependenciasQuery,
  useGetDependenciaQuery,
  useCreateDependenciaMutation,
  useUpdateDependenciaMutation,
  useDeleteDependenciaMutation,

  // — departamento —
  useGetDepartamentosQuery,
  useGetDepartamentoQuery,
  useCreateDepartamentoMutation,
  useUpdateDepartamentoMutation,
  useDeleteDepartamentoMutation,

  // — puesto —
  useGetPuestosQuery,
  useGetPuestoQuery,
  useCreatePuestoMutation,
  useUpdatePuestoMutation,
  useDeletePuestoMutation,

  // — módulos de navegación —
  useGetModulosNavQuery,
  useGetModuloNavQuery,
  useCreateModuloNavMutation,
  useUpdateModuloNavMutation,
  useDeleteModuloNavMutation,

  // — pestañas —
  useGetPestanasQuery,
  useGetPestanaQuery,
  useCreatePestanaMutation,
  useUpdatePestanaMutation,
  useDeletePestanaMutation,

  // — usuarios —
  useGetUsuariosQuery,
  useCreateUsuarioMutation,
  useUpdateUsuarioMutation,
  useDeleteUsuarioMutation,

  // — roles —
  useGetRolesQuery,
  useCreateRolMutation,
  useUpdateRolMutation,
  useDeleteRolMutation,

  // — sidebar —
  useGetSidebarModulosQuery,
  useGetSidebarPestanasQuery,

  // — permisos —
  useGetPermisosQuery,
} = sistemaApiSlice;
