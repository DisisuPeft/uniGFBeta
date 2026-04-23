import { apiSlice } from "@/redux/services/apiSlice";
import { SuccessMessage } from "../types/reponse";
import { LeadFormData } from "@/hooks/crm/leads/use-lead-form";
import {
  Lead,
  LeadQueryParams,
  InteraccionLead,
  InteraccionForm,
  SeguimientoProgramado,
  SeguimientoForm,
  HistorialEtapa,
  Vendedor,
  PlanPagoDetalle,
  CreatePlanPagoPayload,
  Validacion,
  CreateValidacionPayload,
} from "../types/crm/lead-types";
import { PaginatedResponse } from "../types/paginated";

const leadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Leads ────────────────────────────────────────────────────────

    getLeads: builder.query<PaginatedResponse<Lead>, LeadQueryParams | void>({
      query: (params = {}) => {
        const {
          instituto,
          etapa,
          estatus,
          vendedor,
          fuente,
          page = 1,
          search,
        } = params as LeadQueryParams;
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (instituto) qs.set("instituto", String(instituto));
        if (etapa) qs.set("etapa", String(etapa));
        if (estatus) qs.set("estatus", String(estatus));
        if (vendedor) qs.set("vendedor", String(vendedor));
        if (fuente) qs.set("fuente", String(fuente));
        if (search) qs.set("search", search);
        return `/crm/leads/?${qs.toString()}`;
      },
    }),

    getLead: builder.query<Lead, string>({
      query: (uuid) => `/crm/leads/${uuid}/`,
    }),

    createLead: builder.mutation<SuccessMessage, LeadFormData>({
      query: (formData) => ({
        url: "/crm/leads/",
        method: "POST",
        body: formData,
      }),
    }),

    updateLead: builder.mutation<Lead, { uuid: string; data: Partial<Lead> }>({
      query: ({ uuid, data }) => ({
        url: `/crm/leads/${uuid}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteLead: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/crm/leads/${uuid}/`,
        method: "DELETE",
      }),
    }),

    // ─── Interacciones ────────────────────────────────────────────────

    getInteracciones: builder.query<
      PaginatedResponse<InteraccionLead>,
      { lead: number }
    >({
      query: ({ lead }) => `/crm/interacciones/?lead=${lead}`,
    }),

    createInteraccion: builder.mutation<InteraccionLead, InteraccionForm>({
      query: (data) => {
        if (data.evidencia instanceof File) {
          const formData = new FormData();
          (Object.entries(data) as [string, unknown][]).forEach(
            ([key, value]) => {
              if (value === undefined || value === null) return;
              if (value instanceof File) {
                formData.append(key, value);
              } else {
                formData.append(key, String(value));
              }
            },
          );
          return { url: "/crm/interacciones/", method: "POST", body: formData };
        }
        return { url: "/crm/interacciones/", method: "POST", body: data };
      },
    }),

    updateInteraccion: builder.mutation<
      InteraccionLead,
      { id: number; data: Partial<InteraccionForm> }
    >({
      query: ({ id, data }) => ({
        url: `/crm/interacciones/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteInteraccion: builder.mutation<void, number>({
      query: (id) => ({
        url: `/crm/interacciones/${id}/`,
        method: "DELETE",
      }),
    }),

    // ─── Seguimientos ─────────────────────────────────────────────────

    getSeguimientos: builder.query<
      PaginatedResponse<SeguimientoProgramado>,
      { lead?: number; completado?: boolean }
    >({
      query: ({ lead, completado }) => {
        const qs = new URLSearchParams();
        if (lead) qs.set("lead", String(lead));
        if (completado !== undefined) qs.set("completado", String(completado));
        return `/crm/seguimientos/?${qs.toString()}`;
      },
    }),

    createSeguimiento: builder.mutation<SeguimientoProgramado, SeguimientoForm>(
      {
        query: (data) => ({
          url: "/crm/seguimientos/",
          method: "POST",
          body: data,
        }),
      },
    ),

    updateSeguimiento: builder.mutation<
      SeguimientoProgramado,
      { id: number; data: Partial<SeguimientoForm> }
    >({
      query: ({ id, data }) => ({
        url: `/crm/seguimientos/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    completarSeguimiento: builder.mutation<void, number>({
      query: (id) => ({
        url: `/crm/seguimientos/${id}/completar/`,
        method: "POST",
      }),
    }),

    // ─── Historial etapas ─────────────────────────────────────────────

    getHistorialEtapas: builder.query<
      PaginatedResponse<HistorialEtapa>,
      { lead: number }
    >({
      query: ({ lead }) => `/crm/historial-etapas/?lead=${lead}`,
    }),

    // ─── Vendedores ───────────────────────────────────────────────────

    getVendedores: builder.query<Vendedor[], void>({
      query: () => `/crm/leads/vendedores/`,
    }),

    asignarVendedor: builder.mutation<Lead, { uuid: string; vendedor: number }>(
      {
        query: ({ uuid, vendedor }) => ({
          url: `/crm/leads/${uuid}/asignar-vendedor/`,
          method: "POST",
          body: { vendedor },
        }),
      },
    ),

    desasignarVendedor: builder.mutation<Lead, string>({
      query: (uuid) => ({
        url: `/crm/leads/${uuid}/desasignar-vendedor/`,
        method: "POST",
      }),
    }),

    // ─── Planes de pago ───────────────────────────────────────────────

    getPlanesPago: builder.query<
      PaginatedResponse<PlanPagoDetalle>,
      { lead?: number; estado_plan?: number; instituto?: number; empresa?: number }
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params.lead) qs.set("lead", String(params.lead));
        if (params.estado_plan) qs.set("estado_plan", String(params.estado_plan));
        if (params.instituto) qs.set("instituto", String(params.instituto));
        if (params.empresa) qs.set("empresa", String(params.empresa));
        return `/crm/planes-pago/?${qs.toString()}`;
      },
    }),

    getPlanPago: builder.query<PlanPagoDetalle, number>({
      query: (id) => `/crm/planes-pago/${id}/`,
    }),

    createPlanPago: builder.mutation<PlanPagoDetalle, CreatePlanPagoPayload>({
      query: (data) => ({
        url: "/crm/planes-pago/",
        method: "POST",
        body: data,
      }),
    }),

    aprobarPlanPago: builder.mutation<{ detail: string }, number>({
      query: (id) => ({
        url: `/crm/planes-pago/${id}/aprobar/`,
        method: "POST",
      }),
    }),

    // ─── Validaciones ─────────────────────────────────────────────────

    getValidaciones: builder.query<
      PaginatedResponse<Validacion>,
      { plan_pago?: number }
    >({
      query: ({ plan_pago }) => {
        const qs = new URLSearchParams();
        if (plan_pago) qs.set("plan_pago", String(plan_pago));
        return `/crm/validaciones/?${qs.toString()}`;
      },
    }),

    createValidacion: builder.mutation<Validacion, CreateValidacionPayload>({
      query: (data) => {
        const formData = new FormData();
        formData.append("plan_pago", String(data.plan_pago));
        formData.append("comprobante_pago", data.comprobante_pago);
        formData.append("monto_pagado", String(data.monto_pagado));
        formData.append("fecha_pago", data.fecha_pago);
        if (data.notas_internas) {
          formData.append("notas_internas", data.notas_internas);
        }
        return { url: "/crm/validaciones/", method: "POST", body: formData };
      },
    }),

    validarValidacion: builder.mutation<{ detail: string }, number>({
      query: (id) => ({
        url: `/crm/validaciones/${id}/validar/`,
        method: "POST",
      }),
    }),

    rechazarValidacion: builder.mutation<
      { detail: string },
      { id: number; motivo_rechazo: string }
    >({
      query: ({ id, motivo_rechazo }) => ({
        url: `/crm/validaciones/${id}/rechazar/`,
        method: "POST",
        body: { motivo_rechazo },
      }),
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetInteraccionesQuery,
  useCreateInteraccionMutation,
  useUpdateInteraccionMutation,
  useDeleteInteraccionMutation,
  useGetSeguimientosQuery,
  useCreateSeguimientoMutation,
  useUpdateSeguimientoMutation,
  useCompletarSeguimientoMutation,
  useGetHistorialEtapasQuery,
  useGetVendedoresQuery,
  useAsignarVendedorMutation,
  useDesasignarVendedorMutation,
  useGetPlanesPagoQuery,
  useGetPlanPagoQuery,
  useCreatePlanPagoMutation,
  useAprobarPlanPagoMutation,
  useGetValidacionesQuery,
  useCreateValidacionMutation,
  useValidarValidacionMutation,
  useRechazarValidacionMutation,
} = leadsApiSlice;
