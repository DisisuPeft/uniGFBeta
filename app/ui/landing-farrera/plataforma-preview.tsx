"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

/* ─── Componente reutilizable de imagen con etiqueta de dimensión ─── */
function Placeholder({
  width,
  height,
  label,
  className = "",
}: {
  width: number;
  height: number;
  label: string;
  className?: string;
}) {
  return (
    <div className={`relative rounded-xl overflow-hidden border border-gray-200 shadow-md bg-gray-100 ${className}`}>
      <Image
        src="/assets/placeholder.png"
        alt={label}
        width={width}
        height={height}
        className="w-full h-full object-cover"
      />
      {/* Etiqueta de dimensión para el diseñador */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-[#1c2634]/80 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 rounded-md border border-white/10">
        <span className="opacity-60">📐</span>
        {width} × {height} px — {label}
      </div>
    </div>
  );
}

const features = [
  "Seguimiento de progreso por colaborador y área",
  "Evaluaciones automáticas con retroalimentación",
  "Certificados descargables con sello corporativo",
  "Panel de métricas para líderes de área",
];

const featureCards = [
  {
    label: "Vista de cursos",
    desc: "Catálogo de capacitaciones por área con progreso integrado.",
    w: 380,
    h: 240,
  },
  {
    label: "Evaluaciones",
    desc: "Módulo de evaluación con resultados en tiempo real.",
    w: 380,
    h: 240,
  },
  {
    label: "Certificados",
    desc: "Generación automática de certificados al completar el curso.",
    w: 380,
    h: 240,
  },
];

export default function PlataformaPreview() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Bloque A: texto izquierda + imagen derecha ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 lg:mb-28">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-[#333333]/55 text-xs font-semibold tracking-widest uppercase mb-3">
              La plataforma
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1c2634] mb-5">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-[#333333]/60 text-base leading-relaxed mb-8">
              Farrera Academy integra la gestión de capacitación, la medición de resultados
              y la certificación en una experiencia fluida para colaboradores y líderes.
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1c2634] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#333333]/70">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Imagen principal — 640 × 460 px */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Placeholder width={640} height={460} label="Vista general de la plataforma" />
          </motion.div>
        </div>

        {/* ── Bloque B: imagen grande centrada — dashboard completo ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-6"
        >
          <div className="text-center mb-10">
            <span className="inline-block text-[#333333]/55 text-xs font-semibold tracking-widest uppercase mb-3">
              Panel de control
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1c2634]">
              Mide el impacto de cada capacitación
            </h2>
            <p className="mt-4 text-[#333333]/60 max-w-xl mx-auto text-base">
              Los líderes de área tienen visibilidad completa del desempeño de su equipo:
              avance, calificaciones y certificaciones obtenidas.
            </p>
          </div>

          {/* Dashboard wide — 1200 × 680 px */}
          <Placeholder
            width={1200}
            height={680}
            label="Dashboard de métricas — vista líder"
            className="w-full"
          />
        </motion.div>

        {/* ── Bloque C: 3 feature cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {featureCards.map(({ label, desc, w, h }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="flex flex-col gap-4"
            >
              <Placeholder width={w} height={h} label={label} />
              <div>
                <h4 className="font-semibold text-[#1c2634] text-sm mb-1">{label}</h4>
                <p className="text-sm text-[#333333]/55 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
