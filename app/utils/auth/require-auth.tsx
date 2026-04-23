"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
// import { Modal } from "@/app/components/common/Modal"
// import Loading from "@/app/components/common/Loading"
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import { Role } from "@/redux/features/types/auth/auth-types";
// import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function RequireAuth({ children, allowedRoles }: Props) {
  const { isLoading, isAuth } = useAppSelector((state) => state.auth);
  const { data: verify } = useVerifyUserQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center bg-white h-screen text-gray-900"></div>
    );
  }
  if (!isAuth) {
    redirect("/login");
  }

  if (allowedRoles?.length && verify) {
    const tieneAcceso =
      verify.superuser ||
      (verify.roles.length > 0 &&
        verify.roles.some((r: Role) => allowedRoles.includes(r.nombre)));

    const isEstudianteorGuest =
      verify.roles.length > 0 &&
      verify.roles.some((r: Role) =>
        ["Estudiante", "Guest"].includes(r.nombre),
      );

    if (isEstudianteorGuest && !tieneAcceso) {
      redirect("/plataforma");
    } else if (!isEstudianteorGuest && !tieneAcceso) {
      redirect("/unauthorized");
    }
  }

  return <>{children}</>;
}
