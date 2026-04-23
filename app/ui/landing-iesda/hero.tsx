"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #F8F2E9 0%, #FFFFFF 50%, #F8F2E9 100%)",
      }}
    >
      {/* Decorative subtle accent */}
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: "#D7A22A" }}
      />

      <div className="container mx-auto px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block text-sm tracking-widest uppercase mb-6"
            style={{ color: "#7D8EA3" }}
          >
            Instituto de Educación Superior
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-8"
            style={{ color: "#3A3A3A" }}
          >
            Formación profesional
            <br />
            <span className="font-normal" style={{ color: "#D7A22A" }}>
              en ciencias de la salud
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto"
            style={{ color: "#7D8EA3" }}
          >
            Una educación centrada en la dignidad humana, el rigor científico y
            la responsabilidad profesional hacia el cuidado de la vida.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link
              href="#diplomados-iesda"
              className="inline-flex items-center px-8 py-4 text-base font-medium rounded-md transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: "#3A3A3A",
                color: "#F8F2E9",
              }}
            >
              Conocer nuestra oferta académica
              <svg
                className="ml-2 w-4 h-4"
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
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle bottom gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-32"
        style={{
          background: "linear-gradient(to top, #FFFFFF, transparent)",
        }}
      />
    </section>
  );
}
