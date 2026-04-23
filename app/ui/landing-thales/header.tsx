"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  // const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-full shadow-lg px-4 md:px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/thales"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <Image
                src="/assets/logos/logo-thales.svg"
                alt="logo"
                height={40}
                width={40}
              />
              <span className="text-lg md:text-xl font-bold text-primary">
                Instituto Thales
              </span>
            </motion.a>

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              <motion.a
                href="#quienes-somos"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm xl:text-base"
              >
                <span className="font-medium">Descubre</span>
                {/* <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg> */}
              </motion.a>

              <motion.a
                href="#oferta-diplomados"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm xl:text-base"
              >
                <span className="font-medium">Nuestros Diplomados</span>
                {/* <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg> */}
              </motion.a>

              {/* <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="¿Qué tema te interesa?"
                  //   value={searchQuery}
                  //   onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 xl:w-64 px-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </motion.div> */}

              {/* <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="px-4 xl:px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-colors text-sm xl:text-base"
              >
                Crear cuenta
              </motion.button> */}

              <motion.a
                href="https://wa.link/lj52bn"
                target="_blank"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="px-4 xl:px-6 py-2 border-2 border-primary text-gray-700 rounded-full font-medium hover:border-primary/80 hover:text-primary/80 transition-colors text-sm xl:text-base"
              >
                Contacto
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-primary/80 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
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

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden mt-4 bg-white rounded-2xl shadow-lg p-6 space-y-4 flex flex-col"
            >
              {/* <div className="relative">
                <input
                  type="text"
                  placeholder="¿Qué tema te interesa?"
                  //   value={searchQuery}
                  //   onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div> */}
              <Link
                href="#quienes-somos"
                className="cursor-pointer w-full text-left px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Descubre
              </Link>
              <Link
                href="#oferta-diplomados"
                className="cursor-pointer w-full text-left px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                <span className="font-medium">Nuestros Diplomados</span>
              </Link>
              {/* <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors">
                Crear cuenta
              </button> */}
              <Link
                href="https://wa.link/lj52bn"
                target="_blank"
                className="cursor-pointer w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-primary hover:text-primary transition-colors"
              >
                Contacto
              </Link>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  );
}
