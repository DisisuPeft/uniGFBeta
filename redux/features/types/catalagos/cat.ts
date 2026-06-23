import { BaseModel } from "../base-interface";

export interface Instituciones extends BaseModel {
  nombre: string;
  empresa: string;
}

export interface NivelEducativo {
  id: number;
  nombre: string;
}

export interface EstadoRepublica {
  id: number;
  name: string;
}

export interface Localidad {
  id: number;
  name: string;
}

export interface MetodoPago {
  id: string;
  nombre: string;
}

export interface NivelCompetencia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string | null;
  activo: boolean;
  creado_at: string;
  actualizado_at: string;
}

export interface NivelCompetenciaForm {
  nombre: string;
  codigo: string;
  descripcion?: string | null;
  activo?: boolean;
}

// Catálogos de Capacitación
export interface StatusCurso {
  id: number; nombre: string; codigo: string;
  activo: boolean; creado_at: string; actualizado_at: string;
}
export interface StatusCursoForm { nombre: string; codigo: string; activo?: boolean; }

export interface TipoTema {
  id: number; nombre: string; codigo: string;
  activo: boolean; creado_at: string; actualizado_at: string;
}
export interface TipoTemaForm { nombre: string; codigo: string; activo?: boolean; }

export interface TipoBloque {
  id: number; nombre: string; codigo: string;
  activo: boolean; creado_at: string; actualizado_at: string;
}
export interface TipoBloqueForm { nombre: string; codigo: string; activo?: boolean; }

export interface TipoEvaluacion {
  id: number; nombre: string; codigo: string;
  activo: boolean; creado_at: string; actualizado_at: string;
}
export interface TipoEvaluacionForm { nombre: string; codigo: string; activo?: boolean; }
