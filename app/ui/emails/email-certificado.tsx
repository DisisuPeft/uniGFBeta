import EmailWrapper, { EmailPlaceholder } from "./email-wrapper";

export default function EmailCertificado() {
  return (
    <EmailWrapper preheader="Felicidades, [Nombre]. Obtuviste tu certificado en [Nombre del Curso].">
      {/* Celebration header */}
      <div className="text-center mb-6">
        {/* <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1c2634]/8 mb-4">
          <span className="text-2xl">🏅</span>
        </div> */}
        <p className="text-[#1c2634]/50 text-xs font-semibold uppercase tracking-widest mb-2">
          Certificado obtenido
        </p>
        <h1 className="text-2xl font-bold text-[#1c2634] leading-snug">
          ¡Lo lograste, [Nombre]!
        </h1>
      </div>

      <p className="text-[#333333]/65 text-sm leading-relaxed mb-6 text-center">
        Completaste satisfactoriamente el curso{" "}
        <strong className="text-[#1c2634]">[Nombre del Curso]</strong> y
        obtuviste tu certificado oficial de Farrera Academy.
      </p>

      {/* Certificate mockup */}
      <div className="-mx-8 mb-8">
        <EmailPlaceholder
          width={600}
          height={380}
          label="Previsualización del certificado (imagen)"
        />
      </div>

      {/* Score block */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { value: "[N]%", label: "Calificación final" },
          { value: "[N]h", label: "Tiempo invertido" },
          { value: "[Fecha]", label: "Fecha de emisión" },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="bg-[#F4F7FB] rounded-xl p-4 text-center border border-gray-100"
          >
            <p className="text-lg font-bold text-[#1c2634]">{value}</p>
            <p className="text-[10px] text-[#333333]/45 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mb-8 flex flex-col gap-3 items-center">
        <a
          href="#"
          className="inline-block bg-[#1c2634] text-white text-sm font-semibold px-8 py-3.5 rounded-xl no-underline"
        >
          Descargar certificado →
        </a>
        <a
          href="#"
          className="inline-block text-[#1c2634]/60 text-sm font-medium px-8 py-2 rounded-xl border border-[#1c2634]/15 no-underline hover:bg-[#1c2634]/5"
        >
          Ver en mi perfil
        </a>
      </div>

      <hr className="border-gray-100 mb-6" />

      {/* Next course nudge */}
      {/* <div className="bg-[#F4F7FB] rounded-xl p-5">
        <p className="text-xs font-semibold text-[#1c2634]/60 uppercase tracking-wide mb-2">
          ¿Qué sigue?
        </p>
        <p className="text-sm text-[#333333]/60 leading-relaxed mb-3">
          Tienes [N] cursos más disponibles en tu área. Sigue construyendo tu
          camino dentro de Grupo Farrera.
        </p>
        <a
          href="#"
          className="text-[#1c2634] text-sm font-semibold no-underline"
        >
          Ver cursos de mi área →
        </a>
      </div> */}
    </EmailWrapper>
  );
}
