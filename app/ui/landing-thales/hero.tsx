"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
// import { Modal } from "@/app/components/common/modal";
// import FormConversion from "./form-conversion/form-conver";

// arriba del componente
const OVERLAY_BY_THEME: Record<string, string> = {
  neonatales: "from-sky-900/85 via-sky-700/45 to-transparent",
  perinatal: "from-rose-900/85 via-rose-700/45 to-transparent",
  default: "from-primary/85 via-primary/55 to-transparent",
};

const slides = [
  {
    image: "/assets/hero/thales-hero.webp",
    mobileImage: "/assets/hero/Thales-movil.webp",
    subtitle: "Excelencia Académica",
    title: "Conecta saberes transforma realidades",
    description:
      "En el Instituto Thales unimos ciencia, arte y humanidades para formar mentes críticas, creativas y conscientes del mundo que habitan. Porque aprender no es acumular conocimiento, sino iluminar la realidad desde nuevas perspectivas.",
    primaryButton: {
      text: "Explorar Oferta Educativa",
      href: "#oferta-diplomados",
    },
    secondaryButton: { text: "Conoce UNSZA", href: "/about-us" },
    theme: "default",
  },
  {
    image: "/assets/diplomados/thales/COMPOSICION-DIGITAL.webp",
    subtitle: "Diseño gráfico",
    title: "Diplomado Composición Digital y Efectos Visuales",
    description:
      "Enfocado en los principios y técnicas de la composición digital y los efectos visuales, integrando herramientas profesionales y procesos utilizados en la industria audiovisual para la creación y postproducción de imágenes.",
    primaryButton: { text: "Saber más", href: "https://wa.link/o9gru5" },
    // secondaryButton: { text: "Saber más", href: "#cta" },
    theme: "neonatales",
  },
  {
    image: "/assets/diplomados/thales/Nutricionginecologica.webp",
    subtitle: "Salud y Bienestar",
    title: "Diplomado en Nutrición Ginecológica y Salud Hormonal Femenina",
    description:
      "Formación especializada en evaluación, prevención e intervención psicológica durante el embarazo, parto y posparto. Desarrolla competencias clínicas y humanas para promover vínculos sanos y bienestar perinatal.",
    primaryButton: { text: "Más Información", href: "https://wa.link/bn88h3" },
    // secondaryButton: { text: "Inscríbete", href: "#cta" },
    theme: "perinatal",
  },
  //
  {
    image: "/assets/diplomados/thales/Seguridadehigieneindustrial (1).webp",
    subtitle: "Salud y Bienestar",
    title: "Diplomado en Seguridad e Higiene Industrial",
    description:
      "Diplomado orientado al estudio de los principios, normas y prácticas de seguridad e higiene industrial, enfocado en la prevención de riesgos laborales y la promoción de entornos de trabajo seguros.",
    primaryButton: { text: "Más Información", href: "https://wa.link/8jmvlr" },
    // secondaryButton: { text: "Inscríbete", href: "#cta" },
    theme: "perinatal",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  // const [open, setOpen] = useState<boolean>(false);
  const hovering = useRef(false);

  // Auto-advance (pausa al hacer hover sobre el hero)
  useEffect(() => {
    const id = setInterval(() => {
      if (!hovering.current) setCurrent((p) => (p + 1) % slides.length);
    }, 7000);
    return () => clearInterval(id);
  }, [current]);

  const goTo = (i: number) => setCurrent(i);
  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // console.log(reduceMotion);
  return (
    <div
      className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center bg-primary text-white overflow-hidden"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      {/* Fondo slider */}
      {/* <AnimatePresence mode="wait"> */}
      {/* <AnimatePresence mode="wait"> */}
      <div key={current} className="absolute inset-0">
        {/* Mobile (vertical / alto) */}
        <Image
          src={slides[current].mobileImage ?? slides[current].image}
          alt={slides[current].title}
          fill
          priority={current === 0}
          quality={100}
          sizes="(max-width:480px) 2048px, (max-width:768px) 2560px, 100vw"
          className="md:hidden absolute inset-0 object-cover object-center"
        />

        {/* Desktop (horizontal) */}
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          fill
          priority={current === 0}
          quality={100}
          sizes="100vw"
          className="hidden md:block absolute inset-0 object-cover md:object-[90%_center] object-center"
        />

        {/* Overlays */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            OVERLAY_BY_THEME[slides[current].theme]
          } pointer-events-none`}
        />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(0,0,0,0.28)_100%)] pointer-events-none" />
      </div>
      {/* </AnimatePresence> */}

      {/* </AnimatePresence> */}

      {/* Contenido (mismo layout) */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-28 pb-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Texto */}
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              ease: [0.65, 0, 0.35, 1],
            }}
            className="lg:col-span-6"
          >
            <h1 className="font-bold leading-tight mb-4 text-[clamp(2rem,6vw,4.2rem)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.75)]">
              {slides[current].title.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h1>

            <motion.p
              className="text-white/95 text-lg md:text-xl lg:text-2xl leading-relaxed mb-7 max-w-2xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {slides[current].description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href={slides[current].primaryButton.href}
                target="_blank"
                prefetch={false}
                className="group inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3
             text-secondary-foreground font-semibold shadow-md hover:shadow-lg hover:bg-secondary/90
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
             focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 transition"
              >
                {slides[current].primaryButton.text}
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
          {/* <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg> */}
          {/* Columna derecha para balance (se mantiene vacía) */}
          <div className="lg:col-span-6" />
        </div>

        {/* Controladores: flechas y puntos (opcionales) */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={prev}
            aria-label="Anterior"
            className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center transition"
          >
            ‹
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir al slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === current ? "w-6 bg-white" : "w-2.5 bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center transition"
          >
            ›
          </button>
        </div>

        {/* Cards debajo (sin cambios) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <Link
            href="https://wa.link/lj52bn"
            target="_blank"
            className="relative h-32 rounded-lg overflow-hidden cursor-pointer group mt-12"
            // onClick={() => setOpen(true)}
          >
            {/* Fondo base más legible */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm ring-1 ring-white/15 transition-all duration-500 group-hover:bg-slate-900/70" />

            {/* Efecto de barrido */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />

            {/* Contenido */}
            <div className="relative z-10 flex h-full items-center p-6">
              <p className="text-white font-medium text-xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                Tu próximo logro comienza aquí. Contacta con nosotros
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
      {/* <Modal show={open} onClose={() => setOpen(false)}>
        <div
          className="    bg-slate-900/65 backdrop-blur-md
    ring-1 ring-white/10 shadow-2xl
    border border-white/5"
        >
          <FormConversion />
        </div>
      </Modal> */}
    </div>
  );
}

// "use client";

// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";
// import Image from "next/image";

// export default function Hero() {
//   return (
//     <>
//       {/* Hero Section */}
//       <div className="relative w-full min-h-[90svh] bg-primary text-white overflow-hidden">
//         {/* Imagen de fondo, ocupa todo */}
//         <Image
//           src="/assets/hero/thles1.png"
//           alt="Profesional de la salud usando tablet"
//           fill
//           priority
//           sizes="100vw"
//           className="absolute inset-0 object-cover object-[70%_center] pointer-events-none"
//         />

//         {/* Overlay para legibilidad del texto */}
//         <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-transparent" />

//         {/* Vignette sutil inferior (opcional) */}
//         <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/50 to-transparent" />

//         {/* Contenido */}
//         <div className="relative mx-auto w-full max-w-7xl px-6 pt-28 pb-16">
//           <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
//             {/* Texto */}
//             <motion.div
//               initial={{ opacity: 0, x: -40 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               className="lg:col-span-6"
//             >
//               <h1 className="font-bold mt-[200px] leading-tight mb-8 text-[clamp(2rem,6vw,4.5rem)]">
//                 Tu próximo
//                 <br />
//                 logro
//                 <br />
//                 comienza aquí
//               </h1>

//               <motion.button
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="group inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-secondary-foreground font-semibold shadow-md hover:shadow-lg transition"
//               >
//                 Comienza tu experiencia
//                 <svg
//                   className="h-5 w-5 transition-transform group-hover:translate-x-1"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17 8l4 4m0 0l-4 4m4-4H3"
//                   />
//                 </svg>
//               </motion.button>
//             </motion.div>

//             {/* Columna “imagen” (solo para balance; el fondo ya trae la composición) */}
//             <motion.div
//               initial={{ opacity: 0, x: 40 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.1 }}
//               className="lg:col-span-6"
//             >
//               {/* Si quieres tarjetas o elementos flotando, colócalos aquí */}
//             </motion.div>
//           </div>

//           {/* Cards debajo */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
//           >
//             <div className="relative h-32 rounded-lg overflow-hidden">
//               <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
//               <div className="relative z-10 flex h-full items-center p-6">
//                 <p className="text-white/90 font-medium">
//                   Tu próximo logro comienza aquí
//                 </p>
//               </div>
//             </div>
//             <div className="relative h-32 rounded-lg overflow-hidden">
//               <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
//               <div className="relative z-10 flex h-full items-center p-6">
//                 <p className="text-white/90 font-medium">
//                   Diplomado Integral en Urgencias Pediátricas
//                 </p>
//               </div>
//             </div>
//             <div className="relative h-32 rounded-lg overflow-hidden">
//               <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
//               <div className="relative z-10 flex h-full items-center p-6">
//                 <p className="text-white/90 font-medium">
//                   Diplomado en Psicologia Perinata
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </>
//   );
// }
