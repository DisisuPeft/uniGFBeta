"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, BookOpen } from "lucide-react";
import {
  useGetMiPerfilQuery,
  useIniciarRutaMutation,
} from "@/redux/features/competencias/competenciasApiSlice";
import { RutaRecomendada } from "@/redux/features/types/competencias/types";
import { iconMap } from "@/app/ui/icon/icon-map";

function Spinner() {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0056D2]" />
    </div>
  );
}

export default function CompetenciasView() {
  const { data: perfil, isLoading, isError } = useGetMiPerfilQuery();
  const [iniciarRuta, { isLoading: iniciando }] = useIniciarRutaMutation();
  const router = useRouter();
  const [selected, setSelected] = useState<number | "todos">("todos");

  async function handleAccionRuta(ruta: RutaRecomendada) {
    if (ruta.terminada || !ruta.curso_actual_id) return;
    if (!ruta.iniciada) {
      try {
        await iniciarRuta({ ruta_id: ruta.id }).unwrap();
      } catch {
        // error silencioso
      }
    }
    router.push(`/plataforma/curso/${ruta.curso_actual_id}`);
  }

  const total = perfil?.length ?? 0;
  const cubiertas = perfil?.filter((c) => c.completada).length ?? 0;
  const porcentaje = total > 0 ? Math.round((cubiertas / total) * 100) : 0;

  const rutasVisibles =
    perfil
      ?.filter((c) => (selected === "todos" ? true : c.competencia_id === selected))
      .flatMap((c) =>
        c.rutas_recomendadas.map((r) => ({ ruta: r, comp: c })),
      ) ?? [];

  return (
    <div className="mx-auto px-4 sm:px-8 md:px-12 py-8 relative">
      {/* Wave decorativo */}
      <div className="absolute top-0 left-0 right-0 h-44 overflow-hidden pointer-events-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 220"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C320,80 720,20 1080,70 C1280,100 1380,140 1440,160 L1440,0 L0,0 Z"
            fill="#f0f4ff"
            opacity="0.4"
          />
          <path
            d="M0,0 C240,40 640,0 960,35 C1160,55 1320,110 1440,140 L1440,0 L0,0 Z"
            fill="#eff6ff"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Competencias de mi perfil
            </h1>
            <p className="text-slate-500 mt-2 text-base">
              Monitorea los cursos y programas de formación diseñados para
              fortalecer las competencias de tu puesto.
            </p>
          </div>

          {/* Progreso global */}
          {!isLoading && !isError && total > 0 && (
            <div className="shrink-0 flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Avance general</p>
                <p className="text-sm font-bold text-slate-700">
                  {cubiertas} de {total} cubiertas
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  {porcentaje}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Loading / error */}
        {isLoading && <Spinner />}
        {isError && (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[28px]">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium text-sm">
              No se encontraron competencias para tu puesto.
            </p>
          </div>
        )}

        {!isLoading && !isError && perfil && perfil.length > 0 && (
          <>
            {/* Tarjetas de competencias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
              {perfil.map((c) => {
                const color = c.competencia_color || "#6366f1";
                const Icon = iconMap[c.competencia_icono];
                const isSelected = selected === c.competencia_id;
                const progreso =
                  c.nivel_requerido_orden > 0
                    ? Math.min(
                        c.nivel_actual_orden / c.nivel_requerido_orden,
                        1,
                      )
                    : 0;

                const chip = c.completada
                  ? {
                      text: "Cubierta",
                      cls: "bg-emerald-50 text-emerald-700 border-emerald-100",
                    }
                  : c.nivel_actual_id === null
                    ? {
                        text: "Sin iniciar",
                        cls: "bg-slate-100 text-slate-500 border-slate-200",
                      }
                    : {
                        text: "En progreso",
                        cls: "bg-amber-50 text-amber-700 border-amber-100",
                      };

                const rutasCount = c.rutas_recomendadas.length;

                return (
                  <div
                    key={c.competencia_id}
                    onClick={() =>
                      setSelected(isSelected ? "todos" : c.competencia_id)
                    }
                    className={`bg-white border rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                      isSelected
                        ? "ring-2"
                        : "border-slate-100"
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: color,
                            boxShadow: `0 0 0 2px ${color}22`,
                          }
                        : {}
                    }
                  >
                    {/* Icono + badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: color + "18" }}
                      >
                        {Icon ? (
                          <Icon size={20} style={{ color }} />
                        ) : (
                          <span
                            className="text-sm font-bold"
                            style={{ color }}
                          >
                            {c.competencia_codigo[0]}
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${chip.cls}`}
                      >
                        {chip.text}
                      </span>
                    </div>

                    {/* Nombre */}
                    <h3 className="font-bold text-gray-900 text-sm mb-1 leading-snug">
                      {c.competencia_nombre}
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-4">
                      {rutasCount > 0
                        ? `${rutasCount} ruta${rutasCount !== 1 ? "s" : ""} de aprendizaje`
                        : "Sin rutas asignadas"}
                    </p>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1.5">
                        <span>{c.nivel_actual_nombre ?? "Sin nivel"}</span>
                        <span style={{ color: c.completada ? "#10b981" : color }}>
                          {c.nivel_requerido_nombre}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${progreso * 100}%`,
                            backgroundColor: c.completada ? "#10b981" : color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rutas de aprendizaje */}
            <div className="border-t border-slate-100 pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  {selected === "todos"
                    ? "Todas las rutas de aprendizaje"
                    : `Rutas para: ${perfil.find((c) => c.competencia_id === selected)?.competencia_nombre}`}
                </h2>
                {selected !== "todos" && (
                  <button
                    onClick={() => setSelected("todos")}
                    className="text-xs font-bold text-[#0056D2] hover:underline"
                  >
                    Mostrar todas
                  </button>
                )}
              </div>

              {rutasVisibles.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-100 rounded-[28px]">
                  <p className="text-slate-400 font-medium text-sm">
                    No hay rutas de aprendizaje para esta selección.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rutasVisibles.map(({ ruta, comp: c }) => {
                    const color = c.competencia_color || "#6366f1";
                    const Icon = iconMap[c.competencia_icono];
                    const { total: tot, completados: done, porcentaje: rutaPct } = ruta.progreso;
                    const sorted = [...ruta.cursos].sort((a, b) => a.orden - b.orden);
                    const completada = ruta.terminada;

                    return (
                      <div
                        key={`${c.competencia_id}-${ruta.id}`}
                        className="bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col hover:shadow-md transition-all duration-300"
                      >
                        {/* Cabecera */}
                        <div
                          className="px-5 pt-5 pb-4"
                          style={{ borderBottom: `2px solid ${color}18` }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: color + "18" }}
                            >
                              {Icon ? (
                                <Icon size={12} style={{ color }} />
                              ) : (
                                <span className="text-[10px] font-bold" style={{ color }}>
                                  {c.competencia_codigo[0]}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
                              {c.competencia_nombre}
                            </span>
                          </div>

                          <h3 className="font-bold text-gray-900 text-[15px] leading-snug mb-1">
                            {ruta.nombre}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Objetivo: {ruta.nivel_objetivo_nombre}
                          </p>

                          {/* Progreso */}
                          <div className="mt-3">
                            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                              <span>{done}/{tot} cursos completados</span>
                              <span style={{ color: completada ? "#10b981" : color }}>
                                {rutaPct}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${rutaPct}%`,
                                  backgroundColor: completada ? "#10b981" : color,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Lista de cursos con estado */}
                        <div className="p-5 flex-1 space-y-2.5">
                          {sorted.map((cu, idx) => (
                            <div key={cu.id} className="flex items-center gap-3">
                              {cu.estado === "completado" ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                              ) : cu.estado === "en_curso" ? (
                                <div
                                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                                  style={{ borderColor: color, backgroundColor: color + "15", color }}
                                >
                                  {idx + 1}
                                </div>
                              ) : (
                                <div
                                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                                  style={{ borderColor: "#cbd5e1", color: "#94a3b8" }}
                                >
                                  {idx + 1}
                                </div>
                              )}
                              <span
                                className={`text-xs leading-snug flex-1 ${
                                  cu.estado === "completado"
                                    ? "text-slate-400 line-through"
                                    : cu.estado === "en_curso"
                                      ? "text-slate-800 font-semibold"
                                      : "text-slate-500"
                                }`}
                              >
                                {cu.curso_titulo}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Pie */}
                        <div className="px-5 pb-5">
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              {tot} curso{tot !== 1 ? "s" : ""}
                            </span>
                            {completada ? (
                              <span className="px-3 py-1 text-xs font-bold rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                ✓ Completada
                              </span>
                            ) : ruta.iniciada ? (
                              <button
                                onClick={() => handleAccionRuta(ruta)}
                                disabled={iniciando}
                                className="px-4 py-1.5 text-xs font-bold rounded-2xl border transition-all disabled:opacity-60"
                                style={{ backgroundColor: color + "12", color, borderColor: color + "35" }}
                              >
                                Continuar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAccionRuta(ruta)}
                                disabled={iniciando}
                                className="px-4 py-1.5 text-xs font-bold rounded-2xl text-white transition-all shadow-sm disabled:opacity-60"
                                style={{ backgroundColor: color }}
                              >
                                Iniciar ruta →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
