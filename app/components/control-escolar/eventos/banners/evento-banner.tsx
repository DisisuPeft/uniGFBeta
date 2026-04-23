"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  IconCalendar,
  IconX,
  IconPlay,
} from "@/app/components/plataforma/iconst";
import Link from "next/link";
import { EventoShowInterface } from "@/redux/features/types/control-escolar/type";
// import { useState } from "react";

interface BannerEvento {
  onClose?: () => void;
  eventos: EventoShowInterface[];
  showClose?: boolean;
}

export function BannerEvento({ onClose, showClose, eventos }: BannerEvento) {
  return (
    <div className="bg-[#F0F8F4] border border-[#A8D5B8] rounded-lg p-4 relative">
      {eventos.map((evento) => {
        const fecha = new Date(evento.fecha_inicio);
        return (
          <div className="flex gap-3 items-start" key={evento.nombre}>
            {/* Ícono */}
            <div className="flex-shrink-0 w-9 h-9 bg-[#D6EFE1] rounded-lg flex items-center justify-center mt-0.5">
              <IconCalendar className="w-[18px] h-[18px] text-[#1B7A42]" />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-[#1B7A42] text-[#F0F8F4] text-[16px] font-medium px-2 py-0.5 rounded-full tracking-wide">
                  {evento.tipo}
                </span>
                <span className="text-medium text-[#2E7D52] font-medium">
                  {format(fecha, "EEEE d 'de' MMMM · h:mm a", { locale: es })}
                </span>
              </div>

              <h3 className="text-sm font-medium text-gray-900 mb-0.5 leading-snug">
                {evento.nombre}
              </h3>

              <p className="text-sm text-gray-500 mb-2.5">
                {evento.descripcion}
              </p>

              <Link
                href={evento.ubicacion}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B7A42] border border-[#1B7A42] px-3 py-1 rounded-full hover:bg-[#D6EFE1] transition-colors"
              >
                <IconPlay className="w-3.5 h-3.5" />
                Unirse al Zoom
              </Link>
            </div>

            {/* Cerrar */}
            {showClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <IconX className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
