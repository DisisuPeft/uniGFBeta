// "use client";

// import { useState } from "react";
// import TabClases from "./tab-class";
// import {
//   IconPlayCircle,
//   IconDocument,
//   IconClipboard,
//   IconChat,
//   IconArrowLeft,
//   IconStar,
//   IconUsers,
//   IconClock,
//   IconPlay,
//   IconChevronUp,
//   IconCalendarEnd,
//   IconMapPin,
// } from "./iconst";
// import Image from "next/image";
// import Link from "next/link";
// import { useProgramaEstudianteQuery } from "@/redux/features/control-escolar/alumnosApiSlice";

// interface Props {
//   id: string;
//   tipo: string;
// }

// export default function CursoVista({ id, tipo }: Props) {
//   const { data: programa } = useProgramaEstudianteQuery(id);
//   const [moduloActivo, setModuloActivo] = useState(1);
//   const [sidebarSeccion, setSidebarSeccion] = useState<
//     "material" | "grades" | "notes"
//   >("material");

// Calculate remaining time for active module
// const videosRestantes =
//   moduloSeleccionado?.items.filter(
//     (i) => i.tipo === "video" && !i.completada,
//   ) || [];
// const lecturasRestantes =
//   moduloSeleccionado?.items.filter(
//     (i) => i.tipo === "lectura" && !i.completada,
//   ) || [];
// const minVideos = videosRestantes.reduce((acc, i) => {
//   const m = parseInt(i.duracion) || 0;
//   return acc + m;
// }, 0);
// const minLecturas = lecturasRestantes.reduce((acc, i) => {
//   const m = parseInt(i.duracion) || 0;
//   return acc + m;
// }, 0);

// return (
// <div className="bg-white">
{
  /* Course top bar */
}
{
  /* <header className="bg-white border-b border-gray-200">
        <div className="flex items-center h-14 px-4 gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar en el curso"
              className="flex-1 h-9 px-3 border border-gray-300 rounded-l-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0056D2] bg-white"
            />
            <button className="h-9 px-4 bg-[#0056D2] text-white text-sm font-semibold rounded-r-md hover:bg-[#004BB5] transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </header> */
}

{
  /* <div className="flex"> */
}
{
  /* Left Sidebar - Course Navigation */
}

{
  /* Center Content */
}
{
  /* <main className="flex-1 min-w-0 border-r border-gray-200"> */
}
{
  /* {sidebarSeccion === "material" && moduloSeleccionado && (
            <div className="max-w-2xl mx-auto px-6 py-6">
    
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-5 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <h2 className="font-bold text-gray-900 text-lg">
                      {moduloSeleccionado.label}
                    </h2>
                    <IconChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>

                  <div className="flex items-center gap-5 mt-3">
                    {minVideos > 0 && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <IconPlay className="w-4 h-4 text-gray-400" />
                        <span>
                          <span className="font-semibold text-gray-900">
                            {minVideos} min
                          </span>{" "}
                          de videos restantes
                        </span>
                      </div>
                    )}
                    {minLecturas > 0 && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <IconDocument className="w-4 h-4 text-gray-400" />
                        <span>
                          <span className="font-semibold text-gray-900">
                            {minLecturas} min
                          </span>{" "}
                          de lecturas restantes
                        </span>
                      </div>
                    )}
                    {minVideos === 0 && minLecturas === 0 && (
                      <p className="text-sm text-green-600 font-medium">
                        Modulo completado
                      </p>
                    )}
                  </div>
                </div>

         
                <div className="px-5 py-4 border-b border-gray-100 border-l-4 border-l-[#0056D2] bg-[#FAFBFF]">
                  <p className="text-sm text-gray-700">
                    Bienvenido a {moduloSeleccionado.label}.
                  </p>
                </div>

       
                <div className="divide-y divide-gray-100">
                  {moduloSeleccionado.items.map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.completada
                            ? "bg-green-50"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }`}
                      >
                        {getItemIcon(
                          item.tipo,
                          `w-4 h-4 ${item.completada ? "text-green-600" : "text-gray-500"}`,
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${item.completada ? "text-gray-500" : "text-gray-900"}`}
                        >
                          {item.titulo}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getItemLabel(item.tipo)}
                          {item.duracion ? ` · ${item.duracion}` : ""}
                        </p>
                      </div>
                      {item.completada && (
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {sidebarSeccion === "grades" && (
            <div className="max-w-2xl mx-auto px-6 py-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">
                Calificaciones
              </h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                  <span>Actividad</span>
                  <span className="w-24 text-center">Estado</span>
                  <span className="w-24 text-center">Nota</span>
                </div>
                {modulosData.flatMap((m) =>
                  m.items
                    .filter((i) => i.tipo === "quiz" || i.tipo === "practica")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3.5 border-b border-gray-50 items-center"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.titulo}
                          </p>
                          <p className="text-xs text-gray-400">{m.titulo}</p>
                        </div>
                        <div className="w-24 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.completada
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.completada ? "Aprobado" : "Pendiente"}
                          </span>
                        </div>
                        <div className="w-24 text-center">
                          <span
                            className={`text-sm font-semibold ${item.completada ? "text-green-600" : "text-gray-400"}`}
                          >
                            {item.completada ? "95/100" : "--"}
                          </span>
                        </div>
                      </div>
                    )),
                )}
              </div>
            </div>
          )}

          {sidebarSeccion === "notes" && (
            <div className="max-w-2xl mx-auto px-6 py-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">
                Mis Notas
              </h2>
              <div className="border border-gray-200 rounded-lg p-5 bg-white">
                <textarea
                  rows={8}
                  placeholder="Escribe tus notas aqui..."
                  className="w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Las notas se guardan automaticamente.
              </p>
            </div>
          )} */
}
{
  /* </main> */
}

{
  /* Right Sidebar - Learning Plan + Timeline */
}
{
  /* <aside className="w-72 flex-shrink-0 min-h-[calc(100vh-56px)] overflow-y-auto bg-white hidden xl:block">
          <div className="p-5 space-y-6"> */
}
{
  /* Learning plan */
}
{
  /* <div className="border border-gray-200 rounded-lg p-4 bg-[#FAFBFF]">
              <h3 className="font-bold text-gray-900 text-sm mb-2">
                Plan de aprendizaje
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Me comprometo a aprender 2 dias a la semana en edulearn.
              </p>
              <div className="flex items-center gap-1.5 mb-3">
                {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
                  <div
                    key={d + i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                      i === 0 || i === 2
                        ? "bg-[#0056D2] text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <button className="text-[#0056D2] text-xs font-medium hover:text-[#004BB5] transition-colors">
                Editar mi plan de aprendizaje
              </button>
            </div> */
}

{
  /* Course timeline */
}
{
  /* <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3">
                Cronograma del curso
              </h3> */
}

{
  /* Status */
}
{
  /* <div className="bg-[#F0F6FF] rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">
                  Vas bien!
                </p>
                <p className="text-xs text-[#0056D2] leading-relaxed">
                  Estas progresando muy bien. Mantiene el ritmo y alcanzaras tus
                  plazos.
                </p>
              </div> */
}

{
  /* Timeline */
}
{
  /* <div className="relative pl-6"> */
}
{
  /* Vertical dotted line */
}
{
  /* <div className="absolute left-2 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-300"></div> */
}

{
  /* Start date */
}
{
  /* <div className="relative mb-5">
                  <div className="absolute -left-4 top-0.5">
                    <IconMapPin className="w-4 h-4 text-gray-400" />
                  </div> */
}
{
  /* <p className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-900">
                      Fecha inicio:
                    </span>{" "}
                    Enero 7, 2025
                  </p> */
}
{
  /* </div> */
}

{
  /* Deadlines header */
}
{
  /* <p className="text-xs font-semibold text-gray-500 mb-3">
                  Tus proximos plazos
                </p> */
}

{
  /* Deadline items */
}
{
  /* {deadlines.map((dl, i) => (
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
                ))} */
}

{
  /* End date */
}
{
  /* <div className="relative mt-5">
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
      </div>
    </div>
  );
} */
}

// export default function CursoVista({ id, tipo }: Props) {
//   const { data: programa } = useProgramaEstudianteQuery(id);
//   const [tabActiva, setTabActiva] = useState<
//     "clases" | "materiales" | "actividades" | "foro"
//   >("clases");
//   const [claseActiva, setClaseActiva] = useState<number | null>(null);

//   const tabs = [
//     { key: "clases" as const, label: "Clases", icon: IconPlayCircle },
//     { key: "materiales" as const, label: "Materiales", icon: IconDocument },
//     { key: "actividades" as const, label: "Actividades", icon: IconClipboard },
//     { key: "foro" as const, label: "Foro", icon: IconChat },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header del curso */}
//       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//         <div className="relative h-48 md:h-56">
//           <Image
//             src={"/assets/place2.jpg"}
//             alt={"placeholder"}
//             className="w-full h-full object-cover"
//             width={100}
//             height={100}
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
//           <Link
//             href={`/plataforma/educacion`}
//             className="absolute top-4 left-4 flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/25 transition-colors"
//           >
//             {/* <IconArrowLeft className="w-4 h-4" /> */}
//             Volver
//           </Link>
//           <div className="absolute bottom-5 left-5 right-5">
//             <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
//               {/* {cursoDetalle.titulo} */}
//             </h1>
//             <div className="flex items-center gap-4 flex-wrap">
//               <div className="flex items-center gap-2">
//                 <Image
//                   src={`/assets/placeholderuser.jpg`}
//                   alt={"Imagen"}
//                   className="w-6 h-6 rounded-full object-cover border border-white/30"
//                   width={50}
//                   height={50}
//                 />
//                 <span className="text-white/90 text-sm">{"Instructor"}</span>
//               </div>
//               <div className="flex items-center gap-1 text-white/80 text-sm">
//                 <IconStar className="w-4 h-4 text-amber-400" />
//                 {/* <span>{cursoDetalle.rating}</span> */}
//               </div>
//               <div className="flex items-center gap-1 text-white/80 text-sm">
//                 <IconClock className="w-4 h-4" />
//                 <span>{0}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs de navegacion */}
//         <div className="flex border-t border-gray-200">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.key}
//                 onClick={() => setTabActiva(tab.key)}
//                 className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors border-b-2 ${
//                   tabActiva === tab.key
//                     ? "border-blue-600 text-blue-600 bg-blue-50/50"
//                     : "border-transparent text-gray-800 hover:text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 <Icon className="w-4.5 h-4.5" />
//                 {tab.label}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Contenido de la tab activa */}
//       {tabActiva === "clases" && (
//         <TabClases
//           claseActiva={claseActiva}
//           onSelectClase={setClaseActiva}
//           tipo={tipo}
//           programa={programa}
//         />
//       )}
//       {/* {tabActiva === "materiales" && <TabMateriales />}
//       {tabActiva === "actividades" && <TabActividades />}
//       {tabActiva === "foro" && <TabForo />} */}
//     </div>
//   );
// }
