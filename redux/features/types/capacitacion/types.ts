// ── Curso ─────────────────────────────────────────────────────
export interface Curso {
  id: number;
  titulo: string;
  descripcion: string | null;
  duracion_horas: string;
  imagen: string | null;
  banner: string | null;
  status: number;
  status_nombre: string;
  activo: boolean;
  creado_at: string;
  actualizado_at: string;
}
export interface CursoForm {
  titulo: string;
  descripcion?: string | null;
  duracion_horas?: string;
  status?: number;
  activo?: boolean;
}

// ── Módulo ────────────────────────────────────────────────────
export interface Modulo {
  id: number;
  curso: number;
  titulo: string;
  descripcion: string | null;
  orden: number;
  horas_teoricas: string;
  horas_practicas: string;
  tiene_evaluacion: boolean;
  activo: boolean;
}
export interface ModuloForm {
  curso: number;
  titulo: string;
  descripcion?: string | null;
  orden: number;
  horas_teoricas?: string;
  horas_practicas?: string;
  tiene_evaluacion?: boolean;
  activo?: boolean;
}

// ── Tema ──────────────────────────────────────────────────────
export interface Tema {
  id: number;
  modulo: number;
  titulo: string;
  duracion_estimada: string | null;
  tipo: number;
  tipo_nombre: string;
  orden: number;
  activo: boolean;
}
export interface TemaForm {
  modulo: number;
  titulo: string;
  duracion_estimada?: string | null;
  tipo: number;
  orden: number;
  activo?: boolean;
}

// ── ContenidoBloque ───────────────────────────────────────────
export interface ContenidoBloque {
  id: number;
  tema: number;
  tipo: number;
  tipo_nombre: string;
  orden: number;
  texto: string | null;
  variante: string | null;
  items: string[] | null;
  filas: Record<string, string>[] | null;
  video_url: string | null;
}
export interface BloqueForm {
  tema: number;
  tipo: number;
  orden: number;
  texto?: string | null;
  variante?: string | null;
  items?: string[] | null;
  filas?: Record<string, string>[] | null;
  video_url?: string | null;
}

// ── Evaluación ────────────────────────────────────────────────
export interface Evaluacion {
  id: number;
  titulo: string;
  tipo: number;
  tipo_nombre: string;
  puntaje_minimo: string;
  modulo: number | null;
  curso: number | null;
  activo: boolean;
}
export interface EvaluacionForm {
  titulo: string;
  tipo: number;
  puntaje_minimo?: string;
  modulo?: number | null;
  curso?: number | null;
  activo?: boolean;
}

// ── Pregunta ──────────────────────────────────────────────────
export interface Pregunta {
  id: number;
  evaluacion: number;
  texto: string;
  orden: number;
  activo: boolean;
}
export interface PreguntaForm {
  evaluacion: number;
  texto: string;
  orden: number;
  activo?: boolean;
}

// ── OpcionPregunta ────────────────────────────────────────────
export interface OpcionPregunta {
  id: number;
  pregunta: number;
  texto: string;
  orden: number;
  es_correcta: boolean;
}
export interface OpcionPreguntaForm {
  pregunta: number;
  texto: string;
  orden: number;
  es_correcta: boolean;
}