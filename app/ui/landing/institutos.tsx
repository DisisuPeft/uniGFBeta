"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const diplomas = [
  {
    title: "Instituto Thales",
    image: "/assets/logos/logo-thales.svg",
    path: "/thales",
  },
  {
    title: "Instituto de Educación Superior y Desarrollo Académico",
    image: "/assets/logos/iesdalogo.webp",
    path: "/iesda",
  },
];

export default function InstitutesPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="diplomados" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Oferta Académica
            </span>
            <h2 className="mt-4 text-3xl lg:text-4xl font-semibold text-foreground leading-tight text-balance">
              Nuestros institutos académicos
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              La oferta formativa de CINFA se organiza en institutos académicos
              especializados, desde los cuales se desarrollan programas y
              diplomados orientados a distintas áreas del conocimiento.
            </p>
          </div>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diplomas.map((diploma, index) => (
            <motion.article
              key={diploma.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={diploma.image || "/placeholder.svg"}
                  alt={diploma.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {diploma.title}
                </h3>
              </div>
              <div className="p-6">
                <Link
                  href={diploma.path}
                  // target="_blank"
                  className="mt-4 inline-flex items-center gap-2 text-primary font-medium text-sm hover:text-primary/80 transition-colors"
                >
                  Más información
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
