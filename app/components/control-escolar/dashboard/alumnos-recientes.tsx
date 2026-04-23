"use client";

import { useGetAlumnosRecientesQuery } from "@/redux/features/control-escolar/dashboardApiSlice";
import { StatusBadge } from "@/app/utils/data-table";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

function Skeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-5 w-14 bg-gray-100 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function Initials({ nombre }: { nombre: string }) {
  const parts = nombre.trim().split(" ");
  const letters = parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-semibold text-[#0056D2]">{letters}</span>
    </div>
  );
}

export default function AlumnosRecientes() {
  const { data: alumnos, isLoading } = useGetAlumnosRecientesQuery();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">
            Alumnos recientes
          </h2>
        </div>
        <Link
          href="/dashboard/control-escolar/alumnos"
          className="flex items-center gap-1 text-xs text-[#0056D2] hover:underline font-medium"
        >
          Ver todos
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* List */}
      <div className="px-5 py-2">
        {isLoading ? (
          <Skeleton />
        ) : !alumnos?.length ? (
          <div className="py-10 text-center">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Sin alumnos recientes</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {alumnos.map((alumno) => (
              <Link
                key={alumno.ref}
                href={`/dashboard/control-escolar/alumnos/${alumno.ref}`}
                className="flex items-center gap-3 py-3 group"
              >
                <Initials nombre={alumno.nombre} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#0056D2] transition-colors">
                    {alumno.nombre}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {alumno.programa_nombre}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <StatusBadge status={alumno.status} />
                  <span className="text-xs text-gray-400">
                    {new Date(alumno.fecha_inscripcion).toLocaleDateString(
                      "es-MX",
                      { day: "numeric", month: "short" },
                    )}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}