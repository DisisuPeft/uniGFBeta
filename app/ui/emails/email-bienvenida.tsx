import EmailWrapper, { EmailPlaceholder } from "./email-wrapper";

export default function EmailBienvenida() {
  return (
    <EmailWrapper preheader="Bienvenido a Farrera Academy, tu espacio de capacitación dentro de Grupo Farrera.">
      {/* Hero image */}
      <div className="-mx-8 -mt-8 mb-8">
        <EmailPlaceholder
          width={600}
          height={220}
          label="Hero bienvenida (foto o ilustración)"
        />
      </div>

      {/* Greeting */}
      <p className="text-[#1c2634]/50 text-xs font-semibold uppercase tracking-widest mb-2">
        Farrera Academy
      </p>
      <h1 className="text-2xl font-bold text-[#1c2634] leading-snug mb-4">
        Hola [Nombre], bienvenido a tu espacio.
      </h1>
      <p className="text-[#333333]/65 text-sm leading-relaxed mb-6">
        Tu cuenta en <strong className="text-[#1c2634]">Farrera Academy</strong>{" "}
        ya está activa. Esta plataforma fue creada para que puedas crecer
        profesionalmente desde adentro, a tu propio ritmo y desde cualquier
        lugar.
      </p>
      <p className="text-[#333333]/65 text-sm leading-relaxed mb-8">
        Encuentra los cursos de tu área, retoma donde lo dejaste y certifica lo
        que ya sabes. Todo en un mismo lugar.
      </p>

      {/* CTA */}
      <div className="text-center mb-8">
        <a
          href="#"
          className="inline-block bg-[#1c2634] text-white text-sm font-semibold px-8 py-3.5 rounded-xl no-underline"
        >
          Entrar a Farrera Academy →
        </a>
        <p className="text-[#333333]/35 text-xs mt-3">
          O copia este enlace:{" "}
          <span className="text-[#1c2634]/50 font-mono">[url-plataforma]</span>
        </p>
      </div>

      <hr className="border-gray-100 mb-6" />

      {/* Credentials block */}
      {/* <div className="bg-[#F4F7FB] rounded-xl p-5 mb-6">
        <p className="text-xs font-semibold text-[#1c2634]/60 uppercase tracking-wide mb-3">
          Tus credenciales de acceso
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#333333]/50">Correo</span>
            <span className="text-xs font-medium text-[#1c2634] font-mono">[correo@grupofarrera.com]</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#333333]/50">Contraseña temporal</span>
            <span className="text-xs font-medium text-[#1c2634] font-mono">[contraseña-temporal]</span>
          </div>
        </div>
        <p className="text-[10px] text-[#333333]/35 mt-3">
          Se te pedirá cambiar tu contraseña al primer inicio de sesión.
        </p>
      </div> */}

      <p className="text-[#333333]/45 text-xs leading-relaxed">
        Si tienes alguna duda, contacta al Área de Desarrollo y Capacitación de
        Grupo Farrera.
      </p>
    </EmailWrapper>
  );
}
