"use client";

import Link from "next/link";
import { MODULOS_MOCK, TEMAS_CONTENIDO, ContenidoBloque } from "./types";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  AlertCircle,
  Info,
} from "lucide-react";

interface Props {
  cursoId: number;
  moduloId: number;
  temaId: number;
}

function Bloque({ bloque }: { bloque: ContenidoBloque }) {
  switch (bloque.tipo) {
    case "parrafo":
      return (
        <p className="text-sm text-gray-700 leading-relaxed">{bloque.texto}</p>
      );

    case "subtitulo":
      return (
        <h3 className="text-sm font-bold text-gray-900 mt-2">{bloque.texto}</h3>
      );

    case "lista":
      return (
        <ul className="space-y-2">
          {bloque.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "tabla":
      return (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide w-2/5">
                  Indicador
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide">
                  Valor / Referencia
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bloque.filas?.map((fila, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-gray-800 align-top">
                    {fila.label}
                  </td>
                  <td className="px-4 py-3 text-gray-600 align-top">
                    {fila.valor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "alerta": {
      const esAdvertencia = bloque.variante === "advertencia";
      return (
        <div
          className={`flex gap-3 rounded-xl p-4 border ${
            esAdvertencia
              ? "bg-amber-50 border-amber-200"
              : "bg-sky-50 border-sky-100"
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {esAdvertencia ? (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            ) : (
              <Info className="w-4 h-4 text-sky-500" />
            )}
          </div>
          <p
            className={`text-sm leading-relaxed whitespace-pre-line ${
              esAdvertencia ? "text-amber-800" : "text-sky-800"
            }`}
          >
            {bloque.texto}
          </p>
        </div>
      );
    }

    default:
      return null;
  }
}

export default function CursoTema({ cursoId, moduloId, temaId }: Props) {
  const modulo = MODULOS_MOCK.find((m) => m.id === moduloId);
  const temas = modulo?.temas ?? [];
  const temaIdx = temas.findIndex((t) => t.id === temaId);
  const tema = temas[temaIdx];
  const bloques = TEMAS_CONTENIDO[temaId];

  const prevTema = temas[temaIdx - 1];
  const nextTema = temas[temaIdx + 1];
  const moduloIdx = MODULOS_MOCK.findIndex((m) => m.id === moduloId);

  const base = `/dashboard/cursos/${cursoId}`;
  const moduloPath = `${base}/modulo/${moduloId}`;

  if (!tema || !modulo) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 text-center text-gray-400">
        <p className="text-4xl mb-3">📄</p>
        <p className="text-sm">Tema no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href={moduloPath}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {modulo.titulo}
        </Link>
        <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-1">
          Módulo {moduloIdx + 1} · Tema {temaIdx + 1} de {temas.length}
        </p>
        <h1 className="text-xl font-bold text-gray-900">{tema.titulo}</h1>
        <p className="text-xs text-gray-400 mt-1">{tema.duracion}</p>
      </div>

      {/* Contenido */}
      <div className="space-y-5">
        {bloques?.length ? (
          bloques.map((bloque, i) => <Bloque key={i} bloque={bloque} />)
        ) : (
          <p className="text-sm text-gray-400 italic">
            Contenido en preparación.
          </p>
        )}
      </div>

      {/* CTA evaluación si es el último tema */}
      {!nextTema && modulo.tieneEvaluacion && (
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="w-4 h-4 text-sky-600" />
              <p className="font-semibold text-sm text-gray-900">
                ¡Completaste todos los temas!
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Ya puedes presentar la evaluación del módulo. Necesitas 70% para aprobar.
            </p>
          </div>
          <Link
            href={`${moduloPath}/evaluacion`}
            className="flex-shrink-0 px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-500/90 transition-colors"
          >
            Ir a evaluación
          </Link>
        </div>
      )}

      {/* Navegación entre temas */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          href={prevTema ? `${moduloPath}/tema/${prevTema.id}` : moduloPath}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="truncate max-w-[180px]">
            {prevTema ? prevTema.titulo : "Volver al módulo"}
          </span>
        </Link>

        {nextTema && (
          <Link
            href={`${moduloPath}/tema/${nextTema.id}`}
            className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            <span className="truncate max-w-[180px] text-right">
              {nextTema.titulo}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
