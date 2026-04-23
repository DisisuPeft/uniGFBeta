"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function OfertaEducativaPage() {
  const diplomados = [
    {
      id: 1,
      nombre: "Diplomado Composición Digital y Efectos Visuales",
      descripcion:
        "Enfocado en los principios y técnicas de la composición digital y los efectos visuales, integrando herramientas profesionales y procesos utilizados en la industria audiovisual para la creación y postproducción de imágenes.",
      imagen: "/assets/diplomados/thales/COMPOSICION-DIGITAL.webp",
      href: "https://wa.link/o9gru5",
    },
    {
      id: 2,
      nombre: "Diplomado en Nutrición Ginecológica y Salud Hormonal Femenina",
      descripcion:
        "Formación especializada en evaluación, prevención e intervención psicológica durante el embarazo, parto y posparto. Desarrolla competencias clínicas y humanas para promover vínculos sanos y bienestar perinatal.",
      imagen: "/assets/diplomados/thales/Nutricionginecologica.webp",
      href: "https://wa.link/bn88h3",
    },
    {
      id: 3,
      nombre: "Diplomado en Seguridad e Higiene Industrial",
      descripcion:
        "Diplomado orientado al estudio de los principios, normas y prácticas de seguridad e higiene industrial, enfocado en la prevención de riesgos laborales y la promoción de entornos de trabajo seguros.",
      imagen: "/assets/diplomados/thales/Seguridadehigieneindustrial (1).webp",
      href: "https://wa.link/8jmvlr",
    },
  ];

  return (
    <div
      id="oferta-diplomados"
      className="min-h-screen w-full relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(28,61,84,0.1) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative elements */}
      <div
        className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "#d7a556" }}
      />
      <div
        className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-10 blur-3xl"
        style={{ background: "#1c3d54" }}
      />

      {/* Main container */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            style={{ color: "#fff" }}
          >
            Nuestra oferta educativa
          </h1>
          <div
            className="w-24 sm:w-32 md:w-40 h-1 mx-auto rounded-full"
            style={{ background: "#d7a556" }}
          />
          <p
            className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: "#ffff" }}
          >
            Programas de excelencia que integran conocimiento científico,
            sensibilidad artística y reflexión humanística
          </p>
        </motion.div>

        {/* Diplomados Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
            {diplomados.map((diplomado, index) => (
              <motion.div
                key={diplomado.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div
                  className="rounded-2xl overflow-hidden shadow-lg h-full flex flex-col transition-all duration-300"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(215, 165, 86, 0.2)",
                  }}
                >
                  {/* Image container with 16:9 aspect ratio */}
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <Image
                      src={diplomado.imagen || "/placeholder.svg"}
                      alt={diplomado.nombre}
                      fill
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 0%, rgba(28,61,84,0.7) 100%)",
                      }}
                    /> */}
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <h3
                      className="text-lg sm:text-xl font-semibold mb-3"
                      style={{ color: "#1c3d54" }}
                    >
                      {diplomado.nombre}
                    </h3>
                    <p
                      className="text-sm sm:text-base mb-6 flex-grow"
                      style={{ color: "#1c3d54", opacity: 0.8 }}
                    >
                      {diplomado.descripcion}
                    </p>

                    {/* Button */}
                    <motion.a
                      href={diplomado.href}
                      target="_blank"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 shadow-md"
                      style={{
                        background: "#d7a556",
                        color: "#1c3d54",
                        border: "none",
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <span className="flex justify-center text-center text-lg items-center">
                          Saber más
                        </span>
                        <svg
                          className="w-6 h-6 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Próximamente section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="rounded-3xl p-8 sm:p-10 md:p-12 text-center shadow-xl"
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(15px)",
              border: "2px solid rgba(215, 165, 86, 0.3)",
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="inline-block mb-4"
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center"
                style={{
                  background: "rgba(215, 165, 86, 0.2)",
                  border: "2px solid #d7a556",
                }}
              >
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  fill="none"
                  stroke="#d7a556"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </motion.div>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6"
              style={{ color: "#1c3d54" }}
            >
              Próximamente
            </h2>
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed"
              style={{ color: "#1c3d54", opacity: 0.9 }}
            >
              Nuevos programas en{" "}
              <span style={{ color: "#d7a556", fontWeight: "600" }}>salud</span>
              ,{" "}
              <span style={{ color: "#4ca495", fontWeight: "600" }}>
                tecnología
              </span>{" "}
              y{" "}
              <span style={{ color: "#d7a556", fontWeight: "600" }}>
                humanidades
              </span>
            </p>

            {/* Decorative dots */}
            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#d7a556" }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
