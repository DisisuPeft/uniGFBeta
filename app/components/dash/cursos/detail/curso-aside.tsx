"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetCursoQuery } from "@/redux/features/control-escolar/programasApiSlice";
import { MODULOS_MOCK } from "./types";
import { BookOpen, ClipboardList, ChevronDown, ArrowLeft } from "lucide-react";
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
    <aside className="w-64 flex-shrink-0 border-r border-gray-100 bg-white overflow-y-auto h-[calc(100vh-56px)] sticky top-0 self-start">
      {/* Encabezado del curso */}
      <div className="p-5 border-b border-gray-100">
        <Link
          href="/dashboard/cursos"
          className="flex items-center gap-1.5 text-xs text-[#333333]/40 hover:text-[#1c2634] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Todos los cursos
        </Link>
        <div className="w-10 h-10 bg-[#1c2634] rounded-xl flex items-center justify-center mb-3">
          <BookOpen className="w-4.5 h-4.5 text-white/80" />
        </div>
        <h2 className="font-bold text-[#1c2634] text-sm leading-snug">
          {curso?.nombre ?? "Cargando..."}
        </h2>
        {curso?.instructor?.[0] && (
          <p className="text-xs text-[#333333]/45 mt-1">
            {curso.instructor[0].user?.nombre}
          </p>
        )}
      </div>

      {/* Bienvenida */}
      <div className="px-3 pt-3 pb-1">
        <Link
          href={`${base}/bienvenida`}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === `${base}/bienvenida`
              ? "bg-[#1c2634]/8 text-[#1c2634] font-medium"
              : "text-[#333333]/55 hover:bg-[#1c2634]/5 hover:text-[#1c2634]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          Inicio del curso
        </Link>
      </div>

      {/* Separador */}
      <div className="px-5 pt-3 pb-1">
        <p className="text-[10px] font-semibold text-[#333333]/35 uppercase tracking-widest">
          Módulos
        </p>
      </div>

      {/* Módulos */}
      <div className="px-3 py-1 space-y-0.5">
        {MODULOS_MOCK.map((modulo, idx) => {
          const isOpen = abiertos.includes(modulo.id);
          const moduloPath = `${base}/modulo/${modulo.id}`;
          const evalPath = `${moduloPath}/evaluacion`;
          const isActivo = pathname.startsWith(moduloPath);

          return (
            <div key={modulo.id}>
              <button
                onClick={() => toggle(modulo.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActivo
                    ? "text-[#1c2634] font-semibold"
                    : "text-[#333333]/60 hover:bg-[#1c2634]/5 hover:text-[#1c2634]"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#1c2634]/8 text-[#1c2634]/60 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate text-left flex-1 text-xs">
                  {modulo.titulo}
                </span>
                <ChevronDown
                  className={`w-3 h-3 flex-shrink-0 text-[#333333]/30 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                />
              </button>

              {isOpen && (
                <div className="ml-5 mt-0.5 space-y-0.5">
                  <Link
                    href={moduloPath}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      pathname === moduloPath
                        ? "bg-[#1c2634]/8 text-[#1c2634] font-medium"
                        : "text-[#333333]/50 hover:bg-[#1c2634]/5 hover:text-[#1c2634]"
                    }`}
                  >
                    Contenido
                  </Link>
                  {modulo.tieneEvaluacion && (
                    <Link
                      href={evalPath}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        pathname === evalPath
                          ? "bg-[#1c2634]/8 text-[#1c2634] font-medium"
                          : "text-[#333333]/50 hover:bg-[#1c2634]/5 hover:text-[#1c2634]"
                      }`}
                    >
                      <ClipboardList className="w-3 h-3 flex-shrink-0 opacity-60" />
                      Evaluación
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}