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
export interface ContenidoBloqueItem {
  id: number;
  bloque: number;
  orden: number;
  titulo: string | null;
  texto: string | null;
  imagen_url: string | null;
  // Cuando la imagen del ítem se sube como archivo (en vez de URL externa),
  // el backend la devuelve aquí en lugar de en imagen_url.
  imagen_archivo: string | null;
  items: string[] | null;
}
export interface ContenidoBloqueItemForm {
  bloque: number;
  orden: number;
  titulo?: string | null;
  texto?: string | null;
  imagen_url?: string | null;
  items?: string[] | null;
}

export interface ContenidoBloque {
  id: number;
  tema: number;
  tipo: number;
  tipo_nombre: string;
  tipo_codigo: string;
  orden: number;
  texto: string | null;
  variante: string | null;
  items: string[] | null;
  filas: Record<string, string>[] | null;
  video_url: string | null;
  imagen_url: string | null;
  // Cuando la imagen del bloque se sube como archivo (en vez de URL externa),
  // el backend la devuelve aquí en lugar de en imagen_url — mismo patrón que
  // ContenidoBloqueItem.imagen_archivo arriba.
  imagen_archivo: string | null;
  // Bloque tipo "embed" (Canva u otro iframe-embed) — texto libre, "" cuando
  // no hay embed (nunca null), igual que video_url/imagen_url.
  embed_url: string;
  bloque_items: ContenidoBloqueItem[] | null;
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
  imagen_url?: string | null;
  embed_url?: string | null;
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