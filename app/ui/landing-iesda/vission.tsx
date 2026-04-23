"use client";

import { motion } from "framer-motion";

export function Vision() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span
            className="text-sm tracking-widest uppercase mb-4 block"
            style={{ color: "#7D8EA3" }}
          >
            Hacia dónde nos dirigimos
          </span>
          <h2
            className="text-3xl md:text-4xl font-light leading-tight mb-8"
            style={{ color: "#3A3A3A" }}
          >
            Visión
          </h2>

          <div
            className="w-16 h-0.5 mx-auto mb-10"
            style={{ backgroundColor: "#D7A22A" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-lg p-10 md:p-14"
          style={{ backgroundColor: "#F8F2E9" }}
        >
          <p
            className="text-lg md:text-xl leading-relaxed mb-6"
            style={{ color: "#3A3A3A" }}
          >
            Consolidarnos como una institución de educación superior reconocida
            por la calidad académica y la formación integral de profesionales de
            la salud comprometidos con el bienestar de la comunidad.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#7D8EA3" }}>
            Como parte de la red CINFA, proyectamos fortalecer nuestros vínculos
            con instituciones del sector salud y contribuir al desarrollo de una
            cultura profesional basada en la ética, el conocimiento y el
            servicio. Aspiramos a ser un referente en la formación de técnicos y
            profesionales que ejerzan con responsabilidad y humanidad.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
