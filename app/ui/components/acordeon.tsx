"use client";

import clsx from "clsx";
import type React from "react";

import { useState, type ReactNode } from "react";

interface AcordeonProps {
  title: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Acordeon({
  title,
  children,
  className,
  defaultOpen = false,
}: AcordeonProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={clsx(
        "group border border-border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden font-serif",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left font-semibold text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-balance">{title}</span>
        <ChevronDownIcon
          className={clsx(
            "w-5 h-5 text-muted-foreground transform transition-all duration-300 ease-out",
            isOpen ? "rotate-180 text-primary" : "group-hover:text-foreground"
          )}
        />
      </button>

      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-out",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 pb-6 pt-2 border-t border-border/50">
          <div className="space-y-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
