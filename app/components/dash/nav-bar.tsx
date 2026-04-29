"use client";

import Link from "next/link";
import Image from "next/image";
import Badge from "../plataforma/badge";
import { UserMenu } from "../plataforma/drop-down-menu";

export default function Navbar() {
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
