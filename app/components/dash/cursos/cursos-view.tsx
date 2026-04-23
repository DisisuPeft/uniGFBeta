"use client";

import { useState, useMemo } from "react";
import { useGetCursosQuery } from "@/redux/features/control-escolar/programasApiSlice";
import CursoCard from "./curso-card";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-sm">No se pudo cargar la lista de cursos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar curso..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all"
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          <option value="Todos">Todos</option>
          {Object.entries(ESTADOS_LABEL).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Resultados */}
      {cursosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">
            No se encontraron cursos con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            {cursosFiltrados.length} curso
            {cursosFiltrados.length !== 1 ? "s" : ""} encontrado
            {cursosFiltrados.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursosFiltrados.map((curso) => (
              <CursoCard key={curso.id} curso={curso} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
