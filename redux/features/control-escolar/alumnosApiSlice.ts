import { apiSlice } from "@/redux/services/apiSlice";
import {
  EstudiantePerfil,
  EstudiantePerfilForm,
  Material,
  PagoFormData,
  ProgramaEducativoDetail,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";
import { MessageResponse, SuccessMessage } from "../types/reponse";
import {
  InscriptionDetail,
  ModulosInterface,
} from "../types/alumnos/inscription";

export interface InscripcionEstudiante {
  ref: string;
  programa_nombre: string;
  campania_nombre: string;
  fecha_ingreso: string | null;
  modulo_actual: number;
  total_modulos: number;
  status: number;
}

const alumnoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addEstudiantes: builder.mutation({
      query: (formData) => ({
        url: "/control-escolar/estudiantes/",
        method: "POST",
        body: formData,
      }),
    }),
    getEstudiantes: builder.query<
      PaginatedResponse<EstudiantePerfil>,
      { page?: number; search?: string; status?: string } | void
    >({
      query: (params = {}) => {
        const { page = 1, search, status } = params as { page?: number; search?: string; status?: string };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        if (status && status !== "all") qs.set("status", status);
        return `/control-escolar/estudiantes/?${qs.toString()}`;
      },
    }),
    retrieveEstudiante: builder.query<EstudiantePerfilForm, string>({
      query: (uuid) => `/control-escolar/estudiantes/${uuid}/`,
    }),
    updateEstudiante: builder.mutation<
      MessageResponse,
      { uuid: string; formData: EstudiantePerfilForm }
    >({
      query: ({ uuid, formData }) => ({
        url: `/control-escolar/estudiantes/${uuid}/`,
        method: "PATCH",
        body: formData,
      }),
    }),
    makeInscription: builder.mutation<
      SuccessMessage,
      {
        campania: string | undefined;
        estudianteId: string | undefined;
        formData: PagoFormData;
      }
    >({
      query: ({ campania, estudianteId, formData }) => ({
        url: `/control-escolar/inscripciones/?campania=${campania}&estudiante=${estudianteId}`,
        method: "POST",
        body: formData,
      }),
    }),
    inscriptionAlumnoDetail: builder.query<InscriptionDetail, void>({
      query: () => `/control-escolar/inscripciones/inscription_details_alumno/`,
    }),
    programaEstudiante: builder.query<ProgramaEducativoDetail, string>({
      query: (id) =>
        `/control-escolar/programas-educativos/${id}/programa_estudiante`,
    }),
    ModuloPrograma: builder.query<
      ModulosInterface,
      { id: string; moduloId: number }
    >({
      query: ({ id, moduloId }) =>
        `/control-escolar/programas-educativos/${id}/modulos?modulo=${moduloId}`,
    }),
    getMaterialesModulo: builder.query<PaginatedResponse<Material>, number>({
      query: (moduloId) => `/control-escolar/materiales/?modulo=${moduloId}`,
    }),
    getMaterialesPrograma: builder.query<PaginatedResponse<Material>, string>({
      query: (programaId) => `/control-escolar/materiales/?programa=${programaId}`,
    }),
    getInscripcionesEstudiante: builder.query<InscripcionEstudiante[], string>({
      query: (uuid) => `/control-escolar/estudiantes/${uuid}/inscripciones/`,
    }),
  }),
});

export const {
  useAddEstudiantesMutation,
  useGetEstudiantesQuery,
  useRetrieveEstudianteQuery,
  useUpdateEstudianteMutation,
  useMakeInscriptionMutation,
  useInscriptionAlumnoDetailQuery,
  useProgramaEstudianteQuery,
  useModuloProgramaQuery,
  useGetMaterialesModuloQuery,
  useGetMaterialesProgramaQuery,
  useGetInscripcionesEstudianteQuery,
} = alumnoApiSlice;
