"use client";

import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/utils/data-table";
import { Campania } from "@/redux/features/types/control-escolar/type";
import { useRetrieveCampaniasQuery } from "@/redux/features/control-escolar/campaniasApiSlice";
import { formatCurrency } from "@/lib/format-currency";
import { Megaphone } from "lucide-react";
// import ButtonLink from "../link-button";

const columns: ColumnDef<Campania>[] = [
  {
    id: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <p className="text-sm font-medium text-gray-900">{row.original.nombre}</p>
    ),
  },
  {
    id: "institucion",
    header: "Institución",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.institucion_nombre}
      </span>
    ),
  },
  {
    id: "fecha_inicio",
    header: "Inicio",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.fecha_inicio.split("-").reverse().join("/")}
      </span>
    ),
  },
  {
    id: "fecha_fin",
    header: "Fin",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.fecha_fin.split("-").reverse().join("/")}
      </span>
    ),
  },
  {
    id: "costo",
    header: "Costo asignado",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-gray-900">
        {formatCurrency(parseInt(row.original.costo_asignado))}
      </span>
    ),
  },
];

export default function CampaniasView() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";

  const { data: campanias, isLoading } = useRetrieveCampaniasQuery({
    page,
    search,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      {/* <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona las campañas de inscripción activas
          </p>
        </div>
        <ButtonLink
          path="/dashboard/control-escolar/campanias/new"
          title="+ Nueva Campaña"
        />
      </div> */}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-[#0056D2]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {campanias?.count ?? "—"}
            </p>
            <p className="text-xs text-gray-500">Total campañas</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-gray-500">#</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.ceil((campanias?.count ?? 0) / 10)}
            </p>
            <p className="text-xs text-gray-500">Páginas totales</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={campanias?.results ?? []}
        isLoading={isLoading}
        count={campanias?.count ?? 0}
        filters={[
          {
            type: "search",
            key: "search",
            placeholder: "Nombre o institución...",
          },
        ]}
        emptyIcon={Megaphone}
        emptyMessage="No se encontraron campañas"
      />
    </div>
  );
}
