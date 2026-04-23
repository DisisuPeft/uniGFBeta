import { apiSlice } from "@/redux/services/apiSlice";

export interface DashboardResumen {
  estudiantes_total: number;
  programas_activos: number;
  campanias_activas: number;
  ingresos_mes: number;
  estudiantes_nuevos_mes: number;
}

export interface AlumnoReciente {
  ref: string;
  nombre: string;
  matricula: string;
  programa_nombre: string;
  fecha_inscripcion: string;
  status: number;
}

export interface CampaniaProxima {
  ref: string;
  nombre: string;
  fecha_fin: string;
  inscritos: number;
  cupo_maximo: number;
  programa_nombre: string;
}

const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardResumen: builder.query<DashboardResumen, void>({
      query: () => "/control-escolar/dashboard/resumen/",
    }),
    getAlumnosRecientes: builder.query<AlumnoReciente[], void>({
      query: () => "/control-escolar/dashboard/alumnos_recientes/",
    }),
    getCampaniasProximas: builder.query<CampaniaProxima[], void>({
      query: () => "/control-escolar/dashboard/campanias_proximas/",
    }),
  }),
});

export const {
  useGetDashboardResumenQuery,
  useGetAlumnosRecientesQuery,
  useGetCampaniasProximasQuery,
} = dashboardApiSlice;