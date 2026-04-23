"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Inicio", href: "/iesda" },
    { label: "Nosotros", href: "#nosotros-iesda" },
    { label: "Misión y Visión", href: "#mision-iesda" },
    { label: "Oferta Académica", href: "#diplomados-iesda" },
    // { label: "Comunidad", href: "#comunidad" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/iesda" className="flex items-center gap-3">
            <div className="w-[50px] h-[50px] rounded-lg flex items-center justify-center">
              <Image
                src="/assets/logos/iesdalogo.webp"
                alt="Logo IESDA"
                width={50}
                height={50}
                loading="eager"
              />
            </div>
            {/* <span className="text-foreground font-semibold text-lg tracking-tight">
              IESDA
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="https://wa.link/fgv19q"
              target="_blank"
              className="bg-[#D7A22A] text-[#fff] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#D7A22A]/90 transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Abrir menú"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
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
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border"
          >
            <nav className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-base font-medium py-2"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="https://wa.link/fgv19q"
                onClick={() => setIsMenuOpen(false)}
                className="bg-[#D7A22A] text-[#fff] px-5 py-3 rounded-lg text-sm font-medium text-center mt-2"
              >
                Contacto
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
