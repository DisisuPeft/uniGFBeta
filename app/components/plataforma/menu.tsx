"use client";
import { useState } from "react";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { IconBook, IconDashboard, IconUser } from "./iconst";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavItem = {
  id: number;
  nav: string;
  label: string;
  icon: React.FC<{ className?: string }>;
};

const navItems: NavItem[] = [
  { id: 1, nav: "/plataforma", label: "Dashboard", icon: IconDashboard },
  { id: 2, nav: "/plataforma/educacion", label: "Mis Cursos", icon: IconBook },
  { id: 3, nav: "perfil", label: "Mi Perfil", icon: IconUser },
];

// interface Props {
//   children: React.ReactNode;
// }

export default function PlataformaEducativa() {
  const { data: user } = useRetrieveUserQuery();
  const pathname = usePathname();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div>
      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
            fixed left-0 top-0 h-full w-64 bg-white z-50
            transform transition-transform duration-300
            ${sidebarAbierto ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Image
                src="/assets/logos/Logo CINFA-01.webp"
                alt="Logo CINFA"
                width={40}
                height={40}
                loading="eager"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">
              CINFA Plataforma
            </span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.nav}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left cursor-pointer ${
                  pathname === item.nav
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Usuario en sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0 cursor-pointer">
              <p className="font-medium text-gray-900 truncate">
                {user?.nombre_completo}
              </p>
              <p className="text-gray-500 text-sm truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
