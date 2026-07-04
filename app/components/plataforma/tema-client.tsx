"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetTemaQuery,
  useGetBloquesQuery,
  useGetTemasQuery,
  useGetMisProgresosQuery,
  useMarcarTemaCompletadoMutation,
} from "@/redux/features/capacitacion/plataformaApiSlice";
import BloqueRenderer from "@/app/components/plataforma/bloque-renderer";

export default function TemaClient({
  cursoId,
  temaId,
}: {
  cursoId: number;
  temaId: number;
}) {
  const { data: tema, isLoading: loadingTema } = useGetTemaQuery(temaId);
  const { data: bloquesData, isLoading: loadingBloques } = useGetBloquesQuery({ tema: temaId });
  const { data: temasModuloData } = useGetTemasQuery(
    { modulo: tema?.modulo ?? 0 },
    { skip: !tema?.modulo },
  );
  const { data: progresosData } = useGetMisProgresosQuery();
  const [marcarCompletado, { isLoading: marcando }] = useMarcarTemaCompletadoMutation();

  const bloques = bloquesData?.results ?? [];
  const progresos = progresosData?.results ?? [];
  const completado = progresos.some((p) => p.tema === temaId);

  const hasVideo = bloques.some((b) => b.tipo_nombre?.toLowerCase() === "video");
  const [videoEnded, setVideoEnded] = useState(false);
  const canComplete = completado || !hasVideo || videoEnded;

  const temasModulo = temasModuloData?.results ?? [];
  const currentIndex = temasModulo.findIndex((t) => t.id === temaId);
  const siguienteTema = currentIndex >= 0 && currentIndex < temasModulo.length - 1
    ? temasModulo[currentIndex + 1]
    : null;

  const handleCompletar = async () => {
    if (completado || marcando) return;
    await marcarCompletado({ tema: temaId, curso: cursoId });
  };

  if (loadingTema || loadingBloques) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        {tema?.tipo_nombre && (
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {tema.tipo_nombre}
            {tema.duracion_estimada && ` · ${tema.duracion_estimada}`}
          </span>
        )}
        <h1 className="text-xl font-semibold text-gray-900 mt-1">{tema?.titulo}</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {bloques.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            Este tema no tiene contenido aún.
          </p>
        ) : (
          bloques.map((bloque) => (
            <BloqueRenderer
              key={bloque.id}
              bloque={bloque}
              onVideoEnd={() => setVideoEnded(true)}
            />
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
        <Link
          href={`/plataforma/curso/${cursoId}`}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Volver al curso
        </Link>

        {completado ? (
          siguienteTema ? (
            <Link
              href={`/plataforma/curso/${cursoId}/tema/${siguienteTema.id}`}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Siguiente tema →
            </Link>
          ) : (
            <Link
              href={`/plataforma/curso/${cursoId}`}
              className="px-5 py-2.5 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
            >
              Ver resumen del curso
            </Link>
          )
        ) : (
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleCompletar}
              disabled={marcando || !canComplete}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {marcando ? "Guardando..." : "Marcar como completado"}
            </button>
            {hasVideo && !videoEnded && (
              <p className="text-xs text-gray-400">Termina el video para continuar</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}