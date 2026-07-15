"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Lock,
  ArrowLeft,
  Play,
  Award,
  Layers,
  GraduationCap,
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
    <ul className="mt-2 space-y-1">
      {temas.map((tema) => {
        const completado = temasCompletados.has(tema.id);
        return (
          <li key={tema.id}>
            {inscrito ? (
              <Link
                href={`/plataforma/curso/${cursoId}/tema/${tema.id}`}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 group transition-colors"
              >
                <span className="flex-shrink-0">
                  {completado ? (
                    <CheckCircle className="w-5 h-5 text-[#10b981]" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
                  )}
                </span>
                <span
                  className={`flex-1 text-[15px] font-medium ${
                    completado ? "text-slate-500" : "text-slate-700 group-hover:text-blue-600"
                  }`}
                >
                  {tema.titulo}
                </span>
                <div className="flex items-center gap-6">
                  <span
                    className={`text-xs font-bold ${
                      tema.tipo_nombre?.toLowerCase() === "teórico" || tema.tipo_nombre?.toLowerCase() === "teorico"
                        ? "text-blue-500"
                        : "text-[#10b981]"
                    }`}
                  >
                    {tema.tipo_nombre || "Práctico"}
                  </span>
                  <span className="text-xs font-medium text-slate-400 w-12 text-right">
                    {tema.duracion_estimada || "15 min"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-4 px-4 py-3 opacity-50 cursor-not-allowed">
                <span className="flex-shrink-0">
                  <Circle className="w-5 h-5 text-slate-300" />
                </span>
                <span className="flex-1 text-[15px] font-medium text-slate-600">{tema.titulo}</span>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold text-slate-400">
                    {tema.tipo_nombre || "Práctico"}
                  </span>
                  <span className="text-xs font-medium text-slate-400 w-12 text-right">
                    {tema.duracion_estimada || "15 min"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
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
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-amber-50 group transition-colors"
            >
              <span className="w-5 h-5 rounded-full border-2 border-amber-300 bg-amber-50 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-amber-500">
                E
              </span>
              <span className="flex-1 text-[15px] font-medium text-amber-700 group-hover:text-amber-800">
                {ev.titulo}
              </span>
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold text-amber-500">Evaluación</span>
                <span className="text-xs font-medium text-slate-400 w-12 text-right">30 min</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 px-4 py-3 opacity-50 cursor-not-allowed">
              <span className="w-5 h-5 rounded-full border-2 border-amber-200 bg-amber-50 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-amber-400">
                E
              </span>
              <span className="flex-1 text-[15px] font-medium text-amber-600">{ev.titulo}</span>
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold text-slate-400">Evaluación</span>
                <span className="text-xs font-medium text-slate-400 w-12 text-right">30 min</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
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
  const { total, porcentaje } = modulo.progreso;
  const isCompleto = porcentaje === 100;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 hover:bg-slate-50/60 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1">
          <span className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f0f4ff] text-[#0056D2] flex-shrink-0 border border-blue-100/50">
             <BookOpen className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-bold text-gray-900 truncate">
              {modulo.titulo}
            </p>
            <p className="text-[13px] text-slate-400 mt-0.5">
              {modulo.descripcion || "Módulo de formación"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {!inscrito || total === 0 ? (
             <div className="flex items-center gap-2">
               <Lock className="w-4 h-4 text-slate-300" />
               <span className="text-[13px] font-bold text-slate-500">0%</span>
             </div>
           ) : (
             <div className="flex items-center gap-3 w-32 justify-end">
               <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div
                   className="h-full rounded-full transition-all duration-700 bg-[#0056D2]"
                   style={{ width: `${porcentaje}%` }}
                 />
               </div>
               <span className="text-[13px] font-bold text-[#1c2634] w-8 text-right">
                 {porcentaje}%
               </span>
             </div>
           )}
           <ChevronDown
             className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
               open ? "rotate-180" : ""
             }`}
           />
        </div>
      </button>

      {open && (
        <div className="px-6 pb-5">
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
      <div className="bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative">
        {/* Banner (optional) */}
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

        <div className="p-8 lg:p-10 flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* Info Column */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="mb-5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  isCompletado
                    ? "bg-emerald-50 text-emerald-700"
                    : inscripcion
                      ? "bg-[#f0f4ff] text-[#0056D2]"
                      : "bg-slate-50 text-slate-500"
                }`}
              >
                {isCompletado ? (
                  <>
                    <Award className="w-3.5 h-3.5" /> Completado
                  </>
                ) : inscripcion ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> En progreso
                  </>
                ) : (
                  "Disponible"
                )}
              </span>
            </div>

            <h1 className="text-3xl lg:text-[40px] font-extrabold text-[#111827] leading-tight mb-4 tracking-tight">
              {curso.titulo}
            </h1>

            {curso.descripcion && (
              <p className="text-slate-500 text-[15px] leading-relaxed mb-6 max-w-3xl">
                {curso.descripcion}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-500 mb-8 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {curso.duracion_horas}h 00m de contenido
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" />
                {modulos.length} módulo{modulos.length !== 1 ? "s" : ""}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" />
                {totalTemas} temas
              </span>
            </div>

            {/* Progreso */}
            {progreso && (
              <div className="max-w-xl mt-auto">
                <div className="flex justify-between items-end mb-2.5">
                  <span className="text-[15px] font-extrabold text-[#111827]">
                    {progreso.porcentaje}% completado
                  </span>
                  <span className="text-[13px] font-medium text-slate-400">
                    {progreso.completados}/{progreso.total} temas
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out bg-[#0056D2]"
                    style={{ width: `${progreso.porcentaje}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CTA Column */}
          <div className="flex-shrink-0 flex flex-col items-end gap-6">
            {isCompletado ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl">
                <Award className="w-5 h-5 text-emerald-500" />
                Curso completado
              </div>
            ) : inscripcion ? (
              <button
                onClick={handleContinuar}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0056D2] hover:bg-[#0047b3] text-white text-[15px] font-bold rounded-xl shadow-[0_4px_12px_rgba(0,86,210,0.2)] transition-all duration-200"
              >
                <Play className="w-4 h-4 fill-current" />
                Continuar curso
              </button>
            ) : (
              <button
                onClick={() => inscribirse({ curso: cursoId })}
                disabled={inscribiendo}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0056D2] hover:bg-[#0047b3] text-white text-[15px] font-bold rounded-xl shadow-[0_4px_12px_rgba(0,86,210,0.2)] disabled:opacity-60 transition-all duration-200"
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

      {/* Mensaje final */}
      <div className="flex items-center justify-center gap-4 mt-8 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#f0f4ff] flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-[#0056D2]" />
        </div>
        <p className="text-[15px] text-slate-500 font-medium text-center">
          Sigue aprendiendo cada día.{" "}
          <span className="font-bold text-[#0056D2]">
            ¡Tú puedes lograr grandes cosas!
          </span>
        </p>
      </div>
    </div>
  );
}
