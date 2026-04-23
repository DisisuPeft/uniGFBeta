"use client";

import { useState } from "react";
import { useInscriptionAlumnoDetailQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { IconStarOutline, IconDots } from "./iconst";
import Link from "next/link";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { useMyCalender } from "@/hooks";
import CalenderStudent from "./calender";

export default function MainEducationDash() {
  const [tabCursos, setTabCursos] = useState<"progreso" | "completados">(
    "progreso",
  );

  const { data: detalleInscripcion } = useInscriptionAlumnoDetailQuery();
  const { data: user } = useRetrieveUserQuery();
  const [filtro, setFiltro] = useState<"todos" | "progreso" | "completados">(
    "todos",
  );

  //   const cursosFiltrados = cursosData.filter((curso) => {
  //     if (filtro === "progreso") return curso.progreso < 100;
  //     if (filtro === "completados") return curso.progreso === 100;
  //     return true;
  //   });

  // useEffect(() => {});

  return (
    <div className="mx-auto px-12 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-14 h-14 rounded-full bg-[#0056D2] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          D
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hola, {user?.nombre_completo}
          </h1>
          <p className="text-sm text-gray-600">
            Tu meta profesional es{" "}
            <span className="font-semibold text-gray-900">
              {/* {perfilData.metaCarrera} */}
            </span>
            <button className="text-[#0056D2] text-sm font-medium ml-2 hover:text-[#004BB5] transition-colors">
              Editar meta
            </button>
          </p>
        </div>
      </div>

      {/* Role suggestion banner */}
      <div className="bg-gray-50 rounded-lg px-5 py-3 flex items-center gap-3 mt-4 mb-8 border border-gray-200">
        <div className="w-8 h-8 rounded-full bg-[#0056D2] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <p className="text-sm text-gray-700 flex-1">
          Comencemos! En que roles estas interesado?
        </p>
        <button className="text-[#0056D2] text-sm font-medium hover:text-[#004BB5] transition-colors whitespace-nowrap">
          Seleccionar rol
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar: Goals + Calendar */}
        <div className="lg:w-[340px] flex-shrink-0 space-y-6">
          {/* Today's goals */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white">
            <h3 className="font-bold text-gray-900 mb-4">Metas de hoy</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <IconStarOutline className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Completar un modulo
                </span>
              </div>
            </div>
          </div>

          {/* Learning plan / Calendar */}
          <CalenderStudent />
        </div>

        {/* Right: Courses */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6">
            <button
              onClick={() => setTabCursos("progreso")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                tabCursos === "progreso"
                  ? "bg-[#0056D2] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              En Progreso
            </button>
            <button
              onClick={() => setTabCursos("completados")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                tabCursos === "completados"
                  ? "bg-[#0056D2] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Completados
            </button>
          </div>

          {/* Course cards */}
          <div className="space-y-4">
            {tabCursos === "progreso" &&
              detalleInscripcion?.programasInscritos.map((curso) => (
                <div
                  key={curso.ref}
                  className="border border-gray-200 rounded-lg bg-white p-5 flex flex-col lg:flex-row gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                      <span className="w-4 h-4 bg-sky-200 rounded-sm flex-shrink-0"></span>
                      {curso?.modulos.length}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {curso.nombre}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{curso.tipo}</p>

                    <div className="w-full max-w-sm bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        // style={{
                        //   width: `${curso?.modulos.length}%`,
                        //   backgroundColor: curso.colorBarra,
                        // }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 lg:flex-shrink-0">
                    <div className="hidden lg:block text-right mr-2">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                        {/* {curso.proximaActividad} */}
                      </p>
                      {/* <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                        {curso.proximaTipo.includes("Video") ? (
                          <IconPlay className="w-3 h-3" />
                        ) : (
                          <IconDocument className="w-3 h-3" />
                        )}
                        {curso.proximaTipo}
                      </p> */}
                    </div>
                    <Link
                      href={`/plataforma/${curso.tipo}/${curso.ref}`}
                      className="bg-[#0056D2] text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#004BB5] transition-colors whitespace-nowrap"
                    >
                      Reanudar
                    </Link>
                    <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
                      <IconDots className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

            {tabCursos === "completados" && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white border border-gray-200 rounded-lg">
                {/* Icono de certificado/medalla */}
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Aún no has completado ningún programa
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Continúa aprendiendo y alcanza tus metas. Tus certificados
                  aparecerán aquí cuando completes los programas.
                </p>

                {/* Estadística motivacional */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>¡Sigue adelante! Cada paso cuenta</span>
                </div>

                {/* Botón de acción */}
                <button
                  onClick={() => setTabCursos("progreso")}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver cursos activos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
