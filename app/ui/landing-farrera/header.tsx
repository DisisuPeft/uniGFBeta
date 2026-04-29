"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const nav = [
  { label: "Áreas", href: "#areas" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Comunidad", href: "#comunidad" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <Link href="/" className="relative h-[200px] w-[200px] flex-shrink-0">
          {scrolled ? (
            <Image
              src="/assets/logo/f-academy.webp"
              alt="Farrera Academy"
              fill
              className="object-contain object-left"
            />
          ) : (
            <Image
              src="/assets/logo/f-academy-white.webp"
              alt="Farrera Academy"
              fill
              className="object-contain object-left"
            />
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-[#333333] hover:text-[#1c2634]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/login"
          className={`hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow ${
            scrolled
              ? "bg-[#1c2634] text-white hover:bg-[#333333]"
              : "bg-white text-[#1c2634] hover:bg-gray-100"
          }`}
        >
          Acceder a mi plataforma
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`lg:hidden p-2 ${scrolled ? "text-[#1c2634]" : "text-white"}`}
          aria-label="Abrir menú"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <nav className="px-6 py-4 flex flex-col gap-1">
              {nav.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#333333] hover:text-[#1c2634] font-medium py-3 border-b border-gray-50 text-sm"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-3 bg-[#1c2634] text-white px-5 py-3 rounded-lg text-sm font-semibold text-center hover:bg-[#333333] transition-colors"
              >
                Acceder a mi plataforma
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
