"use client";

import { motion } from "framer-motion";
import { LogIn, BookOpen, ClipboardCheck, Award } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "Accede con tu cuenta",
    desc: "Ingresa con tus credenciales corporativas de Grupo Farrera. Sin registro adicional necesario.",
  },
  {
    icon: BookOpen,
    title: "Aprende a tu ritmo",
    desc: "Accede a cursos, módulos y materiales de tu área. Aprende cuando y donde quieras.",
  },
  {
    icon: ClipboardCheck,
    title: "Evalúa tu conocimiento",
    desc: "Completa evaluaciones y ejercicios prácticos para medir tu progreso real.",
  },
  {
    icon: Award,
    title: "Certifícate",
    desc: "Obtén tu certificado de Grupo Farrera y demuestra las competencias adquiridas.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#333333]/60 text-xs font-semibold tracking-widest uppercase mb-3">
            El proceso
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1c2634]">
            Cómo funciona Farrera Academy
          </h2>
          <p className="mt-4 text-[#333333]/60 max-w-xl mx-auto text-base">
            De la inscripción al certificado, todo en una sola plataforma.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Connector line (desktop only) */}
          <div
            className="hidden lg:block absolute h-px bg-gradient-to-r from-transparent via-[#1c2634]/25 to-transparent"
            style={{ top: "2rem", left: "15%", right: "15%" }}
          />

          {steps.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6 z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#1c2634] flex items-center justify-center shadow-lg shadow-[#1c2634]/20">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#333333] flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-[#1c2634] text-base mb-2">{title}</h3>
              <p className="text-sm text-[#333333]/55 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
