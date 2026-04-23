"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetCursoQuery } from "@/redux/features/control-escolar/programasApiSlice";
import { MODULOS_MOCK } from "./types";
import { BookOpen, ClipboardList, ChevronDown, ArrowLeft, Medal } from "lucide-react";
import { useState } from "react";

export default function CursoAside({ cursoId }: { cursoId: number }) {
  const { data: curso } = useGetCursoQuery(cursoId);
  const pathname = usePathname();
  const [abiertos, setAbiertos] = useState<number[]>([1]);

  const toggle = (id: number) =>
    setAbiertos((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  const base = `/dashboard/cursos/${cursoId}`;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto h-[calc(100vh-56px)] sticky top-0 self-start">
      {/* Encabezado del curso */}
      <div className="p-5 border-b border-gray-200">
        <Link
          href="/dashboard/cursos"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Todos los cursos
        </Link>
        <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center mb-3">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h2 className="font-bold text-gray-900 text-sm leading-snug">
          {curso?.nombre ?? "Cargando..."}
        </h2>
        {curso?.instructor?.[0] && (
          <p className="text-xs text-sky-600 mt-0.5">
            {curso.instructor[0].user?.nombre}
          </p>
        )}
      </div>

      {/* Bienvenida */}
      <div className="px-4 pt-4 pb-1">
        <Link
          href={`${base}/bienvenida`}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
            pathname === `${base}/bienvenida`
              ? "bg-sky-50 text-sky-700 font-medium border-l-2 border-sky-500"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          Bienvenida
        </Link>
      </div>

      {/* Módulos */}
      <div className="px-4 py-2 space-y-0.5">
        {MODULOS_MOCK.map((modulo, idx) => {
          const isOpen = abiertos.includes(modulo.id);
          const moduloPath = `${base}/modulo/${modulo.id}`;
          const evalPath = `${moduloPath}/evaluacion`;
          const isActivo = pathname.startsWith(moduloPath);

          return (
            <div key={modulo.id}>
              <button
                onClick={() => toggle(modulo.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActivo
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate text-left flex-1">
                  {modulo.titulo}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 text-gray-400 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                />
              </button>

              {isOpen && (
                <div className="ml-5 mt-0.5 space-y-0.5">
                  <Link
                    href={moduloPath}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors ${
                      pathname === moduloPath
                        ? "bg-sky-50 text-sky-700 font-medium border-l-2 border-sky-500"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Contenido
                  </Link>
                  {modulo.tieneEvaluacion && (
                    <Link
                      href={evalPath}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors ${
                        pathname === evalPath
                          ? "bg-sky-50 text-sky-700 font-medium border-l-2 border-sky-500"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <ClipboardList className="w-3 h-3" />
                      Evaluación
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Evaluación Final */}
      <div className="px-4 py-3 border-t border-gray-100">
        <Link
          href={`${base}/evaluacion-final`}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
            pathname === `${base}/evaluacion-final`
              ? "bg-sky-50 text-sky-700 font-medium border-l-2 border-sky-500"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Medal className="w-4 h-4 flex-shrink-0" />
          Evaluación Final
        </Link>
      </div>
    </aside>
  );
}
