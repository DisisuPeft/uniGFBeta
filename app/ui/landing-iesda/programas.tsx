"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const programs = [
  {
    name: "Enfermería Nefrológica, Hemodiálisis y Accesos Vasculares",
    // duration: "3 años",
    description:
      "Orientado a la formación especializada en enfermería nefrológica, con énfasis en los procesos de hemodiálisis y el cuidado integral de los accesos vasculares, integrando fundamentos clínicos, técnicos y humanizados en la atención al paciente.",
    image: "/assets/diplomados/iesda/Enfermeríanefrologica.webp",
  },
  {
    name: "Enfermería Pericial y Registros Clínicos",
    // duration: "2 años",
    description:
      "Orientado a la formación en enfermería pericial y el correcto manejo de los registros clínicos, con énfasis en la documentación profesional, el sustento legal de la práctica y la atención conforme a criterios éticos y normativos.",
    image: "/assets/diplomados/iesda/Enfermeríapericiall.webp",
  },
  {
    name: "Urgencias Pediátricas",
    // duration: "2 años",
    description:
      "Orientado al estudio y abordaje de las urgencias pediátricas, enfocado en la identificación oportuna, valoración inicial y atención adecuada de situaciones críticas en pacientes pediátricos, bajo criterios clínicos y éticos.",
    image: "/assets/diplomados/iesda/URGENCIA-PEDIATRICAS.webp",
  },
];

export function Programs() {
  const getWaLink = (programName: string) => {
    const phone = "529613986294";
    const message = `Hola, me gustaría recibir más información sobre el diplomado: ${programName}.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };
  return (
    <section
      id="diplomados-iesda"
      className="py-24 px-6"
      style={{ backgroundColor: "#F8F2E9" }}
    >
      <div className="container mx-auto max-w-6xl">
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
            Formación académica
          </span>
          <h2
            className="text-3xl md:text-4xl font-light leading-tight mb-6"
            style={{ color: "#3A3A3A" }}
          >
            Oferta Académica
          </h2>
          <p
            className="max-w-2xl mx-auto text-base leading-relaxed"
            style={{ color: "#7D8EA3" }}
          >
            Programas técnicos y tecnológicos en el área de la salud, diseñados
            para formar profesionales competentes y éticamente comprometidos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* IMAGE */}
              {program.image && (
                <div className="w-full h-[300px] overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.name}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                    quality={100}
                  />
                </div>
              )}

              {/* CONTENT */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="text-lg font-medium pr-4"
                    style={{ color: "#3A3A3A" }}
                  >
                    {program.name}
                  </h3>
                </div>

                <div
                  className="w-8 h-0.5 mb-4"
                  style={{ backgroundColor: "#D7A22A" }}
                />

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#7D8EA3" }}
                >
                  {program.description}
                </p>
                <a
                  href={getWaLink(program.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-6 text-sm font-medium transition-colors"
                  style={{ color: "#1FBAC4" }}
                >
                  Saber más
                  <span className="ml-2">→</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
