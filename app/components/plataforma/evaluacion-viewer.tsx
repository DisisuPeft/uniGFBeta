"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetPreguntasQuery,
  useGetMisResultadosQuery,
  useEnviarResultadoMutation,
} from "@/redux/features/capacitacion/plataformaApiSlice";
import { EvaluacionPlataforma } from "@/redux/features/types/capacitacion/plataforma-types";

interface Props {
  cursoId: number;
  evaluacion: EvaluacionPlataforma;
}

function ResultadoScreen({
  puntaje,
  correctas,
  total,
  puntajeMinimo,
  yaExistia,
  cursoId,
}: {
  puntaje: number;
  correctas: number;
  total: number;
  puntajeMinimo: number;
  yaExistia: boolean;
  cursoId: number;
}) {
  const aprobado = puntaje >= puntajeMinimo;
  return (
    <div className="max-w-md mx-auto text-center py-10">
      <div
        className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-5 ${
          aprobado ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}
      >
        {aprobado ? "✓" : "✗"}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-1">
        {aprobado ? "Evaluación aprobada" : "Evaluación no aprobada"}
      </h3>
      {yaExistia && (
        <p className="text-sm text-gray-400 mb-4">Ya presentaste esta evaluación.</p>
      )}

      <div className="bg-gray-50 rounded-xl p-5 text-left mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Puntaje obtenido</span>
          <span
            className={`text-lg font-semibold ${aprobado ? "text-green-600" : "text-red-600"}`}
          >
            {puntaje}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Puntaje mínimo</span>
          <span className="text-sm font-medium text-gray-700">{puntajeMinimo}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Respuestas correctas</span>
          <span className="text-sm font-medium text-gray-700">
            {correctas} / {total}
          </span>
        </div>
        <div className="pt-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                aprobado ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${puntaje}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/plataforma/curso/${cursoId}`}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Volver al curso
        </Link>
      </div>
    </div>
  );
}

export default function EvaluacionViewer({ cursoId, evaluacion }: Props) {
  const { data: preguntasData, isLoading } = useGetPreguntasQuery({
    evaluacion: evaluacion.id,
  });
  const { data: resultadosData } = useGetMisResultadosQuery();
  const [enviarResultado, { isLoading: enviando }] = useEnviarResultadoMutation();

  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [resultadoLocal, setResultadoLocal] = useState<{
    puntaje: number;
    correctas: number;
    total: number;
  } | null>(null);

  const preguntas = preguntasData?.results ?? [];
  const puntajeMinimo = parseFloat(evaluacion.puntaje_minimo);
  const resultadoExistente = resultadosData?.results?.find(
    (r) => r.evaluacion === evaluacion.id,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (resultadoLocal) {
    return (
      <ResultadoScreen
        puntaje={resultadoLocal.puntaje}
        correctas={resultadoLocal.correctas}
        total={resultadoLocal.total}
        puntajeMinimo={puntajeMinimo}
        yaExistia={false}
        cursoId={cursoId}
      />
    );
  }

  if (resultadoExistente) {
    return (
      <ResultadoScreen
        puntaje={resultadoExistente.puntaje}
        correctas={resultadoExistente.correctas}
        total={resultadoExistente.total}
        puntajeMinimo={puntajeMinimo}
        yaExistia={true}
        cursoId={cursoId}
      />
    );
  }

  const todosRespondidos = preguntas.length > 0 &&
    preguntas.every((p) => respuestas[p.id] !== undefined);

  const handleSubmit = async () => {
    if (!todosRespondidos) return;
    const res = await enviarResultado({
      evaluacion: evaluacion.id,
      cursoId,
      respuestas: Object.entries(respuestas).map(([preguntaId, opcionId]) => ({
        pregunta: Number(preguntaId),
        opcion: opcionId,
      })),
    }).unwrap();
    setResultadoLocal({ puntaje: res.puntaje, correctas: res.correctas, total: res.total });
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{evaluacion.titulo}</h2>
        <p className="text-sm text-gray-400 mt-1">
          Puntaje mínimo para aprobar: {evaluacion.puntaje_minimo}%
          {" · "}
          {preguntas.length} pregunta{preguntas.length !== 1 ? "s" : ""}
        </p>
      </div>

      {preguntas.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-12">
          Esta evaluación no tiene preguntas aún.
        </p>
      ) : (
        <>
          <div className="space-y-5">
            {preguntas.map((pregunta, idx) => (
              <div
                key={pregunta.id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <p className="text-sm font-medium text-gray-900 mb-4">
                  {idx + 1}. {pregunta.texto}
                </p>
                <div className="space-y-2">
                  {pregunta.opciones.map((opcion) => {
                    const selected = respuestas[pregunta.id] === opcion.id;
                    return (
                      <label
                        key={opcion.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`pregunta-${pregunta.id}`}
                          value={opcion.id}
                          checked={selected}
                          onChange={() =>
                            setRespuestas((prev) => ({
                              ...prev,
                              [pregunta.id]: opcion.id,
                            }))
                          }
                          className="mt-0.5 accent-blue-600 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700">{opcion.texto}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <Link
              href={`/plataforma/curso/${cursoId}`}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Volver al curso
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-gray-400">
                {Object.keys(respuestas).length} / {preguntas.length} respondidas
              </span>
              <button
                onClick={handleSubmit}
                disabled={!todosRespondidos || enviando}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {enviando ? "Enviando..." : "Enviar evaluación"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}