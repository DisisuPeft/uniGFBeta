"use client";

// import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
// import { useEffect, useState } from "react";
// import { useAppSelector } from "@/redux/hooks";
// import User
// import { Settings } from "lucide-react";
// import Logout from "@/app/utils/auth/logout";
import Link from "next/link";
import Image from "next/image";
// import { usePathname } from "next/navigation";
import Badge from "../plataforma/badge";
// import { IconSearch, IconGlobe, IconBell } from "../plataforma/iconst";
import { UserMenu } from "../plataforma/drop-down-menu";

// type NavItem = {
//   id: number;
//   nav: string;
//   label: string;
// };

// const navItems: NavItem[] = [
// { id: 1, nav: "/plataforma", label: "Dashboard", icon: IconDashboard },
// {
//   id: 2,
//   nav: "/plataforma/educacion",
//   label: "Mi Aprendizaje",
// },
// { id: 3, nav: "perfil", label: "Mi Perfil", icon: IconUser },
// ];

export default function Navbar() {
  // const { data: user } = useRetrieveUserQuery();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center h-14 sm:h-16 px-3 sm:px-6 gap-2 sm:gap-6">
        {/* Logo */}
        <div className="flex items-center min-w-0">
          <Link href={"/dashboard"}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0">
                {/* <Image
                  src="/assets/logos/Logo CINFA-01.webp"
                  alt="Logo CINFA"
                  width={40}
                  height={40}
                  loading="eager"
                /> */}
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Universidad Farrera
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-1 ml-4 sm:ml-10 min-w-0">
            <button className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
              {/* {user?.nombre_completo ?? "Sin configurar perfil"} */}
            </button>
          </nav>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Badge />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
