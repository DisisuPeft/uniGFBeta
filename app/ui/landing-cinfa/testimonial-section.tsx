"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    name: "María González",
    role: "Egresada - Gestión Empresarial",
    image: "/professional-latina-woman-headshot-portrait.jpg",
    quote:
      "CINFA me dio las herramientas prácticas que necesitaba para dar el salto a un puesto de liderazgo. La red de contactos ha sido invaluable.",
  },
  {
    name: "Carlos Mendoza",
    role: "Egresado - Marketing Digital",
    image: "/professional-latino-man-headshot-portrait.jpg",
    quote:
      "La metodología basada en proyectos reales me permitió construir un portafolio sólido antes de terminar el diplomado.",
  },
  {
    name: "Ana Lucía Vargas",
    role: "Egresada - Desarrollo de Software",
    image: "/professional-woman-software-developer-headshot-por.jpg",
    quote:
      "Los docentes son profesionales activos que entienden las demandas actuales del mercado. Eso marca la diferencia.",
  },
];

export default function CommunitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="comunidad" className="py-24 lg:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            Comunidad CINFA
          </span>
          <h2 className="mt-4 text-3xl lg:text-4xl font-semibold text-foreground leading-tight text-balance">
            Historias de transformación
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Conoce las experiencias de quienes ya forman parte de nuestra
            comunidad educativa internacional.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="bg-card p-8 rounded-xl border border-border"
            >
              <svg
                className="w-10 h-10 text-primary/20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="mt-4 text-foreground leading-relaxed">
                {testimonial.quote}
              </p>
              <footer className="mt-6 flex items-center gap-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <cite className="not-italic font-semibold text-foreground">
                    {testimonial.name}
                  </cite>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
