"use client";

import { motion } from "framer-motion";
import { BookOpen, BarChart3 } from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: "8+",
    label: "Áreas de capacitación se integraran a la plataforma",
  },
  { icon: BarChart3, value: "20+", label: "Cursos disponibles proximamante" },
  // { icon: Users, value: "200+", label: "Colaboradores activos" },
  // { icon: Award, value: "500+", label: "Certificaciones emitidas" },
];

export default function Stats() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-4 lg:p-6"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-[#1c2634]/8">
                <Icon className="w-5 h-5 text-[#1c2634]" />
              </div>
              <p className="text-3xl font-bold text-[#1c2634]">{value}</p>
              <p className="text-sm text-[#333333]/60 mt-1 leading-tight">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
