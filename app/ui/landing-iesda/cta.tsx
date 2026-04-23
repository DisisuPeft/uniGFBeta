"use client";

import { motion } from "framer-motion";

export function CTA() {
  return (
    <section
      className="py-20 px-6"
      style={{
        background: "linear-gradient(135deg, #3A3A3A 0%, #4A4A4A 100%)",
      }}
    >
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2
            className="text-2xl md:text-3xl font-light leading-tight mb-6"
            style={{ color: "#F8F2E9" }}
          >
            ¿Te interesa conocer más sobre nuestra oferta académica?
          </h2>
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "#7D8EA3" }}
          >
            Completa el formulario de solicitud de información y un asesor
            académico se comunicará contigo para resolver tus dudas sobre
            programas, requisitos de admisión y proceso de inscripción.
          </p>

          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-8 py-4 text-base font-medium rounded-md transition-colors duration-300"
            style={{
              backgroundColor: "#D7A22A",
              color: "#3A3A3A",
            }}
          >
            Solicitar información académica
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
