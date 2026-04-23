"use client";

import { motion } from "framer-motion";

export function Mission() {
  return (
    <section
      className="py-24 px-6"
      style={{ backgroundColor: "#F8F2E9" }}
      id="mision-iesda"
    >
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
            Nuestra razón de ser
          </span>
          <h2
            className="text-3xl md:text-4xl font-light leading-tight mb-8"
            style={{ color: "#3A3A3A" }}
          >
            Misión
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
          className="bg-white rounded-lg p-10 md:p-14 shadow-sm"
        >
          <p
            className="text-lg md:text-xl leading-relaxed mb-6"
            style={{ color: "#3A3A3A" }}
          >
            Formar profesionales de la salud con rigor científico, competencia
            técnica y sensibilidad humana, capaces de ejercer su labor con
            responsabilidad ética y compromiso social.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#7D8EA3" }}>
            Nuestra misión se sustenta en el respeto por la vida, la empatía
            hacia el paciente y su entorno, y el desarrollo del pensamiento
            crítico necesario para afrontar los desafíos del campo de la salud.
            Buscamos que cada egresado integre conocimiento, valores y vocación
            de servicio en su práctica profesional.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
