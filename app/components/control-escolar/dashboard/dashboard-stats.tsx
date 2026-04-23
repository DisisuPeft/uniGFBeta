"use client";

import { useGetDashboardResumenQuery } from "@/redux/features/control-escolar/dashboardApiSlice";
import { Users, BookOpen, Megaphone, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";

interface StatItemProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  isLoading: boolean;
}

function StatItem({ label, value, sub, icon, accent, isLoading }: StatItemProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        {isLoading ? (
          <>
            <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mb-1" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900 leading-none">
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
            {sub && <p className="text-xs text-emerald-600 font-medium mt-0.5">{sub}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardStats() {
  const { data: resumen, isLoading } = useGetDashboardResumenQuery();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatItem
        label="Estudiantes inscritos"
        value={resumen?.estudiantes_total ?? 0}
        sub={
          resumen?.estudiantes_nuevos_mes
            ? `+${resumen.estudiantes_nuevos_mes} este mes`
            : undefined
        }
        icon={<Users className="w-5 h-5 text-[#0056D2]" />}
        accent="bg-[#F0F6FF]"
        isLoading={isLoading}
      />
      <StatItem
        label="Programas activos"
        value={resumen?.programas_activos ?? 0}
        icon={<BookOpen className="w-5 h-5 text-violet-600" />}
        accent="bg-violet-50"
        isLoading={isLoading}
      />
      <StatItem
        label="Campañas activas"
        value={resumen?.campanias_activas ?? 0}
        icon={<Megaphone className="w-5 h-5 text-amber-600" />}
        accent="bg-amber-50"
        isLoading={isLoading}
      />
      <StatItem
        label="Ingresos del mes"
        value={
          resumen?.ingresos_mes !== undefined
            ? formatCurrency(resumen.ingresos_mes)
            : "$—"
        }
        icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        accent="bg-emerald-50"
        isLoading={isLoading}
      />
    </div>
  );
}