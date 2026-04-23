import CursosView from "@/app/components/dash/cursos/cursos-view";

export default function CursosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cursos de Capacitación
            </h1>
            <p className="text-gray-500 mt-1">
              Formación profesional para el desarrollo del personal
            </p>
          </div>
        </div>
        <CursosView />
      </div>
    </div>
  );
}
