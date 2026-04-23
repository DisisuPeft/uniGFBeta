import { BaseModel } from "../base-interface";
import { ModulosInterface } from "../alumnos/inscription";

export interface SubmoduloEducativoForm extends BaseModel {
  titulo: string;
  descripcion?: string | null;
  orden?: number;
  path_class?: string | null;
}

export interface ModuloEducativoForm extends BaseModel {
  nombre: string;
  horas_teoricas: number;
  horas_practicas: number;
  horas_totales: number;
  creditos: number;

  submodulos: SubmoduloEducativoForm[];
}

export interface ProgramaEducativo extends BaseModel {
  nombre: string;
  descripcion?: string | null;
  ref: string | null;
  tipo_nombre: string | null;
  institucion_nombre?: string | null;
  modalidad?: string | null;
  modalidad_nombre: string | null;

  duracion_horas?: number | null;
  duracion_meses?: number | null;

  fecha_inicio?: string | null;
  fecha_fin?: string | null;

  horario?: string | null;

  costo_inscripcion?: number | null;
  costo_mensualidad?: number | null;
  costo_documentacion?: number | null;

  instructor?: number[];

  imagen_url?: string | null;
  banner_url?: string | null;

  modulos_obj: ModuloEducativoForm[];
}

export interface ProgramaEducativoForm extends BaseModel {
  nombre: string;
  descripcion?: string | null;

  tipo?: number | null;
  institucion?: number | null;
  modalidad?: number | null;

  duracion_horas?: number | null;
  duracion_meses?: number | null;

  fecha_inicio?: string | null;
  fecha_fin?: string | null;

  horario?: string | null;

  costo_inscripcion?: number | null;
  costo_mensualidad?: number | null;
  costo_documentacion?: number | null;

  instructor?: number[];

  imagen_url?: string | null;
  banner_url?: string | null;

  modulos: ModuloEducativoForm[];
  modulos_obj?: ModuloEducativoForm[];
}

export const programaInicial: ProgramaEducativoForm = {
  nombre: "",
  descripcion: "",
  tipo: null,
  institucion: null,
  modalidad: null,

  duracion_horas: null,
  duracion_meses: null,

  fecha_inicio: null,
  fecha_fin: null,

  horario: "",
  costo_inscripcion: null,
  costo_mensualidad: null,
  costo_documentacion: null,

  instructor: [],

  imagen_url: "",
  banner_url: "",

  modulos: [
    {
      nombre: "",
      horas_teoricas: 0,
      horas_practicas: 0,
      horas_totales: 0,
      creditos: 0,
      submodulos: [
        {
          titulo: "",
          descripcion: "",
          orden: 1,
        },
      ],
    },
  ],
};

export interface ProgramaSimple extends BaseModel {
  nombre: string;
}

export interface TipoProgramaGenerico extends BaseModel {
  nombre: string;
}

export interface ModalidadesGenerico extends BaseModel {
  name: string;
}

export interface UserStudentData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  genero: number;
  edad: number;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  status: number;
}

export interface EstudiantePerfilForm extends BaseModel {
  user: UserStudentData;
  user_obj?: UserStudentData;
  nivel_educativo: number | null;
  institucion: number | null;
  estado_pais: string | null;
  ciudad: string | null;
  status: number;
  especialidad: string;
  matricula: string;
  fecha_ingreso: string | null;
}

export const InitalUserValues: UserStudentData = {
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  genero: 0,
  edad: 0,
  fecha_nacimiento: "",
  telefono: "",
  email: "",
  status: 0,
  // roles: [],
};

export const estudiantePerfilInitialValues: EstudiantePerfilForm = {
  user: InitalUserValues,
  nivel_educativo: null,
  institucion: null,
  estado_pais: null,
  ciudad: null,
  status: 0,
  especialidad: "",
  matricula: "",
  fecha_ingreso: null,
};

export interface User {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  genero: number;
  edad: number;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  status: number | null;
}

export interface EstudiantePerfil extends BaseModel {
  status: number;

  user: User;
  nivel_educativo_nombre: number | null;
  institucion_nombre: number | null;
  estado_pais_nombre: number | null;
  ciudad_nombre: number | null;
  user_nombre: string;
  user_genero: string;
  ref: string;
  especialidad: string;
  matricula: string;
  fecha_ingreso: string | null;
}
/**Campanias */
export type CampaniaFormFields = {
  nombre: string;
  descripcion: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  programa: string | null;
  costo_asignado: number | null;
  // empresa: string | null;
  instituto: string | null;
  status: number;
};

export const initialCampaniaFormValues: CampaniaFormFields = {
  nombre: "",
  descripcion: "",
  fecha_inicio: null,
  fecha_fin: null,
  programa: null,
  costo_asignado: null,
  instituto: null,
  status: 1,
};

export interface Campania {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  costo_asignado: string;
  institucion_nombre: string;
  programa_nombre: string;
  status: number;
}

export interface CampaniaPrograma {
  id: number;
  nombre: string;
}

/**Campanias */
export type Pago = {
  id: string;
  estudiante: string;
  inscripcion: number;
  monto: string | null;
  referencia: string | null;
  periodo: string | null;
  notas: string | null;
  tipo_pago: number | null;
  tipo_pago_r: string | null;
  fecha_pago: string | null;
  fecha_vencimiento: string | null;
  metodo_pago: "efectivo" | "tarjeta" | "transferencia";
  estado: "pendiente" | "completado" | "parcial" | "vencido" | "cancelado";
  numero_pago: string | null;
  concepto: string | null;
};

export interface PagoFormData {
  tipo_pago: string[];
  monto: number;
  fecha_vencimiento?: string | null;
  metodo_pago?: string;
  notas?: string;
  concepto: string;
  num_mensualidades: number;
  fecha_primera_mensualidad: string;
  tiene_precio_custom: boolean;
  precios_custom: {
    costo_inscripcion: number | undefined;
    costo_mensualidad: number | undefined;
    costo_documentacion: number | undefined;
  };
  razon_precio_custom: string;
  campania: string | null;
}

export interface TipoPago {
  id: number;
  nombre: string;
}

export const InitalPagoForm = {
  tipo_pago: [],
  monto: 0,
  fecha_vencimiento: "",
  metodo_pago: "",
  notas: "",
  concepto: "",
  tiene_precio_custom: false,
  precios_custom: {
    costo_inscripcion: 0,
    costo_mensualidad: 0,
    costo_documentacion: 0,
  },
  razon_precio_custom: "",
  campania: null,
};

export interface ProgramaEducativoDetail {
  ref: string;
  nombre: string;
  descripcion: string;
  tipo: number;
  tipo_nombre: string;
  institucion: number;
  institucion_nombre: string;
  duracion_horas: number;
  duracion_meses: number;
  fecha_inicio: string; // o Date si prefieres convertirlo
  fecha_fin: string; // o Date
  horario: string;
  costo_inscripcion: string; // o number si conviertes decimal
  costo_mensualidad: string; // o number
  costo_documentacion: string; // o number
  instructor: number[]; // array de IDs
  modalidad: number;
  modalidad_nombre: string;
  imagen_url: string;
  banner_url: string;
  modulos: number[]; // array de IDs
  modulos_obj: ModulosInterface[];
}

export interface PlataformaImparticion {
  id: number;
  nombre: string;
}

export interface EnlaceClase {
  id: number;
  programa: number;
  link: string;
  fecha_imparticion: string;
  titulo: string;
  descripcion: string | null;
  plataforma_detail: PlataformaImparticion | null;
  password_platform: string | null;
  created_at: string;
}

export interface ComentarioSimple {
  id: number;
  comentario: string;
  padre: number | null;
  usuario: number;
  usuario_nombre: string | null;
  editado: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Comentario {
  id: number;
  comentario: string;
  diplomado: number | null;
  diplomado_nombre: string | null;
  modulo: number | null;
  modulo_nombre: string | null;
  usuario: number;
  usuario_nombre: string | null;
  padre: number | null;
  editado: number;
  status: number;
  created_at: string;
  updated_at: string;
  respuestas: ComentarioSimple[];
}

export interface Material {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: number;
  original_name: string;
  storage_name: string;
  mime_type: string;
  size: number;
  path: string;
  file_type: string;
  description: string | null;
  is_public: boolean;
  created_by_id: number | null;
  deleted_by_id: number | null;
  edited_by_id: number | null;
  owner_id: number | null;
  uploaded_by_id: number | null;
  modulo_id: number | null;
  programa_id: string | null;
  submodulo_id: number | null;
  campania_id: number | null;
}

export interface EventoShowInterface {
  nombre: string;
  descripcion: string;
  campania: string;
  empresa: string;
  instituto: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  ubicacion: string;
  tipo: string;
}
