"use client";

// import { Modal } from "@/app/components/common/modal";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
// import FormConversion from "./form/form-c";
import Link from "next/link";

export default function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showModal, setShowModal] = useState(false);

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-primary/10 rounded-2xl p-8 lg:p-16 text-center border border-primary/10 backdrop-blur-xl"
        >
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground leading-tight text-balance max-w-2xl mx-auto">
            Da el siguiente paso en tu formación profesional
          </h2>

          <p className="mt-6 text-foreground text-lg leading-relaxed max-w-xl mx-auto">
            Conoce nuestra oferta académica y aclara tus dudas en una sesión
            informativa sin costo. Te acompañamos para que tomes una decisión
            bien fundamentada.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={"https://wa.link/fgv19q"}
              target="_blank"
              className="bg-primary-foreground text-primary px-8 py-4 rounded-lg text-base font-medium hover:bg-primary-foreground/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Solicitar información
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            {/* <a
              href="#"
              className="border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-lg text-base font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Descargar catálogo
            </a> */}
          </div>
        </motion.div>
        {/* <Modal show={showModal} onClose={() => setShowModal(false)}>
          <FormConversion />
        </Modal> */}
      </div>
    </section>
  );
}
