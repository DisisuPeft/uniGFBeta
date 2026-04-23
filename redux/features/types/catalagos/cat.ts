import { BaseModel } from "../base-interface";

export interface Instituciones extends BaseModel {
  nombre: string;
  empresa: string;
}

export interface NivelEducativo {
  id: number;
  nombre: string;
}

export interface EstadoRepublica {
  id: number;
  name: string;
}

export interface Localidad {
  id: number;
  name: string;
}

export interface MetodoPago {
  id: string;
  nombre: string;
}
