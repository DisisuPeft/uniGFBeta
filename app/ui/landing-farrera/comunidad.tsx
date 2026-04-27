"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Farrera Academy transformó cómo desarrollo a mi equipo. Puedo medir el progreso de cada colaborador en tiempo real y tomar decisiones informadas.",
    name: "María González",
    role: "Directora de Recursos Humanos",
    area: "Gestión de Talento",
    initials: "MG",
  },
  {
    quote:
      "Los cursos de Mercadotecnia Digital me dieron las herramientas que necesitaba para actualizar nuestra estrategia. El contenido es muy relevante y práctico.",
    name: "Carlos Ramírez",
    role: "Analista de Marketing Senior",
    area: "Mercadotecnia",
    initials: "CR",
  },
  {
    quote:
      "La plataforma es intuitiva y puedo aprender desde cualquier lugar. Las certificaciones son un reconocimiento real al esfuerzo de aprendizaje.",
    name: "Ana Luisa Torres",
    role: "Gerente de Operaciones",
    area: "Operaciones",
    initials: "AT",
  },
];

const metrics = [
  { value: "95%", label: "Tasa de finalización" },
  { value: "4.8/5", label: "Satisfacción promedio" },
  { value: "48h", label: "Tiempo prom. de certificación" },
  { value: "100%", label: "Cobertura corporativa" },
];

export default function Comunidad() {
  return (
    <section id="comunidad" className="py-20 lg:py-28 bg-[#1c2634] relative overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Subtle depth gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-white/50 text-xs font-semibold tracking-widest uppercase mb-3">
            La gente detrás de Farrera
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Quienes hacen posible la casa
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            Personas de todas las áreas de Grupo Farrera aprendiendo juntas,
            creciendo en sus roles y construyendo una organización más fuerte.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {testimonials.map(({ quote, name, role, area, initials }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white/10 border border-white/15 rounded-2xl p-6 hover:bg-white/[0.13] transition-colors"
            >
              {/* Quote icon */}
              <svg
                className="w-7 h-7 mb-4 text-white/30"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c4.4 0 8-3.6 8-8V8H10zm16 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c4.4 0 8-3.6 8-8V8h-8z" />
              </svg>

              <p className="text-white/70 text-sm leading-relaxed mb-6">{quote}</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-white/40 text-xs">
                    {role} · {area}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white/10 border border-white/15 rounded-2xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
        >
          {metrics.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-sm text-white/45 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
