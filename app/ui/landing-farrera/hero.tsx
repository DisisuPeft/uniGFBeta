"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Award, BookOpen, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#1c2634]" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-36 lg:pb-28 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> */}
            {/* Área de Desarrollo y Capacitación · Grupo Farrera */}
            {/* </motion.div> */}

            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Tu espacio para crecer,{" "}
              <span className="text-white/60 italic">dentro de casa.</span>
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-9 max-w-xl">
              Farrera Academy nació para las personas que hacen posible a Grupo
              Farrera. Aquí encuentras los programas, cursos y rutas de
              desarrollo diseñados por tu organización, para tu área y para tu
              crecimiento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1c2634] px-7 py-3.5 rounded-xl font-semibold transition-colors hover:bg-gray-100 shadow-lg text-base"
              >
                Entrar a mi espacio
              </Link>
              <Link
                href="#areas"
                className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 text-white/80 hover:text-white px-7 py-3.5 rounded-xl font-semibold transition-colors text-base"
              >
                Ver mi área
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 flex-wrap">
              {[
                { icon: BookOpen, text: "Para todos los colaboradores" },
                { icon: Award, text: "Programas por área" },
                { icon: TrendingUp, text: "Tu crecimiento, medido" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-white/45 text-sm"
                >
                  <Icon className="w-4 h-4 text-white/60" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Platform mockup image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="hidden lg:block relative"
          >
            {/* Main mockup — 600 × 400 px */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/40">
              <Image
                src="/assets/placeholder.png"
                alt="Farrera Academy — vista de plataforma"
                width={600}
                height={400}
                className="w-full object-cover"
                priority
              />
              {/* Dimension label */}
              <div className="absolute bottom-3 left-3 bg-[#1c2634]/80 backdrop-blur-sm text-white/80 text-[10px] font-mono px-2 py-1 rounded-md border border-white/10">
                600 × 400 px — Dashboard principal
              </div>
            </div>

            {/* Floating badge — certificado */}
            {/* <motion.div
              className="absolute -bottom-5 -left-5 bg-white rounded-xl p-3.5 shadow-xl flex items-center gap-3 max-w-[200px]"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            > */}
            {/* <div className="w-8 h-8 rounded-lg bg-[#1c2634]/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-[#1c2634]" />
              </div> */}
            {/* <div>
                <p className="text-xs font-semibold text-[#1c2634]">¡Certificado obtenido!</p>
                <p className="text-[10px] text-[#333333]/60">Mercadotecnia Digital</p>
              </div> */}
            {/* </motion.div> */}

            {/* Floating badge — progreso */}
            {/* <motion.div
              className="absolute -top-4 -right-4 bg-[#1c2634] rounded-xl px-4 py-3 shadow-xl text-center"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <p className="text-2xl font-bold text-white">94%</p>
              <p className="text-white/50 text-[10px]">Satisfacción</p>
            </motion.div> */}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-12 lg:h-16"
        >
          <path d="M0,60 L1440,60 L1440,30 Q1080,0 720,20 Q360,40 0,20 Z" />
        </svg>
      </div>
    </section>
  );
}
