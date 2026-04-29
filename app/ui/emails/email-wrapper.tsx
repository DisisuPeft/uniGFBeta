import Image from "next/image";

interface EmailWrapperProps {
  children: React.ReactNode;
  preheader?: string;
}

export function EmailPlaceholder({
  width,
  height,
  label,
}: {
  width: number;
  height: number;
  label: string;
}) {
  return (
    <div
      className="relative bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center w-full"
      style={{ height }}
    >
      <div className="text-center">
        <div className="text-gray-400 text-xs font-mono mb-1">
          {width} × {height} px
        </div>
        <div className="text-gray-400 text-xs">{label}</div>
      </div>
      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">
        📐 {width} × {height} — {label}
      </div>
    </div>
  );
}

export default function EmailWrapper({ children, preheader }: EmailWrapperProps) {
  return (
    <div className="bg-[#F4F7FB] py-8 px-4">
      {preheader && (
        <p className="text-[0px] text-transparent leading-none max-h-0 overflow-hidden">
          {preheader}
        </p>
      )}
      <div className="max-w-[600px] mx-auto">
        {/* Email header */}
        <div className="bg-[#1c2634] px-8 py-6 rounded-t-xl flex items-center justify-between">
          <Image
            src="/assets/logo/f-academy-white.webp"
            alt="Farrera Academy"
            width={130}
            height={40}
            className="object-contain h-10 w-auto"
          />
          <span className="text-white/30 text-xs">
            Grupo Farrera
          </span>
        </div>

        {/* Email body */}
        <div className="bg-white px-8 py-8">
          {children}
        </div>

        {/* Email footer */}
        <div className="bg-[#1c2634]/5 border border-t-0 border-gray-100 px-8 py-6 rounded-b-xl text-center">
          <p className="text-[#333333]/40 text-xs mb-2">
            Este correo fue enviado a <span className="font-medium text-[#1c2634]/50">[correo@grupofarrera.com]</span>
          </p>
          <p className="text-[#333333]/30 text-xs">
            © {new Date().getFullYear()} Grupo Farrera · Área de Desarrollo y Capacitación
            <br />
            [Ciudad, Estado, México]
          </p>
          <div className="mt-3 flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#1c2634]/20 inline-block" />
            <a href="#" className="text-[#1c2634]/40 text-xs hover:text-[#1c2634] transition-colors">
              Cancelar suscripción
            </a>
            <span className="w-1 h-1 rounded-full bg-[#1c2634]/20 inline-block" />
            <a href="#" className="text-[#1c2634]/40 text-xs hover:text-[#1c2634] transition-colors">
              Ver en el navegador
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
