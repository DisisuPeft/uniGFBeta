"use client";

import Link from "next/link";
import { MODULOS_MOCK } from "./types";
import {
  BookOpen,
  PlayCircle,
  PenLine,
  ArrowRight,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";

const TIPO_ICON = {
  lectura: BookOpen,
  video: PlayCircle,
  actividad: PenLine,
};

const TIPO_BADGE: Record<string, string> = {
  lectura: "bg-[#1c2634]/8 text-[#1c2634]",
  video: "bg-purple-50 text-purple-600",
  actividad: "bg-amber-50 text-amber-600",
};

interface Props {
  cursoId: number;
  moduloId: number;
}

export default function CursoModuloView({ cursoId, moduloId }: Props) {
  const modulo = MODULOS_MOCK.find((m) => m.id === moduloId);
  const idx = MODULOS_MOCK.findIndex((m) => m.id === moduloId);
  const prevModulo = MODULOS_MOCK[idx - 1];
  const nextModulo = MODULOS_MOCK[idx + 1];
  const base = `/dashboard/cursos/${cursoId}`;

  if (!modulo) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 text-center text-[#333333]/40">
        <p className="text-3xl mb-3">📂</p>
        <p className="text-sm">Módulo no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-[#1c2634]/50 uppercase tracking-widest mb-1.5">
          Módulo {idx + 1} de {MODULOS_MOCK.length}
        </p>
        <h1 className="text-xl font-bold text-[#1c2634]">{modulo.titulo}</h1>
        <p className="text-sm text-[#333333]/60 mt-1.5 leading-relaxed">
          {modulo.descripcion}
        </p>
      </div>

      {/* Temas */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-[#F4F7FB] border-b border-gray-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-[#333333]/50 uppercase tracking-wide">
            Temas del módulo
          </p>
          <span className="text-xs text-[#333333]/35">
            {modulo.temas.length} temas
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {modulo.temas.map((tema) => {
            const Icon = TIPO_ICON[tema.tipo];
            return (
              <Link
                key={tema.id}
                href={`${base}/modulo/${modulo.id}/tema/${tema.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#1c2634]/[0.03] transition-colors group"
              >
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#1c2634]/8 transition-colors">
                  <Icon className="w-4 h-4 text-[#333333]/40 group-hover:text-[#1c2634] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1c2634] font-medium">
                    {tema.titulo}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIPO_BADGE[tema.tipo]}`}
                    >
                      {tema.tipo}
                    </span>
                    <span className="text-xs text-[#333333]/35">
                      {tema.duracion}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-[#1c2634]/40 transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Texto de apoyo */}
      <div className="space-y-3 text-sm text-[#333333]/60 leading-relaxed">
        <p>
          Este módulo cubre los conceptos fundamentales necesarios para
          desempeñar el rol de manera efectiva. A lo largo de los temas
          encontrarás lecturas, recursos multimedia y actividades prácticas que
          reforzarán el aprendizaje.
        </p>
        <p>
          Es importante que completes cada tema en orden, ya que el contenido
          está diseñado de manera progresiva. Al finalizar todos los temas
          podrás acceder a la evaluación del módulo.
        </p>
      </div>

      {/* CTA evaluación */}
      {modulo.tieneEvaluacion && (
        <div className="bg-[#1c2634]/5 border border-[#1c2634]/10 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="w-4 h-4 text-[#1c2634]/60" />
              <p className="font-semibold text-sm text-[#1c2634]">
                Evaluación del módulo
              </p>
            </div>
            <p className="text-xs text-[#333333]/50">
              Pon a prueba lo aprendido. Necesitas 70% para aprobar.
            </p>
          </div>
          <Link
            href={`${base}/modulo/${modulo.id}/evaluacion`}
            className="flex-shrink-0 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-xl hover:bg-[#1c2634]/90 transition-colors"
          >
            Ir a evaluación
          </Link>
        </div>
      )}

      {/* Finalizar curso — solo en el último módulo */}
      {!nextModulo && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <p className="font-semibold text-sm text-[#1c2634]">
                ¡Llegaste al final del curso!
              </p>
            </div>
            <p className="text-xs text-[#333333]/50">
              Revisa tu progreso y finaliza la capacitación desde la página de inicio.
            </p>
          </div>
          <Link
            href={`${base}/bienvenida`}
            className="flex-shrink-0 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Finalizar curso
          </Link>
        </div>
      )}

      {/* Navegación entre módulos */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Link
          href={prevModulo ? `${base}/modulo/${prevModulo.id}` : `${base}/bienvenida`}
          className="flex items-center gap-2 text-sm text-[#333333]/50 hover:text-[#1c2634] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{prevModulo ? prevModulo.titulo : "Inicio del curso"}</span>
        </Link>
        {nextModulo && (
          <Link
            href={`${base}/modulo/${nextModulo.id}`}
            className="flex items-center gap-2 text-sm text-[#1c2634] font-medium hover:text-[#1c2634]/70 transition-colors"
          >
            <span>{nextModulo.titulo}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}