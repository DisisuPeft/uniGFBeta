"use client";

import { motion } from "framer-motion";

export default function QuienesSomosPage() {
  return (
    <div
      id="quienes-somos"
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 mt-12"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 z-0" />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main content container with glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-6xl w-full"
      >
        <div
          className="rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: "#ffffff" }}
            >
              Quiénes somos
            </h1>
            <div
              className="w-20 sm:w-24 md:w-32 h-1 mx-auto rounded-full"
              style={{ background: "#d7a556" }}
            />
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="space-y-6"
            >
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-semibold"
                style={{ color: "#e8edf3" }}
              >
                Nuestra identidad
              </h2>

              <p
                className="text-base sm:text-lg md:text-xl leading-relaxed"
                style={{ color: "#e8edf3" }}
              >
                El{" "}
                <span style={{ color: "#d7a556", fontWeight: "600" }}>
                  Instituto Thales
                </span>{" "}
                es un espacio de aprendizaje que une ciencia, arte, tecnología y
                humanidades, inspirado en la visión de{" "}
                <span style={{ fontWeight: "600" }}>Tales de Mileto</span>,
                quien buscó comprender la realidad a través de la razón y la
                observación. Creemos que cada área del conocimiento es como un
                rayo de luz: al pasar por el prisma del pensamiento crítico, se
                expande en infinitas posibilidades para transformar vidas y
                sociedades.
              </p>

              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "#e8edf3", opacity: 0.9 }}
              >
                Nuestra misión es fomentar un aprendizaje integral que combine
                ciencia, tecnología, arte y humanidades, formando personas
                capaces de pensar críticamente y aplicar el conocimiento para
                mejorar su vida y su entorno. Nuestra visión: ser un referente
                en educación multidisciplinaria en Latinoamérica, conectando
                saberes diversos para formar mentes creativas, éticas y
                resolutivas.
              </p>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg transition-all duration-300"
                style={{
                  background: "#d7a556",
                  color: "#1c3d54",
                  border: "none",
                }}
              >
                Conoce nuestra filosofía educativa
              </motion.button>
            </motion.div>

            {/* Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="relative h-64 sm:h-80 md:h-96 lg:h-full min-h-[300px] flex items-center justify-center"
            >
              {/* Geometric shapes representing knowledge */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Circle */}
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    scale: {
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute w-32 sm:w-40 md:w-48 lg:w-56 h-32 sm:h-40 md:h-48 lg:h-56 rounded-full"
                  style={{
                    background: "rgba(215, 165, 86, 0.2)",
                    border: "2px solid #d7a556",
                  }}
                />

                {/* Triangle */}
                <motion.div
                  animate={{
                    rotate: -360,
                    y: [0, -20, 0],
                  }}
                  transition={{
                    rotate: {
                      duration: 25,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    y: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute w-24 sm:w-32 md:w-40 lg:w-48 h-24 sm:h-32 md:h-40 lg:h-48"
                  style={{
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                    background: "rgba(76, 164, 149, 0.3)",
                    border: "2px solid #4ca495",
                  }}
                />

                {/* Square */}
                <motion.div
                  animate={{
                    rotate: 360,
                    x: [0, 20, 0],
                  }}
                  transition={{
                    rotate: {
                      duration: 15,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    x: {
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute w-20 sm:w-24 md:w-32 lg:w-36 h-20 sm:h-24 md:h-32 lg:h-36 rounded-lg"
                  style={{
                    background: "rgba(232, 237, 243, 0.2)",
                    border: "2px solid #e8edf3",
                  }}
                />

                {/* Center glow */}
                <div
                  className="absolute w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(215,165,86,0.6) 0%, rgba(215,165,86,0) 70%)",
                    filter: "blur(20px)",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 sm:mt-12 md:mt-16 h-px w-full origin-left"
            style={{
              background:
                "linear-gradient(90deg, transparent, #d7a556, transparent)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
