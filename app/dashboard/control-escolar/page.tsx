import DashboardStats from "@/app/components/control-escolar/dashboard/dashboard-stats";
import AlumnosRecientes from "@/app/components/control-escolar/dashboard/alumnos-recientes";
import CampaniasProximas from "@/app/components/control-escolar/dashboard/campanias-proximas";
import Link from "next/link";
import { BookOpen, Users, Megaphone } from "lucide-react";

const fecha = new Date().toLocaleDateString("es-MX", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const accesosRapidos = [
  {
    label: "Nuevo alumno",
    href: "/dashboard/control-escolar/alumnos/new",
    icon: Users,
    color: "bg-[#F0F6FF] text-[#0056D2]",
  },
  {
    label: "Nuevo programa",
    href: "/dashboard/control-escolar/programas/new",
    icon: BookOpen,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Nueva campaña",
    href: "/dashboard/control-escolar/campanias/new",
    icon: Megaphone,
    color: "bg-amber-50 text-amber-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Panel de Control Escolar
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">{fecha}</p>
        </div>

        {/* Accesos rápidos */}
        <div className="hidden sm:flex items-center gap-2">
          {accesosRapidos.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 bg-white"
            >
              <span className={`w-6 h-6 rounded-md flex items-center justify-center ${color}`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <DashboardStats />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AlumnosRecientes />
        </div>
        <div className="lg:col-span-1">
          <CampaniasProximas />
        </div>
      </div>

      {/* Mobile quick actions */}
      <div className="sm:hidden grid grid-cols-3 gap-3">
        {accesosRapidos.map(({ label, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-white text-center"
          >
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}