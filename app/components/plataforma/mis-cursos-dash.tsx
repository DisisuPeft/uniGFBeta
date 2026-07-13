"use client";

import {
  Clock,
  CheckCircle,
  Search,
  ChevronDown,
  Grid,
  List,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useGetCursosPlataformaQuery,
  useGetMisCursosQuery,
  useGetMisInscripcionesQuery,
  useInscribirseACursoMutation,
} from "@/redux/features/capacitacion/plataformaApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { CursoPlataforma } from "@/redux/features/types/capacitacion/plataforma-types";
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

function CompetenciaBadge({
  nombre,
  color,
  icono,
}: {
  nombre: string;
  color: string;
  icono: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
      style={{
        borderColor: color ? `${color}40` : "#e2e8f0",
        color: color || "#475569",
        backgroundColor: color ? `${color}10` : "#f1f5f9",
      }}
    >
      {icono && <span>{icono}</span>}
      {nombre}
    </span>
  );
}

const getPlaceholderImage = (id: string | number) => {
  const images = [
    "/assets/hero-image.jpg",
    "/assets/place2.jpg",
    "/assets/plataforma-img.png",
    "/assets/vista-cursos.jpg",
    "/assets/hero/thales-hero.webp",
  ];
  const strId = String(id);
  let hash = 0;
  for (let i = 0; i < strId.length; i++) {
    hash = strId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return images[Math.abs(hash) % images.length];
};

const getCursoImage = (curso: CursoPlataforma) => {
  if (curso.imagen) return curso.imagen;
  const titleLower = curso.titulo.toLowerCase();
  if (titleLower.includes("analista")) {
    return "/assets/Fotos de Curso/Analista.png";
  }
  return getPlaceholderImage(curso.id);
};


interface CursoCardProps {
  curso: CursoPlataforma;
  completadoAt?: string | null;
  onInscribirse?: () => void;
  inscribiendo?: boolean;
}

function CursoRow({
  curso,
  completadoAt,
  onInscribirse,
  inscribiendo,
}: CursoCardProps) {
  const isCompleted =
    !!completadoAt || (curso.progreso && curso.progreso.porcentaje === 100);
  const isInscrito = curso.inscrito;
  const progressPercent = isCompleted ? 100 : curso.progreso?.porcentaje ?? 0;

  const badgeClass = isCompleted
    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
    : isInscrito
      ? "bg-blue-50 text-[#0056D2] border border-blue-100"
      : "bg-slate-50 text-slate-500 border border-slate-100";
  const badgeText = isCompleted
    ? "Completado"
    : isInscrito
      ? "En progreso"
      : "No iniciado";

  const barColor = isCompleted ? "#10b981" : "#0056D2";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl flex items-center gap-4 px-4 py-3 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
      {/* Miniatura */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
        <img
          src={getCursoImage(curso)}
          alt={curso.titulo}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/placeholder.png";
          }}
        />
      </div>

      {/* Título + chips */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{curso.titulo}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {curso.competencias && curso.competencias.length > 0 ? (
            curso.competencias.slice(0, 2).map((c) => (
              <CompetenciaBadge key={c.codigo} nombre={c.nombre} color={c.color} icono={c.icono} />
            ))
          ) : (
            <CompetenciaBadge nombre="General" color="#94a3b8" icono="" />
          )}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="hidden md:flex flex-col gap-1 w-32 flex-shrink-0">
        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
          <span>{progressPercent}%</span>
          <span>{curso.progreso?.completados ?? 0}/{curso.progreso?.total ?? 0}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      {/* Duración */}
      <div className="hidden lg:flex items-center gap-1 text-xs text-slate-400 font-semibold w-16 flex-shrink-0">
        <Clock className="w-3.5 h-3.5" />
        {curso.duracion_horas}h
      </div>

      {/* Estado */}
      <span className={`hidden sm:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0 ${badgeClass}`}>
        {badgeText}
      </span>

      {/* Acción */}
      <div className="flex-shrink-0">
        {isInscrito ? (
          <Link
            href={`/plataforma/curso/${curso.id}`}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 whitespace-nowrap ${
              isCompleted
                ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                : "bg-blue-50 border-blue-100 text-[#0056D2] hover:bg-[#0056D2] hover:text-white"
            }`}
          >
            {isCompleted ? "Ver curso" : "Continuar"}
          </Link>
        ) : (
          <button
            onClick={onInscribirse}
            disabled={inscribiendo}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#0056D2] hover:bg-[#0047b3] text-white disabled:opacity-60 transition-all duration-200 whitespace-nowrap flex items-center gap-1.5"
          >
            {inscribiendo ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3 h-3 fill-current" />
            )}
            Inscribirme
          </button>
        )}
      </div>
    </div>
  );
}

function CursoCard({
  curso,
  completadoAt,
  onInscribirse,
  inscribiendo,
}: CursoCardProps) {
  const estado = completadoAt
    ? "completado"
    : curso.inscrito
      ? "inscrito"
      : "catalogo";

  const isCompleted =
    estado === "completado" ||
    (curso.progreso && curso.progreso.porcentaje === 100);
  const progressPercent = isCompleted ? 100 : curso.progreso?.porcentaje || 0;
  const progressText = isCompleted
    ? "100% completado"
    : progressPercent > 0
      ? `${Math.round(progressPercent)}% completado`
      : "0% completado";

  let statusBadgeBg = "bg-slate-400";
  let statusText = "No iniciado";
  let progressBarColor = "bg-slate-200";

  if (isCompleted) {
    statusBadgeBg = "bg-[#10b981]";
    statusText = "Completado";
    progressBarColor = "bg-[#10b981]";
  } else if (estado === "inscrito") {
    statusBadgeBg = "bg-[#0056D2]";
    statusText = "En progreso";
    progressBarColor = "bg-[#0056D2]";
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] transition-all duration-300 relative group h-full">
      <div className="relative h-44 flex-shrink-0 overflow-hidden">
        <img
          src={getCursoImage(curso)}
          alt={curso.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/placeholder.png";
          }}
        />
        <span
          className={`absolute top-4 left-4 ${statusBadgeBg} text-white text-[10px] font-bold px-3 py-1 rounded-[6px] uppercase tracking-wider`}
        >
          {statusText}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 mb-3">
          {curso.titulo}
        </h3>

        <div className="mb-6">
          {curso.competencias && curso.competencias.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {curso.competencias.slice(0, 2).map((c) => (
                <CompetenciaBadge
                  key={c.codigo}
                  nombre={c.nombre}
                  color={c.color}
                  icono={c.icono}
                />
              ))}
              {curso.competencias.length > 2 && (
                <span className="text-[10px] font-bold text-gray-400 self-center ml-0.5">
                  +{curso.competencias.length - 2}
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <CompetenciaBadge nombre="General" color="#94a3b8" icono="" />
            </div>
          )}
        </div>

        <div className="mb-6 mt-auto">
          <div className="text-[12px] font-bold text-slate-400 mb-2">
            {progressText}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${progressBarColor}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-50 mt-auto">
          <div className="flex items-center text-slate-400 text-[13px] font-semibold gap-1.5">
            <Clock className="w-4 h-4" strokeWidth={2} />
            <span>{curso.duracion_horas}h 00m</span>
          </div>

          <div>
            {curso.inscrito ? (
              <Link
                href={`/plataforma/curso/${curso.id}`}
                className={`px-4 py-1.5 text-xs font-bold rounded-2xl border transition-all duration-300 flex items-center justify-center gap-1 ${
                  isCompleted
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                    : "bg-blue-50 border-blue-100 text-[#0056D2] hover:bg-[#0056D2] hover:text-white"
                }`}
              >
                {isCompleted ? "Ver curso" : "Continuar"}
              </Link>
            ) : (
              <button
                onClick={onInscribirse}
                disabled={inscribiendo}
                className="w-9 h-9 rounded-full flex items-center justify-center border bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-300 disabled:opacity-50"
              >
                {inscribiendo ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MisCursosDash() {
  const { data: userData } = useRetrieveUserQuery();
  const { data: todosData, isLoading: loadingTodos } =
    useGetCursosPlataformaQuery();
  const { isLoading: loadingMis } = useGetMisCursosQuery();
  const { data: inscripcionesData } = useGetMisInscripcionesQuery();
  const [inscribirse, { isLoading: inscribiendo }] =
    useInscribirseACursoMutation();
  const { data: perfil } = useGetMiPerfilQuery();
  const [iniciarRuta, { isLoading: iniciando }] = useIniciarRutaMutation();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCompId, setSelectedCompId] = useState<number | null>(null);

  const todos = todosData?.results ?? [];
  const inscripciones = inscripcionesData?.results ?? [];

  const completadoMap = new Map(
    inscripciones.map((i) => [i.curso, i.completado_at]),
  );

  const nombre = userData?.nombre_completo?.split(" ")[0] ?? "Martha";


  // Competencia seleccionada
  const selectedComp =
    selectedCompId !== null
      ? (perfil?.find((c) => c.competencia_id === selectedCompId) ?? null)
      : null;

  // Rutas visibles según selección
  const rutasVisibles =
    perfil && perfil.length > 0
      ? selectedCompId !== null
        ? perfil
            .filter((c) => c.competencia_id === selectedCompId)
            .flatMap((c) =>
              c.rutas_recomendadas.map((r) => ({ ruta: r, comp: c })),
            )
        : perfil
            .filter((c) => !c.completada)
            .flatMap((c) =>
              c.rutas_recomendadas
                .filter((r) => r.nivel_objetivo_orden > c.nivel_actual_orden)
                .map((r) => ({ ruta: r, comp: c })),
            )
      : [];

  if (loadingTodos || loadingMis) return <Spinner />;

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

  // Filtrado de cursos (competencia + búsqueda + estado)
  const filteredCursos = todos.filter((curso) => {
    const matchesSearch = curso.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesComp =
      selectedComp !== null
        ? curso.competencias?.some(
            (c) => c.codigo === selectedComp.competencia_codigo,
          ) ?? false
        : true;

    const isComp =
      completadoMap.has(curso.id) ||
      (curso.progreso && curso.progreso.porcentaje === 100);
    const isInProg = curso.inscrito && !isComp;
    const isNotStarted = !curso.inscrito;

    let matchesStatus = true;
    if (statusFilter === "in_progress") matchesStatus = isInProg;
    else if (statusFilter === "completed") matchesStatus = isComp;
    else if (statusFilter === "not_started") matchesStatus = isNotStarted;

    return matchesSearch && matchesComp && matchesStatus;
  });

  return (
    <div className="relative min-h-screen pb-16 overflow-hidden">
      {/* Fondo ola */}
      <div className="absolute top-0 left-0 right-0 h-[380px] pointer-events-none select-none z-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 380"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="headerFadeBlue"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#eff6ff" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f3f8fe" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f9fafb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-100,0 L-100,240 C200,320 600,140 900,240 C1200,340 1300,200 1600,260 L1600,0 Z"
            fill="url(#headerFadeBlue)"
          />
        </svg>
      </div>

      <div className="px-6 md:px-12 lg:px-16 py-12 max-w-[1600px] mx-auto relative z-10 space-y-8">
        {/* Bienvenida + progreso global */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-[40px] font-bold text-gray-900 tracking-tight leading-tight">
              ¡Bienvenida(o), {nombre}!
            </h1>
            <p className="text-slate-500 mt-2 text-base">
              Continúa con tu plan de capacitación
            </p>
          </div>

          {/* Progreso global de competencias */}
          {perfil && perfil.length > 0 && (() => {
            const total = perfil.length;
            const cubiertas = perfil.filter((c) => c.completada).length;
            const pct = Math.round((cubiertas / total) * 100);
            return (
              <div className="shrink-0 flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Competencias cubiertas
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {cubiertas} de {total}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-emerald-600">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Chips de competencias ── */}
        {perfil && perfil.length > 0 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              onClick={() => setSelectedCompId(null)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-200 ${
                selectedCompId === null
                  ? "bg-[#0056D2] text-white border-[#0056D2] shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              Todas las competencias
            </button>

            {perfil.map((c) => {
              const color = c.competencia_color || "#6366f1";
              const isSelected = selectedCompId === c.competencia_id;
              const Icon = iconMap[c.competencia_icono];

              return (
                <button
                  key={c.competencia_id}
                  onClick={() =>
                    setSelectedCompId(
                      isSelected ? null : c.competencia_id,
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-200"
                  style={
                    isSelected
                      ? {
                          backgroundColor: color,
                          color: "#fff",
                          borderColor: color,
                        }
                      : {
                          backgroundColor: "#fff",
                          color: "#475569",
                          borderColor: "#e2e8f0",
                        }
                  }
                >
                  {Icon && (
                    <Icon
                      size={12}
                      style={{ color: isSelected ? "#fff" : color }}
                    />
                  )}
                  {c.competencia_nombre}
                  {/* Dot de estado */}
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: isSelected
                        ? "rgba(255,255,255,0.55)"
                        : c.completada
                          ? "#10b981"
                          : c.nivel_actual_id !== null
                            ? "#f59e0b"
                            : "#cbd5e1",
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* ── Rutas de aprendizaje ── */}
        {rutasVisibles.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="px-6 pt-5 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  {selectedCompId !== null
                    ? `Rutas para ${selectedComp?.competencia_nombre}`
                    : "Rutas recomendadas"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {rutasVisibles.length} ruta
                  {rutasVisibles.length !== 1 ? "s" : ""} de aprendizaje
                </p>
              </div>
            </div>

            <div
              className="flex gap-3 overflow-x-auto px-6 pb-5 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {rutasVisibles.map(({ ruta, comp: c }) => {
                const color = c.competencia_color || "#6366f1";
                const Icon = iconMap[c.competencia_icono];
                const { total: tot, completados: done, porcentaje: rutaPct } = ruta.progreso;
                const sorted = [...ruta.cursos].sort((a, b) => a.orden - b.orden);
                const completada = ruta.terminada;

                return (
                  <div
                    key={`${c.competencia_id}-${ruta.id}`}
                    className="flex-shrink-0 w-60 border border-slate-100 rounded-2xl overflow-hidden bg-white hover:shadow-sm transition-shadow"
                  >
                    {/* Franja de color */}
                    <div className="h-1 w-full" style={{ backgroundColor: color }} />

                    <div className="p-4 space-y-3">
                      {/* Competencia + nombre ruta */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: color + "18" }}
                          >
                            {Icon ? (
                              <Icon size={11} style={{ color }} />
                            ) : (
                              <span className="text-[9px] font-bold" style={{ color }}>
                                {c.competencia_codigo[0]}
                              </span>
                            )}
                          </div>
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider truncate"
                            style={{ color }}
                          >
                            {c.competencia_nombre}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">
                          {ruta.nombre}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          → {ruta.nivel_objetivo_nombre}
                        </p>
                      </div>

                      {/* Barra de progreso */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>{done}/{tot} completados</span>
                          <span style={{ color: completada ? "#10b981" : color }}>
                            {rutaPct}%
                          </span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${rutaPct}%`,
                              backgroundColor: completada ? "#10b981" : color,
                            }}
                          />
                        </div>
                      </div>

                      {/* Lista de cursos con estado */}
                      <ul className="space-y-1.5">
                        {sorted.slice(0, 3).map((cu) => (
                          <li key={cu.id} className="flex items-center gap-2">
                            {cu.estado === "completado" ? (
                              <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            ) : cu.estado === "en_curso" ? (
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0 border-2"
                                style={{ borderColor: color, backgroundColor: color + "25" }}
                              />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-slate-300 flex-shrink-0" />
                            )}
                            <span
                              className={`text-[10px] truncate ${
                                cu.estado === "completado"
                                  ? "text-slate-400 line-through"
                                  : cu.estado === "en_curso"
                                    ? "text-slate-800 font-semibold"
                                    : "text-slate-500"
                              }`}
                            >
                              {cu.curso_titulo}
                            </span>
                          </li>
                        ))}
                        {tot > 3 && (
                          <li className="text-[10px] text-slate-400 pl-5">
                            +{tot - 3} más
                          </li>
                        )}
                      </ul>

                      {/* Botón de acción */}
                      <button
                        onClick={() => handleAccionRuta(ruta)}
                        disabled={completada || iniciando}
                        className="w-full mt-1 py-2 rounded-xl text-xs font-bold transition-all disabled:cursor-not-allowed"
                        style={
                          completada
                            ? { backgroundColor: "#f0fdf4", color: "#10b981", border: "1px solid #bbf7d0" }
                            : ruta.iniciada
                              ? { backgroundColor: color + "15", color, border: `1px solid ${color}35` }
                              : { backgroundColor: color, color: "#fff", border: `1px solid ${color}` }
                        }
                      >
                        {completada ? "✓ Completada" : ruta.iniciada ? "Continuar ruta" : "Iniciar ruta →"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Filtros y búsqueda ── */}
        <div className="bg-white border border-slate-100 rounded-[22px] p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="pl-2 hidden md:block">
            <h2 className="text-lg font-bold text-slate-800">
              {selectedComp
                ? `Cursos · ${selectedComp.competencia_nombre}`
                : "Mis cursos"}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400 text-slate-700"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none text-slate-600 font-semibold cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completados</option>
                <option value="not_started">No iniciados</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="hidden sm:flex border border-slate-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 ${viewMode === "grid" ? "bg-blue-50 text-[#0056D2]" : "bg-white text-slate-400 hover:text-slate-600"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 ${viewMode === "list" ? "bg-blue-50 text-[#0056D2]" : "bg-white text-slate-400 hover:text-slate-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Cursos ── */}
        {filteredCursos.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCursos.map((curso) => (
                <CursoCard
                  key={curso.id}
                  curso={curso}
                  completadoAt={completadoMap.get(curso.id) ?? null}
                  onInscribirse={() => inscribirse({ curso: curso.id })}
                  inscribiendo={inscribiendo}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredCursos.map((curso) => (
                <CursoRow
                  key={curso.id}
                  curso={curso}
                  completadoAt={completadoMap.get(curso.id) ?? null}
                  onInscribirse={() => inscribirse({ curso: curso.id })}
                  inscribiendo={inscribiendo}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[28px] shadow-sm">
            <p className="text-slate-400 font-medium">
              No se encontraron cursos con los filtros aplicados.
            </p>
          </div>
        )}

        {/* Paginación */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 text-sm font-semibold text-slate-400">
          <div>
            Mostrando 1 a {filteredCursos.length} de {filteredCursos.length}{" "}
            cursos
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3.5 py-1.5 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-50"
              disabled
            >
              &lt;
            </button>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold">
              1
            </span>
            <button
              className="px-3.5 py-1.5 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-50"
              disabled
            >
              &gt;
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg cursor-pointer text-slate-500 font-semibold text-[13px] focus:outline-none">
                <option>8 por página</option>
                <option>16 por página</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}