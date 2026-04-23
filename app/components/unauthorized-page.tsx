"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4 font-sans">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-primary mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Acceso no autorizado</h2>
        <p className="text-gray-600 mb-6">
          No tienes permiso para acceder a esta sección del sistema. Si crees
          que esto es un error, contacta con un administrador.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-900 hover:bg-red-700 transition-colors px-6 py-2 rounded text-white font-semibold"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
