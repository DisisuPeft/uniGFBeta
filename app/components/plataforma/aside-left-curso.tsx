"use client";

import { IconChevronUp } from "./iconst";
import { useState } from "react";
import Link from "next/link";
import { useProgramaEstudianteQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { useGetMisClasesQuery } from "@/redux/features/control-escolar/comunidadApiSlice";
import { useParams } from "next/navigation";
import { ExternalLink, Video, MessageCircle, FolderOpen } from "lucide-react";

export default function AsideCurso({ id, slug }: { id: string; slug: string }) {
  const { data: inscripcion } = useProgramaEstudianteQuery(id);
  const { data: misClases } = useGetMisClasesQuery();
  const [sidebarSeccion, setSidebarSeccion] = useState<
    "material" | "clases" | "grades" | "notes"
  >("material");
  const params = useParams();
  const moduloId = Number(params.id);
  return (
    <>
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 min-h-[calc(100vh-56px)] overflow-y-auto bg-white">
        {/* University logo + course name */}
        <div className="p-5 border-b border-gray-200">
          <div className="w-16 h-16 bg-[#0056D2] rounded-lg flex items-center justify-center mb-3">
            <span className="text-white text-2xl font-bold"></span>
          </div>
          <h2 className="font-bold text-gray-900 text-sm leading-snug">
            {slug} en {inscripcion?.nombre}
          </h2>
          <p className="text-xs text-[#0056D2] mt-0.5">
            {inscripcion?.institucion_nombre}
          </p>
        </div>

        {/* Navigation sections */}
        <div className="px-4 py-3">
          <button
            onClick={() => setSidebarSeccion("material")}
            className={`flex items-center gap-2 text-sm font-semibold w-full text-left mb-3 ${
              sidebarSeccion === "material"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <IconChevronUp
              className={`w-4 h-4 transition-transform ${sidebarSeccion === "material" ? "" : "rotate-180"}`}
            />
            Material del Curso
          </button>

          {sidebarSeccion === "material" && (
            <div className="space-y-0.5">
              {inscripcion?.modulos_obj.map((modulo) => {
                // setModuloActivo(modulo.id);
                return (
                  <Link
                    key={modulo.id}
                    href={`/plataforma/${slug}/${id}/modulo/${modulo.id}`}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-colors ${
                      moduloId === modulo.id
                        ? "bg-white font-medium text-gray-900 border-l-3 border-[#0056D2] -ml-px pl-[11px]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{modulo.nombre}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Clases en vivo */}
        <div className="px-4 border-t border-gray-200 py-3">
          <button
            onClick={() => setSidebarSeccion("clases")}
            className={`flex items-center gap-2 text-sm font-semibold w-full text-left mb-3 ${
              sidebarSeccion === "clases"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <IconChevronUp
              className={`w-4 h-4 transition-transform ${sidebarSeccion === "clases" ? "" : "rotate-180"}`}
            />
            Clases en Vivo
          </button>

          {sidebarSeccion === "clases" && (
            <div className="space-y-1">
              {!misClases?.length && (
                <p className="text-xs text-gray-800 px-3 font-bold">
                  No hay clases programadas.
                </p>
              )}
              {misClases?.map((clase) => (
                <a
                  key={clase.id}
                  href={clase.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 px-3 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Video className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#0056D2]" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-gray-800">
                      {clase.titulo}
                    </p>
                    <p className="text-xs text-gray-400">
                      {clase.plataforma_detail?.nombre ?? "Plataforma"} ·{" "}
                      {new Date(clase.fecha_imparticion).toLocaleDateString(
                        "es-MX",
                        { day: "numeric", month: "short" },
                      )}
                    </p>
                  </div>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 text-gray-400 mt-1" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Comentarios */}
        <div className="px-4 border-t border-gray-200 py-3">
          <Link
            href={`/plataforma/${slug}/${id}/comentarios`}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Comentarios
          </Link>
        </div>

        {/* Archivos del programa */}
        <div className="px-4 border-t border-gray-200 py-3">
          <Link
            href={`/plataforma/${slug}/${id}/archivos`}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Archivos
          </Link>
        </div>

        {/* Grades & Notes */}
        {/* <div className="px-4 border-t border-gray-200 py-3 space-y-1">
          <button
            onClick={() => setSidebarSeccion("grades")}
            className={`w-full text-left text-sm font-semibold py-2 px-3 rounded-md transition-colors ${
              sidebarSeccion === "grades"
                ? "text-gray-900 bg-gray-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Calificaciones
          </button>
          <button
            onClick={() => setSidebarSeccion("notes")}
            className={`w-full text-left text-sm font-semibold py-2 px-3 rounded-md transition-colors ${
              sidebarSeccion === "notes"
                ? "text-gray-900 bg-gray-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Notas
          </button>
        </div> */}
      </aside>
    </>
  );
}
