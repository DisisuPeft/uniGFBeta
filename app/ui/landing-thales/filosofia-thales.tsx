"use client";

import { motion } from "framer-motion";

export default function FilosofiaEducativa() {
  const pilares = [
    {
      titulo: "Pensamiento crítico",
      descripcion:
        "Desarrollamos la capacidad de análisis, reflexión y argumentación rigurosa en cada disciplina.",
      icon: (
        <svg
          className="w-16 h-16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d7a556"
          strokeWidth="1.5"
        >
          <path
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      titulo: "Integración de saberes",
      descripcion:
        "Conectamos ciencia, arte y humanidades para una comprensión integral del conocimiento.",
      icon: (
        <svg
          className="w-16 h-16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d7a556"
          strokeWidth="1.5"
        >
          <path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      titulo: "Formación humana y ética",
      descripcion:
        "Cultivamos valores, responsabilidad social y compromiso con el bien común.",
      icon: (
        <svg
          className="w-16 h-16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d7a556"
          strokeWidth="1.5"
        >
          <path
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      titulo: "Flexibilidad y acompañamiento",
      descripcion:
        "Ofrecemos modalidades adaptables y seguimiento personalizado en tu proceso formativo.",
      icon: (
        <svg
          className="w-16 h-16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d7a556"
          strokeWidth="1.5"
        >
          <path
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      id="filosofia-educativa"
      style={{
        minHeight: "100vh",
        // background:
        //   "linear-gradient(135deg, #0a1929 0%, #1c3d54 50%, #0f2942 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blur decorativo de fondo */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(215, 165, 86, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(76, 164, 149, 0.1) 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: "80px 20px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h1
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: "300",
                color: "#ffffff",
                marginBottom: "20px",
                letterSpacing: "0.02em",
              }}
            >
              Nuestra filosofía educativa
            </h1>
            <div
              style={{
                width: "80px",
                height: "3px",
                background:
                  "linear-gradient(90deg, transparent, #d7a556, transparent)",
                margin: "0 auto",
              }}
            />
          </motion.div>

          {/* Texto institucional central */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              maxWidth: "900px",
              margin: "0 auto 80px",
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            <p
              style={{
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                lineHeight: "1.8",
                color: "#e8edf3",
                fontWeight: "300",
                marginBottom: "30px",
              }}
            >
              En el Instituto Thales creemos en una educación que trasciende la
              mera transmisión de conocimientos. Formamos profesionales con
              visión integral, capaces de comprender la complejidad del mundo
              contemporáneo y de contribuir al desarrollo de una sociedad más
              justa, reflexiva y humana.
            </p>

            {/* RVOE Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 28px",
                background: "rgba(215, 165, 86, 0.1)",
                border: "1px solid rgba(215, 165, 86, 0.3)",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d7a556"
                strokeWidth="2"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  color: "#fff",
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  letterSpacing: "0.05em",
                }}
              >
                RVOE ante SEP
              </span>
            </motion.div>
          </motion.div>

          {/* Grid de pilares */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
              marginBottom: "80px",
              padding: "0 20px",
            }}
          >
            {pilares.map((pilar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 * index }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                style={{
                  background:
                    "linear-gradient(135deg, #0a1929 0%, #1c3d54 50%, #0f2942 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "50px 30px",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Ícono */}
                <div
                  style={{
                    marginBottom: "30px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {pilar.icon}
                </div>

                {/* Título */}
                <h3
                  style={{
                    fontSize: "clamp(1.3rem, 2vw, 1.5rem)",
                    fontWeight: "400",
                    color: "#ffffff",
                    marginBottom: "16px",
                    letterSpacing: "0.01em",
                  }}
                >
                  {pilar.titulo}
                </h3>

                {/* Descripción */}
                <p
                  style={{
                    fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                    lineHeight: "1.7",
                    color: "#e8edf3",
                    fontWeight: "300",
                    opacity: 0.9,
                  }}
                >
                  {pilar.descripcion}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ textAlign: "center" }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 12px 40px rgba(215, 165, 86, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #d7a556 0%, #c99647 100%)",
                color: "#1c3d54",
                fontSize: "clamp(1rem, 2vw, 1.1rem)",
                fontWeight: "600",
                padding: "18px 48px",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(215, 165, 86, 0.25)",
                letterSpacing: "0.02em",
                transition: "all 0.3s ease",
              }}
            >
              Descubre nuestro modelo formativo
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
