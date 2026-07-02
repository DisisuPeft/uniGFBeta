"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import Link from "next/link";
import { DynamicIcon } from "@/app/ui/icon/dynamic-icon";

export default function ModulosGrid() {
  const { data: user } = useRetrieveUserQuery();
  return (
    <div className="flex flex-wrap justify-center gap-24 py-5 max-w-7xl mx-auto">
      {user?.modulos_accesibles?.map((m) => (
        <Link
          key={m.uuid}
          className="relative group block w-[365px] h-[300px] shrink-0 rounded-[32px] overflow-hidden transition-all duration-300 hover:-translate-y-1"
          href={{ pathname: m.href, query: { ref: m.uuid } }}
        >
          {/* Fondo desvaneciéndose hacia el fondo de la página (blanco) para que la flecha se funda */}
          <div className="absolute inset-0 transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-gray-200 to-white" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 p-6 text-[#1c2634]">
            {/* Ícono gigante con relleno real tipo Duotono */}
            <div className="relative flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                 <DynamicIcon 
                   iconName={(m.nombre === "Capactiación" || m.nombre === "Capacitación") ? "book-open" : m.icon} 
                 />
            </div>
            {/* Texto centrado */}
            <h3 className="text-3xl font-bold leading-tight text-center tracking-tight drop-shadow-sm px-2">
              {m.nombre}
            </h3>
          </div>

          {/* Cutout area en la esquina inferior derecha (Fondo blanco de la página) */}
          <div className="absolute bottom-0 right-0 bg-white w-[88px] h-[88px] rounded-tl-[32px] flex items-end justify-end p-2 z-20 transition-colors duration-300">
            
            <svg className="absolute -top-6 right-0 w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 24H24V0C24 13.2548 13.2548 24 0 24Z" />
            </svg>
            
            <svg className="absolute bottom-0 -left-6 w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 24H24V0C24 13.2548 13.2548 24 0 24Z" />
            </svg>

            {/* Botón circular de acción: Gris al inicio, Azul marino en hover */}
            <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-[#1c2634] text-gray-400 group-hover:text-white flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md">
              <svg className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 19L19 5M19 5v10M19 5H9" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
