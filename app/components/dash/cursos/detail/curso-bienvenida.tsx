"use client";

import Link from "next/link";
import { useGetCursoQuery } from "@/redux/features/control-escolar/programasApiSlice";
import { MODULOS_MOCK } from "./types";
import { Clock, BookOpen, User, ChevronRight, CheckCircle, Circle, Trophy } from "lucide-react";
import { useCursoProgress } from "./use-curso-progress";
import Swal from "sweetalert2";

const TIPO_BADGE: Record<string, string> = {
  lectura: "bg-blue-50 text-blue-600",
  video: "bg-purple-50 text-purple-600",
  actividad: "bg-amber-50 text-amber-600",
  evaluación: "bg-green-50 text-green-700",
};

const modulosConEval = MODULOS_MOCK.filter((m) => m.tieneEvaluacion);

export default function CursoBienvenida({ cursoId }: { cursoId: number }) {
  const { data: curso, isLoading } = useGetCursoQuery(cursoId);
  const { getScore, allCompleted, finalScore } = useCursoProgress(cursoId);

  const handleFinalizar = () => {
    if (!allCompleted) {
      Swal.fire({
        icon: "info",
        title: "Evaluaciones pendientes",
        text: "Completa todas las evaluaciones de módulos y la Evaluación Final antes de finalizar.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#0ea5e9",
      });
      return;
    }
    if (finalScore !== null && finalScore >= 70) {
      Swal.fire({
        icon: "success",
        title: "¡Felicitaciones!",
        html: `
          <p style="font-size:3rem;font-weight:700;color:#10b981;margin:8px 0">${finalScore}%</p>
          <p style="color:#6b7280;font-size:0.85rem;margin-bottom:12px">Evaluación Final del Curso</p>
          <p style="color:#374151">Completaste el <strong>Curso Básico BDC</strong> exitosamente.<br/>¡Bienvenido al equipo!</p>
        `,
        confirmButtonText: "¡Listo! 🎉",
        confirmButtonColor: "#0ea5e9",
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Sigue intentando",
        html: `
          <p style="font-size:3rem;font-weight:700;color:#f59e0b;margin:8px 0">${finalScore ?? 0}%</p>
          <p style="color:#6b7280;font-size:0.85rem;margin-bottom:12px">Evaluación Final del Curso</p>
          <p style="color:#374151">Necesitas al menos <strong>70%</strong> en la Evaluación Final.<br/>Revisa el contenido y vuelve a intentarlo.</p>
        `,
        confirmButtonText: "Continuar estudiando",
        confirmButtonColor: "#0ea5e9",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const primerModulo = MODULOS_MOCK[0];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-1">
          Bienvenida
        </p>
        <h1 className="text-2xl font-bold text-gray-900">{curso?.nombre}</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {curso?.descripcion ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Esta capacitación está diseñada para brindarte las herramientas necesarias para desempeñar tu rol de manera efectiva dentro de la organización."}
        </p>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{curso?.duracion_horas ?? "—"} horas totales</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span>{MODULOS_MOCK.length} módulos</span>
        </div>
        {curso?.instructor?.[0] && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-gray-400" />
            <span>{curso.instructor[0].user?.nombre}</span>
          </div>
        )}
      </div>

      {/* Lo que aprenderás */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-sm mb-3">
          Lo que aprenderás
        </h2>
        <ul className="space-y-2">
          {MODULOS_MOCK.map((m) => (
            <li
              key={m.id}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="text-sky-500 font-bold mt-0.5">✓</span>
              {m.descripcion}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido del curso */}
      <div>
        <h2 className="font-bold text-gray-900 text-base mb-3">
          Contenido del curso
        </h2>
        <div className="space-y-3">
          {MODULOS_MOCK.map((modulo, idx) => (
            <div
              key={modulo.id}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">
                    {modulo.titulo}
                  </p>
                  <p className="text-xs text-gray-400">
                    {modulo.temas.length} temas
                    {modulo.tieneEvaluacion && " · Evaluación incluida"}
                  </p>
                </div>
                <Link
                  href={`/dashboard/cursos/${cursoId}/modulo/${modulo.id}`}
                  className="text-xs text-sky-600 font-medium hover:text-sky-700 flex items-center gap-0.5 transition-colors"
                >
                  Ver <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {modulo.temas.map((tema) => (
                  <div
                    key={tema.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIPO_BADGE[tema.tipo]}`}
                    >
                      {tema.tipo}
                    </span>
                    <span className="text-sm text-gray-700 flex-1">
                      {tema.titulo}
                    </span>
                    <span className="text-xs text-gray-400">
                      {tema.duracion}
                    </span>
                  </div>
                ))}
                {modulo.tieneEvaluacion && (
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIPO_BADGE["evaluación"]}`}
                    >
                      evaluación
                    </span>
                    <span className="text-sm text-gray-700 flex-1">
                      Evaluación del módulo
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso de evaluaciones */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
          <Trophy className="w-5 h-5 text-sky-500" />
          <div>
            <p className="text-sm font-bold text-gray-900">Progreso de evaluaciones</p>
            <p className="text-xs text-gray-400">
              {[...modulosConEval.map((m) => getScore(`modulo_${m.id}`)), getScore("final")].filter(
                (s) => s !== null
              ).length}{" "}
              / {modulosConEval.length + 1} completadas
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {modulosConEval.map((m) => {
            const score = getScore(`modulo_${m.id}`);
            return (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                {score !== null ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-700 flex-1">
                  Módulo {m.id} — {m.titulo}
                </span>
                {score !== null ? (
                  <span
                    className={`text-xs font-semibold ${
                      score >= 70 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {score}%
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Pendiente</span>
                )}
              </div>
            );
          })}
          {/* Evaluación Final */}
          <div className="flex items-center gap-3 px-5 py-3">
            {finalScore !== null ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
            )}
            <span className="text-sm font-semibold text-gray-700 flex-1">
              Evaluación Final del Curso
            </span>
            {finalScore !== null ? (
              <span
                className={`text-xs font-semibold ${
                  finalScore >= 70 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {finalScore}%
              </span>
            ) : (
              <span className="text-xs text-gray-400">Pendiente</span>
            )}
          </div>
        </div>
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            {allCompleted
              ? "Todas las evaluaciones completadas. ¡Ya puedes finalizar!"
              : "Completa todas las evaluaciones de módulos y la Evaluación Final."}
          </p>
          <button
            onClick={handleFinalizar}
            disabled={!allCompleted}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-500/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Trophy className="w-4 h-4" />
            Finalizar curso
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <Link
          href={`/dashboard/cursos/${cursoId}/modulo/${primerModulo.id}`}
          className="px-6 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-500/90 transition-colors"
        >
          Comenzar capacitación →
        </Link>
      </div>
    </div>
  );
}
