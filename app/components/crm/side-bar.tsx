"use client";
import {
  // useRetrieveUserQuery,
  useGetPestaniaQuery,
} from "@/redux/features/auth/authApiSlice";
import { Menu, X } from "lucide-react";
import { useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useChangeUnidad } from "@/hooks";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("ref");
  const { data: pestanias, isLoading } = useGetPestaniaQuery(q);
  const [open, setOpen] = useState(false);
  const { unidades, onChange, unidadId } = useChangeUnidad();

  const toggleSidebar = () => setOpen((v) => !v);

  const navItems = isLoading
    ? Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
      ))
    : (pestanias ?? []).map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.nombre}
            href={`${item.href}?ref=${q}`}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? "bg-[#F0F6FF] text-[#0056D2]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#0056D2] flex-shrink-0" />
            )}
            {item.nombre}
          </Link>
        );
      });

  return (
    <div>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm text-gray-600"
        onClick={toggleSidebar}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:hidden transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex flex-col w-64 h-full bg-white border-r border-gray-200 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900">Edu CRM</span>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Unidad selector — LÓGICA INTACTA */}
          <div className="flex items-center justify-center p-4 border-b border-gray-100">
            <div className="w-64">
              <label
                htmlFor="negocio"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Negocio
              </label>
              <select
                id="negocio"
                name="negocio"
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
                onChange={onChange}
                value={String(unidadId)}
              >
                {unidades &&
                  unidades.map((unidad) => (
                    <option key={unidad.id} value={unidad.id}>
                      {unidad.nombre}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {navItems}
          </nav>
        </div>
        <div
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 border-r border-gray-200 bg-white mt-16">
        {/* CRM label */}
        <div className="flex items-center h-10 px-4 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            CRM
          </span>
        </div>

        {/* Unidad selector — LÓGICA INTACTA */}
        <div className="flex items-center justify-center p-4 border-b border-gray-100">
          <div className="w-64">
            <label
              htmlFor="negocio"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Negocio
            </label>
            <select
              id="negocio"
              name="negocio"
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
              onChange={onChange}
              value={String(unidadId)}
            >
              {unidades &&
                unidades.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems}
        </nav>
      </div>
    </div>
  );
}
