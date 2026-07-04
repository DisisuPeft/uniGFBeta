"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_PAGE_SIZE = 10;

// ─── StatusBadge ─────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: number }) {
  return status === 1 ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Activo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 ring-1 ring-red-200">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      Inactivo
    </span>
  );
}

// ─── TablePagination ──────────────────────────────────────────────────

export function TablePagination({
  page,
  count,
  pageSize,
  onPage,
}: {
  page: number;
  count: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-500">
        Página {page} de {totalPages} · {count} registros
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && pages[i - 1] !== p - 1 && (
              <span className="px-1 text-xs text-gray-400">…</span>
            )}
            <button
              onClick={() => onPage(p)}
              className={`min-w-[32px] h-8 px-2 rounded-md text-xs font-medium transition-colors ${
                p === page
                  ? "bg-[#0056D2] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          </span>
        ))}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

// ─── Filter types ─────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  type: "search" | "select";
  key: string;
  placeholder?: string;
  options?: SelectOption[];
}

// ─── DataTable ────────────────────────────────────────────────────────

export interface DataTableProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading?: boolean;
  /** Total record count from the paginated API response */
  count?: number;
  pageSize?: number;
  filters?: FilterConfig[];
  emptyIcon?: React.ComponentType<{ className?: string }>;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  count = 0,
  pageSize = DEFAULT_PAGE_SIZE,
  filters,
  emptyIcon: EmptyIcon,
  emptyMessage = "No se encontraron resultados",
}: DataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");

  const setParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (!v || v === "all") params.delete(k);
        else params.set(k, v);
      });
      if (!("page" in updates)) params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Filters */}
      {filters && filters.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          {filters.map((filter) => {
            if (filter.type === "search") {
              return (
                <div key={filter.key} className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder={filter.placeholder ?? "Buscar..."}
                    defaultValue={searchParams.get(filter.key) ?? ""}
                    onChange={(e) =>
                      setParam({ [filter.key]: e.target.value })
                    }
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] placeholder:text-gray-400"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              );
            }

            if (filter.type === "select") {
              return (
                <select
                  key={filter.key}
                  value={searchParams.get(filter.key) ?? "all"}
                  onChange={(e) =>
                    setParam({ [filter.key]: e.target.value })
                  }
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0056D2] text-gray-600"
                >
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center select-none">
                  {/* Ilustración de Estado Vacío Premium (Mockup Exacto) */}
                  <div className="relative w-[190px] h-[140px] mx-auto mb-3 flex items-center justify-center">
                    <svg width="190" height="140" viewBox="0 0 190 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none select-none">
                      <defs>
                        {/* Degradado para la nube difuminada de fondo */}
                        <radialGradient id="cloudGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#0056D2" stopOpacity="0.07" />
                          <stop offset="70%" stopColor="#0056D2" stopOpacity="0.02" />
                          <stop offset="100%" stopColor="#0056D2" stopOpacity="0" />
                        </radialGradient>
                        <filter id="cloudBlur" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="8" />
                        </filter>
                        {/* Sombras suaves para los folios */}
                        <filter id="cardShadow" x="-35%" y="-35%" width="170%" height="170%">
                          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.03" />
                        </filter>
                      </defs>
                      
                      {/* Nube celeste de fondo muy suave */}
                      <ellipse cx="95" cy="72" rx="75" ry="46" fill="url(#cloudGlow)" filter="url(#cloudBlur)" />
                      
                      {/* Hoja trasera (rotada a la derecha, con doblez) */}
                      <g transform="translate(48, 16) rotate(8 36 48)" filter="url(#cardShadow)">
                        {/* Contorno de la hoja */}
                        <path 
                          d="M 8,0 L 56,0 L 72,16 L 72,88 A 8,8 0 0 1 64,96 L 8,96 A 8,8 0 0 1 0,88 L 0,8 A 8,8 0 0 1 8,0 Z" 
                          fill="white" 
                          stroke="#e6ecf4" 
                          strokeWidth="1.2" 
                        />
                        {/* Doblez de la esquina superior derecha */}
                        <path 
                          d="M 56,0 L 56,10 A 6,6 0 0 0 62,16 L 72,16 Z" 
                          fill="#e2e8f0" 
                          stroke="#cbd5e1" 
                          strokeWidth="1.0" 
                        />
                      </g>
                      
                      {/* Hoja delantera (rotada a la izquierda, con doblez y líneas) */}
                      <g transform="translate(58, 20) rotate(-8 36 48)" filter="url(#cardShadow)">
                        {/* Contorno de la hoja */}
                        <path 
                          d="M 8,0 L 56,0 L 72,16 L 72,88 A 8,8 0 0 1 64,96 L 8,96 A 8,8 0 0 1 0,88 L 0,8 A 8,8 0 0 1 8,0 Z" 
                          fill="white" 
                          stroke="#e6ecf4" 
                          strokeWidth="1.2" 
                        />
                        {/* Doblez de la esquina superior derecha */}
                        <path 
                          d="M 56,0 L 56,10 A 6,6 0 0 0 62,16 L 72,16 Z" 
                          fill="#e2e8f0" 
                          stroke="#cbd5e1" 
                          strokeWidth="1.0" 
                        />
                        {/* Líneas de texto simuladas */}
                        <line x1="14" y1="16" x2="48" y2="16" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                        <line x1="14" y1="26" x2="32" y2="26" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />

                        {/* Contenedor del ícono centrado en la hoja */}
                        <foreignObject x="20" y="44" width="32" height="32">
                          <div className="w-full h-full flex items-center justify-center text-[#3b82f6]">
                            {EmptyIcon ? (
                              <EmptyIcon className="w-7 h-7" strokeWidth={1.2} fill="#eff6ff" />
                            ) : (
                              <svg className="w-7 h-7" fill="#eff6ff" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>
                        </foreignObject>
                      </g>
                      
                      {/* Elementos decorativos flotantes celestes muy suaves */}
                      {/* Cruz superior derecha */}
                      <path d="M 140,36 L 148,36 M 144,32 L 144,40" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
                      {/* Cruz izquierda */}
                      <path d="M 32,58 L 40,58 M 36,54 L 36,62" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
                      {/* Círculo izquierdo */}
                      <circle cx="42" cy="82" r="3.5" stroke="#cbd5e1" strokeWidth="1.8" fill="none" opacity="0.5" />
                    </svg>
                  </div>

                  <p className="text-sm font-semibold text-slate-500 tracking-tight">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            )}

            {!isLoading &&
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group border-b border-gray-100 hover:bg-gray-50/80 transition-colors last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {count > pageSize && (
        <TablePagination
          page={page}
          count={count}
          pageSize={pageSize}
          onPage={(p) => setParam({ page: String(p) })}
        />
      )}
    </div>
  );
}