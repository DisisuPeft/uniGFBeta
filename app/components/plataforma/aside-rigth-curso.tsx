"use client";

// import { useMyCalender } from "@/hooks";
import { useState } from "react";
import Link from "next/link";
import { useProgramaEstudianteQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { IconMapPin, IconCalendarEnd } from "./iconst";
import CalenderStudent from "./calender";

export default function AsideRigthCurso({
  id,
  slug,
}: {
  id: string;
  slug: string;
}) {
  // const { data: inscripcion } = useProgramaEstudianteQuery(id);

  return (
    <>
      <aside className="w-72 flex-shrink-0 min-h-[calc(100vh-56px)] overflow-y-auto bg-white hidden xl:block">
        <div className="p-5 space-y-6">
          {/* Learning plan */}
          <CalenderStudent />

          {/* Course timeline */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">
              Cronograma del curso
            </h3>

            {/* Status */}
            <div className="bg-[#F0F6FF] rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-0.5">
                Vas bien!
              </p>
              <p className="text-xs text-[#0056D2] leading-relaxed">
                Estas progresando muy bien. Mantiene el ritmo y alcanzaras tus
                plazos.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative pl-6">
              {/* Vertical dotted line */}
              <div className="absolute left-2 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-300"></div>

              {/* Start date */}
              <div className="relative mb-5">
                <div className="absolute -left-4 top-0.5">
                  <IconMapPin className="w-4 h-4 text-gray-400" />
                </div>
                {/* <p className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-900">
                      Fecha inicio:
                    </span>{" "}
                    Enero 7, 2025
                  </p> */}
              </div>

              {/* Deadlines header */}
              <p className="text-xs font-semibold text-gray-500 mb-3">
                Tus proximos plazos
              </p>

              {/* Deadline items */}
              {/* {deadlines.map((dl, i) => (
                  <div key={i} className="relative mb-4">
                    <div className="absolute -left-4 top-0.5 w-3 h-3 rounded-full border-2 border-gray-300 bg-white"></div>
                    <button className="text-[#0056D2] text-xs font-medium hover:text-[#004BB5] underline transition-colors block mb-1">
                      {dl.titulo}
                    </button>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${dl.esUrgente ? "text-red-600" : "text-[#0056D2]"}`}
                      >
                        {dl.urgencia}
                      </span>
                      <span className="text-xs text-gray-500">{dl.tipo}</span>
                    </div>
                  </div>
                ))} */}

              {/* End date */}
              <div className="relative mt-5">
                <div className="absolute -left-4 top-0.5">
                  <IconCalendarEnd className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-900">
                    Fecha estimada:
                  </span>{" "}
                  Marzo 6, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
