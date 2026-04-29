import EmailWrapper, { EmailPlaceholder } from "./email-wrapper";

export default function EmailNuevoCurso() {
  return (
    <EmailWrapper preheader="Hay un nuevo curso disponible en tu área: [Nombre del Curso].">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 bg-[#1c2634]/8 text-[#1c2634] text-xs font-semibold px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1c2634]/50 inline-block" />
          Nuevo curso disponible
        </span>
      </div>

      <h1 className="text-2xl font-bold text-[#1c2634] leading-snug mb-2">
        [Nombre del Curso]
      </h1>
      <p className="text-[#333333]/50 text-xs font-semibold uppercase tracking-wide mb-6">
        Área de [Nombre del Área] · [N] módulos · [N] horas
      </p>

      {/* Course thumbnail */}
      <div className="-mx-8 mb-6">
        <EmailPlaceholder width={600} height={300} label="Thumbnail del curso (foto / ilustración del tema)" />
      </div>

      <p className="text-[#333333]/65 text-sm leading-relaxed mb-4">
        Hola <strong className="text-[#1c2634]">[Nombre]</strong>, este curso fue diseñado para colaboradores de tu área y ya está disponible en tu perfil de Farrera Academy.
      </p>
      <p className="text-[#333333]/65 text-sm leading-relaxed mb-8">
        [Descripción breve del curso: 2-3 oraciones sobre el contenido, para qué sirve y qué aprenderá el colaborador.]
      </p>

      {/* Course meta pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          "🎓  [N] módulos",
          "⏱  [N] horas estimadas",
          "📋  Evaluación incluida",
          "🏅  Certificado al finalizar",
        ].map((item) => (
          <span
            key={item}
            className="bg-[#F4F7FB] border border-gray-200 text-[#333333]/60 text-xs px-3 py-1.5 rounded-lg"
          >
            {item}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mb-8">
        <a
          href="#"
          className="inline-block bg-[#1c2634] text-white text-sm font-semibold px-8 py-3.5 rounded-xl no-underline"
        >
          Iniciar curso →
        </a>
      </div>

      <hr className="border-gray-100 mb-6" />

      {/* Instructor block */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <EmailPlaceholder width={56} height={56} label="Foto instructor" />
        </div>
        <div>
          <p className="text-xs text-[#333333]/40 mb-0.5">Impartido por</p>
          <p className="text-sm font-semibold text-[#1c2634]">[Nombre del Instructor]</p>
          <p className="text-xs text-[#333333]/50">[Cargo] · Grupo Farrera</p>
        </div>
      </div>
    </EmailWrapper>
  );
}
