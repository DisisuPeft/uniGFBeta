"use client";

import { useState, useMemo } from "react";
import { useGetCursosQuery } from "@/redux/features/control-escolar/programasApiSlice";
import CursoCard from "./curso-card";
import { Search } from "lucide-react";

const ESTADOS_LABEL: Record<number, string> = {
  1: "Activo",
  0: "Inactivo",
};

export default function CursosView() {
  const { data, isLoading, isError } = useGetCursosQuery();
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<string>("Todos");

  const cursos = data?.results ?? [];

  const cursosFiltrados = useMemo(() => {
    return cursos.filter((c) => {
      const coincideBusqueda =
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado =
        estado === "Todos" || c.status === Number(estado);
      return coincideBusqueda && coincideEstado;
    });
  }, [cursos, busqueda, estado]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-[#333333]/40">
        <p className="text-3xl mb-3">⚠️</p>
        <p className="text-sm">No se pudo cargar la lista de cursos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar curso..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#1c2634] placeholder:text-[#333333]/30 focus:outline-none focus:ring-2 focus:ring-[#1c2634]/15 focus:border-[#1c2634] transition-all bg-white"
          />
        </div>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2634]/15 focus:border-[#1c2634] transition-all"
        >
          <option value="Todos">Todos los estados</option>
          {Object.entries(ESTADOS_LABEL).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Resultados */}
      {cursosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-[#333333]/40">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm">
            No se encontraron cursos con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[#333333]/45 font-medium">
            {cursosFiltrados.length} curso
            {cursosFiltrados.length !== 1 ? "s" : ""} encontrado
            {cursosFiltrados.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cursosFiltrados.map((curso) => (
              <CursoCard key={curso.id} curso={curso} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}