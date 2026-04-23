import { BaseModel } from "../base-interface";

export interface Empresa extends BaseModel {
  nombre: string;
  slug: string;
}
