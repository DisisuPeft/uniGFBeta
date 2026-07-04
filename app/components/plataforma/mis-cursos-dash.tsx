"use client";

import { 
  Clock, 
  Shield, 
  BarChart, 
  Users, 
  CheckCircle, 
  Lightbulb,
  Search,
  ChevronDown,
  Grid,
  List,
  MoreVertical,
  Check,
  ChevronRight,
  Play,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  useGetCursosPlataformaQuery,
  useGetMisCursosQuery,
  useGetMisInscripcionesQuery,
  useInscribirseACursoMutation,
} from "@/redux/features/capacitacion/plataformaApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { CursoPlataforma } from "@/redux/features/types/capacitacion/plataforma-types";

function Spinner() {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0056D2]" />
    </div>
  );
}

function CompetenciaBadge({ nombre, color, icono }: { nombre: string; color: string; icono: string }) {
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
    "/assets/hero/thales-hero.webp"
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

const getRandomIcon = (id: string | number) => {
  const icons = [Shield, BarChart, Users, CheckCircle, Lightbulb];
  const strId = String(id);
  let hash = 0;
  for (let i = 0; i < strId.length; i++) {
    hash = strId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const IconComponent = icons[Math.abs(hash) % icons.length];
  return <IconComponent className="w-5 h-5" />;
};

interface CursoCardProps {
  curso: CursoPlataforma;
  completadoAt?: string | null;
  onInscribirse?: () => void;
  inscribiendo?: boolean;
}

function CursoCard({
  curso,
  completadoAt,
  onInscribirse,
  inscribiendo,
}: CursoCardProps) {
  const estado = completadoAt ? "completado" : curso.inscrito ? "inscrito" : "catalogo";
  
  const isCompleted = estado === "completado" || (curso.progreso && curso.progreso.porcentaje === 100);
  const progressPercent = isCompleted ? 100 : (curso.progreso?.porcentaje || 0);
  const progressText = isCompleted ? "100% completado" : progressPercent > 0 ? `${Math.round(progressPercent)}% completado` : "0% completado";
  
  // Clases y colores según el estado
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
      {/* Imagen */}
      <div className="relative h-44 flex-shrink-0 overflow-hidden">
        <img
          src={getCursoImage(curso)}
          alt={curso.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null; // Evitar bucle infinito
            e.currentTarget.src = "/assets/placeholder.png";
          }}
        />
        {/* Badge de estado sólido */}
        <span className={`absolute top-4 left-4 ${statusBadgeBg} text-white text-[10px] font-bold px-3 py-1 rounded-[6px] uppercase tracking-wider`}>
          {statusText}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 mb-3">
          {curso.titulo}
        </h3>

        {/* Competencias */}
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
              <CompetenciaBadge
                nombre="General"
                color="#94a3b8"
                icono=""
              />
            </div>
          )}
        </div>

        {/* Fila de Progreso */}
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

        {/* Fila de pie de tarjeta */}
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
  const { data: todosData, isLoading: loadingTodos } = useGetCursosPlataformaQuery();
  const { data: misCursosData, isLoading: loadingMis } = useGetMisCursosQuery();
  const { data: inscripcionesData } = useGetMisInscripcionesQuery();
  const [inscribirse, { isLoading: inscribiendo }] = useInscribirseACursoMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const todos = todosData?.results ?? [];
  const misCursosRecomendados = misCursosData?.results ?? [];
  const inscripciones = inscripcionesData?.results ?? [];

  const completadoMap = new Map(inscripciones.map((i) => [i.curso, i.completado_at]));
  
  const nombre = userData?.nombre_completo?.split(" ")[0] ?? "Martha";

  // Calcular estadísticas de aprendizaje
  const inscritos = todos.filter((c) => c.inscrito);
  const horasTotales = inscritos.reduce((sum, c) => sum + (c.duracion_horas || 0), 0);
  const totalHorasStr = horasTotales > 0 ? `${horasTotales}h 30m` : "12h 30m";

  if (loadingTodos || loadingMis) return <Spinner />;

  // Filtrado de cursos
  const filteredCursos = todos.filter((curso) => {
    const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isComp = completadoMap.has(curso.id) || (curso.progreso && curso.progreso.porcentaje === 100);
    const isInProg = curso.inscrito && !isComp;
    const isNotStarted = !curso.inscrito;

    if (statusFilter === "in_progress") return matchesSearch && isInProg;
    if (statusFilter === "completed") return matchesSearch && isComp;
    if (statusFilter === "not_started") return matchesSearch && isNotStarted;
    
    return matchesSearch;
  });

  return (
    <div className="relative min-h-screen pb-16 overflow-hidden">
      
      {/* Fondo de Ola Curva Celeste (Desvanecido del Mockup) */}
      <div className="absolute top-0 left-0 right-0 h-[380px] pointer-events-none select-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 380" preserveAspectRatio="none">
          <defs>
            <linearGradient id="headerFadeBlue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eff6ff" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f3f8fe" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f9fafb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M-100,0 L-100,240 C200,320 600,140 900,240 C1200,340 1300,200 1600,260 L1600,0 Z" fill="url(#headerFadeBlue)" />
        </svg>
      </div>

      <div className="px-6 md:px-12 lg:px-16 py-12 max-w-[1600px] mx-auto relative z-10 space-y-10">
        
        {/* Fila superior de Bienvenida */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-[40px] font-bold text-gray-900 tracking-tight leading-tight">
              ¡Bienvenida, {nombre}!
            </h1>
            <p className="text-slate-500 mt-2 text-base">
              Continúa con tu plan de capacitación
            </p>
          </div>
        </div>

        {/* Fila de Filtros y Búsqueda */}
        <div className="bg-white border border-slate-100 rounded-[22px] p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          {/* Título interno */}
          <div className="pl-2 hidden md:block">
            <h2 className="text-lg font-bold text-slate-800">
              Mis cursos
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Input buscar */}
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

            {/* Dropdown estados */}
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

            {/* Toggle visualización */}
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

        {/* Grilla de Cursos de 4 columnas */}
        {filteredCursos.length > 0 ? (
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
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[28px] shadow-sm">
            <p className="text-slate-400 font-medium">No se encontraron cursos con los filtros aplicados.</p>
          </div>
        )}

        {/* Barra de paginación estética */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 text-sm font-semibold text-slate-400">
          <div>
            Mostrando 1 a {filteredCursos.length} de {filteredCursos.length} cursos
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-3.5 py-1.5 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
              &lt;
            </button>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold">
              1
            </span>
            <button className="px-3.5 py-1.5 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
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