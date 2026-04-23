"use client";

import { useState } from "react";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
// import { useInscriptionAlumnoDetailQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { IconPencil, IconX, IconStarOutline, IconInfo } from "./iconst";
import CalenderStudent from "./calender";
import { useGetEventosQuery } from "@/redux/features/control-escolar/eventosApiSlice";
import { BannerEvento } from "../control-escolar/eventos/banners/evento-banner";
// import {useGetEventosQuery}
// interface Props {
//   inscription: InscriptionDetail | undefined;
//   isLoading?: boolean;
// }

export default function Dashboard() {
  const [mostrarBanner, setMostrarBanner] = useState(true);
  const [mostrarRoles, setMostrarRoles] = useState(true);
  const [eventoBanner, setEventoBanner] = useState(true);
  // const [habilidadActiva, setHabilidadActiva] = useState("Todos");
  const { data: user } = useRetrieveUserQuery();
  const { data: eventos, isLoading } = useGetEventosQuery();
  // console.log(inscription?.programasInscritos);
  // const { data: inscription, isLoading } = useInscriptionAlumnoDetailQuery();
  return (
    <div className="max-w-9xl mx-auto px-12 py-8">
      {/* Welcome + Banner row */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Welcome + Goals + Weekly */}
        <div className="lg:w-[380px] flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Bienvenido, {user?.nombre_completo}
          </h1>
          <p className="text-gray-600 mb-6">
            Tu meta es{" "}
            <button className="text-[#0056D2] underline hover:text-[#004BB5] transition-colors">
              {/* {perfilData.metaCarrera} */}
            </button>
            <button className="ml-2 text-gray-400 hover:text-gray-600 transition-colors inline-flex">
              <IconPencil className="w-4 h-4" />
            </button>
          </p>

          {/* Today's goals */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">
              Metas de hoy
            </h3>
            <div className="space-y-3">
              {/* <div className="flex items-center gap-3">
                <IconStarOutline className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <button className="text-[#0056D2] underline hover:text-[#004BB5]">
                    Completar 3 elementos
                  </button>{" "}
                  · 0/3
                </span>
              </div> */}
              {/* <div className="flex items-center gap-3">
                <IconStarOutline className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Completar 3 lecturas · 0/3
                </span>
              </div> */}
              <div className="flex items-center gap-3">
                <IconStarOutline className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Completar un modulo
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            {/* Weekly activity */}
            <CalenderStudent />
          </div>
        </div>

        {/* Right: Banner + Roles */}
        <div className="flex-1 space-y-4">
          {/* Info Banner */}
          {mostrarBanner && (
            <div className="bg-[#F0F6FF] border border-[#B3D4FF] rounded-lg p-5 relative">
              <div className="flex gap-3">
                <IconInfo className="w-6 h-6 text-[#0056D2] flex-shrink-0 mt-0.5" />
                {/* <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Plataforma Educativa - Versión Beta
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Hemos lanzado nuestra plataforma educativa y trabajamos
                    constantemente en actualizaciones y mejoras.
                    <button className="text-[#0056D2] underline mx-1 hover:text-[#004BB5]">
                      Ver actualizaciones recientes
                    </button>
                    o reporta cualquier inconveniente para ayudarnos a mejorar.
                  </p>
                </div> */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    ¡Bienvenido a nuestra nueva plataforma educativa!
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Estamos emocionados de anunciar el lanzamiento oficial de
                    nuestra plataforma. Continuaremos agregando nuevas
                    funcionalidades y mejoras de forma constante para brindarte
                    la mejor experiencia de aprendizaje. ¡Gracias por ser parte
                    de esta comunidad!
                  </p>
                </div>
                <button
                  onClick={() => setMostrarBanner(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Role interests card */}
          {/* {mostrarRoles && (
            <div className="border border-gray-200 rounded-lg p-5 bg-white relative">
              <h3 className="font-semibold text-gray-900 mb-4">
                En que roles estas interesado?
              </h3>
              <div className="flex items-center gap-2 flex-wrap mb-4"> */}
          {/* {rolesInteres.map((rol) => (
                  <button
                    key={rol.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: rol.color }}
                    ></span>
                    {rol.label}
                  </button>
                ))} */}
          {/* <button className="flex items-center gap-1 px-4 py-2 text-sm text-[#0056D2] hover:text-[#004BB5] font-medium transition-colors">
                  + Ver mas
                </button>
              </div>
              <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Aplicar
              </button>
              <button
                onClick={() => setMostrarRoles(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
          )} */}

          {/* Mostrar eventos */}
          {eventos && !isLoading && (
            <BannerEvento
              eventos={eventos}
              onClose={() => setEventoBanner(false)}
              showClose={false}
            />
          )}
        </div>
      </div>

      {/* Grow your skills section */}
      <div className="mt-12">
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Desarrolla tus habilidades
          </h2>
          <button className="text-sm text-[#0056D2] font-medium hover:text-[#004BB5] transition-colors">
            Editar habilidades
          </button>
        </div>

        {/* Skill filter pills */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {/* {habilidades.map((h) => (
            <button
              key={h}
              onClick={() => setHabilidadActiva(h)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                habilidadActiva === h
                  ? "bg-[#0056D2] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {h}
            </button>
          ))} */}
        </div>

        {/* Course recommendation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* {cursosRecomendados.map((curso) => (
            <button
              key={curso.id}
              onClick={onAbrirCurso}
              className="text-left bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={curso.imagen || "/placeholder.svg"}
                  alt={curso.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  crossOrigin="anonymous"
                />
                {curso.destacado && (
                  <span className="absolute bottom-3 right-3 bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded border border-gray-200">
                    Recomendacion principal
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">
                  {curso.universidad}
                </p>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-snug">
                  {curso.titulo}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  <span className="text-gray-700 font-medium">
                    Habilidades:
                  </span>{" "}
                  {curso.habilidades}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <IconStar className="w-4 h-4 text-[#0056D2]" />
                  <span className="font-semibold text-gray-900">
                    {curso.rating}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">
                    · {curso.resenas} resenas
                  </span>
                </div>
              </div>
            </button>
          ))} */}
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            {/* Ilustración/Icono */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            {/* Título */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nuevos programas en camino
            </h3>

            {/* Descripción */}
            <p className="text-gray-600 text-center max-w-md mb-6">
              Estamos trabajando en nuevos programas educativos increíbles.
              Pronto tendrás acceso a cursos diseñados especialmente para ti.
            </p>

            {/* Badge informativo */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">
                Próximamente disponibles
              </span>
            </div>

            {/* Opciones adicionales */}
            {/* <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Notificarme
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Explorar recursos
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
