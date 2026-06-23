"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import { Role } from "@/redux/features/types/auth/auth-types";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

// Roles que van a /plataforma cuando no tienen acceso a rutas de dashboard
const ROLES_PLATAFORMA = ["Colaborador"] as const;

function resolveRedirect(
  superuser: boolean,
  roles: Role[],
  allowedRoles: string[],
): string | null {
  if (superuser) return null;
  if (roles.some((r) => allowedRoles.includes(r.nombre))) return null;
  const esPlataforma = roles.some((r) =>
    (ROLES_PLATAFORMA as readonly string[]).includes(r.nombre),
  );
  return esPlataforma ? "/plataforma" : "/unauthorized";
}

export default function RequireAuth({ children, allowedRoles }: Props) {
  const router = useRouter();
  const { isLoading, isAuth } = useAppSelector((state) => state.auth);

  const needsRoleCheck = isAuth && !!allowedRoles?.length;

  const {
    data: verify,
    isLoading: isVerifying,
    isUninitialized,
  } = useVerifyUserQuery(undefined, { skip: !isAuth });

  const authPending = isLoading;
  const rolePending = needsRoleCheck && (isUninitialized || isVerifying);
  const isReady = !authPending && !rolePending;

  let redirectTo: string | null = null;
  if (isReady) {
    if (!isAuth) {
      redirectTo = "/login";
    } else if (needsRoleCheck && verify) {
      redirectTo = resolveRedirect(
        verify.superuser,
        verify.roles,
        allowedRoles!,
      );
    }
  }

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  if (!isReady || redirectTo) {
    return <div className="flex justify-center bg-white h-screen" />;
  }

  return <>{children}</>;
}
