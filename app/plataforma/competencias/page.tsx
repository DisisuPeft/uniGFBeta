"use client";

import { useState } from "react";
import { Clock, Shield, BarChart, Users, CheckCircle, Award, ArrowRight, Play, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CompetenciasPage() {
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>("todos");

  // Competencias estáticas de ejemplo
  const competencias = [
    {
      id: "analisis",
      nombre: "Análisis de Datos",
      descripcion: "Habilidad para recopilar, procesar e interpretar información cuantitativa.",
      cursosCount: 2,
      completados: 1,
      color: "text-[#0056D2] bg-blue-50 border-blue-100",
      progress: 50,
      icon: BarChart
    },
    {
      id: "seguridad",
      nombre: "Seguridad e Higiene Industrial",
      descripcion: "Prevención de riesgos laborales y normativas de salud e higiene en planta.",
      cursosCount: 1,
      completados: 0,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      progress: 0,
      icon: Shield
    },
    {
      id: "liderazgo",
      nombre: "Liderazgo y Gestión",
      descripcion: "Coordinación de equipos de trabajo, toma de decisiones y comunicación efectiva.",
      cursosCount: 1,
      completados: 1,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      progress: 100,
      icon: Users
    }
  ];

  // Cursos mock asociados a las competencias
  const cursosMock = [
    {
      id: 1,
      titulo: "Analista de datos",
      descripcion: "Aprende a recopilar y analizar la información de las empresas para tomar decisiones basadas en datos.",
      imagen: "/assets/Fotos de Curso/Analista.png",
      duracion: "60h 00m",
      progreso: 50,
      estado: "En progreso",
      competenciaId: "analisis",
      competenciaNombre: "Análisis de Datos"
    },
    {
      id: 2,
      titulo: "Introducción a SQL y Base de Datos",
      descripcion: "Fundamentos de bases de datos relacionales y consultas estructuradas SQL para perfiles técnicos.",
      imagen: "/assets/vista-cursos.jpg",
      duracion: "24h 00m",
      progreso: 100,
      estado: "Completado",
      competenciaId: "analisis",
      competenciaNombre: "Análisis de Datos"
    },
    {
      id: 3,
      titulo: "Seguridad e Higiene Industrial",
      descripcion: "Protocolos básicos de prevención de riesgos y respuesta ante emergencias industriales en el sector.",
      imagen: "/assets/place2.jpg",
      duracion: "30h 00m",
      progreso: 0,
      estado: "No iniciado",
      competenciaId: "seguridad",
      competenciaNombre: "Seguridad e Higiene"
    },
    {
      id: 4,
      titulo: "Liderazgo de Equipos de Alto Rendimiento",
      descripcion: "Técnicas de motivación, coaching, delegación de tareas y comunicación asertiva para líderes.",
      imagen: "/assets/plataforma-img.png",
      duracion: "40h 00m",
      progreso: 100,
      estado: "Completado",
      competenciaId: "liderazgo",
      competenciaNombre: "Liderazgo y Gestión"
    }
  ];

  const filteredCursos = selectedCompetencia === "todos"
    ? cursosMock
    : cursosMock.filter(c => c.competenciaId === selectedCompetencia);

  return (
    <div className="mx-auto px-12 py-8 relative">
      {/* Wave decorativo de fondo */}
      <div className="absolute top-0 left-0 right-0 h-44 overflow-hidden pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 220" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C320,80 720,20 1080,70 C1280,100 1380,140 1440,160 L1440,0 L0,0 Z" fill="#f0f4ff" opacity="0.4" />
          <path d="M0,0 C240,40 640,0 960,35 C1160,55 1320,110 1440,140 L1440,0 L0,0 Z" fill="#eff6ff" opacity="0.6" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Competencias de mi perfil
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Monitorea los cursos y programas de formación diseñados para fortalecer las competencias de tu puesto.
          </p>
        </div>

        {/* Fila de Tarjetas de Competencias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {competencias.map((comp) => {
            const Icon = comp.icon;
            const isSelected = selectedCompetencia === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => setSelectedCompetencia(isSelected ? "todos" : comp.id)}
                className={`bg-white border rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                  isSelected 
                    ? "border-[#0056D2] ring-2 ring-[#0056D2]/10" 
                    : "border-slate-100"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${comp.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-55/60 px-2.5 py-1 rounded-lg">
                    {comp.cursosCount} cursos
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  {comp.nombre}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {comp.descripcion}
                </p>

                {/* Progreso */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                    <span>Avance</span>
                    <span className={comp.progress === 100 ? "text-emerald-600" : "text-[#0056D2]"}>
                      {comp.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        comp.progress === 100 ? "bg-emerald-500" : "bg-[#0056D2]"
                      }`}
                      style={{ width: `${comp.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección de Cursos Asociados */}
        <div className="border-t border-slate-100 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              {selectedCompetencia === "todos" 
                ? "Todos los cursos de mi perfil" 
                : `Cursos asociados a: ${competencias.find(c => c.id === selectedCompetencia)?.nombre}`}
            </h2>
            {selectedCompetencia !== "todos" && (
              <button
                onClick={() => setSelectedCompetencia("todos")}
                className="text-xs font-bold text-[#0056D2] hover:underline"
              >
                Mostrar todos
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCursos.map((curso) => (
              <div
                key={curso.id}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col hover:shadow-md hover:border-slate-200 transition-all duration-300 h-full group"
              >
                {/* Imagen */}
                <div className="relative h-44 flex-shrink-0 overflow-hidden bg-slate-50">
                  <img
                    src={curso.imagen}
                    alt={curso.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge de Estado */}
                  <span className={`absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-lg text-white ${
                    curso.estado === "Completado" 
                      ? "bg-[#10b981]" 
                      : curso.estado === "En progreso"
                      ? "bg-[#0056D2]"
                      : "bg-slate-400"
                  }`}>
                    {curso.estado.toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      {curso.competenciaNombre}
                    </span>
                    <h3 className="font-bold text-gray-900 text-[15px] line-clamp-2 leading-snug">
                      {curso.titulo}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {curso.descripcion}
                    </p>
                  </div>

                  {/* Pie de tarjeta */}
                  <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-350" />
                      {curso.duracion}
                    </span>

                    <div>
                      {curso.estado === "Completado" ? (
                        <Link
                          href={`/plataforma/curso/${curso.id}`}
                          className="px-4 py-1.5 text-xs font-bold rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                        >
                          Ver curso
                        </Link>
                      ) : curso.estado === "En progreso" ? (
                        <Link
                          href={`/plataforma/curso/${curso.id}`}
                          className="px-4 py-1.5 text-xs font-bold rounded-2xl border border-blue-100 bg-blue-50 text-[#0056D2] hover:bg-[#0056D2] hover:text-white transition-all flex items-center justify-center"
                        >
                          Continuar
                        </Link>
                      ) : (
                        <button
                          className="px-4 py-1.5 text-xs font-bold rounded-2xl border border-slate-200 bg-slate-50 text-slate-550 hover:bg-slate-100 hover:text-slate-700 transition-all flex items-center justify-center"
                        >
                          Iniciar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
