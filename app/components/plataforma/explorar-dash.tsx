"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetCursosPlataformaQuery,
  useInscribirseACursoMutation,
} from "@/redux/features/capacitacion/plataformaApiSlice";
import { Clock, Search, Play, CheckCircle } from "lucide-react";

const getPlaceholderImage = (id: number) => {
  const images = [
    "/assets/hero-image.jpg",
    "/assets/place2.jpg",
    "/assets/plataforma-img.png",
    "/assets/vista-cursos.jpg",
    "/assets/hero/thales-hero.webp",
  ];
  return images[id % images.length];
};

export default function ExplorarDash() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: todosData, isLoading } = useGetCursosPlataformaQuery();
  const [inscribirse, { isLoading: inscribiendo, originalArgs: inscribiendoId }] =
    useInscribirseACursoMutation();

  const cursos = todosData?.results ?? [];

  const filtrados = cursos.filter((c) =>
    c.titulo.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleInscribirse(cursoId: number) {
    try {
      await inscribirse({ curso: cursoId }).unwrap();
    } catch {
      // 400 = ya inscrito — navegar igual
    }
    router.push(`/plataforma/curso/${cursoId}`);
  }

  return (
    <div className="mx-auto px-4 sm:px-8 md:px-12 py-8 relative min-h-[calc(100vh-100px)]">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Explorar más cursos
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Descubre nuevos programas de formación profesional para seguir
            desarrollando tus competencias.
          </p>
        </div>

        {/* Búsqueda */}
        <div className="mb-8">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cursos por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056D2] shadow-[0_4px_12px_rgba(0,0,0,0.005)] transition-all placeholder-slate-400 text-slate-700"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0056D2]" />
          </div>
        ) : filtrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtrados.map((curso) => {
              const pct = curso.progreso?.porcentaje ?? 0;
              const isCompletado = curso.inscrito && pct === 100;
              const isEnProgreso = curso.inscrito && pct < 100;
              const cargando =
                inscribiendo && inscribiendoId?.curso === curso.id;

              const badgeText = isCompletado
                ? "Completado"
                : isEnProgreso
                  ? "En progreso"
                  : "Disponible";
              const badgeBg = isCompletado
                ? "bg-emerald-500/80"
                : isEnProgreso
                  ? "bg-[#0056D2]/80"
                  : "bg-slate-900/65";

              return (
                <div
                  key={curso.id}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col hover:shadow-[0_15px_30px_rgba(0,0,0,0.035)] hover:border-slate-200/80 transition-all duration-300 relative group h-full"
                >
                  {/* Imagen */}
                  <div className="relative h-44 flex-shrink-0 overflow-hidden bg-slate-50">
                    <img
                      src={curso.imagen ?? getPlaceholderImage(curso.id)}
                      alt={curso.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getPlaceholderImage(curso.id);
                      }}
                    />
                    <span
                      className={`absolute top-4 left-4 ${badgeBg} backdrop-blur-[3px] text-white text-[9px] font-bold px-2.5 py-1 rounded-[6px] uppercase tracking-wider`}
                    >
                      {badgeText}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-[15px] line-clamp-2 leading-snug mb-3">
                        {curso.titulo}
                      </h3>

                      {/* Chips de competencias */}
                      <div className="mb-4">
                        {curso.competencias && curso.competencias.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {curso.competencias.slice(0, 2).map((c) => (
                              <span
                                key={c.codigo}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
                                style={{
                                  borderColor: c.color ? `${c.color}40` : "#e2e8f0",
                                  color: c.color || "#475569",
                                  backgroundColor: c.color ? `${c.color}10` : "#f1f5f9",
                                }}
                              >
                                {c.nombre}
                                {c.nivel && (
                                  <span className="opacity-60">· {c.nivel}</span>
                                )}
                              </span>
                            ))}
                            {curso.competencias.length > 2 && (
                              <span className="text-[10px] font-bold text-gray-400 self-center ml-0.5">
                                +{curso.competencias.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200 text-slate-500 bg-slate-50">
                            General
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {curso.descripcion ||
                          "Curso de formación profesional y desarrollo de habilidades."}
                      </p>

                      {/* Barra de progreso — solo si inscrito */}
                      {curso.inscrito && (
                        <div className="mt-4">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                            <span>
                              {curso.progreso.completados}/{curso.progreso.total} temas
                            </span>
                            <span
                              style={{ color: isCompletado ? "#10b981" : "#0056D2" }}
                            >
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: isCompletado ? "#10b981" : "#0056D2",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {curso.duracion_horas}h
                      </span>

                      {isCompletado ? (
                        <button
                          onClick={() => router.push(`/plataforma/curso/${curso.id}`)}
                          className="px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl flex items-center gap-1.5 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Completado
                        </button>
                      ) : isEnProgreso ? (
                        <button
                          onClick={() => router.push(`/plataforma/curso/${curso.id}`)}
                          className="px-4 py-1.5 bg-blue-50 border border-blue-100 text-[#0056D2] text-xs font-bold rounded-2xl hover:bg-[#0056D2] hover:text-white transition-all duration-300"
                        >
                          Continuar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleInscribirse(curso.id)}
                          disabled={cargando}
                          className="px-4 py-1.5 bg-[#0056D2] hover:bg-[#0047b3] text-white disabled:opacity-60 text-xs font-bold rounded-2xl transition-all duration-300 flex items-center gap-1.5 shadow-sm"
                        >
                          {cargando ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Play className="w-3 h-3 fill-current" />
                          )}
                          Inscribirme
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.015)] mt-10">
            <Search className="w-10 h-10 text-slate-200 mx-auto mb-4" />
            <h3 className="text-base font-bold text-gray-900 mb-1.5 tracking-tight">
              No se encontraron cursos
            </h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
              {search
                ? "Prueba buscando con palabras clave diferentes."
                : "No hay cursos disponibles en este momento."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
