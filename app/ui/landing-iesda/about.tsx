"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section
      id="nosotros-iesda"
      className="py-24 px-6"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <span
              className="text-sm tracking-widest uppercase mb-4 block"
              style={{ color: "#D7A22A" }}
            >
              Sobre IESDA
            </span>
            <h2
              className="text-3xl md:text-4xl font-light leading-tight mb-6"
              style={{ color: "#3A3A3A" }}
            >
              Una institución comprometida con la{" "}
              <span className="font-normal">formación integral</span>
            </h2>
          </div>

          <div className="space-y-6">
            <p
              className="text-base leading-relaxed"
              style={{ color: "#3A3A3A" }}
            >
              IESDA es una institución de educación superior con una identidad
              académica, humanista y ética. Nuestra labor formativa está
              centrada en la dignidad humana, el rigor científico y la
              responsabilidad profesional que exige el campo de la salud.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: "#7D8EA3" }}
            >
              Formamos parte de la red coordinada por CINFA, manteniendo nuestra
              autonomía institucional y vocación pedagógica. Cada estudiante
              recibe un acompañamiento cercano que respeta su proceso formativo
              y fomenta el desarrollo de competencias técnicas y humanas.
            </p>
          </div>
        </motion.div>

        {/* Values grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          {[
            {
              title: "Formación ética",
              description:
                "El ejercicio profesional en salud requiere una base sólida de principios éticos que guíen cada decisión.",
            },
            {
              title: "Acompañamiento pedagógico",
              description:
                "Cada estudiante cuenta con el apoyo de docentes comprometidos con su desarrollo académico y personal.",
            },
            {
              title: "Dignidad humana",
              description:
                "El respeto por la vida y la persona es el eje central de nuestra propuesta educativa.",
            },
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-lg"
              style={{ backgroundColor: "#F8F2E9" }}
            >
              <div
                className="w-10 h-0.5 mb-6"
                style={{ backgroundColor: "#D7A22A" }}
              />
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: "#3A3A3A" }}
              >
                {value.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#7D8EA3" }}
              >
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
