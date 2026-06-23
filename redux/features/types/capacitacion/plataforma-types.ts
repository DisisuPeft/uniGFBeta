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

export interface BloqueContenido {
  id: number;
  tema: number;
  tipo_nombre: string;
  orden: number;
  texto: string;
  variante: string;
  items: unknown[] | null;
  filas: unknown[] | null;
  video_url: string;
}

export interface EvaluacionPlataforma {
  id: number;
  titulo: string;
  tipo_nombre: string;
  puntaje_minimo: string;
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
