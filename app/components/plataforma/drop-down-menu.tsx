"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import Logout from "@/app/utils/auth/logout";
import { User, Settings } from "lucide-react";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: user } = useRetrieveUserQuery();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const initials = user?.nombre_completo
    ? user.nombre_completo
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-[#1c2634] flex items-center justify-center text-white text-xs font-bold hover:bg-[#1c2634]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1c2634]/20 focus:ring-offset-2"
      >
        {initials}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-[#1c2634] truncate">
              {user?.nombre_completo}
            </p>
            <p className="text-xs text-[#333333]/45 truncate mt-0.5">
              {user?.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="#"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[#333333]/70 hover:bg-[#1c2634]/5 hover:text-[#1c2634] transition-colors"
            >
              <User className="w-4 h-4 text-[#1c2634]/30" />
              Ver perfil
            </Link>

            <Link
              href="#"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[#333333]/70 hover:bg-[#1c2634]/5 hover:text-[#1c2634] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#1c2634]/30" />
              Configuración
            </Link>
          </div>

          <div className="border-t border-gray-100 my-1" />

          <Logout />
        </div>
      )}
    </div>
  );
}