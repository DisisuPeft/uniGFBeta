"use client";

import { useGetCampaniasProximasQuery } from "@/redux/features/control-escolar/dashboardApiSlice";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";

function Skeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="py-4 space-y-2">
          <div className="h-3.5 w-36 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-2 w-full bg-gray-100 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function DaysLeft({ fechaFin }: { fechaFin: string }) {
  const diff = Math.ceil(
    (new Date(fechaFin).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return <span className="text-xs text-red-500 font-medium">Vencida</span>;
  if (diff === 0) return <span className="text-xs text-orange-500 font-medium">Vence hoy</span>;
  if (diff <= 7)
    return (
      <span className="text-xs text-orange-500 font-medium">{diff}d restantes</span>
    );
  return <span className="text-xs text-gray-400">{diff}d restantes</span>;
}

export default function CampaniasProximas() {
  const { data: campanias, isLoading } = useGetCampaniasProximasQuery();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">
            Campañas próximas a vencer
          </h2>
        </div>
        <Link
          href="/dashboard/control-escolar/campanias"
          className="flex items-center gap-1 text-xs text-[#0056D2] hover:underline font-medium"
        >
          Ver todas
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* List */}
      <div className="px-5 py-2">
        {isLoading ? (
          <Skeleton />
        ) : !campanias?.length ? (
          <div className="py-10 text-center">
            <Megaphone className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Sin campañas próximas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {campanias.map((campania) => {
              const pct =
                campania.cupo_maximo > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (campania.inscritos / campania.cupo_maximo) * 100,
                      ),
                    )
                  : 0;
              const isFull = pct >= 100;

              return (
                <div key={campania.ref} className="py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {campania.nombre}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {campania.programa_nombre}
                      </p>
                    </div>
                    <DaysLeft fechaFin={campania.fecha_fin} />
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>
                        {campania.inscritos} / {campania.cupo_maximo} inscritos
                      </span>
                      <span
                        className={
                          isFull ? "text-emerald-600 font-medium" : ""
                        }
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull
                            ? "bg-emerald-500"
                            : pct >= 75
                              ? "bg-amber-400"
                              : "bg-[#0056D2]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}