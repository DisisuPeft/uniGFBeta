import Link from "next/link";
import Image from "next/image";

const platformLinks = ["Áreas de capacitación", "Cómo funciona", "Acceder"];
const groupLinks = ["Nuestra empresa", "Contacto", "Aviso de privacidad"];

export default function Footer() {
  return (
    <footer className="bg-[#1c2634] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="relative h-9 w-40 mb-4">
              <Image
                src="/assets/logo/f-academy.webp"
                alt="Farrera Academy"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              La plataforma de capacitación corporativa de Grupo Farrera. Formando al
              equipo que construye el futuro.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <p className="text-white/70 font-semibold text-sm mb-4">Plataforma</p>
            <ul className="space-y-2.5">
              {platformLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-white/40 hover:text-white/70 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group links */}
          <div>
            <p className="text-white/70 font-semibold text-sm mb-4">Grupo Farrera</p>
            <ul className="space-y-2.5">
              {groupLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-white/40 hover:text-white/70 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Grupo Farrera. Todos los derechos reservados.
          </p>
          <p className="text-white/20 text-xs">
            Farrera Academy — Plataforma corporativa de capacitación
          </p>
        </div>
      </div>
    </footer>
  );
}
