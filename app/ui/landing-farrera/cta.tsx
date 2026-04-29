"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-[#1c2634] rounded-3xl p-10 lg:p-14 relative overflow-hidden text-center">
            {/* Decorative elements */}
            {/* <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" /> */}
            {/* <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/[0.03]" /> */}
            {/* <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "28px 28px",
              }}
            /> */}

            <div className="relative z-10">
              <span className="inline-block bg-white/10 border border-white/20 text-white/70 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                Grupo Farrera · Área de Desarrollo y Capacitación
              </span>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Este es tu espacio. Bienvenido.
              </h2>

              <p className="text-white/55 text-base mb-8 max-w-xl mx-auto leading-relaxed">
                Farrera Academy es tuya. Entra, explora tu área, retoma donde lo
                dejaste y sigue construyendo tu camino dentro de Grupo Farrera.
              </p>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-[#1c2634] px-8 py-3.5 rounded-xl font-semibold transition-colors hover:bg-gray-100 shadow-lg text-base"
              >
                Entrar a mi espacio
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* <p className="mt-5 text-white/30 text-sm">
                Ingresa con tus credenciales de Grupo Farrera
              </p> */}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
