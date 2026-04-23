"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";

export default function UserName() {
  const { data: user } = useRetrieveUserQuery();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        ¡Bienvenido de nuevo, {user?.nombre_completo}!
      </h1>
      <p className="text-gray-600">
        Continúa donde lo dejaste y sigue avanzando en tu aprendizaje
      </p>
    </div>
  );
}
