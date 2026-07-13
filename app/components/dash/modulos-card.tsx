"use client";

import {
  useRetrieveUserQuery,
  useLogoutMutation,
} from "@/redux/features/auth/authApiSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, HelpCircle, LogOut, ArrowUpRight } from "lucide-react";
import { TbBook, TbSettings } from "react-icons/tb";
import type { ElementType } from "react";
const MODULE_THEMES: Record<
  string,
  { bgBlob: string; iconColor: string; iconBg: string; icon: ElementType }
> = {
  capacitacion: {
    bgBlob: "from-blue-400/20 to-indigo-500/10",
    iconColor: "text-[#0056D2]",
    iconBg:
      "bg-blue-50/85 border-blue-100/50 shadow-[0_8px_20px_-4px_rgba(37,99,235,0.06)]",
    icon: TbBook,
  },
  configuracion: {
    bgBlob: "from-teal-400/20 to-emerald-500/10",
    iconColor: "text-[#0d9488]",
    iconBg:
      "bg-teal-50/85 border-teal-100/50 shadow-[0_8px_20px_-4px_rgba(13,148,136,0.06)]",
    icon: TbSettings,
  },
};

export default function ModulosGrid() {
  const { data: user } = useRetrieveUserQuery();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const nombre = user?.nombre_completo?.split(" ")[0] ?? "Mary";

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="flex -m-6 h-[calc(100vh-56px)] bg-white overflow-hidden select-none">
      {/* Sidebar de navegación interna */}
      <div className="w-[88px] flex flex-col justify-between items-center py-8 border-r border-gray-100 bg-white shrink-0 h-full">
        {/* Home active icon */}
        <div className="w-12 h-12 rounded-2xl bg-blue-50/80 flex items-center justify-center text-blue-600 border border-blue-100/30">
          <Home className="w-5 h-5" />
        </div>

        {/* Bottom items */}
        <div className="flex flex-col gap-5">
          <button
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            title="Ayuda"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Área de Contenido Principal */}
      <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center items-center relative overflow-y-auto h-full bg-[#f8fafc]">
        {/* Fondo de Olas Vectoriales Limpias (Iguales al diseño en azul) */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 800"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="waveBlueOnly"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.02" />
                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.10" />
                <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>

              {/* Degradado vertical de arriba a abajo para el desvanecido de fondo */}
              <linearGradient id="fadeBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.6" />
                <stop offset="35%" stopColor="#eff6ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fcfdfe" />
                <stop offset="50%" stopColor="#f5f8fc" />
                <stop offset="100%" stopColor="#edf3fa" />
              </linearGradient>
            </defs>

            {/* Base Background */}
            <rect width="1440" height="800" fill="url(#bgGrad)" />

            {/* Forma de ola rellena con degradado desvanecido (desde arriba) */}
            <path
              d="M-100,0 L-100,280 C200,380 600,160 900,280 C1200,400 1300,240 1600,320 L1600,0 Z"
              fill="url(#fadeBlue)"
            />

            {/* Brillos radiales sutiles */}
            <circle
              cx="200"
              cy="200"
              r="250"
              fill="#3b82f6"
              fillOpacity="0.02"
              filter="blur(70px)"
            />
            <circle
              cx="1200"
              cy="600"
              r="300"
              fill="#10b981"
              fillOpacity="0.01"
              filter="blur(90px)"
            />
          </svg>
        </div>

        {/* Saludo de Bienvenida */}
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-4xl lg:text-[44px] font-bold text-[#1c2634] tracking-tight mb-3">
            ¡Bienvenida, {nombre}!
          </h1>
          <p className="text-slate-500 text-base lg:text-lg max-w-md mx-auto leading-relaxed">
            Selecciona una opción para administrar la plataforma.
          </p>
        </div>

        {/* Grilla de Módulos */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-10 lg:gap-12 relative z-10 w-full max-w-5xl">
          {user?.modulos_accesibles?.map((m) => {
            const theme = MODULE_THEMES[m.slug] ?? MODULE_THEMES.configuracion;
            // console.log(theme);
            const IconComponent = theme.icon;

            return (
              <Link
                key={m.uuid}
                href={{ pathname: m.href, query: { ref: m.uuid } }}
                className="relative group bg-white border border-gray-100/60 rounded-[36px] p-10 w-full max-w-[380px] h-[380px] flex flex-col items-center justify-between shadow-[0_15px_35px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500"
              >
                {/* Contenido superior de la tarjeta */}
                <div className="flex flex-col items-center mt-4 w-full relative">
                  {/* Contenedor del Icono y Decoraciones */}
                  <div className="relative flex items-center justify-center mb-8">
                    {/* Blob de brillo de fondo oblicuo/alargado */}
                    <div
                      className={`absolute w-44 h-16 rounded-full blur-xl bg-gradient-to-r ${theme.bgBlob} opacity-80 -left-10 top-4 -rotate-[18deg] z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500`}
                    />

                    {/* Círculo del Icono (Redondo, con fondo claro) */}
                    <div
                      className={`w-28 h-28 rounded-full flex items-center justify-center border z-10 group-hover:scale-105 transition-transform duration-500 relative ${theme.iconBg}`}
                    >
                      <IconComponent
                        size={52}
                        className={theme.iconColor}
                        strokeWidth={1.0}
                      />
                    </div>
                  </div>

                  {/* Título del módulo */}
                  <h2 className="text-[#1c2634] text-[24px] font-bold tracking-tight mb-3 text-center">
                    {m.nombre}
                  </h2>

                  {/* Descripción del módulo */}
                  <p className="text-slate-500 text-[15px] leading-relaxed text-center px-4 max-w-[290px]">
                    {m.desc}
                  </p>
                </div>

                {/* Botón de flecha flotante en la esquina inferior derecha */}
                <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-[#f0f4ff] text-[#0056D2] flex items-center justify-center group-hover:bg-[#1c2634] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <ArrowUpRight
                    className="w-5.5 h-5.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                    strokeWidth={2.5}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
