import EmailWrapper, { EmailPlaceholder } from "./email-wrapper";

export default function EmailRecordatorio() {
  return (
    <EmailWrapper preheader="Tienes un curso pendiente, [Nombre]. ¡Ya casi terminas!">
      {/* Progress bar header */}
      <div className="-mx-8 -mt-8 mb-8">
        <div className="bg-[#1c2634]/5 px-8 pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[#1c2634]/60 uppercase tracking-wide">
              Tu progreso
            </p>
            <span className="text-xs font-bold text-[#1c2634]">[N]% completado</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#1c2634] h-2 rounded-full"
              style={{ width: "65%" }}
            />
          </div>
        </div>
      </div>

      <p className="text-[#1c2634]/50 text-xs font-semibold uppercase tracking-widest mb-2">
        Recordatorio de curso
      </p>
      <h1 className="text-2xl font-bold text-[#1c2634] leading-snug mb-2">
        Hola [Nombre], ¿seguimos?
      </h1>
      <p className="text-[#333333]/65 text-sm leading-relaxed mb-6">
        Dejaste el curso <strong className="text-[#1c2634]">[Nombre del Curso]</strong> a medias. Solo te quedan <strong className="text-[#1c2634]">[N] módulos</strong> para obtener tu certificado.
      </p>

      {/* Course card */}
      <div className="border border-gray-100 rounded-xl overflow-hidden mb-8">
        <EmailPlaceholder width={600} height={200} label="Thumbnail del curso" />
        <div className="p-5">
          <p className="text-xs text-[#333333]/40 uppercase tracking-wide font-semibold mb-1">
            [Nombre del Área]
          </p>
          <p className="font-semibold text-[#1c2634] text-base mb-1">
            [Nombre del Curso]
          </p>
          <p className="text-xs text-[#333333]/50">
            Último módulo visto: <strong>[Nombre del Módulo]</strong>
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mb-8">
        <a
          href="#"
          className="inline-block bg-[#1c2634] text-white text-sm font-semibold px-8 py-3.5 rounded-xl no-underline"
        >
          Retomar donde lo dejé →
        </a>
      </div>

      <hr className="border-gray-100 mb-6" />

      <p className="text-[#333333]/40 text-xs leading-relaxed text-center">
        Te enviamos este recordatorio porque tienes un curso activo. Si ya lo terminaste, ignora este mensaje.
      </p>
    </EmailWrapper>
  );
}
