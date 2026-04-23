"use client";
import { Pestanias } from "@/redux/features/types/auth/auth-types";

interface TabsProps {
  tabs: Pestanias[];
  activeTab?: Pestanias | undefined;
  setActiveTab: (tab: Pestanias) => void;
  pathname?: string;
}

export default function Tabs({
  tabs,
  // activeTab,
  setActiveTab,
  pathname,
}: TabsProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname?.includes(tab.href);
          return (
            <button
              key={tab.uuid}
              onClick={() => setActiveTab(tab)}
              className={`relative whitespace-nowrap py-3.5 px-4 text-sm font-medium border-b-2 transition-colors duration-150 focus:outline-none cursor-pointer ${
                isActive
                  ? "border-[#0056D2] text-[#0056D2]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.nombre}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
