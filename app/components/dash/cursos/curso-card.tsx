import Link from "next/link";
import { Curso } from "@/redux/features/control-escolar/programasApiSlice";

export type { Curso };

const estadoColor: Record<Curso["status"], string> = {
  1: "bg-sky-100 text-sky-700",
  0: "bg-emerald-100 text-emerald-700",
};

export default function CursoCard({ curso }: { curso: Curso }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="h-32 bg-gradient-to-br from-sky-500 to-sky-700 relative flex flex-col justify-end p-4">
        {/* {curso.imagenUrl && (
          <img
            src={curso.imagenUrl}
            alt={curso.titulo}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )} */}
        <div className="relative">
          <p className="text-xs font-semibold text-sky-100 uppercase tracking-wide mb-0.5">
            {/* {curso.empresa} */}
          </p>
          {/* <p className="text-sm font-bold text-white">{curso.periodo}</p> */}
        </div>
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${estadoColor[curso.status]}`}
        >
          {/* {curso.estado} */}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-sky-600 font-medium uppercase tracking-wide mb-1">
          {/* {curso.categoria} */}
        </span>

        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">
          {curso.nombre}
        </h3>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {curso.descripcion}
        </p>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 mb-4">
          <span>
            <span className="font-medium text-gray-700">Instructor</span>
            <br />
            {/* {curso.instructor} */}
          </span>
          <span>
            <span className="font-medium text-gray-700">Duración</span>
            <br />
            {curso.duracion_horas}
          </span>
        </div>

        {/* {curso.estado === "En progreso" && curso.progreso !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progreso</span>
              <span>{curso.progreso}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: `${curso.progreso}%` }}
              />
            </div>
          </div>
        )} */}

        <Link
          href={`/dashboard/cursos/${curso.id}`}
          className="block w-full text-center px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-500/90 transition-colors mt-auto"
        >
          Ver curso
        </Link>
      </div>
    </div>
  );
}
