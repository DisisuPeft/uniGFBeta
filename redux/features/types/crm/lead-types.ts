// ─── Catálogos ───────────────────────────────────────────────────────

export interface NivelTemperatura {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  color: string;
  puntuacion: number;
  descripcion: string;
  orden: number;
}

export interface Etapa {
  id: number;
  nombre: string;
  orden: number;
  pipeline: number;
  pipeline_nombre: string;
}

export interface Pipeline {
  id: number;
  nombre: string;
  orden: number;
  etapas: Etapa[];
}

export interface TipoInteraccion {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  descripcion: string;
  requiere_duracion: boolean;
  requiere_telefono: boolean;
  permite_archivos: boolean;
  orden: number;
}

export interface EstadoInteraccion {
  id: number;
  nombre: string;
  codigo: string;
  color: string;
  es_final: boolean;
  orden: number;
}

export interface TipoSeguimiento {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  tipo_interaccion_default?: number;
  orden: number;
}

export interface FuenteLead {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  orden: number;
}

export interface EstatusLead {
  id: number;
  nombre: string;
  codigo: string;
  color?: string;
  es_final: boolean;
  orden: number;
}

// ─── Vendedor ────────────────────────────────────────────────────────

export interface Vendedor {
  id: number;
  nombre_completo: string;
  email?: string;
}

// ─── Lead ────────────────────────────────────────────────────────────

export interface Lead {
  id: number;
  uuid: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre_completo: string;
  correo: string;
  telefono: string;
  contacto_alterno?: string;
  fuente: number;
  fuente_nombre?: string;
  etapa: number;
  etapa_nombre?: string;
  etapa_orden?: number;
  estatus: number;
  estatus_nombre?: string;
  vendedor_asignado?: number;
  vendedor_nombre?: string;
  campania?: number;
  campania_nombre?: string;
  programa_objetivo?: number;
  programa_nombre?: string;
  temperatura_actual?: NivelTemperatura;
  status: number;
  created_at: string;
  updated_at: string;
  notas?: string;
  instituto?: number;
}

export interface LeadQueryParams {
  instituto?: number;
  etapa?: number;
  estatus?: number;
  vendedor?: number;
  fuente?: number;
  page?: number;
  search?: string;
}

// ─── Interacciones ───────────────────────────────────────────────────

export interface ArchivoInteraccion {
  id: number;
  original_name: string;
  mime_type: string;
  size_formatted: string;
  file_type: string;
  preview_url: string;
}

export interface InteraccionLead {
  id: number;
  lead: number;
  tipo: number;
  tipo_detail?: TipoInteraccion;
  estado: number;
  estado_detail?: EstadoInteraccion;
  asunto: string;
  contenido: string;
  fecha_interaccion: string;
  duracion_minutos?: number;
  usuario: string;
  numero_telefono?: string;
  mensaje_enviado: boolean;
  mensaje_recibido: boolean;
  url_externa?: string;
  proximo_paso?: string;
  temperatura_post?: number;
  temperatura_post_detail?: NivelTemperatura;
  archivos_detail?: ArchivoInteraccion[] | [];
}

export interface InteraccionForm {
  lead: number;
  tipo: number;
  estado: number;
  asunto: string;
  contenido: string;
  duracion_minutos?: number;
  numero_telefono?: string;
  temperatura_post?: number;
  proximo_paso?: string;
  evidencia?: File;
  mensaje_enviado?: 0 | 1;
  mensaje_recibido?: 0 | 1;
}

// ─── Seguimientos ────────────────────────────────────────────────────

export interface SeguimientoProgramado {
  id: number;
  lead: number;
  tipo: number;
  tipo_detail?: TipoSeguimiento;
  fecha_programada: string;
  descripcion: string;
  responsable: number;
  responsable_nombre?: string;
  completado: boolean;
  fecha_completado?: string;
}

export interface SeguimientoForm {
  lead: number;
  tipo: number;
  fecha_programada: string;
  descripcion: string;
  responsable?: number;
}

// ─── Plan de Pago ────────────────────────────────────────────────────

export interface OrigenPago {
  id: number;
  nombre: string;
  slug: string;
}

export interface EstadoPlan {
  id: number;
  nombre: string;
}

export interface PlanPagoDetalle {
  id: number;
  lead: number;
  campania: number;
  origen: number;
  origen_detail: { id: number; nombre: string; slug: string } | null;
  estado_plan: number;
  estado_plan_detail: { id: number; nombre: string } | null;
  estudiante_existente: number | null;
  inscripcion_monto: string;
  mensualidad_monto: string;
  num_mensualidades: number;
  documentacion_monto: string;
  fecha_primera_mensualidad: string;
  tiene_beca: boolean;
  tipo_beca: string | null;
  notas_vendedor: string | null;
  creado_por: number;
  aprobado_por: number | null;
  fecha_aprobacion: string | null;
  status: number;
  created_at: string;
}

export interface CreatePlanPagoPayload {
  lead: number;
  campania: number;
  origen: number;
  estado_plan: number;
  inscripcion_monto: number;
  mensualidad_monto: number;
  num_mensualidades: number;
  documentacion_monto?: number;
  fecha_primera_mensualidad: string;
  tiene_beca: boolean;
  tipo_beca?: string;
  notas_vendedor?: string;
  estudiante_existente?: number;
  instituto: number;
  empresa: number;
}

export interface Validacion {
  id: number;
  plan_pago: number;
  comprobante_pago: string;
  monto_pagado: string;
  fecha_pago: string;
  subido_por: number;
  subido_por_nombre: string | null;
  fecha_subida: string;
  validado_por: number | null;
  validado_por_nombre: string | null;
  fecha_validacion: string | null;
  motivo_rechazo: string | null;
  notas_internas: string | null;
}

export interface CreateValidacionPayload {
  plan_pago: number;
  comprobante_pago: File;
  monto_pagado: number;
  fecha_pago: string;
  notas_internas?: string;
}

// ─── Historial ───────────────────────────────────────────────────────

export interface HistorialEtapa {
  id: number;
  lead: number;
  etapa: number;
  etapa_nombre?: string;
  fecha_entrada: string;
  fecha_salida?: string;
}
