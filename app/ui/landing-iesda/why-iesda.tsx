"use client";

import { motion } from "framer-motion";

const differentiators = [
  {
    title: "Enfoque humanista",
    description:
      "La formación técnica se complementa con el desarrollo de valores y actitudes que permiten un ejercicio profesional centrado en la persona.",
  },
  {
    title: "Acompañamiento docente",
    description:
      "Nuestro cuerpo académico acompaña el proceso formativo de cada estudiante, atendiendo sus necesidades y potenciando sus capacidades.",
  },
  {
    title: "Práctica supervisada",
    description:
      "Los estudiantes realizan prácticas en instituciones del sector salud, bajo la supervisión de profesionales y docentes.",
  },
  {
    title: "Responsabilidad profesional",
    description:
      "Formamos con énfasis en la ética y el compromiso que implica trabajar en el cuidado de la salud y la vida de las personas.",
  },
];

export function WhyIesda() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span
            className="text-sm tracking-widest uppercase mb-4 block"
            style={{ color: "#7D8EA3" }}
          >
            Nuestra propuesta
          </span>
          <h2
            className="text-3xl md:text-4xl font-light leading-tight"
            style={{ color: "#3A3A3A" }}
          >
            ¿Por qué elegir IESDA?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex gap-5"
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                style={{
                  backgroundColor: "#F8F2E9",
                  color: "#D7A22A",
                }}
              >
                {index + 1}
              </div>
              <div>
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: "#3A3A3A" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#7D8EA3" }}
                >
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
