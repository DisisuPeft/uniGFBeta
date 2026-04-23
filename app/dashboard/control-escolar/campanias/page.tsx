import CreateCampanias from "@/app/components/control-escolar/campanias/campania-form";
import CampaniasView from "@/app/components/control-escolar/campanias/campanias-view";

export default function ProgramasPage() {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campañas</h1>
              <p className="text-gray-600 mt-1">
                Gestiona y visualiza todos las campañas de el centro educativo
              </p>
            </div>
            <CreateCampanias />
          </div>
          <CampaniasView />
        </div>
      </div>
    </div>
  );
}
