"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, Home, BookOpen, Award, Compass } from "lucide-react";
import { TbBook, TbBolt } from "react-icons/tb";
import { useGetSidebarPestanasQuery } from "@/redux/features/sistema/sistemaApiSlice";

export default function CapacitacionSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const [open, setOpen] = useState(false);

  const { data: pestanas = [] } = useGetSidebarPestanasQuery(ref, {
    skip: !ref,
  });

  const isPlatformPage = pathname.startsWith("/plataforma");

  // Si estamos en la plataforma o no hay pestañas dinámicas, usamos las pestañas estáticas del mockup
  const links = isPlatformPage || (pestanas.length === 0 && !ref)
    ? [
        {
          uuid: "cursos",
          nombre: "Cursos",
          href: "/plataforma",
          icon: BookOpen,
        },
        {
          uuid: "competencias",
          nombre: "Competencias",
          href: "/plataforma/competencias",
          icon: Award,
        },
        {
          uuid: "explorar",
          nombre: "Explorar más",
          href: "/plataforma/explorar",
          icon: Compass,
        },
      ]
    : pestanas.map((p) => ({
        uuid: p.uuid,
        nombre: p.nombre === "Capactiación" ? "Capacitación" : p.nombre,
        href: ref ? `${p.href}?ref=${ref}` : p.href,
        icon: p.nombre.toLowerCase().includes("competencia") ? Award : BookOpen,
      }));

  const navLinks = links.map((link) => {
    const isActive = pathname === link.href || (link.href !== "/plataforma" && pathname.startsWith(link.href));
    const Icon = link.icon;

    return (
      <Link
        key={link.uuid}
        href={link.href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-300 ${
          isActive
            ? "bg-[#f0f4ff] text-[#0056D2] font-bold"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
        }`}
      >
        <Icon
          className={`w-[18px] h-[18px] ${isActive ? "text-[#0056D2]" : "text-slate-400"}`}
          strokeWidth={2.0}
        />
        {link.nombre}
      </Link>
    );
  });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Botón de Inicio al principio de todo */}
      <div className="px-3 pt-4">
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-300 ${
            pathname === "/dashboard"
              ? "bg-slate-100 text-slate-900 font-bold"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
          }`}
        >
          <Home className="w-[18px] h-[18px] text-slate-400" strokeWidth={2.0} />
          Inicio
        </Link>
      </div>

      <div className="border-t border-gray-100 my-4 mx-4" />

      {/* Título de Sección */}
      <div className="px-7 mb-2 flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Capacitación
        </span>
      </div>

      {/* Enlaces de navegación */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navLinks}
      </nav>

      {/* Tarjeta de Farrera Academy al final */}
      <div className="p-4 mt-auto flex justify-center w-full">
        <div className="relative w-[208px] h-[277px]">
          <Image 
            src="/assets/farrera-academy-card.png" 
            alt="Farrera Academy Card" 
            fill 
            sizes="208px"
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );

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
                <TbBook className="w-5 h-5 text-slate-900" />
                <span className="text-sm font-bold text-slate-900">
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
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-60 md:fixed md:top-14 md:bottom-0 border-r border-gray-200 bg-white z-10">
        {sidebarContent}
      </div>
    </>
  );
}