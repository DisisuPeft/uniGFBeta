"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const pestanias = [
    { id: 1, path: "/plataforma", nombre: "Dashboard" },
    { id: 2, path: "/plataforma/courses", nombre: "Aprendizaje" },
    { id: 3, path: "/plataforma/profile", nombre: "Perfil" },
  ];
  return (
    <div className="hidden md:flex gap-6">
      {pestanias.map((p) => {
        const isActive = p.path === pathname;
        return (
          <Link
            href={p.path}
            className={`${
              isActive
                ? "border-b border-sky-500 text-sky-500"
                : "boder-b border-gray-500"
            } text-gray-700 transition mb-2`}
          >
            {p.nombre}
          </Link>
        );
      })}
      {/* <Link href="/plataforma" className={`${pathname}`}>
        Dashboard
      </Link>
      <Link
        href="/plataforma/courses"
        className="text-gray-700 hover:text-blue-600 transition"
      >
        Mis Cursos
      </Link>
      <Link
        href="/plataforma/profile"
        className="text-gray-700 hover:text-blue-600 transition"
      >
        Perfil
      </Link> */}
    </div>
  );
}
