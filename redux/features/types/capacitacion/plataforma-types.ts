// Progreso del colaborador

export interface MiInscripcion {
  id: number;
  curso: number;
  curso_titulo: string;
  inscrito_at: string;
  completado_at: string | null;
  activo: boolean;
}

export interface MiProgresoTema {
  id: number;
  tema: number;
  tema_titulo: string;
  completado_at: string;
  activo: boolean;
}

export interface MiResultadoEvaluacion {
  id: number;
  evaluacion: number;
  evaluacion_titulo: string;
  correctas: number;
  total: number;
  puntaje: number;
  presentado_at: string;
  activo: boolean;
}

// Contenido del curso (solo lectura)

export interface CompetenciaCurso {
  nombre: string;
  codigo: string;
  icono: string;
  color: string;
  nivel: string;
}

export interface CursoPlataforma {
  id: number;
  titulo: string;
  descripcion: string;
  duracion_horas: number;
  imagen: string | null;
  banner: string | null;
  status_nombre: string;
  competencias: CompetenciaCurso[];
  inscrito: boolean;
  progreso: {
    completados: number;
    total: number;
    porcentaje: number;
  };
}

export interface ModuloPlataforma {
  id: number;
  curso: number;
  titulo: string;
  descripcion: string;
  orden: number;
  horas_teoricas: number;
  horas_practicas: number;
  tiene_evaluacion: boolean;
  progreso: {
    completados: number;
    total: number;
    porcentaje: number;
  };
}

export interface TemaPlataforma {
  id: number;
  modulo: number;
  titulo: string;
  duracion_estimada: string;
  tipo_nombre: string;
  orden: number;
}

export interface ContenidoBloqueItemPlataforma {
  id: number;
  bloque: number;
  orden: number;
  titulo: string | null;
  texto: string | null;
  imagen_url: string | null;
  imagen_archivo: string | null;
  items: string[] | null;
}

export interface BloqueContenido {
  id: number;
  tema: number;
  tipo_nombre: string;
  tipo_codigo: string;
  orden: number;
  texto: string;
  variante: string;
  items: unknown[] | null;
  filas: unknown[] | null;
  video_url: string | null;
  video_stream_url: string | null;
  imagen_url: string | null;
  // El backend guarda el archivo subido aquí en vez de imagen_url cuando la
  // imagen viene de "Seleccionar archivo" (no de una URL externa) — ver
  // redux/features/types/capacitacion/types.ts para el mismo campo del lado
  // del editor.
  imagen_archivo: string | null;
  // Bloque tipo "embed" (Canva u otro iframe-embed) — texto libre, "" cuando
  // no hay embed, igual que video_url/imagen_url (nunca null).
  embed_url: string;
  bloque_items: ContenidoBloqueItemPlataforma[] | null;
}

export interface EvaluacionPlataforma {
  id: number;
  titulo: string;
  tipo_nombre: string;
  puntaje_minimo: string;
  // Límite de intentos por colaborador — varía por evaluación, nunca
  // hardcodear un número fijo en el frontend. Los intentos restantes se
  // calculan contando cuántos MiResultadoEvaluacion existen para esta
  // evaluación en /capacitacion/mis-resultados/ y restando a este valor.
  intentos_maximos: number;
  curso: number | null;
  modulo: number | null;
}

export interface OpcionPlataforma {
  id: number;
  texto: string;
  orden: number;
  es_correcta?: boolean;
}

export interface PreguntaConOpciones {
  id: number;
  evaluacion: number;
  texto: string;
  orden: number;
  opciones: OpcionPlataforma[];
}
