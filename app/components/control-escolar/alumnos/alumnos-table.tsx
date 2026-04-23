"use client";

import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { useGetEstudiantesQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { EstudiantePerfil } from "@/redux/features/types/control-escolar/type";
import { DataTable, StatusBadge } from "@/app/utils/data-table";
import ButtonLink from "../link-button";
import { Users } from "lucide-react";

const PAGE_SIZE = 10;

const columns: ColumnDef<EstudiantePerfil>[] = [
  {
    id: "matricula",
    header: "Matrícula",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-gray-500">
        {row.original.matricula}
      </span>
    ),
  },
  {
    id: "estudiante",
    header: "Estudiante",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-gray-900">
          {row.original.user_nombre}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{row.original.user_genero}</p>
      </div>
    ),
  },
  {
    id: "instituto",
    header: "Instituto",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 truncate max-w-[180px] block">
        {row.original.institucion_nombre ?? "—"}
      </span>
    ),
  },
  {
    id: "estado",
    header: "Estado",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "acciones",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ButtonLink
          icon="eye-icon"
          path={`/dashboard/control-escolar/alumnos/${row.original.ref}`}
        />
      </div>
    ),
  },
];

export default function EstudiantesPage() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";

  const { data: estudiantes, isLoading } = useGetEstudiantesQuery({
    page,
    search,
    status,
  });

  const activos =
    estudiantes?.results.filter((e) => e.status === 1).length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona y visualiza todos los estudiantes inscritos
          </p>
        </div>
        <ButtonLink
          path="/dashboard/control-escolar/alumnos/new"
          title="+ Nuevo Alumno"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-[#0056D2]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {estudiantes?.count ?? "—"}
            </p>
            <p className="text-xs text-gray-500">Total estudiantes</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{activos}</p>
            <p className="text-xs text-gray-500">Activos esta página</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-gray-500">#</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.ceil((estudiantes?.count ?? 0) / PAGE_SIZE)}
            </p>
            <p className="text-xs text-gray-500">Páginas totales</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={estudiantes?.results ?? []}
        isLoading={isLoading}
        count={estudiantes?.count ?? 0}
        pageSize={PAGE_SIZE}
        filters={[
          {
            type: "search",
            key: "search",
            placeholder: "Nombre, matrícula o email...",
          },
          {
            type: "select",
            key: "status",
            options: [
              { value: "all", label: "Todos los estados" },
              { value: "1", label: "Activo" },
              { value: "0", label: "Inactivo" },
            ],
          },
        ]}
        emptyIcon={Users}
        emptyMessage="No se encontraron estudiantes"
      />
    </div>
  );
}