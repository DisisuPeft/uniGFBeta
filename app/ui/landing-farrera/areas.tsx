"use client";

import { motion } from "framer-motion";
import {
  Users,
  Megaphone,
  Settings,
  TrendingUp,
  ShoppingBag,
  Code2,
  Shield,
  Compass,
} from "lucide-react";

const areas = [
  {
    icon: Users,
    label: "Gestión de Talento Humano",
    desc: "Liderazgo, cultura organizacional y desarrollo de personas.",
    courses: 8,
  },
  {
    icon: Megaphone,
    label: "Mercadotecnia",
    desc: "Estrategia digital, branding y posicionamiento de marca.",
    courses: 6,
  },
  // {
  //   icon: Settings,
  //   label: "Operaciones",
  //   desc: "Procesos, calidad y eficiencia operacional.",
  //   courses: 5,
  // },
  // {
  //   icon: TrendingUp,
  //   label: "Finanzas y Contabilidad",
  //   desc: "Control financiero, presupuesto y análisis de resultados.",
  //   courses: 5,
  // },
  // {
  //   icon: ShoppingBag,
  //   label: "Ventas",
  //   desc: "Técnicas de venta, negociación y atención al cliente.",
  //   courses: 7,
  // },
  // {
  //   icon: Code2,
  //   label: "Tecnología e Innovación",
  //   desc: "Herramientas digitales, automatización y nuevas tecnologías.",
  //   courses: 6,
  // },
  // {
  //   icon: Shield,
  //   label: "Cumplimiento y Legal",
  //   desc: "Normatividad, ética corporativa y gestión de riesgos.",
  //   courses: 4,
  // },
  // {
  //   icon: Compass,
  //   label: "Dirección y Liderazgo",
  //   desc: "Estrategia corporativa, visión y liderazgo ejecutivo.",
  //   courses: 5,
  // },
];

export default function Areas() {
  return (
    <section id="areas" className="py-20 lg:py-28 bg-[#F4F7FB]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#333333]/60 text-xs font-semibold tracking-widest uppercase mb-3">
            Ecosistema de aprendizaje
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1c2634]">
            Áreas de capacitación
          </h2>
          <p className="mt-4 text-[#333333]/60 max-w-xl mx-auto text-base leading-relaxed">
            Cada área de Grupo Farrera tiene su propio programa de formación,
            diseñado para el desarrollo real de competencias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {areas.map(({ icon: Icon, label, desc, courses }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1c2634]/15 transition-all cursor-default group"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[#1c2634]/8 group-hover:bg-[#1c2634]/12 transition-colors">
                <Icon className="w-5 h-5 text-[#1c2634]" />
              </div>
              <h3 className="font-semibold text-[#1c2634] text-sm leading-snug mb-2">
                {label}
              </h3>
              <p className="text-sm text-[#333333]/55 leading-relaxed mb-4">
                {desc}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1c2634]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c2634]/40 flex-shrink-0" />
                {courses} cursos disponibles
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
