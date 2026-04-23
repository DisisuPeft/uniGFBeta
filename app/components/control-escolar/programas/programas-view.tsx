"use client";

// import { useSearchParams } from "next/navigation";
// import { ColumnDef } from "@tanstack/react-table";
// import { useRetrieveProgramasQuery } from "@/redux/features/control-escolar/programasApiSlice";
// import { ProgramaEducativo } from "@/redux/features/types/control-escolar/type";
// import { DataTable } from "@/app/utils/data-table";
// import ButtonLink from "../link-button";
import { BookOpen } from "lucide-react";

// const columns: ColumnDef<ProgramaEducativo>[] = [
//   {
//     id: "nombre",
//     header: "Nombre",
//     cell: ({ row }) => (
//       <div>
//         <p className="text-sm font-medium text-gray-900">
//           {row.original.tipo_nombre} en {row.original.nombre}
//         </p>
//       </div>
//     ),
//   },
//   {
//     id: "instituto",
//     header: "Instituto",
//     cell: ({ row }) => (
//       <span className="text-sm text-gray-600">
//         {row.original.institucion_nombre}
//       </span>
//     ),
//   },
//   {
//     id: "modalidad",
//     header: "Modalidad",
//     cell: ({ row }) => (
//       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">
//         {row.original.modalidad_nombre ?? "—"}
//       </span>
//     ),
//   },
//   {
//     id: "acciones",
//     header: "",
//     cell: ({ row }) => (
//       <div className="flex justify-end">
//         <ButtonLink
//           path={`/dashboard/control-escolar/programas/${row.original.ref}`}
//           icon="eye-icon"
//         />
//       </div>
//     ),
//   },
// ];

export default function ProgramasView() {
  // const searchParams = useSearchParams();

  // const page = Number(searchParams.get("page") ?? "1");
  // const search = searchParams.get("search") ?? "";

  // const { data: programas, isLoading } = useRetrieveProgramasQuery({
  //   page,
  //   search,
  // });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      {/* <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Programas Educativos
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona todos los programas educativos disponibles
          </p>
        </div>
        <ButtonLink
          path="/dashboard/control-escolar/programas/new"
          title="+ Nuevo Programa"
        />
      </div> */}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-[#0056D2]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {/* {programas?.count ?? "—"} */}
            </p>
            <p className="text-xs text-gray-500">Total programas</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-gray-500">#</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {/* {Math.ceil((programas?.count ?? 0) / 10)} */}
            </p>
            <p className="text-xs text-gray-500">Páginas totales</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {/* <DataTable
        columns={columns}
        data={programas?.results ?? []}
        isLoading={isLoading}
        count={programas?.count ?? 0}
        filters={[
          {
            type: "search",
            key: "search",
            placeholder: "Nombre, tipo o modalidad...",
          },
        ]}
        emptyIcon={BookOpen}
        emptyMessage="No se encontraron programas educativos"
      /> */}
    </div>
  );
}
