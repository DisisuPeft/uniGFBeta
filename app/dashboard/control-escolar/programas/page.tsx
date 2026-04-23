import ButtonLink from "@/app/components/control-escolar/link-button";
import ProgramasView from "@/app/components/control-escolar/programas/programas-view";

export default function ProgramasPage() {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Programas Educativos
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona y visualiza todos los programas académicos
              </p>
            </div>
            <ButtonLink
              path="/dashboard/control-escolar/programas/new"
              title="+ Nuevo programa"
            />
          </div>
          <ProgramasView />
        </div>
      </div>
    </div>
  );
}
