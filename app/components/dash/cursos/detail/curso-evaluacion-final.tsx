"use client";

import { useState } from "react";
import Link from "next/link";
import { EVALUACION_FINAL_MOCK } from "./types";
import { CheckCircle, XCircle, Trophy, Medal, ChevronLeft } from "lucide-react";
import { useCursoProgress } from "./use-curso-progress";

type Estado = "pendiente" | "completado";

const SECCIONES = [
  { label: "Sección 1: Comprensión de conceptos", rango: [1, 5] },
  { label: "Sección 2: Aplicación práctica", rango: [6, 8] },
  { label: "Sección 3: Alineación al rol BDC", rango: [9, 11] },
];

export default function CursoEvaluacionFinal({ cursoId }: { cursoId: number }) {
  const preguntas = EVALUACION_FINAL_MOCK;
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
    saveResult("final", correctas, preguntas.length);
  };

  const handleReintentar = () => {
    setRespuestas({});
    setEstado("pendiente");
    setPuntaje(0);
  };

  const aprobado = puntaje >= 70;

  const preguntasPorSeccion = (desde: number, hasta: number) =>
    preguntas.filter((p) => p.id >= desde && p.id <= hasta);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`${base}/bienvenida`}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Volver al inicio del curso
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Medal className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide">
            Evaluación Final del Curso
          </p>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Evaluación de Capacitación BDC</h1>
        <p className="text-sm text-gray-500 mt-1">
          {preguntas.length} preguntas · 3 secciones · Mínimo aprobatorio: 70%
        </p>
      </div>

      {/* ── RESULTADO ── */}
      {estado === "completado" ? (
        <div className="space-y-6">
          <div
            className={`rounded-xl p-6 text-center border ${
              aprobado ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
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
              {aprobado ? "¡Capacitación aprobada!" : "No aprobado"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {aprobado
                ? "Completaste el Curso Básico BDC. ¡Bienvenido al equipo!"
                : "Revisa los módulos del curso e intenta de nuevo."}
            </p>
          </div>

          {/* Revisión por sección */}
          {SECCIONES.map((sec) => {
            const [desde, hasta] = sec.rango;
            const grupo = preguntasPorSeccion(desde, hasta);
            const correctasSec = grupo.filter((p) => respuestas[p.id] === p.correcta).length;
            return (
              <div key={sec.label} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {sec.label}
                  </p>
                  <span className="text-xs text-gray-400">
                    {correctasSec}/{grupo.length} correctas
                  </span>
                </div>
                {grupo.map((p) => {
                  const esCorrecta = respuestas[p.id] === p.correcta;
                  return (
                    <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className={`flex items-center gap-3 px-4 py-3 ${esCorrecta ? "bg-emerald-50" : "bg-red-50"}`}>
                        {esCorrecta ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                        <p className="text-sm font-medium text-gray-900">{p.id}. {p.texto}</p>
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
                                : "text-gray-600"
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
            );
          })}

          <div className="flex items-center justify-between pt-2">
            {!aprobado && (
              <button
                onClick={handleReintentar}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reintentar
              </button>
            )}
            {aprobado && (
              <Link
                href={`${base}/bienvenida`}
                className="ml-auto px-5 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-500/90 transition-colors"
              >
                Volver al inicio
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* ── QUIZ por sección ── */
        <div className="space-y-8">
          {SECCIONES.map((sec) => {
            const [desde, hasta] = sec.rango;
            const grupo = preguntasPorSeccion(desde, hasta);
            return (
              <div key={sec.label} className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2">
                  {sec.label}
                </p>
                {grupo.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">
                        {p.id}. {p.texto}
                      </p>
                    </div>
                    <div className="p-4 space-y-2">
                      {p.opciones.map((op, oi) => (
                        <label
                          key={oi}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                            respuestas[p.id] === oi
                              ? "border-sky-400 bg-sky-50 text-sky-800"
                              : "border-gray-100 hover:bg-gray-50 text-gray-700"
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
                            className="accent-sky-500"
                          />
                          <span className="text-sm">{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          <div className="flex items-center justify-between sticky bottom-0 bg-white/90 backdrop-blur-sm py-3 border-t border-gray-100 -mx-6 px-6">
            <p className="text-xs text-gray-400">
              {Object.keys(respuestas).length} de {preguntas.length} respondidas
            </p>
            <button
              onClick={handleSubmit}
              disabled={!todasRespondidas}
              className="px-5 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-500/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Entregar evaluación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
