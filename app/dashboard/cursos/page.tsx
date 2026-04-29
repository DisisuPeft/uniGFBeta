import CursosView from "@/app/components/dash/cursos/cursos-view";

export default function CursosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#1c2634]/50 uppercase tracking-widest mb-1">
          Farrera Academy
        </p>
        <h1 className="text-2xl font-bold text-[#1c2634]">
          Cursos de capacitación
        </h1>
        <p className="text-sm text-[#333333]/55 mt-1">
          Explora los programas disponibles para tu área de Grupo Farrera.
        </p>
      </div>
      <CursosView />
    </div>
  );
}