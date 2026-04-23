"use client";

import { useEffect, useState } from "react";
import Tabs from "@/app/ui/components/tabs";
import {
  // useRetrieveUserQuery,
  useGetPestaniaQuery,
} from "@/redux/features/auth/authApiSlice";
import { Pestanias } from "@/redux/features/types/auth/auth-types";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import path from "path";

export default function TabsPanelWrapper() {
  const searchParams = useSearchParams();
  const q = searchParams.get("ref");
  const { data: pestanias, isLoading } = useGetPestaniaQuery(q);
  const [activeTab, setActiveTab] = useState<Pestanias | undefined>();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   console.log("orden de ejecucion: 1");
  //   if (pestanias && !isLoading) {
  //     setActiveTab((prev) => prev ?? pestanias[0]);
  //   }
  // }, [pestanias, isLoading]);

  useEffect(() => {
    if (!pestanias) return;
    const tabFind = pestanias.find((tab) => pathname.includes(tab.href));
    if (tabFind) {
      setActiveTab(tabFind);
    } else {
      setActiveTab(pestanias[0]);
    }
  }, [pestanias, pathname]);

  const handleActiveTabChange = (tab: Pestanias) => {
    router.push(`${tab.href}?ref=${q}`);
  };

  if (isLoading || !activeTab) {
    return <div className="p-4">Cargando tabs...</div>;
  }

  return (
    <Tabs
      tabs={pestanias ?? []}
      activeTab={activeTab}
      setActiveTab={handleActiveTabChange}
      pathname={pathname}
    />
  );
}

// if (pestanias && pathname) {
//   const tabActual = pestanias.find((tab) => pathname.includes(tab.href));
//   if (tabActual) {
//     setActiveTab(tabActual);
//   }
// }
