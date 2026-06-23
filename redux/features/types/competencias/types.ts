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