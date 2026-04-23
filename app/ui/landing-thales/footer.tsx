"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1c3d54] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:items-start md:gap-16 mb-12">
          {/* Logo + Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-3 text-white">
              Instituto Thales
            </h3>
            <p className="text-white/80 leading-relaxed max-w-sm">
              Ciencia, arte y humanidad en equilibrio.
            </p>
          </motion.div>

          {/* Navegación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-base font-semibold mb-6 text-[#d7a556]">
              Navegación
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Inicio", href: "/" },
                { name: "Diplomados", href: "#oferta-diplomados" },
                { name: "Quiénes somos", href: "#quienes-somos" },
                { name: "Contacto", href: "#contacto-thales" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/80 hover:text-[#d7a556] transition-colors inline-block hover:translate-x-1"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Social + RVOE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-base font-semibold mb-6 text-[#d7a556]">
              Síguenos
            </h4>

            <div className="flex gap-4 mb-6">
              {[
                {
                  href: "https://www.facebook.com/profile.php?id=100041703621914",
                  icon: (
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  ),
                },
                {
                  href: "https://www.instagram.com/in.thales?igsh=MXhyb2lyaTNrd2ZhNA==",
                  icon: (
                    <>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </>
                  ),
                },
                // {
                //   href: "https://linkedin.com",
                //   icon: (
                //     <>
                //       <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                //       <rect x="2" y="9" width="4" height="12" />
                //       <circle cx="4" cy="4" r="2" />
                //     </>
                //   ),
                // },
                // {
                //   href: "https://youtube.com",
                //   icon: (
                //     <>
                //       <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                //       <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                //     </>
                //   ),
                // },
              ].map(({ href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 border border-[#d7a556]/30
                         flex items-center justify-center transition-all hover:bg-[#d7a556] hover:-translate-y-0.5"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    {icon}
                  </svg>
                </Link>
              ))}
            </div>

            <div className="text-white/70 leading-relaxed">
              <p className="mb-1">
                {/* <strong className="text-[#d7a556]">RVOE ante SEP</strong> */}
              </p>
              <p>Validez Institucional</p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#d7a556]/20 mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left"
        >
          <p className="text-sm text-white/60">
            © {currentYear} Instituto Thales. Todos los derechos reservados.
          </p>

          <div className="flex gap-6 text-sm">
            {/* <Link
              href="/privacidad"
              className="text-white/60 hover:text-[#d7a556] transition-colors"
            >
              Aviso de Privacidad
            </Link>
            <Link
              href="/terminos"
              className="text-white/60 hover:text-[#d7a556] transition-colors"
            >
              Términos y Condiciones
            </Link> */}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
