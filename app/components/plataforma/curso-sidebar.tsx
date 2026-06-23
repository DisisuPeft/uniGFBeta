"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useGetCursoPlataformaQuery,
  useGetModulosQuery,
  useGetTemasQuery,
  useGetEvaluacionesQuery,
  useGetMisProgresosQuery,
} from "@/redux/features/capacitacion/plataformaApiSlice";

interface ModuloItemProps {
  moduloId: number;
  moduloTitulo: string;
  orden: number;
  cursoId: number;
  temasCompletados: Set<number>;
}

function ModuloItem({
  moduloId,
  moduloTitulo,
  orden,
  cursoId,
  temasCompletados,
}: ModuloItemProps) {
  const pathname = usePathname();
  const { data: temasData } = useGetTemasQuery({ modulo: moduloId });
  const { data: evalsData } = useGetEvaluacionesQuery({ modulo: moduloId });

  const temas = temasData?.results ?? [];
  const evals = evalsData?.results ?? [];

  return (
    <div className="mb-1">
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center flex-shrink-0 font-medium">
          {orden}
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">
          {moduloTitulo}
        </span>
      </div>

      <ul className="pl-2">
        {temas.map((tema) => {
          const completado = temasCompletados.has(tema.id);
          const isActive = pathname.includes(`/tema/${tema.id}`);
          return (
            <li key={tema.id}>
              <Link
                href={`/plataforma/curso/${cursoId}/tema/${tema.id}`}
                className={`flex items-start gap-2.5 px-3 py-1.5 mx-1 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`mt-0.5 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] ${
                    completado
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                        ? "border-blue-500"
                        : "border-gray-300"
                  }`}
                >
                  {completado && "✓"}
                </span>
                <span className="line-clamp-2 leading-snug">{tema.titulo}</span>
              </Link>
            </li>
          );
        })}

        {evals.map((ev) => {
          const isActive = pathname.includes(`/evaluacion/${ev.id}`);
          return (
            <li key={`eval-${ev.id}`}>
              <Link
                href={`/plataforma/curso/${cursoId}/evaluacion/${ev.id}`}
                className={`flex items-start gap-2.5 px-3 py-1.5 mx-1 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-amber-50 text-amber-700 font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="mt-0.5 w-4 h-4 rounded border border-amber-300 flex-shrink-0 flex items-center justify-center text-[10px] text-amber-500">
                  E
                </span>
                <span className="line-clamp-2 leading-snug">{ev.titulo}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface Props {
  cursoId: number;
}

export default function CursoSidebar({ cursoId }: Props) {
  const pathname = usePathname();
  const { data: curso } = useGetCursoPlataformaQuery(cursoId);
  const { data: modulosData } = useGetModulosQuery({ curso: cursoId });
  const { data: progresosData } = useGetMisProgresosQuery();
  const { data: cursoevals } = useGetEvaluacionesQuery({ curso: cursoId });

  const modulos = modulosData?.results ?? [];
  const progresos = progresosData?.results ?? [];
  const temasCompletados = new Set(progresos.map((p) => p.tema));
  const evalsFinales = cursoevals?.results ?? [];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <Link
          href="/plataforma"
          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-2"
        >
          ← Mis cursos
        </Link>
        <h2 className="text-sm font-semibold text-gray-900 line-clamp-3 leading-snug">
          {curso?.titulo ?? "Cargando..."}
        </h2>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-3">
        {modulos.map((modulo, i) => (
          <ModuloItem
            key={modulo.id}
            moduloId={modulo.id}
            moduloTitulo={modulo.titulo}
            orden={i + 1}
            cursoId={cursoId}
            temasCompletados={temasCompletados}
          />
        ))}

        {/* Evaluación final del curso */}
        {evalsFinales.length > 0 && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="px-4 py-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Evaluación final
              </span>
            </div>
            <ul className="pl-2">
              {evalsFinales.map((ev) => {
                const isActive = pathname.includes(`/evaluacion/${ev.id}`);
                return (
                  <li key={ev.id}>
                    <Link
                      href={`/plataforma/curso/${cursoId}/evaluacion/${ev.id}`}
                      className={`flex items-start gap-2.5 px-3 py-1.5 mx-1 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-amber-50 text-amber-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="mt-0.5 w-4 h-4 rounded border border-amber-300 flex-shrink-0 flex items-center justify-center text-[10px] text-amber-500">
                        E
                      </span>
                      <span className="leading-snug">{ev.titulo}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 flex-shrink-0">
        <Link
          href={`/plataforma/curso/${cursoId}`}
          className="block text-xs text-center text-gray-400 hover:text-gray-600 py-1"
        >
          Ver resumen del curso
        </Link>
      </div>
    </aside>
  );
}