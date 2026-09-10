"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroWrapper({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [renderChildren, setRenderChildren] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);
    // Check if user has already seen the intro in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setShowIntro(false);
      setRenderChildren(true);
    } else {
      // Para evitar que la carga pesada de la página trabe el inicio del video,
      // esperamos 1 segundo para renderizar la página de fondo.
      const timer = setTimeout(() => {
        setRenderChildren(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleIntroEnd = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
          >
            {/* preload="auto" ayuda a cargar el video antes de reproducirlo */}
            <video
              ref={videoRef}
              src="/assets/inicio.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleIntroEnd}
              className="w-full h-full object-cover"
            />
            {/* Optional Skip button */}
            <button
              onClick={handleIntroEnd}
              className="absolute bottom-8 right-8 px-4 py-2 bg-black/20 hover:bg-black/40 text-white rounded-full text-sm font-medium backdrop-blur-sm transition-all"
            >
              Saltar intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solo renderizamos el contenido principal cuando ya pas el "golpe" de CPU inicial */}
      <div className={`${showIntro ? "h-screen overflow-hidden" : ""}`}>
        {renderChildren && children}
      </div>
    </>
  );
}
