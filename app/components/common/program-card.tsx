import Link from "next/link";

interface ProgramaCardProps {
  id: number;
  nombre: string;
  descripcion: string;
  estudiantes: number;
  duracion: string;
  modalidad: string;
  imagenUrl?: string;
}

export default function ProgramaCard({
  id,
  nombre,
  descripcion,
  estudiantes,
  duracion,
  modalidad,
  imagenUrl,
}: ProgramaCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-700 relative">
        {imagenUrl ? (
          <img
            src={imagenUrl || "/placeholder.svg"}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl text-white opacity-50">📚</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{nombre}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{descripcion}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {estudiantes} estudiantes
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {duracion}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            {modalidad}
          </span>
        </div>

        <Link
          href={`/programas/${id}`}
          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
