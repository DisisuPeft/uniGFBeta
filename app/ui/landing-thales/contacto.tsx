"use client";

import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { useState } from "react";
import { useFormRequest } from "@/hooks";

export default function ContactoPage() {
  const { /*register*/ onSubmit, /*errors,*/ isSubmitting } = useFormRequest();

  return (
    <div
      id="contacto-thales"
      style={{
        minHeight: "100vh",
        // background:
        //   "linear-gradient(135deg, #0a1929 0%, #1c3d54 50%, #2a5270 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      {/* Elementos decorativos de fondo con blur */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(215, 165, 86, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(76, 164, 149, 0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: "900px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Card principal con efecto glass */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #0a1929 0%, #1c3d54 50%, #2a5270 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "24px",
            padding: "3rem 2rem",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Encabezado motivador */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "1rem",
                lineHeight: "1.2",
                letterSpacing: "-0.02em",
              }}
            >
              Da el siguiente paso en tu formación
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                color: "#e8edf3",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
                opacity: 0.9,
              }}
            >
              Conecta con nosotros y descubre cómo nuestros diplomados pueden
              transformar tu desarrollo profesional y académico
            </p>

            {/* Detalle dorado decorativo */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                width: "80px",
                height: "3px",
                background:
                  "linear-gradient(90deg, transparent, #d7a556, transparent)",
                margin: "1.5rem auto 0",
                borderRadius: "2px",
              }}
            />
          </motion.div>

          {/* Formulario */}
          <motion.div
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem",
              }}
            >
              {/* Campo Nombre */}
              {/* <div>
                <label
                  style={{
                    display: "block",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  Nombre completo *
                </label>
                <input
                  {...register("nombre", {
                    required: "El nombre es requerido",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  })}
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: errors.nombre
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid #d7a556";
                    e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = errors.nombre
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  }}
                />
                {errors.nombre && (
                  <p
                    style={{
                      color: "#fca5a5",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {errors.nombre.message}
                  </p>
                )}
              </div> */}

              {/* Campo Correo */}
              {/* <div>
                <label
                  style={{
                    display: "block",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  Correo electrónico *
                </label>
                <input
                  {...register("correo", {
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido",
                    },
                  })}
                  type="email"
                  placeholder="tu@correo.com"
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: errors.correo
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid #d7a556";
                    e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = errors.correo
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  }}
                />
                {errors.correo && (
                  <p
                    style={{
                      color: "#fca5a5",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {errors.correo.message}
                  </p>
                )}
              </div> */}

              {/* Campo Teléfono */}
              {/* <div>
                <label
                  style={{
                    display: "block",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  Teléfono *
                </label>
                <input
                  {...register("telefono", {
                    required: "El teléfono es requerido",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Ingresa un teléfono válido de 10 dígitos",
                    },
                  })}
                  type="tel"
                  placeholder="5512345678"
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: errors.telefono
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid #d7a556";
                    e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = errors.telefono
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  }}
                />
                {errors.telefono && (
                  <p
                    style={{
                      color: "#fca5a5",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {errors.telefono.message}
                  </p>
                )}
              </div> */}

              {/* Botón de envío */}
              <motion.a
                href="https://wa.link/lj52bn"
                target="_blank"
                // type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                // disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "1.25rem 2rem",
                  background: isSubmitting
                    ? "#4ca495"
                    : "linear-gradient(135deg, #d7a556 0%, #c99445 100%)",
                  color: "#1c3d54",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "12px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: isSubmitting
                    ? "0 4px 20px rgba(76, 164, 149, 0.4)"
                    : "0 4px 20px rgba(215, 165, 86, 0.4), 0 0 40px rgba(215, 165, 86, 0.2)",
                  letterSpacing: "0.02em",
                  marginTop: "1rem",
                }}
              >
                {/*isSubmitting ? "✓ Mensaje enviado" :*/ "Enviar mensaje"}
              </motion.a>
            </div>
          </motion.div>

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              marginTop: "2.5rem",
              textAlign: "center",
              padding: "1.5rem",
              background: "rgba(215, 165, 86, 0.08)",
              borderRadius: "16px",
              border: "1px solid rgba(215, 165, 86, 0.2)",
            }}
          >
            <p
              style={{
                color: "#e8edf3",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              <span style={{ color: "#d7a556", fontWeight: "600" }}>
                ¿Tienes dudas?
              </span>{" "}
              Nuestro equipo te responderá en menos de 24 horas para brindarte
              toda la información que necesitas sobre nuestros programas.
            </p>
          </motion.div>
        </div>

        {/* Elementos decorativos flotantes */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "-40px",
            right: "20px",
            width: "80px",
            height: "80px",
            background: "rgba(215, 165, 86, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(215, 165, 86, 0.3)",
            borderRadius: "20px",
            transform: "rotate(15deg)",
            pointerEvents: "none",
            display: "none",
          }}
        />

        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "30px",
            width: "60px",
            height: "60px",
            background: "rgba(76, 164, 149, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(76, 164, 149, 0.3)",
            borderRadius: "50%",
            pointerEvents: "none",
            display: "none",
          }}
        />
      </motion.div>

      {/* Estilos para placeholder */}
      <style jsx>{`
        input::placeholder,
        textarea::placeholder {
          color: rgba(232, 237, 243, 0.5);
        }

        @media (min-width: 768px) {
          input:hover,
          textarea:hover {
            background: rgba(255, 255, 255, 0.12) !important;
          }
        }
      `}</style>
    </div>
  );
}
