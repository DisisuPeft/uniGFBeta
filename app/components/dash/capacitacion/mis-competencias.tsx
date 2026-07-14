"use client";

import { Loader2, CheckCircle2, BookOpen, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useGetMiPerfilQuery } from "@/redux/features/competencias/competenciasApiSlice";
import { MiPerfilCompetencia, RutaRecomendada, CursoEnRuta } from "@/redux/features/types/competencias/types";
import { DynamicIcon } from "@/app/ui/icon/dynamic-icon";

// ── Barra de progreso por niveles ─────────────────────────────

function NivelBar({
  actual,
  requerido,
  color,
}: {
  actual: number;
  requerido: number;
  color: string;
}) {
  const max = Math.max(requerido, 1);
  const pct = Math.min((actual / max) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Nivel actual: {actual}</span>
        <span>Requerido: {requerido}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Ruta recomendada ──────────────────────────────────────────

function RutaCard({ ruta }: { ruta: RutaRecomendada }) {
  const total = ruta.cursos.length;
  const completados = ruta.cursos.filter((c) => c.completado).length;

  return (
    <div className="border border-gray-100 rounded-xl bg-gray-50/60 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-800">{ruta.nombre}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Objetivo: {ruta.nivel_objetivo_nombre} · {completados}/{total} cursos
          </p>
        </div>
        {completados === total && total > 0 && (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
        )}
      </div>

      {ruta.cursos.length > 0 && (
        <ul className="space-y-1.5">
          {ruta.cursos
            .slice()
            .sort((a, b) => a.orden - b.orden)
            .map((curso: CursoEnRuta) => (
              <li key={curso.id} className="flex items-center gap-2.5">
                {curso.completado ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <Link
                  href={`/dashboard/cursos/${curso.curso_id}`}
                  className="text-xs text-gray-600 hover:text-[#0056D2] transition-colors truncate"
                >
                  {curso.curso_titulo}
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

// ── Tarjeta por competencia ───────────────────────────────────

function CompetenciaCard({ item }: { item: MiPerfilCompetencia }) {
  const color = item.competencia_color || "#6366f1";
  const tieneRutas = item.rutas_recomendadas.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + "22" }}
        >
          <DynamicIcon iconName={item.competencia_icono} size={20} color={color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900">{item.competencia_nombre}</h3>
            {item.completada ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                <CheckCircle2 className="w-3 h-3" />
                Completada
              </span>
            ) : item.nivel_actual_id === null ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                <AlertCircle className="w-3 h-3" />
                Sin nivel
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                Brecha: {item.brecha}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
            <span>Actual: {item.nivel_actual_nombre ?? "—"}</span>
            <ChevronRight className="w-3 h-3" />
            <span>Requerido: {item.nivel_requerido_nombre ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* Barra */}
      <div className="px-5 pb-4">
        <NivelBar
          actual={item.nivel_actual_orden}
          requerido={item.nivel_requerido_orden}
          color={color}
        />
      </div>

      {/* Rutas recomendadas */}
      {!item.completada && tieneRutas && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-2.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Rutas recomendadas
          </p>
          {item.rutas_recomendadas.map((ruta) => (
            <RutaCard key={ruta.id} ruta={ruta} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Vista principal ───────────────────────────────────────────

export default function MisCompetenciasView() {
  const { data: perfil, isLoading } = useGetMiPerfilQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!perfil || perfil.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-base font-medium text-gray-600 mb-1">Sin competencias asignadas</p>
          <p className="text-sm text-gray-400">
            Tu puesto no tiene competencias requeridas configuradas aún.
          </p>
        </div>
      </div>
    );
  }

  const completadas = perfil.filter((p) => p.completada).length;
  const pendientes = perfil.length - completadas;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Mis competencias</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Progreso respecto al nivel que exige tu puesto
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{completadas}</p>
            <p className="text-xs text-gray-500">Completadas</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{pendientes}</p>
            <p className="text-xs text-gray-500">En desarrollo</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-[#0056D2]" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{perfil.length}</p>
            <p className="text-xs text-gray-500">Total requeridas</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {perfil.map((item) => (
          <CompetenciaCard key={item.competencia_id} item={item} />
        ))}
      </div>
    </div>
  );
}
