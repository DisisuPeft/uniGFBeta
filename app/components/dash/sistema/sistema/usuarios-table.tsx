"use client";

import { useGetUsersQuery } from "@/redux/features/auth/userApiSlice";
import { DataTable, StatusBadge } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/redux/features/auth/userApiSlice";
import Link from "next/link";
import { Edit2Icon, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ButtonLink from "@/app/components/control-escolar/link-button";

const PAGE_SIZE = 10;

export default function UsuariosTable() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const ref = searchParams.get("ref") ?? "";

  const { data: users, isLoading } = useGetUsersQuery({
    q: search,
    page,
  });

  const columns: ColumnDef<User>[] = [
    {
      id: "nombre",
      header: "Nombre completo",
      cell: ({ row }) => (
        <p className="text-sm font-medium text-gray-900">
          {row.original.nombre} {row.original.apellido_paterno}{" "}
          {row.original.apellido_materno}
        </p>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.email}</span>
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
          <Link
            href={`/dashboard/sistema/usuarios/${row.original.uuid}/usuario?ref=${ref}`}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit2Icon className="w-4 h-4 text-gray-500" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Administra los usuarios del sistema
          </p>
        </div>
        <ButtonLink
          path="/dashboard/sistema/usuarios/add"
          title="+ Nuevo Usuario"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-[#0056D2]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {users?.count ?? "—"}
            </p>
            <p className="text-xs text-gray-500">Total usuarios</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-gray-500">#</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.ceil((users?.count ?? 0) / PAGE_SIZE)}
            </p>
            <p className="text-xs text-gray-500">Páginas totales</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={users?.results ?? []}
        isLoading={isLoading}
        count={users?.count ?? 0}
        pageSize={PAGE_SIZE}
        filters={[
          {
            type: "search",
            key: "search",
            placeholder: "Buscar por nombre o email...",
          },
        ]}
        emptyIcon={Users}
        emptyMessage="No se encontraron usuarios"
      />
    </div>
  );
}