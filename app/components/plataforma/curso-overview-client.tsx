"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useGetCursoPlataformaQuery,
  useGetModulosQuery,
  useGetTemasQuery,
  useGetEvaluacionesQuery,
  useGetMisInscripcionesQuery,
  useInscribirseACursoMutation,
  useGetMisProgresosQuery,
} from "@/redux/features/capacitacion/plataformaApiSlice";

function BarraProgreso({ porcentaje }: { porcentaje: number }) {
  const [ancho, setAncho] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAncho(porcentaje), 120);
    return () => clearTimeout(t);
  }, [porcentaje]);

  return (
    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${ancho}%`,
          background: "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
        }}
      />
    </div>
  );
}

function MiniBarraModulo({
  progreso,
  tiene_evaluacion,
}: {
  progreso: { completados: number; total: number; porcentaje: number };
  tiene_evaluacion: boolean;
}) {
  const [ancho, setAncho] = useState(0);
  const { completados, total, porcentaje } = progreso;
  const pendienteEval = tiene_evaluacion && porcentaje < 100;

  useEffect(() => {
    if (total === 0) return;
    const t = setTimeout(() => setAncho(porcentaje), 200);
    return () => clearTimeout(t);
  }, [porcentaje, total]);

  if (total === 0) return null;

  const color =
    porcentaje === 100
      ? "#22c55e"
      : pendienteEval
        ? "linear-gradient(90deg, #f59e0b 0%, #f97316 100%)"
        : "linear-gradient(90deg, #60a5fa 0%, #818cf8 100%)";

  const textColor =
    porcentaje === 100 ? "text-green-600" : pendienteEval ? "text-amber-500" : "text-blue-600";

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-gray-400">{completados}/{total} pasos</span>
        <div className="flex items-center gap-1.5">
          {pendienteEval && (
            <span className="text-[10px] font-medium text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full">
              Evaluación pendiente
            </span>
          )}
          <span className={`text-[11px] font-semibold ${textColor}`}>{porcentaje}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${ancho}%`, background: color }}
        />
      </div>
    </div>
  );
}

function ModuloTemasRow({
  moduloId,
  cursoId,
  temasCompletados,
  inscrito,
  progreso,
  tiene_evaluacion,
}: {
  moduloId: number;
  cursoId: number;
  temasCompletados: Set<number>;
  inscrito: boolean;
  progreso: { completados: number; total: number; porcentaje: number };
  tiene_evaluacion: boolean;
}) {
  const { data: temasData } = useGetTemasQuery({ modulo: moduloId });
  const { data: evalsData } = useGetEvaluacionesQuery({ modulo: moduloId });
  const temas = temasData?.results ?? [];
  const evals = evalsData?.results ?? [];

  if (!temas.length && !evals.length) return null;

  return (
    <div className="mt-3">
      {inscrito && <MiniBarraModulo progreso={progreso} tiene_evaluacion={tiene_evaluacion} />}
      <ul className="space-y-1">
        {temas.map((tema) => {
          const completado = temasCompletados.has(tema.id);
          return (
            <li key={tema.id}>
              <Link
                href={`/plataforma/curso/${cursoId}/tema/${tema.id}`}
                className="flex items-center gap-2.5 py-1 text-sm text-gray-600 hover:text-blue-600 group"
              >
                <span
                  className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] transition-colors ${
                    completado
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 group-hover:border-blue-400"
                  }`}
                >
                  {completado && "✓"}
                </span>
                {tema.titulo}
                <span className="ml-auto text-xs text-gray-300">{tema.tipo_nombre}</span>
              </Link>
            </li>
          );
        })}
        {evals.map((ev) => (
          <li key={`ev-${ev.id}`}>
            <Link
              href={`/plataforma/curso/${cursoId}/evaluacion/${ev.id}`}
              className="flex items-center gap-2.5 py-1 text-sm text-amber-600 hover:text-amber-700"
            >
              <span className="w-4 h-4 rounded border border-amber-300 flex-shrink-0 flex items-center justify-center text-[10px] text-amber-500">
                E
              </span>
              {ev.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CursoOverviewClient({ cursoId }: { cursoId: number }) {
  const { data: curso, isLoading } = useGetCursoPlataformaQuery(cursoId);
  const { data: modulosData } = useGetModulosQuery({ curso: cursoId });
  const { data: inscripcionesData } = useGetMisInscripcionesQuery();
  const { data: progresosData } = useGetMisProgresosQuery();
  const [inscribirse, { isLoading: inscribiendo }] = useInscribirseACursoMutation();

  const modulos = modulosData?.results ?? [];
  const inscripciones = inscripcionesData?.results ?? [];
  const progresos = progresosData?.results ?? [];
  const temasCompletados = new Set(progresos.map((p) => p.tema));
  const inscripcion = inscripciones.find((i) => i.curso === cursoId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!curso) return null;

  const progreso = curso.inscrito && curso.progreso.total > 0
    ? curso.progreso
    : null;

  return (
    <div className="max-w-3xl mx-auto">
      {curso.banner && (
        <div className="h-44 rounded-xl overflow-hidden mb-6 bg-gray-100">
          <img src={curso.banner} alt={curso.titulo} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{curso.titulo}</h1>
          {curso.descripcion && (
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">{curso.descripcion}</p>
          )}

          {/* Barra de progreso principal */}
          {progreso && (
            <div className="mt-5 mb-4">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-800">
                    {progreso.porcentaje}% completado
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    · {progreso.completados} de {progreso.total} temas
                  </span>
                </div>
                {progreso.porcentaje === 100 && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Finalizado
                  </span>
                )}
              </div>
              <BarraProgreso porcentaje={progreso.porcentaje} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-xs text-gray-400">{curso.duracion_horas}h de contenido</span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400">{modulos.length} módulos</span>
            <span className="text-gray-200">·</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                inscripcion?.completado_at || progreso?.porcentaje === 100
                  ? "bg-green-100 text-green-700"
                  : inscripcion
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {inscripcion?.completado_at || progreso?.porcentaje === 100
                ? "Completado"
                : inscripcion
                  ? "En progreso"
                  : "No inscrito"}
            </span>
          </div>
        </div>

        {!inscripcion && (
          <button
            onClick={() => inscribirse({ curso: cursoId })}
            disabled={inscribiendo}
            className="flex-shrink-0 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {inscribiendo ? "Inscribiendo..." : "Inscribirse al curso"}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {modulos.map((modulo, i) => (
          <div key={modulo.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm">{modulo.titulo}</h3>
                {modulo.descripcion && (
                  <p className="text-xs text-gray-400 mt-1">{modulo.descripcion}</p>
                )}
                <ModuloTemasRow
                  moduloId={modulo.id}
                  cursoId={cursoId}
                  temasCompletados={temasCompletados}
                  inscrito={curso.inscrito}
                  progreso={modulo.progreso}
                  tiene_evaluacion={modulo.tiene_evaluacion}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}