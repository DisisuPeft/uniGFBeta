import Link from "next/link";
import { Curso } from "@/redux/features/control-escolar/programasApiSlice";
import { BookOpen, Clock } from "lucide-react";

export type { Curso };

export default function CursoCard({ curso }: { curso: Curso }) {
  const activo = curso.status === 1;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#1c2634]/15 transition-all flex flex-col group">
      {/* Card header */}
      <div className="h-28 bg-[#1c2634] relative flex items-end p-5">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex items-center justify-between w-full">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white/70" />
          </div>
          <span
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
              activo
                ? "bg-white/15 text-white/80"
                : "bg-white/10 text-white/40"
            }`}
          >
            {activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#1c2634] mb-1.5 line-clamp-2 leading-snug">
          {curso.nombre}
        </h3>

        <p className="text-xs text-[#333333]/55 mb-4 line-clamp-2 flex-1 leading-relaxed">
          {curso.descripcion}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-[#333333]/45 mb-4">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{curso.duracion_horas} horas</span>
        </div>

        <Link
          href={`/dashboard/cursos/${curso.id}`}
          className="block w-full text-center px-4 py-2.5 bg-[#1c2634] text-white rounded-xl text-xs font-semibold hover:bg-[#1c2634]/90 transition-colors mt-auto"
        >
          Ver curso
        </Link>
      </div>
    </div>
  );
}