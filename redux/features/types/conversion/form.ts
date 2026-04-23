export type Option = { id: number | string; name: string };

export type Catalog = { id: number | string; nombre: string };

export type RequestFormValues = {
  nombre: string;
  correo?: string | null;
  telefono?: string | null;
  fuente: string | number;
  interesado_en?: string | number | null;
  empresa?: string | null;
};

export type Oferta = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
  banner_url: string | null;
  tipo: string | null;
  modalidad: string | null;
  duracion_horas: number | null;
};

interface Modulos {
  id: number;
  nombre: string;
}

// interface Submodulos {
//   id: number;
//   nombre: string;
// }

export type DiplomadoResponse = {
  programa: Oferta;
  modulos: Modulos[];
};
