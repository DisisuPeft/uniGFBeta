"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const pillars = [
  {
    number: "1",
    title: "Formación conceptual sólida",
    description:
      "Contenidos académicos estructurados para comprender, analizar y aplicar conocimientos en contextos profesionales diversos.",
  },
  {
    number: "2",
    title: "Aprendizaje práctico",
    description:
      "Estrategias formativas basadas en ejercicios, casos y proyectos que fortalecen habilidades y criterios de actuación profesional.",
  },
  {
    number: "3",
    title: "Vinculación con el entorno profesional",
    description:
      "Atención constante a las dinámicas del campo laboral para mantener los programas alineados con sus prácticas y necesidades.",
  },
];

export default function AcademicModel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="modelo" className="py-24 lg:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-foreground font-medium text-sm uppercase tracking-wider">
            Enfoque Académico
          </span>

          <h2 className="mt-4 text-3xl lg:text-4xl font-semibold text-foreground leading-tight text-balance">
            Principios que orientan nuestra formación
          </h2>

          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Nuestra propuesta académica se fundamenta en la articulación entre
            el conocimiento teórico, la práctica formativa y la comprensión del
            contexto profesional contemporáneo.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl font-bold text-primary/20">
                {pillar.number}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
