"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  BookOpen,
  ChevronDown,
  CheckCircle,
  ArrowLeft,
  Play,
  Award,
} from "lucide-react";
import {
  useGetCursoPlataformaQuery,
  useGetModulosQuery,
  useGetTemasQuery,
  useGetEvaluacionesQuery,
  useGetMisInscripcionesQuery,
  useInscribirseACursoMutation,
  useMarcarCursoCompletadoMutation,
  useGetMisProgresosQuery,
} from "@/redux/features/capacitacion/plataformaApiSlice";

// ── Sub-components ────────────────────────────────────────────────

function BarraProgreso({ porcentaje }: { porcentaje: number }) {
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAncho(porcentaje), 120);
    return () => clearTimeout(t);
  }, [porcentaje]);

  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${ancho}%`,
          background:
            porcentaje === 100
              ? "#10b981"
              : "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
        }}
      />
    </div>
  );
}

function ModuloContent({
  moduloId,
  cursoId,
  temasCompletados,
  inscrito,
}: {
  moduloId: number;
  cursoId: number;
  temasCompletados: Set<number>;
  inscrito: boolean;
}) {
  const { data: temasData } = useGetTemasQuery({ modulo: moduloId });
  const { data: evalsData } = useGetEvaluacionesQuery({ modulo: moduloId });
  const temas = temasData?.results ?? [];
  const evals = evalsData?.results ?? [];

  if (!temas.length && !evals.length) return null;

  return (
    <ul className="mt-3 space-y-0.5">
      {temas.map((tema) => {
        const completado = temasCompletados.has(tema.id);
        return (
          <li key={tema.id}>
            {inscrito ? (
              <Link
                href={`/plataforma/curso/${cursoId}/tema/${tema.id}`}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 group transition-colors"
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    completado
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-300 group-hover:border-[#0056D2]"
                  }`}
                >
                  {completado && <CheckCircle className="w-3 h-3 text-white" />}
                </span>
                <span
                  className={`flex-1 text-sm ${
                    completado
                      ? "text-slate-400 line-through"
                      : "text-slate-700 group-hover:text-[#0056D2]"
                  }`}
                >
                  {tema.titulo}
                </span>
                <span className="text-[11px] text-slate-400">{tema.tipo_nombre}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-3 py-2 opacity-50 cursor-not-allowed">
                <span className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                <span className="flex-1 text-sm text-slate-600">{tema.titulo}</span>
                <span className="text-[11px] text-slate-400">{tema.tipo_nombre}</span>
              </div>
            )}
          </li>
        );
      })}
      {evals.map((ev) => (
        <li key={`ev-${ev.id}`}>
          {inscrito ? (
            <Link
              href={`/plataforma/curso/${cursoId}/evaluacion/${ev.id}`}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-50 group transition-colors"
            >
              <span className="w-5 h-5 rounded-lg border-2 border-amber-300 bg-amber-50 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-amber-500">
                E
              </span>
              <span className="flex-1 text-sm text-amber-700 group-hover:text-amber-800">
                {ev.titulo}
              </span>
              <span className="text-[11px] text-amber-400">Evaluación</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2 opacity-50 cursor-not-allowed">
              <span className="w-5 h-5 rounded-lg border-2 border-amber-200 bg-amber-50 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-amber-400">
                E
              </span>
              <span className="flex-1 text-sm text-amber-600">{ev.titulo}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function ModuloCard({
  modulo,
  index,
  cursoId,
  temasCompletados,
  inscrito,
}: {
  modulo: {
    id: number;
    titulo: string;
    descripcion?: string;
    progreso: { completados: number; total: number; porcentaje: number };
    tiene_evaluacion: boolean;
  };
  index: number;
  cursoId: number;
  temasCompletados: Set<number>;
  inscrito: boolean;
}) {
  const [open, setOpen] = useState(true);
  const { completados, total, porcentaje } = modulo.progreso;
  const isCompleto = porcentaje === 100;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors text-left"
      >
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            isCompleto
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-50 text-[#0056D2]"
          }`}
        >
          {isCompleto ? <CheckCircle className="w-4 h-4" /> : index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{modulo.titulo}</p>
          {inscrito && total > 0 && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              {completados}/{total} pasos completados
            </p>
          )}
        </div>

        {inscrito && total > 0 && (
          <div className="hidden sm:flex items-center gap-2 w-28 flex-shrink-0">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${porcentaje}%`,
                  backgroundColor: isCompleto ? "#10b981" : "#3b82f6",
                }}
              />
            </div>
            <span
              className={`text-[11px] font-bold w-8 text-right ${
                isCompleto ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {porcentaje}%
            </span>
          </div>
        )}

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-5 pb-4 border-t border-slate-50">
          {modulo.descripcion && (
            <p className="text-xs text-slate-400 pt-3 pb-1 leading-relaxed">
              {modulo.descripcion}
            </p>
          )}
          <ModuloContent
            moduloId={modulo.id}
            cursoId={cursoId}
            temasCompletados={temasCompletados}
            inscrito={inscrito}
          />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export default function CursoOverviewClient({ cursoId }: { cursoId: number }) {
  const router = useRouter();
  const { data: curso, isLoading } = useGetCursoPlataformaQuery(cursoId);
  const { data: modulosData } = useGetModulosQuery({ curso: cursoId });
  const { data: evalsData } = useGetEvaluacionesQuery({ curso: cursoId });
  const { data: inscripcionesData } = useGetMisInscripcionesQuery();
  const { data: progresosData } = useGetMisProgresosQuery();
  const [inscribirse, { isLoading: inscribiendo }] = useInscribirseACursoMutation();
  const [marcarCompletado] = useMarcarCursoCompletadoMutation();

  const modulos = modulosData?.results ?? [];
  const evalsFinales = evalsData?.results ?? [];
  const inscripciones = inscripcionesData?.results ?? [];
  const progresos = progresosData?.results ?? [];
  const temasCompletados = new Set(progresos.map((p) => p.tema));
  const inscripcion = inscripciones.find((i) => i.curso === cursoId);
  const primerModuloId = modulos[0]?.id;
  const { data: primerosTemasData } = useGetTemasQuery(
    { modulo: primerModuloId! },
    { skip: !primerModuloId },
  );
  const primerTemaId = primerosTemasData?.results?.[0]?.id;

  useEffect(() => {
    if (
      inscripcion &&
      !inscripcion.completado_at &&
      curso?.progreso?.porcentaje === 100
    ) {
      marcarCompletado({
        id: inscripcion.id,
        completado_at: new Date().toISOString(),
      });
    }
  }, [inscripcion, curso?.progreso?.porcentaje, marcarCompletado]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0056D2]" />
      </div>
    );
  }

  if (!curso) return null;

  const progreso =
    curso.inscrito && curso.progreso?.total > 0 ? curso.progreso : null;
  const isCompletado =
    !!inscripcion?.completado_at || progreso?.porcentaje === 100;
  const totalTemas = modulos.reduce(
    (acc, m) => acc + (m.progreso?.total ?? 0),
    0,
  );

  function handleContinuar() {
    if (primerTemaId) {
      router.push(`/plataforma/curso/${cursoId}/tema/${primerTemaId}`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Back */}
      <Link
        href="/plataforma"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0056D2] transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Mis cursos
      </Link>

      {/* Hero card */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        {/* Banner */}
        {curso.banner ? (
          <div className="h-52 w-full overflow-hidden">
            <img
              src={curso.banner}
              alt={curso.titulo}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="h-1.5 w-full"
            style={{
              background: "linear-gradient(90deg, #0056D2 0%, #6366f1 100%)",
            }}
          />
        )}

        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Info */}
            <div className="flex-1 min-w-0">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold mb-4 ${
                  isCompletado
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : inscripcion
                      ? "bg-blue-50 text-[#0056D2] border border-blue-100"
                      : "bg-slate-50 text-slate-500 border border-slate-200"
                }`}
              >
                {isCompletado ? (
                  <>
                    <Award className="w-3 h-3" /> Completado
                  </>
                ) : inscripcion ? (
                  <>
                    <Play className="w-3 h-3 fill-current" /> En progreso
                  </>
                ) : (
                  "Disponible"
                )}
              </span>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
                {curso.titulo}
              </h1>

              {curso.descripcion && (
                <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-2xl">
                  {curso.descripcion}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {curso.duracion_horas}h de contenido
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  {modulos.length} módulo{modulos.length !== 1 ? "s" : ""}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                <span>{totalTemas} tema{totalTemas !== 1 ? "s" : ""}</span>
              </div>

              {/* Progreso */}
              {progreso && (
                <div className="max-w-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {progreso.porcentaje}% completado
                    </span>
                    <span className="text-xs text-slate-400">
                      {progreso.completados}/{progreso.total} temas
                    </span>
                  </div>
                  <BarraProgreso porcentaje={progreso.porcentaje} />
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              {isCompletado ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                    <Award className="w-8 h-8 text-emerald-500" />
                  </div>
                  <span className="text-sm font-bold text-emerald-700">
                    Curso completado
                  </span>
                </>
              ) : inscripcion ? (
                <button
                  onClick={handleContinuar}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0056D2] hover:bg-[#0047b3] text-white text-sm font-bold rounded-2xl shadow-sm transition-all duration-200"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Continuar curso
                </button>
              ) : (
                <button
                  onClick={() => inscribirse({ curso: cursoId })}
                  disabled={inscribiendo}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0056D2] hover:bg-[#0047b3] text-white text-sm font-bold rounded-2xl shadow-sm disabled:opacity-60 transition-all duration-200"
                >
                  {inscribiendo ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  Inscribirse
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3 px-1">
          Contenido del curso
        </h2>

        <div className="space-y-2">
          {modulos.map((modulo, i) => (
            <ModuloCard
              key={modulo.id}
              modulo={modulo}
              index={i}
              cursoId={cursoId}
              temasCompletados={temasCompletados}
              inscrito={curso.inscrito}
            />
          ))}

          {evalsFinales.length > 0 && (
            <div className="bg-white border border-amber-100 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <span className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-600 flex-shrink-0">
                  E
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    Evaluación final
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {evalsFinales.length} evaluación
                    {evalsFinales.length !== 1 ? "es" : ""}
                  </p>
                </div>
              </div>
              {curso.inscrito && (
                <div className="px-5 pb-4 border-t border-amber-50">
                  <ul className="mt-3 space-y-0.5">
                    {evalsFinales.map((ev) => (
                      <li key={ev.id}>
                        <Link
                          href={`/plataforma/curso/${cursoId}/evaluacion/${ev.id}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-50 group transition-colors"
                        >
                          <span className="w-5 h-5 rounded-lg border-2 border-amber-300 bg-amber-50 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-amber-500">
                            E
                          </span>
                          <span className="flex-1 text-sm text-amber-700 group-hover:text-amber-800">
                            {ev.titulo}
                          </span>
                          <span className="text-[11px] text-amber-400">
                            Evaluación
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
