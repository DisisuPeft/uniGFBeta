"use client";

import Input from "@/app/ui/components/input";
import ButtonLink from "../../control-escolar/link-button";
import { FiltrosFechas } from "@/redux/features/types/crm/type";
import { MisMovimientosHook } from "@/hooks";

export default function MisMovimientos() {
  const {
    register,
    handleSubmit,
    errors,
    limpiarFiltros,
    mostrarFiltros,
    setMostrarFiltros,
    onFiltroFechas,
  } = MisMovimientosHook();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Primera fila: Título y botón crear */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xl sm:text-xl text-gray-600 mt-1 font-bold">
              Mis movimientos
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón toggle filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filtros
            </button>

            <ButtonLink path={"/dashboard/crm/nuevo-lead"}>
              Crear Lead
            </ButtonLink>
          </div>
        </div>

        {/* Segunda fila: Filtros (condicional) */}
        {mostrarFiltros && (
          <form
            onSubmit={handleSubmit(onFiltroFechas)}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Fecha inicio */}
              <Input
                type="date"
                label="Fecha inicio"
                register={register("fecha_inicio")}
                error={errors.fecha_inicio?.message}
              />

              {/* Fecha fin */}
              <Input
                type="date"
                label="Fecha fin"
                register={register("fecha_fin")}
                error={errors.fecha_fin?.message}
              />

              {/* Botones de acción */}
              <div className="flex items-end gap-2 sm:col-span-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar filtros
                </button>

                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
