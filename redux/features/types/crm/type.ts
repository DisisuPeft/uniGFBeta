export type LeadFormValues = {
  nombre: string;
  nombre_completo: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
  interesado_en?: number;
  estatus?: number;
  pipeline?: number;
  etapa?: number;
  fuente?: number;
  vendedor_asignado?: number;
  empresa?: number;
  institucion?: number;
  campania?: number;
};

export interface FiltrosFechas {
  fecha_inicio: string;
  fecha_fin: string;
}

export interface EstatusInterface {
  id: number;
  nombre: string;
}

export interface FuentesInterface {
  id: number;
  nombre: string;
}

export interface EtapasInterface {
  id: number;
  nombre: string;
  orden: number;
}

export interface NivelTemperatura {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  color: string;
}

export interface Vendedor {
  id: number;
  nombre: string;
  email: string;
}

export interface TipoInteraccion {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  orden: number;
  requiere_telefono: string;
  requiere_duracion: string;
}

export interface EstadoInteraccion {
  id: number;
  nombre: string;
  codigo: string;
  color: string;
  es_final: string;
}

interface Interaccion {
  id: number;
  lead_id: number;
  tipo: TipoInteraccion;
  estado: EstadoInteraccion;
  asunto: string;
  contenido: string;
  fecha_interaccion: string;
  duracion_minutos?: number;
  numero_telefono?: string;
  mensaje_enviado: boolean;
  mensaje_recibido: boolean;
  url_externa?: string;
  proximo_paso?: string;
  temperatura_post: NivelTemperatura;
  usuario: string;
  usuario_id: number;
}

interface TipoSeguimiento {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
}
