"use client";

import { useState } from "react";
import { 
  useGetCursosPlataformaQuery, 
  useGetMisCursosQuery,
  useInscribirseACursoMutation
} from "@/redux/features/capacitacion/plataformaApiSlice";
import { Clock, Search, Plus } from "lucide-react";

export default function ExplorarDash() {
  const [search, setSearch] = useState("");
  const { data: todosData, isLoading: loadingCatalog, refetch: refetchCatalog } = useGetCursosPlataformaQuery();
  const { data: misCursosData, refetch: refetchMisCursos } = useGetMisCursosQuery();
  const [inscribirse, { isLoading: inscribiendo }] = useInscribirseACursoMutation();

  const cursosCatalog = todosData?.results ?? [];
  const misCursos = misCursosData?.results ?? [];

  const handleInscribirse = async (cursoId: string | number) => {
    try {
      await inscribirse({ curso_id: cursoId }).unwrap();
      refetchCatalog();
      refetchMisCursos();
    } catch (error) {
      console.error("Error al inscribirse:", error);
    }
  };

  // Helper para imágenes de portadas
  const getCursoImage = (curso: any) => {
    if (curso.imagen) return curso.imagen;
    const titleLower = curso.titulo.toLowerCase();
    if (titleLower.includes("analista")) {
      return "/assets/Fotos de Curso/Analista.png";
    }
    const placeholders = [
      "/assets/hero-image.jpg",
      "/assets/place2.jpg",
      "/assets/plataforma-img.png",
      "/assets/vista-cursos.jpg",
      "/assets/hero/thales-hero.webp"
    ];
    const idNum = typeof curso.id === "number" ? curso.id : 0;
    return placeholders[idNum % placeholders.length];
  };

  // Filtrar cursos del catálogo en los que NO está inscrito
  const cursosDisponibles = cursosCatalog.filter(
    (cat) => !misCursos.some((my) => String(my.id) === String(cat.id))
  );

  // Filtrar por búsqueda
  const filteredCursos = cursosDisponibles.filter((curso) =>
    curso.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto px-12 py-8 relative min-h-[calc(100vh-100px)]">
      {/* Wave decorativo de fondo */}
      <div className="absolute top-0 left-0 right-0 h-44 overflow-hidden pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 220" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C320,80 720,20 1080,70 C1280,100 1380,140 1440,160 L1440,0 L0,0 Z" fill="#f0f4ff" opacity="0.4" />
          <path d="M0,0 C240,40 640,0 960,35 C1160,55 1320,110 1440,140 L1440,0 L0,0 Z" fill="#eff6ff" opacity="0.6" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Explorar más cursos
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Descubre nuevos programas de formación profesional para seguir desarrollando tus competencias.
          </p>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cursos por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056D2] focus:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.005)] transition-all placeholder-slate-400 text-slate-700"
            />
          </div>
        </div>

        {/* Rejilla de Cursos */}
        {loadingCatalog ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0056D2]" />
          </div>
        ) : filteredCursos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCursos.map((curso) => (
              <div
                key={curso.id}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col hover:shadow-[0_15px_30px_rgba(0,0,0,0.035)] hover:border-slate-200/80 transition-all duration-300 relative group h-full"
              >
                {/* Imagen del Curso */}
                <div className="relative h-44 flex-shrink-0 overflow-hidden bg-slate-50">
                  <img
                    src={getCursoImage(curso)}
                    alt={curso.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge de estado sólido sobre la imagen (Premium glassmorphic style) */}
                  <span className="absolute top-4 left-4 bg-slate-900/65 backdrop-blur-[3px] text-white text-[9px] font-bold px-2.5 py-1 rounded-[6px] uppercase tracking-wider">
                    Disponible
                  </span>
                </div>

                {/* Información */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-[15px] line-clamp-2 leading-snug mb-3">
                      {curso.titulo}
                    </h3>
                    
                    {/* Competencias (Píldora debajo del título) */}
                    <div className="mb-4">
                      {curso.competencias && curso.competencias.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {curso.competencias.slice(0, 2).map((c: any) => (
                            <span
                              key={c.codigo}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
                              style={{
                                borderColor: c.color ? `${c.color}40` : "#e2e8f0",
                                color: c.color || "#475569",
                                backgroundColor: c.color ? `${c.color}10` : "#f1f5f9",
                              }}
                            >
                              {c.icono && <span>{c.icono}</span>}
                              {c.nombre}
                            </span>
                          ))}
                          {curso.competencias.length > 2 && (
                            <span className="text-[10px] font-bold text-gray-400 self-center ml-0.5">
                              +{curso.competencias.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200 text-slate-500 bg-slate-50">
                            General
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-3 mt-2 leading-relaxed">
                      {curso.descripcion || "Curso de formación profesional y desarrollo de habilidades en Farrera Academy."}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-350" />
                      {curso.duracion || 10} horas
                    </span>
                    
                    <button
                      onClick={() => handleInscribirse(curso.id)}
                      disabled={inscribiendo}
                      className="px-4 py-1.5 bg-[#0056D2] hover:bg-[#0047b3] text-white disabled:bg-slate-100 disabled:text-slate-400 text-xs font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-1 shadow-sm hover:shadow"
                      title="Inscribirse al curso"
                    >
                      {inscribiendo ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                      )}
                      Inscribirse
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.015)] mt-10 select-none">
            {/* Ilustración Vectorial Premium para Estado Vacío */}
            <div className="relative w-[180px] h-[130px] mx-auto mb-3 flex items-center justify-center">
              <svg width="180" height="130" viewBox="0 0 180 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none select-none">
                <defs>
                  <radialGradient id="emptyGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0056D2" stopOpacity="0.06" />
                    <stop offset="70%" stopColor="#0056D2" stopOpacity="0" />
                  </radialGradient>
                  <filter id="emptyBlur" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" />
                  </filter>
                  <filter id="emptyShadow" x="-35%" y="-35%" width="170%" height="170%">
                    <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.03" />
                  </filter>
                </defs>
                
                {/* Nube celeste de fondo */}
                <ellipse cx="90" cy="70" rx="70" ry="43" fill="url(#emptyGlow)" filter="url(#emptyBlur)" />
                
                {/* Hoja trasera */}
                <g transform="translate(52, 16) rotate(8 36 48)" filter="url(#emptyShadow)">
                  <path 
                    d="M 8,0 L 56,0 L 72,16 L 72,88 A 8,8 0 0 1 64,96 L 8,96 A 8,8 0 0 1 0,88 L 0,8 A 8,8 0 0 1 8,0 Z" 
                    fill="white" 
                    stroke="#e6ecf4" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M 56,0 L 56,10 A 6,6 0 0 0 62,16 L 72,16 Z" 
                    fill="#e2e8f0" 
                    stroke="#cbd5e1" 
                    strokeWidth="1.0" 
                  />
                </g>
                
                {/* Hoja delantera */}
                <g transform="translate(62, 20) rotate(-8 36 48)" filter="url(#emptyShadow)">
                  <path 
                    d="M 8,0 L 56,0 L 72,16 L 72,88 A 8,8 0 0 1 64,96 L 8,96 A 8,8 0 0 1 0,88 L 0,8 A 8,8 0 0 1 8,0 Z" 
                    fill="white" 
                    stroke="#e6ecf4" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M 56,0 L 56,10 A 6,6 0 0 0 62,16 L 72,16 Z" 
                    fill="#e2e8f0" 
                    stroke="#cbd5e1" 
                    strokeWidth="1.0" 
                  />
                  {/* Líneas de texto */}
                  <line x1="14" y1="16" x2="48" y2="16" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                  <line x1="14" y1="26" x2="32" y2="26" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />

                  {/* Ícono de búsqueda en el centro */}
                  <foreignObject x="20" y="44" width="32" height="32">
                    <div className="w-full h-full flex items-center justify-center text-[#3b82f6]">
                      <Search className="w-6 h-6" strokeWidth={1.3} fill="#eff6ff" />
                    </div>
                  </foreignObject>
                </g>
                
                {/* Decoraciones */}
                <path d="M 140,36 L 148,36 M 144,32 L 144,40" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
                <path d="M 32,58 L 40,58 M 36,54 L 36,62" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
                <circle cx="42" cy="82" r="3.5" stroke="#cbd5e1" strokeWidth="1.8" fill="none" opacity="0.5" />
              </svg>
            </div>
            
            <h3 className="text-base font-bold text-gray-900 mb-1.5 mt-4 tracking-tight">
              No se encontraron cursos
            </h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
              {search
                ? "Prueba buscando con palabras clave diferentes o limpiando el buscador."
                : "¡Estás inscrito en todos los cursos disponibles en este momento!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
