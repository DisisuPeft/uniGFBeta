"use client";

import Link from "next/link";
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}

function CompetenciaBadge({ nombre, color, icono }: { nombre: string; color: string; icono: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
      style={{
        borderColor: color || "#e5e7eb",
        color: color || "#6b7280",
        backgroundColor: color ? `${color}18` : "#f9fafb",
      }}
    >
      {icono && <span>{icono}</span>}
      {nombre}
    </span>
  );
}

interface CursoCardProps {
  curso: CursoPlataforma;
  completadoAt?: string | null;
  onInscribirse?: () => void;
  inscribiendo?: boolean;
  mostrarCompetencias?: boolean;
}

function CursoCard({
  curso,
  completadoAt,
  onInscribirse,
  inscribiendo,
  mostrarCompetencias = false,
}: CursoCardProps) {
  const estado = completadoAt ? "completado" : curso.inscrito ? "inscrito" : "catalogo";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Imagen */}
      <div className="h-36 bg-gradient-to-br from-blue-50 to-indigo-100 relative flex-shrink-0">
        {curso.imagen && (
          <img
            src={curso.imagen}
            alt={curso.titulo}
            className="w-full h-full object-cover"
          />
        )}
        {estado !== "catalogo" && (
          <span
            className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              estado === "completado"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {estado === "completado" ? "Completado" : "En progreso"}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
          {curso.titulo}
        </h3>

        {curso.descripcion && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-2">{curso.descripcion}</p>
        )}

        {/* Competencias */}
        {mostrarCompetencias && curso.competencias.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {curso.competencias.slice(0, 3).map((c) => (
              <CompetenciaBadge
                key={c.codigo}
                nombre={c.nombre}
                color={c.color}
                icono={c.icono}
              />
            ))}
            {curso.competencias.length > 3 && (
              <span className="text-[10px] text-gray-400 self-center">
                +{curso.competencias.length - 3}
              </span>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 mb-4">{curso.duracion_horas}h</p>

        <div className="mt-auto">
          {curso.inscrito ? (
            <Link
              href={`/plataforma/curso/${curso.id}`}
              className="flex items-center justify-center w-full bg-blue-600 text-white text-sm rounded-lg py-2 hover:bg-blue-700 transition-colors"
            >
              {estado === "completado" ? "Ver curso" : "Continuar"}
            </Link>
          ) : (
            <button
              onClick={onInscribirse}
              disabled={inscribiendo}
              className="w-full bg-gray-900 text-white text-sm rounded-lg py-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {inscribiendo ? "Inscribiendo..." : "Inscribirse"}
            </button>
          )}
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

  const todos = todosData?.results ?? [];
  const misCursosRecomendados = misCursosData?.results ?? [];
  const inscripciones = inscripcionesData?.results ?? [];

  // Mapa rápido de completado_at por curso id
  const completadoMap = new Map(inscripciones.map((i) => [i.curso, i.completado_at]));

  const inscritos = todos.filter((c) => c.inscrito);
  const recomendadosIds = new Set(misCursosRecomendados.map((c) => c.id));
  const recomendados = misCursosRecomendados.filter((c) => !c.inscrito);
  const catalogo = todos.filter((c) => !c.inscrito && !recomendadosIds.has(c.id));

  const nombre = userData?.nombre_completo?.split(" ")[0] ?? "";

  if (loadingTodos || loadingMis) return <Spinner />;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {nombre ? `Hola, ${nombre}` : "Bienvenido"}
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Continúa con tu plan de capacitación
        </p>
      </div>

      {/* Mis cursos */}
      {inscritos.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Mis cursos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inscritos.map((curso) => (
              <CursoCard
                key={curso.id}
                curso={curso}
                completadoAt={completadoMap.get(curso.id) ?? null}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recomendados según competencias del puesto */}
      {recomendados.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Recomendados para ti
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Cursos alineados a las competencias de tu puesto
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recomendados.map((curso) => (
              <CursoCard
                key={curso.id}
                curso={curso}
                mostrarCompetencias
                onInscribirse={() => inscribirse({ curso: curso.id })}
                inscribiendo={inscribiendo}
              />
            ))}
          </div>
        </section>
      )}

      {/* Catálogo general */}
      {catalogo.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {inscritos.length === 0 && recomendados.length === 0
              ? "Cursos disponibles"
              : "Otros cursos"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogo.map((curso) => (
              <CursoCard
                key={curso.id}
                curso={curso}
                onInscribirse={() => inscribirse({ curso: curso.id })}
                inscribiendo={inscribiendo}
              />
            ))}
          </div>
        </section>
      )}

      {todos.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          No hay cursos disponibles por el momento.
        </div>
      )}
    </div>
  );
}