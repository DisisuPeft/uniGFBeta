"use client";

import { useState } from "react";
import Link from "next/link";
import { MODULOS_MOCK, EVALUACIONES_MOCK } from "./types";
import { CheckCircle, XCircle, ChevronLeft, Trophy } from "lucide-react";
import { useCursoProgress, type ProgressKey } from "./use-curso-progress";

interface Props {
  cursoId: number;
  moduloId: number;
}

type Estado = "pendiente" | "completado";

export default function CursoEvaluacion({ cursoId, moduloId }: Props) {
  const modulo = MODULOS_MOCK.find((m) => m.id === moduloId);
  const preguntas = EVALUACIONES_MOCK[moduloId] ?? [];
  const base = `/dashboard/cursos/${cursoId}`;

  const { saveResult } = useCursoProgress(cursoId);

  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [estado, setEstado] = useState<Estado>("pendiente");
  const [puntaje, setPuntaje] = useState(0);

  const todasRespondidas = preguntas.every((p) => respuestas[p.id] !== undefined);

  const handleSubmit = () => {
    const correctas = preguntas.filter((p) => respuestas[p.id] === p.correcta).length;
    setPuntaje(Math.round((correctas / preguntas.length) * 100));
    setEstado("completado");
    saveResult(`modulo_${moduloId}` as ProgressKey, correctas, preguntas.length);
  };

  const handleReintentar = () => {
    setRespuestas({});
    setEstado("pendiente");
    setPuntaje(0);
  };

  const idx = MODULOS_MOCK.findIndex((m) => m.id === moduloId);
  const nextModulo = MODULOS_MOCK[idx + 1];
  const aprobado = puntaje >= 70;

  if (!modulo || preguntas.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 text-center text-[#333333]/40">
        <p className="text-3xl mb-3">📋</p>
        <p className="text-sm">Evaluación no disponible para este módulo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`${base}/modulo/${moduloId}`}
          className="flex items-center gap-1.5 text-xs text-[#333333]/40 hover:text-[#1c2634] transition-colors mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Volver al módulo
        </Link>
        <p className="text-xs font-semibold text-[#1c2634]/50 uppercase tracking-widest mb-1.5">
          Evaluación · {modulo.titulo}
        </p>
        <h1 className="text-xl font-bold text-[#1c2634]">Evaluación del módulo</h1>
        <p className="text-sm text-[#333333]/55 mt-1">
          {preguntas.length} preguntas · Mínimo aprobatorio: 70%
        </p>
      </div>

      {/* ── RESULTADO ── */}
      {estado === "completado" ? (
        <div className="space-y-6">
          {/* Tarjeta de puntaje */}
          <div
            className={`rounded-xl p-6 text-center border ${
              aprobado
                ? "bg-emerald-50 border-emerald-100"
                : "bg-red-50 border-red-100"
            }`}
          >
            <div className="flex justify-center mb-3">
              {aprobado ? (
                <Trophy className="w-10 h-10 text-emerald-500" />
              ) : (
                <XCircle className="w-10 h-10 text-red-400" />
              )}
            </div>
            <p className={`text-4xl font-bold mb-1 ${aprobado ? "text-emerald-600" : "text-red-500"}`}>
              {puntaje}%
            </p>
            <p className={`text-sm font-semibold ${aprobado ? "text-emerald-700" : "text-red-600"}`}>
              {aprobado ? "¡Módulo aprobado!" : "No aprobado"}
            </p>
            <p className="text-xs text-[#333333]/50 mt-1">
              {aprobado
                ? "Excelente trabajo. Puedes continuar con el siguiente módulo."
                : "Revisa el contenido del módulo e intenta de nuevo."}
            </p>
          </div>

          {/* Revisión de respuestas */}
          <div className="space-y-3">
            {preguntas.map((p, i) => {
              const esCorrecta = respuestas[p.id] === p.correcta;
              return (
                <div
                  key={p.id}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 ${
                      esCorrecta ? "bg-emerald-50" : "bg-red-50"
                    }`}
                  >
                    {esCorrecta ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium text-[#1c2634]">
                      {i + 1}. {p.texto}
                    </p>
                  </div>
                  <div className="px-4 py-3 space-y-1.5">
                    {p.opciones.map((op, oi) => (
                      <div
                        key={oi}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          oi === p.correcta
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : oi === respuestas[p.id] && !esCorrecta
                            ? "bg-red-50 text-red-500 line-through"
                            : "text-[#333333]/60"
                        }`}
                      >
                        {oi === p.correcta && (
                          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
                        )}
                        {op}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between pt-2">
            {!aprobado && (
              <button
                onClick={handleReintentar}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-[#333333]/70 hover:bg-gray-50 transition-colors"
              >
                Reintentar
              </button>
            )}
            {aprobado && nextModulo && (
              <Link
                href={`${base}/modulo/${nextModulo.id}`}
                className="ml-auto px-5 py-2.5 bg-[#1c2634] text-white text-sm font-medium rounded-xl hover:bg-[#1c2634]/90 transition-colors"
              >
                Siguiente módulo →
              </Link>
            )}
            {aprobado && !nextModulo && (
              <div className="ml-auto text-center">
                <p className="text-sm font-semibold text-emerald-600 mb-1">
                  🎉 ¡Capacitación completada!
                </p>
                <Link
                  href={`${base}/bienvenida`}
                  className="text-xs text-[#333333]/40 hover:text-[#1c2634] underline"
                >
                  Volver al inicio del curso
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── QUIZ ── */
        <div className="space-y-5">
          {preguntas.map((p, i) => (
            <div
              key={p.id}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-100 bg-[#F4F7FB]">
                <p className="text-sm font-semibold text-[#1c2634]">
                  {i + 1}. {p.texto}
                </p>
              </div>
              <div className="p-4 space-y-2">
                {p.opciones.map((op, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                      respuestas[p.id] === oi
                        ? "border-[#1c2634] bg-[#1c2634]/5 text-[#1c2634]"
                        : "border-gray-100 hover:bg-[#1c2634]/[0.03] text-[#333333]/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`pregunta-${p.id}`}
                      value={oi}
                      checked={respuestas[p.id] === oi}
                      onChange={() =>
                        setRespuestas((prev) => ({ ...prev, [p.id]: oi }))
                      }
                      className="accent-[#1c2634]"
                    />
                    <span className="text-sm">{op}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <p className="text-xs text-[#333333]/35">
              {Object.keys(respuestas).length} de {preguntas.length} respondidas
            </p>
            <button
              onClick={handleSubmit}
              disabled={!todasRespondidas}
              className="px-5 py-2.5 bg-[#1c2634] text-white text-sm font-medium rounded-xl hover:bg-[#1c2634]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Entregar evaluación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}