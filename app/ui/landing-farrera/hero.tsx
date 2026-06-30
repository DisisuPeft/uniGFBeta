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

          {/* Right: Modern Organic Blob Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden lg:flex relative h-[600px] w-full justify-center items-center"
          >
            {/* Background glowing orb */}
            <div className="absolute w-[80%] h-[80%] bg-blue-500/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[80px] -z-10 translate-x-20 translate-y-20" />

            {/* The Image Container with Animated Blob Border Radius */}
            <motion.div 
              className="relative w-[90%] h-[90%] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/10"
              animate={{
                borderRadius: [
                  "60% 40% 30% 70% / 60% 30% 70% 40%",
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                  "60% 40% 30% 70% / 60% 30% 70% 40%"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/assets/hero-image.jpg"
                alt="Formación Farrera"
                fill
                className="object-cover scale-110 hover:scale-105 transition-transform duration-700"
                priority
              />
            </motion.div>
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
