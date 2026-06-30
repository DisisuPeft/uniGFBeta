"use client";

import { useState, useEffect } from "react";
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
    src: "/assets/vista-cursos.jpg",
  },
  {
    label: "Evaluaciones",
    desc: "Módulo de evaluación con resultados en tiempo real.",
    w: 380,
    h: 240,
    src: "/assets/vista-evaluaciones.jpg",
  },
  {
    label: "Certificados",
    desc: "Generación automática de certificados al completar el curso.",
    w: 380,
    h: 240,
    src: "/assets/vista-certificados.jpg",
  },
];

const carouselSlides = [
  {
    src: "/assets/dashboard-carousel-2.png",
    title: "Catálogo de Cursos",
    desc: "Explora una amplia variedad de capacitaciones diseñadas para cada área, con seguimiento de progreso detallado para asegurar el crecimiento continuo.",
  },
  {
    src: "/assets/dashboard-carousel-3.png",
    title: "Módulo de Evaluaciones",
    desc: "Mide el aprendizaje con exámenes interactivos y obtén retroalimentación inmediata sobre el desempeño de cada colaborador.",
  },
  {
    src: "/assets/dashboard-carousel-4.png",
    title: "Galería de Certificados",
    desc: "Visualiza y descarga todos tus reconocimientos obtenidos, manteniendo un historial claro de tus logros profesionales en la plataforma.",
  },
  {
    src: "/assets/dashboard-carousel-7.png",
    title: "Explora los cursos disponibles",
    desc: "Encuentra fácilmente capacitaciones por área, habilidades o nivel. Utiliza la barra de búsqueda y filtros para descubrir tu próxima meta de aprendizaje.",
  }
];

export default function PlataformaPreview() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 10000); // 10 segundos
    return () => clearInterval(timer);
  }, []);

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

          {/* Imagen principal — Proporcionada por usuario */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
          >
            <Image 
              src="/assets/plataforma-img.jpg" 
              alt="Todo lo que necesitas en un solo lugar" 
              width={800} 
              height={600} 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
            />
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

          {/* Dashboard Carousel */}
          <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[500px] lg:h-[680px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-[#f8f9fa]">
            {carouselSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  activeSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image src={slide.src} alt={slide.title} fill className="object-cover md:object-contain bg-[#f8f9fa]" />
                
                {/* Gradient overlay en la parte inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c2634]/95 via-[#1c2634]/40 to-transparent" />
                
                {/* Text content */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-left">
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={activeSlide === idx ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-4xl font-bold text-white mb-3"
                  >
                    {slide.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={activeSlide === idx ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/80 text-base md:text-xl max-w-3xl leading-relaxed"
                  >
                    {slide.desc}
                  </motion.p>
                </div>
              </div>
            ))}

            {/* Dots navigation */}
            <div className="absolute bottom-10 right-8 md:right-12 z-20 flex gap-2">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? "bg-blue-500 w-8" : "bg-white/40 hover:bg-white/80"
                  }`}
                  aria-label={`Ir a diapositiva ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Bloque C: 3 feature cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {featureCards.map(({ label, desc, w, h, src }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="flex flex-col gap-4"
            >
              {src ? (
                <div className="relative w-full h-[240px] rounded-xl overflow-hidden shadow-md border border-gray-100">
                  <Image src={src} alt={label} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <Placeholder width={w} height={h} label={label} />
              )}
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
