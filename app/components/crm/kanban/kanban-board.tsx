"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useGetPipelinesQuery } from "@/redux/features/crm/catalogosCrmApiSlice";
import { useGetLeadsQuery } from "@/redux/features/crm/leadsApiSlice";
import { Lead, Etapa } from "@/redux/features/types/crm/lead-types";
import {
  Plus,
  Phone,
  Mail,
  Flame,
  Thermometer,
  Snowflake,
  Search,
} from "lucide-react";

// ── Temperature icon ─────────────────────────────────────────────────

function TempIcon({ codigo }: { codigo?: string }) {
  if (!codigo) return <Thermometer className="w-3 h-3" />;
  if (codigo === "caliente") return <Flame className="w-3 h-3" />;
  if (codigo === "frio") return <Snowflake className="w-3 h-3" />;
  return <Thermometer className="w-3 h-3" />;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return "hoy";
  if (diff === 1) return "ayer";
  if (diff < 30) return `hace ${diff}d`;
  return `hace ${Math.floor(diff / 30)}m`;
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

// ── Lead card ────────────────────────────────────────────────────────

function LeadCard({ lead, refParam }: { lead: Lead; refParam: string | null }) {
  const temp = lead.temperatura_actual;
  const tempColor = temp?.color ?? "#94a3b8";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 hover:border-gray-300 hover:shadow-sm transition-all group">
      {/* Top row: temp + initials avatar */}
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/dashboard/crm/detalle-lead/${lead.uuid}?ref=${refParam}`}
          className="flex items-center gap-2.5 min-w-0 flex-1"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{ backgroundColor: tempColor }}
          >
            {initials(
              lead.nombre_completo || `${lead.nombre} ${lead.apellido_paterno}`,
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#0056D2] transition-colors">
              {lead.nombre_completo ||
                `${lead.nombre} ${lead.apellido_paterno}`}
            </p>
            {lead.programa_nombre && (
              <p className="text-xs text-gray-400 truncate">
                {lead.programa_nombre}
              </p>
            )}
          </div>
        </Link>

        {/* Temperature badge */}
        {temp && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
            style={{
              backgroundColor: `${tempColor}18`,
              color: tempColor,
            }}
          >
            <TempIcon codigo={temp.codigo} />
            {temp.nombre}
          </span>
        )}
      </div>

      {/* Contact info */}
      <div className="space-y-1">
        {lead.correo && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 truncate">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{lead.correo}</span>
          </div>
        )}
        {lead.telefono && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span>{lead.telefono}</span>
          </div>
        )}
      </div>

      {/* Footer: date */}
      <div className="pt-1 border-t border-gray-100">
        <span className="text-xs text-gray-400">{timeAgo(lead.created_at)}</span>
      </div>
    </div>
  );
}

// ── Kanban column ────────────────────────────────────────────────────

function KanbanColumn({
  etapa,
  leads,
  refParam,
}: {
  etapa: Etapa;
  leads: Lead[];
  refParam: string | null;
}) {
  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            {etapa.nombre}
          </span>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
            {leads.length}
          </span>
        </div>
        <Link
          href={`/dashboard/crm/nuevo-lead?ref=${refParam}`}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pb-4 pr-0.5">
        {leads.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            <p className="text-xs text-gray-400">Sin leads en esta etapa</p>
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.uuid} lead={lead} refParam={refParam} />
          ))
        )}
      </div>
    </div>
  );
}

// ── Main board ───────────────────────────────────────────────────────

export default function KanbanBoard() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref");
  const [search, setSearch] = useState("");

  const { unidadId } = useAppSelector((state) => state.changeUnidad);

  const { data: pipelines, isLoading: loadingPipelines } = useGetPipelinesQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const { data: leadsData, isLoading: loadingLeads } = useGetLeadsQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );

  const pipeline = pipelines?.results?.[0];
  const etapas = pipeline?.etapas ?? [];

  const leads = (leadsData?.results ?? []).filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.nombre_completo?.toLowerCase().includes(q) ||
      l.correo?.toLowerCase().includes(q) ||
      l.telefono?.includes(q) ||
      l.programa_nombre?.toLowerCase().includes(q)
    );
  });

  const leadsByEtapa = etapas.reduce<Record<number, Lead[]>>((acc, etapa) => {
    acc[etapa.id] = leads.filter((l) => l.etapa === etapa.id);
    return acc;
  }, {});

  const isLoading = loadingPipelines || loadingLeads;

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-72 flex-shrink-0 space-y-3">
            <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="h-28 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!pipeline) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium text-gray-500">
          No hay un pipeline configurado
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Crea un pipeline en la configuración del CRM
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Board toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] bg-white"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-900">
            {leadsData?.count ?? 0}
          </span>
          leads totales
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {etapas.map((etapa) => (
          <KanbanColumn
            key={etapa.id}
            etapa={etapa}
            leads={leadsByEtapa[etapa.id] ?? []}
            refParam={refParam}
          />
        ))}
      </div>
    </div>
  );
}