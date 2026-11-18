"use client";

import { Plus } from "lucide-react";
import {
  TipoBloque,
  TipoTema,
  TipoEvaluacion,
  StatusCurso,
} from "@/redux/features/types/catalagos/cat";

export type Cats = {
  statusList: StatusCurso[];
  tiposTema: TipoTema[];
  tiposBloque: TipoBloque[];
  tiposEvaluacion: TipoEvaluacion[];
  nivelesComp: { id: number; nombre: string }[];
  competencias: { id: number; nombre: string }[];
};

// Helpers de UI compartidos por las distintas secciones del editor de cursos
// (info del curso, módulos, temas, bloques, evaluaciones, competencias).

export const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]/20 transition-colors placeholder:text-gray-400 bg-white";

export const selectCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] transition-colors bg-white text-gray-700";

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <Icon className="w-4 h-4 text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function IconBtn({
  onClick,
  title,
  children,
  danger,
}: {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${danger ? "hover:bg-red-50 text-gray-400 hover:text-red-500" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"}`}
    >
      {children}
    </button>
  );
}

export function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] bg-[#F0F6FF] rounded-lg hover:bg-[#e0edff] transition-colors"
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// Reordenamiento par-a-par genérico (módulos, temas, preguntas, opciones) —
// los bloques y sus ítems usan los endpoints de reordenamiento en lote en su
// lugar (ver bloques/bloques-section.tsx).
export async function swapOrden<T extends { id: number; orden: number }>(
  a: T,
  b: T,
  updateFn: (arg: { id: number; body: { orden: number } }) => {
    unwrap: () => Promise<unknown>;
  },
) {
  const temp = Math.max(a.orden, b.orden) + 1000;
  await updateFn({ id: a.id, body: { orden: temp } }).unwrap();
  await updateFn({ id: b.id, body: { orden: a.orden } }).unwrap();
  await updateFn({ id: a.id, body: { orden: b.orden } }).unwrap();
}
