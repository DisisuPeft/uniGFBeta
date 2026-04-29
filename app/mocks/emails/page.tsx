"use client";

import { useState } from "react";
import EmailBienvenida from "@/app/ui/emails/email-bienvenida";
import EmailNuevoCurso from "@/app/ui/emails/email-nuevo-curso";
import EmailCertificado from "@/app/ui/emails/email-certificado";
import EmailRecordatorio from "@/app/ui/emails/email-recordatorio";

const templates = [
  {
    id: "bienvenida",
    label: "Bienvenida",
    desc: "Activación de cuenta",
    component: <EmailBienvenida />,
  },
  {
    id: "nuevo-curso",
    label: "Nuevo curso",
    desc: "Notificación de contenido",
    component: <EmailNuevoCurso />,
  },
  {
    id: "certificado",
    label: "Certificado",
    desc: "Finalización de curso",
    component: <EmailCertificado />,
  },
  {
    id: "recordatorio",
    label: "Recordatorio",
    desc: "Curso pendiente",
    component: <EmailRecordatorio />,
  },
];

export default function EmailMocksPage() {
  const [active, setActive] = useState("bienvenida");

  const current = templates.find((t) => t.id === active)!;

  return (
    <div className="min-h-screen bg-[#0f1720]">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#1c2634] border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-xs font-mono">MOCKUP</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="text-white text-sm font-semibold">Email Templates · Farrera Academy</span>
        </div>
        <span className="text-white/30 text-xs">Solo uso interno · Diseño</span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 min-h-[calc(100vh-49px)] bg-[#1c2634]/60 border-r border-white/5 p-4">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 mb-3">
            Templates
          </p>
          <div className="flex flex-col gap-1">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  active === t.id
                    ? "bg-white/15 text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 px-2">
            <p className="text-white/20 text-[10px] font-semibold uppercase tracking-widest mb-3">
              Especificaciones
            </p>
            <div className="flex flex-col gap-2 text-[10px] text-white/30 font-mono">
              <span>Ancho: 600px</span>
              <span>Fuente: Google Sans</span>
              <span>Primario: #1c2634</span>
              <span>Fondo: #F4F7FB</span>
            </div>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-white text-lg font-semibold">{current.label}</h1>
            <span className="text-white/30 text-sm">·</span>
            <span className="text-white/40 text-sm">{current.desc}</span>
            <span className="ml-auto bg-white/5 border border-white/10 text-white/40 text-xs px-3 py-1 rounded-full font-mono">
              max-width: 600px
            </span>
          </div>

          {/* Email frame */}
          <div className="max-w-[660px] mx-auto">
            {/* Fake browser chrome */}
            <div className="bg-[#2a3545] rounded-t-xl px-4 py-2.5 flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 bg-white/5 rounded-md h-5 flex items-center px-2">
                <span className="text-white/25 text-[10px] font-mono">
                  farreraacademy.grupofarrera.com · correo de [nombre@grupofarrera.com]
                </span>
              </div>
            </div>

            {/* Email content */}
            <div className="rounded-b-xl overflow-hidden shadow-2xl">
              {current.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
