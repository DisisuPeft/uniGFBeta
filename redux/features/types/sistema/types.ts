// =============================================================
//  Sistema — tipos que mapean la API de Configuración
//  Base: /api/sistema/
// =============================================================

// ── EMPRESA ──────────────────────────────────────────────────

export interface Empresa {
  id: number;
  razon_social: string;
  slug: string;
  logo: string | null;
  sitio_web: string | null;
  telefono: string | null;
  email_contacto: string | null;
  direccion: string | null;
  rfc: string | null;
  status: 0 | 1;
}

// ── DEPENDENCIA ───────────────────────────────────────────────

export interface Dependencia {
  id: number;
  nombre: string;
  empresa: number;
  empresa_nombre: string;
  logo: string | null;
  sitio_web: string | null;
  telefono: string | null;
  email_contacto: string | null;
  direccion: string | null;
  status: 0 | 1;
}

// ── DEPARTAMENTO ─────────────────────────────────────────────

export interface Departamento {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string | null;
  activo: boolean;
  creado_at: string;
  actualizado_at: string;
}

export interface DepartamentoForm {
  nombre: string;
  codigo: string;
  descripcion?: string | null;
  activo?: boolean;
}

// ── PUESTO ───────────────────────────────────────────────────

export interface Puesto {
  id: number;
  departamento: number;
  departamento_nombre: string;
  nombre: string;
  codigo: string;
  descripcion: string | null;
  activo: boolean;
  creado_at: string;
  actualizado_at: string;
}

export interface PuestoForm {
  departamento: number;
  nombre: string;
  codigo: string;
  descripcion?: string | null;
  activo?: boolean;
}

// ── MÓDULOS DE NAVEGACIÓN ────────────────────────────────────

export interface PestanaNav {
  uuid: string;
  nombre: string;
  href: string;
  icon: string;
  icon_path: string;
  orden: number;
}

export interface ModuloNav {
  id: number;
  uuid: string;
  nombre: string;
  href: string;
  icon: string;
  icon_path: string;
  bgColor: string;
  textColor: string;
  orden: number;
  status: 0 | 1;
  pestanias: PestanaNav[];
}

export interface ModuloNavForm {
  nombre: string;
  href: string;
  icon: string;
  icon_path?: string;
  bgColor?: string;
  textColor?: string;
  orden?: number;
  status?: 0 | 1;
}

// ── PESTAÑAS DE NAVEGACIÓN ───────────────────────────────────

export interface PermisoDetail {
  id: number;
  name: string;
  codename: string;
  app_label: string;
}

export interface Pestana {
  id: number;
  uuid: string;
  nombre: string;
  modulo: number;
  href: string;
  icon: string;
  icon_path: string;
  orden: number;
  status: 0 | 1;
  permission: number[];
  permission_detail: PermisoDetail[];
}

export interface PestanaForm {
  nombre: string;
  modulo: number;
  href: string;
  icon: string;
  icon_path?: string;
  orden?: number;
  status?: 0 | 1;
  permission?: number[];
}

// ── SIDEBAR (usuario autenticado) ────────────────────────────

export interface SidebarModulo {
  uuid: string;
  nombre: string;
  href: string;
  icon: string;
  icon_path: string;
  bgColor: string;
  textColor: string;
  orden: number;
}

export interface SidebarPestana {
  uuid: string;
  nombre: string;
  href: string;
  icon: string;
  icon_path: string;
  orden: number;
}

// ── PERMISOS ─────────────────────────────────────────────────

export interface Permiso {
  id: number;
  name: string;
  codename: string;
  app_label: string;
}

// ── ROLES ─────────────────────────────────────────────────────

export interface Rol {
  id: number;
  nombre: string;
  nivel_acceso: number;
  permission: number[];
  permission_detail: PermisoDetail[];
}

export interface RolForm {
  nombre: string;
  nivel_acceso?: number;
  permission?: number[];
}

// ── USUARIOS ──────────────────────────────────────────────────

export interface RolResumen {
  id: number;
  nombre: string;
}

export interface Usuario {
  uuid: string;
  num_colab: number | null;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  genero: number | null;
  genero_nombre: string | null;
  fecha_nacimiento: string | null;
  telefono: string | null;
  curp: string | null;
  rfc: string | null;
  fecha_alta: string | null;
  puesto: number | null;
  puesto_nombre: string | null;
  departamento_nombre: string | null;
  dependencia: number | null;
  dependencia_nombre: string | null;
  roles: number[];
  roles_list: RolResumen[];
  activo: boolean;
  creado_at: string;
}

export interface UsuarioForm {
  num_colab?: number | null;
  email: string;
  password?: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  genero?: number | null;
  fecha_nacimiento?: string | null;
  telefono?: string | null;
  curp?: string | null;
  rfc?: string | null;
  fecha_alta?: string | null;
  puesto?: number | null;
  dependencia?: number | null;
  roles: number[];
}
