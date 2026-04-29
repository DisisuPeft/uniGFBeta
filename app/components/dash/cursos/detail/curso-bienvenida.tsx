"use client";

import Link from "next/link";
import { useGetCursoQuery } from "@/redux/features/control-escolar/programasApiSlice";
import { MODULOS_MOCK } from "./types";
import {
  Clock,
  BookOpen,
  User,
  ChevronRight,
  CheckCircle,
  Circle,
  Trophy,
} from "lucide-react";
import { useCursoProgress } from "./use-curso-progress";
import Swal from "sweetalert2";

const TIPO_BADGE: Record<string, string> = {
  lectura: "bg-[#1c2634]/8 text-[#1c2634]",
  video: "bg-purple-50 text-purple-600",
  actividad: "bg-amber-50 text-amber-600",
  evaluación: "bg-emerald-50 text-emerald-700",
};

const modulosConEval = MODULOS_MOCK.filter((m) => m.tieneEvaluacion);

export default function CursoBienvenida({ cursoId }: { cursoId: number }) {
  const { data: curso, isLoading } = useGetCursoQuery(cursoId);
  const { getScore, allCompleted, overallScore, coursePassed } =
    useCursoProgress(cursoId);

  const handleFinalizar = () => {
    if (coursePassed) {
      Swal.fire({
        icon: "success",
        title: "¡Felicitaciones!",
        html: `
          <p style="font-size:3rem;font-weight:700;color:#10b981;margin:8px 0">${overallScore}%</p>
          <p style="color:#6b7280;font-size:0.85rem;margin-bottom:12px">Calificación total del curso</p>
          <p style="color:#374151">Completaste el curso exitosamente.<br/>¡Gracias por tu compromiso con Farrera Academy!</p>
        `,
        confirmButtonText: "¡Listo!",
        confirmButtonColor: "#1c2634",
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Necesitas repetir el curso",
        html: `
          <p style="font-size:3rem;font-weight:700;color:#f59e0b;margin:8px 0">${overallScore}%</p>
          <p style="color:#6b7280;font-size:0.85rem;margin-bottom:12px">Calificación total del curso</p>
          <p style="color:#374151">Necesitas al menos <strong>70%</strong> en cada módulo y en total.<br/>Revisa el contenido de los módulos reprobados e intenta de nuevo.</p>
        `,
        confirmButtonText: "Revisar módulos",
        confirmButtonColor: "#1c2634",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const primerModulo = MODULOS_MOCK[0];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-[#1c2634]/50 uppercase tracking-widest mb-1.5">
          Inicio del curso
        </p>
        <h1 className="text-2xl font-bold text-[#1c2634]">{curso?.nombre}</h1>
        <p className="text-sm text-[#333333]/60 mt-2 leading-relaxed">
          {curso?.descripcion ||
            "Esta capacitación está diseñada para brindarte las herramientas necesarias para desempeñar tu rol de manera efectiva dentro de Grupo Farrera."}
        </p>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-5">
        <div className="flex items-center gap-2 text-sm text-[#333333]/60">
          <Clock className="w-4 h-4 text-[#1c2634]/30" />
          <span>{curso?.duracion_horas ?? "—"} horas totales</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#333333]/60">
          <BookOpen className="w-4 h-4 text-[#1c2634]/30" />
          <span>{MODULOS_MOCK.length} módulos</span>
        </div>
        {curso?.instructor?.[0] && (
          <div className="flex items-center gap-2 text-sm text-[#333333]/60">
            <User className="w-4 h-4 text-[#1c2634]/30" />
            <span>{curso.instructor[0].user?.nombre}</span>
          </div>
        )}
      </div>

      {/* Lo que aprenderás */}
      <div className="bg-[#1c2634]/5 border border-[#1c2634]/10 rounded-xl p-5">
        <h2 className="font-bold text-[#1c2634] text-sm mb-3">
          Lo que aprenderás
        </h2>
        <ul className="space-y-2">
          {MODULOS_MOCK.map((m) => (
            <li
              key={m.id}
              className="flex items-start gap-2 text-sm text-[#333333]/70"
            >
              <span className="text-[#1c2634] font-bold mt-0.5 flex-shrink-0">✓</span>
              {m.descripcion}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido del curso */}
      <div>
        <h2 className="font-bold text-[#1c2634] text-base mb-3">
          Contenido del curso
        </h2>
        <div className="space-y-2.5">
          {MODULOS_MOCK.map((modulo, idx) => (
            <div
              key={modulo.id}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F4F7FB] border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-[#1c2634]/10 text-[#1c2634] text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1c2634]">
                    {modulo.titulo}
                  </p>
                  <p className="text-xs text-[#333333]/40">
                    {modulo.temas.length} temas
                    {modulo.tieneEvaluacion && " · Evaluación incluida"}
                  </p>
                </div>
                <Link
                  href={`/dashboard/cursos/${cursoId}/modulo/${modulo.id}`}
                  className="text-xs text-[#1c2634]/60 font-medium hover:text-[#1c2634] flex items-center gap-0.5 transition-colors"
                >
                  Ver <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
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
                    <span className="text-sm text-[#333333]/70 flex-1">
                      {tema.titulo}
                    </span>
                    <span className="text-xs text-[#333333]/35">
                      {tema.duracion}
                    </span>
                  </div>
                ))}
                {modulo.tieneEvaluacion && (
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIPO_BADGE["evaluación"]}`}>
                      evaluación
                    </span>
                    <span className="text-sm text-[#333333]/70 flex-1">
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
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 bg-[#F4F7FB] border-b border-gray-100">
          <Trophy className="w-4 h-4 text-[#1c2634]/60" />
          <div>
            <p className="text-sm font-bold text-[#1c2634]">
              Progreso de evaluaciones
            </p>
            <p className="text-xs text-[#333333]/40">
              {
                modulosConEval.filter(
                  (m) => getScore(`modulo_${m.id}`) !== null,
                ).length
              }{" "}
              / {modulosConEval.length} completadas
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {modulosConEval.map((m) => {
            const score = getScore(`modulo_${m.id}`);
            return (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                {score !== null ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-200 flex-shrink-0" />
                )}
                <span className="text-sm text-[#333333]/70 flex-1">
                  Módulo {m.id} — {m.titulo}
                </span>
                {score !== null ? (
                  <span
                    className={`text-xs font-semibold ${score >= 70 ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {score}%
                  </span>
                ) : (
                  <span className="text-xs text-[#333333]/30">Pendiente</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="px-5 py-4 bg-[#F4F7FB] border-t border-gray-100 flex items-center justify-between gap-4">
          <p className="text-xs text-[#333333]/50">
            {allCompleted
              ? "Todas las evaluaciones completadas. ¡Ya puedes finalizar!"
              : "Completa las evaluaciones de todos los módulos para finalizar."}
          </p>
          <button
            onClick={handleFinalizar}
            disabled={!allCompleted}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1c2634] text-white text-sm font-medium rounded-xl hover:bg-[#1c2634]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
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
          className="px-6 py-2.5 bg-[#1c2634] text-white text-sm font-semibold rounded-xl hover:bg-[#1c2634]/90 transition-colors"
        >
          Comenzar capacitación →
        </Link>
      </div>
    </div>
  );
}