import Link from "next/link";
import {
  IconChevronRight,
  IconChevronLeft,
  IconPencil,
  IconCalendar,
  IconPlay,
} from "./iconst";
import { useMyCalender } from "@/hooks";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function CalenderStudent() {
  // Calendar data
  const {
    mesAnterior,
    mesSiguiente,
    esDiaActual,
    nombreMes,
    diasMes,
    dia,
    obtenerEventosDia,
  } = useMyCalender();

  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white">
      <h3 className="font-bold text-gray-900 mb-3">Calendario</h3>

      <div className="flex items-center gap-2 mb-4">
        {["D", "L", "M", "X", "J", "V", "S"].map((d, i) => (
          <div
            key={d + i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
              i === dia ? "bg-[#0056D2] text-white" : "text-gray-500"
            }`}
          >
            {d}
          </div>
        ))}
        <button className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
          <IconPencil className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 capitalize">
          {nombreMes}
        </h4>
        <div className="flex items-center gap-1">
          <button
            onClick={mesAnterior}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={mesSiguiente}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IconChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
          <div
            key={d}
            className="text-center text-xs text-gray-500 font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>
      {/* grid fechas */}
      {diasMes.map((semana, si) => (
        <div key={si} className="grid grid-cols-7 gap-0">
          {semana.map((dia, di) => {
            const eventosDelDia = obtenerEventosDia(dia); // 👈
            return (
              <div
                key={di}
                className={`relative text-center py-1.5 text-sm ${
                  dia === 0
                    ? ""
                    : esDiaActual(dia)
                      ? "font-bold"
                      : dia === 17
                        ? "text-[#6B21A8]"
                        : "text-gray-700"
                }`}
              >
                {esDiaActual(dia) ? (
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold ${
                      eventosDelDia.length > 0
                        ? "border-[#1B7A42] text-[#1B7A42]"
                        : "border-[#0056D2] text-[#0056D2]"
                    }`}
                  >
                    {dia}
                  </span>
                ) : dia > 0 ? (
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      eventosDelDia.length > 0
                        ? "bg-[#D6EFE1] text-[#1B7A42] font-medium"
                        : ""
                    }`}
                  >
                    {dia}
                  </span>
                ) : (
                  ""
                )}

                {/* Punto de evento */}
                {eventosDelDia.length > 0 && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1B7A42]" />
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Legend */}
      {obtenerEventosDia(new Date().getDate()).map((evento) => {
        console.log(evento);
        return (
          <div
            key={evento.nombre}
            className="mt-3 bg-[#F0F8F4] border border-[#A8D5B8] rounded-lg px-3 py-2 flex items-center gap-2 min-w-0 overflow-hidden"
          >
            <div className="flex-shrink-0 w-7 h-7 bg-[#D6EFE1] rounded-md flex items-center justify-center">
              <IconCalendar className="w-3.5 h-3.5 text-[#1B7A42]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">
                {evento.nombre}
              </p>
              <p className="text-[11px] text-[#2E7D52] truncate">
                {" "}
                {/* 👈 truncate aquí */}
                {format(new Date(evento.fecha_inicio), "h:mm a", {
                  locale: es,
                })}
                {" · "}
                {evento.descripcion}
              </p>
            </div>
            <Link
              href={evento.ubicacion}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <IconPlay className="w-4 h-4 text-[#1B7A42]" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
