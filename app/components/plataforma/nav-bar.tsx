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
// import { IconSearch } from "../plataforma/iconst";
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
  // const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="flex justify-between items-center h-14 px-4 sm:px-6 gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center shrink-0">
          <Image
            src="/assets/logo/f-academy.webp"
            alt="Farrera Academy"
            width={160}
            height={160}
            loading="eager"
            className="h-[120px] w-auto object-contain"
          />
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <Badge />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
