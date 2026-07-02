"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Menu, X, Settings } from "lucide-react";
import { useGetSidebarPestanasQuery } from "@/redux/features/sistema/sistemaApiSlice";
import {
  TbBuildingSkyscraper,
  TbSettings,
  TbMenu2,
  TbBook,
  TbUsers,
  TbSchool,
  TbBolt,
  TbClipboardList,
  TbUserCog,
  TbUserCircle,
  TbCube
} from "react-icons/tb";

const getIconForPestana = (nombre: string) => {
  const name = nombre.toLowerCase();
  if (name.includes("empresa")) return TbBuildingSkyscraper;
  if (name.includes("modulo") || name.includes("módulo")) return TbCube;
  if (name.includes("pestaña")) return TbMenu2;
  if (name.includes("curso")) return TbBook;
  if (name.includes("departamento")) return TbUsers;
  if (name.includes("dependencia")) return TbSchool;
  if (name.includes("competencia")) return TbBolt;
  if (name.includes("puesto")) return TbClipboardList;
  if (name.includes("rol") || name.includes("roles")) return TbUserCog;
  if (name.includes("usuario")) return TbUserCircle;
  return TbSettings;
};

export default function ConfigSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const [open, setOpen] = useState(false);

  const { data: pestanas = [] } = useGetSidebarPestanasQuery(ref, {
    skip: !ref,
  });

  const navLinks = pestanas.map((p) => {
    const isActive = pathname === p.href || pathname.startsWith(p.href + "/");
    const Icon = getIconForPestana(p.nombre);

    return (
      <Link
        key={p.uuid}
        href={ref ? `${p.href}?ref=${ref}` : p.href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
          isActive
            ? "bg-blue-50 text-[#0056D2] font-semibold"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
        }`}
      >
        <Icon
          size={18}
          className={isActive ? "text-[#0056D2]" : "text-slate-400"}
        />
        {p.nombre}
      </Link>
    );
  });

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-[60px] left-3 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm text-gray-600"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex flex-col w-64 h-full bg-white border-r border-gray-200 shadow-xl">
            <div className="flex items-center justify-between h-14 px-5 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-slate-900" />
                <span className="text-sm font-bold text-slate-900">
                  Configuración
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {navLinks}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-60 md:fixed md:top-14 md:bottom-0 border-r border-gray-200 bg-white z-10">
        <div className="flex items-center gap-2.5 h-14 px-6 border-b border-gray-200">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Configuración
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks}
        </nav>
      </div>
    </>
  );
}