"use client";

import { ProgramaEducativoDetail } from "@/redux/features/types/control-escolar/type";
import { useState } from "react";
import { IconChevronDown } from "./iconst";

export default function TabClases({
  tipo,
  claseActiva,
  onSelectClase,
  programa,
}: {
  tipo?: string;
  claseActiva: number | null;
  onSelectClase: (id: number) => void;
  programa: ProgramaEducativoDetail | undefined;
}) {
  const [modulosAbiertos, setModulosAbiertos] = useState<number[]>([]);

  function toggleModulo(id: number) {
    setModulosAbiertos((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  //   const totalClases = modulosData.reduce((acc, m) => acc + m.clases.length, 0);
  //   const clasesCompletadas = modulosData.reduce(
  //     (acc, m) => acc + m.clases.filter((c) => c.completada).length,
  //     0,
  //   );

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-6 w-full">
      {/* Sidebar de modulos */}
      <div className="lg:w-80 xl:w-full flex-shrink-0">
        {/* Progreso global */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-700">Progreso del {tipo}</span>
            <span className="text-sm font-bold text-blue-600">
              {/* {cursoDetalle.progreso}% */}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${0}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {/* {clasesCompletadas} de {totalClases} clases completadas */}
          </p>
        </div>

        {/* Lista de modulos */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {programa?.modulos_obj.map((modulo) => {
            const abierto = modulosAbiertos.includes(modulo.id);
            // const clasesModuloCompletadas = programa.modulos_obj.filter(
            //   (c) => c.,
            // ).length;

            return (
              <div key={modulo.id}>
                <button
                  onClick={() => toggleModulo(modulo.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100`}
                  >
                    {/* {modulo.completado ? (
                      <IconCheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <span
                        className={`text-xs font-bold ${clasesModuloCompletadas > 0 ? "text-blue-600" : "text-gray-400"}`}
                      >
                        {modulo.id}
                      </span>
                    )} */}
                    <span className={`text-xs font-bold ${"text-gray-400"}`}>
                      {modulo.id}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {modulo.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {/* {clasesModuloCompletadas}/{modulo.clases.length} clases */}
                    </p>
                  </div>
                  <IconChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${abierto ? "rotate-180" : ""}`}
                  />
                </button>

                {abierto && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {modulo?.submodulos.map((submodulo) => (
                      <button
                        key={submodulo.id}
                        onClick={() => onSelectClase(submodulo.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 pl-8 text-left transition-colors ${
                          claseActiva === submodulo.id
                            ? "bg-blue-50 border-l-3 border-blue-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {/* {clase.completada ? (
                          <IconCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : clase.tipo === "video" ? (
                          <IconPlayCircle
                            className={`w-5 h-5 flex-shrink-0 ${claseActiva === clase.id ? "text-blue-600" : "text-gray-400"}`}
                          />
                        ) : clase.tipo === "quiz" ? (
                          <IconClipboard
                            className={`w-5 h-5 flex-shrink-0 ${claseActiva === clase.id ? "text-blue-600" : "text-gray-400"}`}
                          />
                        ) : (
                          <IconCode
                            className={`w-5 h-5 flex-shrink-0 ${claseActiva === clase.id ? "text-blue-600" : "text-gray-400"}`}
                          />
                        )} */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${claseActiva === submodulo.id ? "text-blue-700 font-medium" : "text-gray-700"}`}
                          >
                            {submodulo.titulo}
                          </p>
                          <p className="text-xs text-gray-400">
                            {/* {submodulo.duracion} */}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
