"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { useGetSidebarPestanasQuery } from "@/redux/features/sistema/sistemaApiSlice";
import { DynamicIcon } from "@/app/ui/icon/dynamic-icon";

export default function CapacitacionSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const [open, setOpen] = useState(false);

  const { data: pestanas = [] } = useGetSidebarPestanasQuery(ref, {
    skip: !ref,
  });

  const navLinks = pestanas.map((p) => {
    const isActive = pathname === p.href || pathname.startsWith(p.href + "/");
    return (
      <Link
        key={p.uuid}
        href={ref ? `${p.href}?ref=${ref}` : p.href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? "bg-[#F0F6FF] text-[#0056D2]"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <DynamicIcon
          iconName={p.icon}
          size={16}
          color={isActive ? "#0056D2" : "#9ca3af"}
        />
        {p.nombre}
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0056D2]" />
        )}
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
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1c2634]" />
                <span className="text-sm font-bold text-[#1c2634]">
                  Capacitación
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
              {navLinks}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-60 md:fixed md:top-14 md:bottom-0 border-r border-gray-100 bg-white">
        <div className="flex items-center gap-2 h-11 px-4 border-b border-gray-100">
          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Capacitación
          </span>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navLinks}
        </nav>
      </div>
    </>
  );
}