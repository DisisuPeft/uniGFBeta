// =============================================================
//  Competencias — tipos que mapean la API
//  Base: /api/competencias/
// =============================================================

// ── CATÁLOGO DE COMPETENCIAS ──────────────────────────────────

export interface Competencia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string | null;
  icono: string;
  color: string;
  activo: boolean;
  creado_at: string;
  actualizado_at: string;
}

export interface CompetenciaForm {
  nombre: string;
  codigo: string;
  descripcion?: string | null;
  icono?: string;
  color?: string;
  activo?: boolean;
}

// ── COMPETENCIAS POR CURSO ────────────────────────────────────

export interface CompetenciaCurso {
  id: number;
  competencia: number;
  competencia_nombre: string;
  curso: number;
  curso_titulo: string;
  nivel: number;
  nivel_nombre: string;
  activo: boolean;
  creado_at: string;
  actualizado_at: string;
}

export interface CompetenciaCursoForm {
  competencia: number;
  curso: number;
  nivel: number;
}

// ── COMPETENCIAS POR PUESTO ───────────────────────────────────

export interface CompetenciaPuesto {
  id: number;
  competencia: number;
  competencia_nombre: string;
  puesto: number;
  puesto_nombre: string;
  nivel: number;
  nivel_nombre: string;
  activo: boolean;
  creado_at: string;
  actualizado_at: string;
}

export interface CompetenciaPuestoForm {
  competencia: number;
  puesto: number;
  nivel: number;
}

// ── RUTAS DE APRENDIZAJE ──────────────────────────────────────

export type CursoEstado = "completado" | "en_curso" | "pendiente";

export interface CursoEnRuta {
  id: number;
  orden: number;
  curso_id: number;
  curso_titulo: string;
  completado: boolean;
  estado: CursoEstado;
}

export interface RutaAprendizaje {
  id: number;
  nombre: string;
  competencia: number;
  competencia_nombre: string;
  nivel_objetivo_id: number;
  nivel_objetivo_nombre: string;
  nivel_objetivo_orden: number;
  cursos: CursoEnRuta[];
}

// Variante enriquecida que devuelve GET /competencias/mi-perfil/
export interface RutaProgreso {
  total: number;
  completados: number;
  porcentaje: number;
}

export interface RutaRecomendada {
  id: number;
  nombre: string;
  nivel_objetivo_id: number;
  nivel_objetivo_nombre: string;
  nivel_objetivo_orden: number;
  iniciada: boolean;
  terminada: boolean;
  curso_actual_id: number | null;
  progreso: RutaProgreso;
  cursos: CursoEnRuta[];
}

// Respuesta de POST /competencias/iniciar-ruta/
export interface IniciarRutaOk {
  creada: boolean;
  inscripcion_id: number;
  curso_id: number;
  curso_titulo: string;
  orden: number;
}

export interface IniciarRutaCompleta {
  detail: string;
}

export interface RutaAprendizajeForm {
  nombre: string;
  competencia: number;
  nivel_objetivo: number;
}

// ── GAP ANALYSIS (colaborador autenticado) ────────────────────

export interface MiPerfilCompetencia {
  competencia_id: number;
  competencia_nombre: string;
  competencia_codigo: string;
  competencia_icono: string;
  competencia_color: string;

  nivel_requerido_id: number | null;
  nivel_requerido_nombre: string | null;
  nivel_requerido_orden: number;

  nivel_actual_id: number | null;
  nivel_actual_nombre: string | null;
  nivel_actual_orden: number;

  brecha: number;
  completada: boolean;

  rutas_recomendadas: RutaRecomendada[];
}

// ── RUTA APRENDIZAJE CURSO ────────────────────────────────────

export interface RutaAprendizajeCursoForm {
  ruta: number;
  curso: number;
  orden: number;
}

// ── COMPETENCIA COLABORADOR (edición manual por admin) ────────

export interface CompetenciaColaborador {
  id: number;
  colaborador: number;
  competencia: number;
  competencia_nombre: string;
  nivel: number;
  nivel_nombre: string;
  actualizado_at: string;
}

export interface CompetenciaColaboradorForm {
  nivel: number;
}