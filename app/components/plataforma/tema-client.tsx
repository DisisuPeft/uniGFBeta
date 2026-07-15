"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetTemaQuery,
  useGetBloquesQuery,
  useGetTemasQuery,
  useGetMisProgresosQuery,
  useMarcarTemaCompletadoMutation,
  useGetCursoPlataformaQuery,
} from "@/redux/features/capacitacion/plataformaApiSlice";
import BloqueRenderer from "@/app/components/plataforma/bloque-renderer";
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark, CheckCircle, Check, Play, Circle } from "lucide-react";

export default function TemaClient({
  cursoId,
  temaId,
}: {
  cursoId: number;
  temaId: number;
}) {
  const { data: curso } = useGetCursoPlataformaQuery(cursoId);
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
  const siguienteTema =
    currentIndex >= 0 && currentIndex < temasModulo.length - 1
      ? temasModulo[currentIndex + 1]
      : null;
  const temaAnterior = currentIndex > 0 ? temasModulo[currentIndex - 1] : null;

  // Progreso global del curso
  const totalTemas = curso?.progreso?.total ?? 0;
  const temasCompletados = curso?.progreso?.completados ?? 0;
  const progresoPorcentaje = curso?.progreso?.porcentaje ?? 0;
  
  // Circular progress SVG calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progresoPorcentaje / 100) * circumference;

  const handleCompletar = async () => {
    if (completado || marcando) return;
    await marcarCompletado({ tema: temaId, curso: cursoId });
  };

  if (loadingTema || loadingBloques) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#0056D2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        
        {/* Main Content (Left) */}
        <div className="flex-1 min-w-0 w-full">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm">
            {/* Content Header */}
            <div className="mb-8">
              {tema?.tipo_nombre && (
                <span className="inline-block text-[13px] font-bold text-[#0056D2] tracking-widest uppercase mb-3">
                  {tema.tipo_nombre}
                  {tema.duracion_estimada && ` - ${tema.duracion_estimada}`}
                </span>
              )}
              <h1 className="text-3xl lg:text-[40px] font-extrabold text-[#111827] leading-tight tracking-tight">
                {tema?.titulo}
              </h1>
            </div>

            {/* Dynamic Content (Bloques) */}
            <div className="prose prose-slate max-w-none text-slate-600 text-[16px] leading-relaxed">
              {bloques.length === 0 ? (
                <p className="text-slate-400 py-12 text-center">
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
          </div>

          {/* Navigation & Footer Actions */}
          <div className="mt-10 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <Link
              href={`/plataforma/curso/${cursoId}`}
              className="flex items-center gap-2 text-[14px] text-slate-500 hover:text-[#0056D2] font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al curso
            </Link>

            {completado ? (
              siguienteTema ? (
                <Link
                  href={`/plataforma/curso/${cursoId}/tema/${siguienteTema.id}`}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0056D2] text-white text-[15px] font-bold rounded-xl hover:bg-[#0047b3] transition-all shadow-[0_4px_12px_rgba(0,86,210,0.2)]"
                >
                  Siguiente tema <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href={`/plataforma/curso/${cursoId}`}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 text-[15px] font-bold rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  Ver resumen del curso <CheckCircle className="w-4 h-4" />
                </Link>
              )
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={handleCompletar}
                  disabled={marcando || !canComplete}
                  className="inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-[#0056D2] text-white text-[15px] font-bold rounded-xl hover:bg-[#0047b3] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_rgba(0,86,210,0.2)]"
                >
                  {marcando ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Marcar como completado
                </button>
                {hasVideo && !videoEnded && (
                  <p className="text-[14px] text-amber-700 font-medium bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
                    Termina el video para continuar
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0 space-y-6">
          {/* Tu Progreso Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-slate-900 mb-6">Tu progreso</h3>
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-[#0056D2] transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center mt-0.5">
                  <span className="text-[26px] font-extrabold text-slate-900 leading-none tracking-tight">{progresoPorcentaje}%</span>
                  <span className="text-[10px] font-medium text-slate-500 mt-1">Completado</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-[13px] font-medium text-slate-600 mb-3">
                <strong className="text-slate-900">{temasCompletados} de {totalTemas}</strong> temas completados
              </p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0056D2] rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progresoPorcentaje}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Contenido del tema Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <h3 className="text-[15px] font-bold text-slate-900 mb-4 px-2">Contenido del tema</h3>
            <div className="space-y-1">
              {temasModulo.map((t) => {
                const isActive = t.id === temaId;
                const isCompleted = progresos.some((p) => p.tema === t.id);
                return (
                  <Link
                    key={t.id}
                    href={`/plataforma/curso/${cursoId}/tema/${t.id}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isActive ? "bg-[#f0f4ff]" : "hover:bg-slate-50"
                    }`}
                  >
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full bg-[#0056D2] flex items-center justify-center flex-shrink-0">
                        <Play className="w-3 h-3 text-white ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex-shrink-0" />
                    )}
                    <span
                      className={`text-[13.5px] font-medium line-clamp-2 ${
                        isActive
                          ? "text-[#0056D2]"
                          : isCompleted
                          ? "text-slate-700"
                          : "text-slate-500"
                      }`}
                    >
                      {t.titulo}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}