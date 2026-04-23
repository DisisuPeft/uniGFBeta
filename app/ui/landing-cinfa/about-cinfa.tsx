"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function AboutCINFA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="nosotros" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Sobre CINFA
            </span>
            <h2 className="mt-4 text-3xl lg:text-4xl font-semibold text-foreground leading-tight text-balance">
              Una comunidad educativa que une disciplinas
            </h2>

            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              El Centro Internacional de Formación Académica (CINFA) es una
              institución dedicada a la formación profesional a través de
              programas académicos organizados por áreas de conocimiento y
              disciplinas específicas.
            </p>

            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Nuestro trabajo académico se construye desde el diálogo entre el
              saber teórico, la práctica profesional y las realidades
              contemporáneas en las que el conocimiento se ejerce y se
              transforma.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <div className="text-lg font-semibold text-primary">
                  Enfoque formativo
                </div>
                <div className="mt-1 text-muted-foreground text-sm leading-relaxed">
                  Promovemos una formación rigurosa, reflexiva y aplicada, que
                  permita a los estudiantes desarrollar competencias sólidas y
                  pensamiento crítico.
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold text-primary">
                  Proyección académica
                </div>
                <div className="mt-1 text-muted-foreground text-sm leading-relaxed">
                  Concebimos la educación como un proceso continuo, abierto al
                  intercambio de saberes y a la participación en contextos
                  formativos de alcance nacional e internacional.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <Image
                src="/assets/photos/joven-escuchando-musica-durante-la-sesion-de-estudio.webp"
                alt="Estudiantes en aula moderna de CINFA"
                className="w-full h-full object-cover"
                width={500}
                height={500}
                quality={100}
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-foreground font-semibold">
                    Validez institucional
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Certificación emitida por una institución académica formal
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
