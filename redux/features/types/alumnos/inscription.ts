export interface Programa {
  nombre: string;
  ref: string;
  tipo: string;
  imagen_url: string | null;
  banner_url: string | null;
  modulos: ModulosInterface[];
  duracion: number;
}

export interface InscriptionDetail {
  countCursos: number;
  programasInscritos: Programa[];
  completados: number;
}

export interface SubmoduloInterface {
  descripcion: string;
  id: number;
  orden: number;
  path_class: string;
  titulo: string;
}

export interface ModulosInterface {
  id: number;
  horas_practicas: number;
  horas_teoricas: number;
  horas_totales: number;
  nombre: string;
  submodulos: SubmoduloInterface[];
}
