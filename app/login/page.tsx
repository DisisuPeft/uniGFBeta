import Image from "next/image";
import Link from "next/link";
import LoginForm from "../components/form/login-form";

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#1c2634] flex-col items-center justify-between p-14 relative overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20" />

        {/* Top — Logo */}
        <div className="relative z-10 w-full">
          <Link href="/">
            <Image
              src="/assets/logo/f-academy-white.webp"
              alt="Farrera Academy"
              width={160}
              height={160}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Center — tagline */}
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold text-white leading-snug mb-4">
            Tu espacio para crecer
            {/* <br />
            <span className="text-white/60 font-normal italic">
              dentro de casa.
            </span> */}
          </h1>
          <p className="text-white/45 text-sm max-w-xs mx-auto leading-relaxed">
            Farrera Academy es la plataforma de capacitación creada por y para
            las personas que conforman Grupo Farrera.
          </p>
        </div>

        {/* Bottom — trust strip */}
        <div className="relative z-10 w-full flex flex-col gap-3">
          {[
            "Para todos los colaboradores",
            "Programas por área",
            "Tu crecimiento, medido",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
              <span className="text-white/40 text-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F4F7FB] p-6">
        {/* Mobile logo */}
        <div className="flex justify-center mb-8 lg:hidden">
          <Link href="/">
            <Image
              src="/assets/logo/f-academy-white.webp"
              alt="Farrera Academy"
              width={100}
              height={100}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1c2634] mb-1.5">
                Bienvenido de vuelta
              </h2>
              <p className="text-[#333333]/55 text-sm">
                Ingresa con tu correo corporativo
              </p>
            </div>

            <LoginForm />
          </div>

          <p className="text-center text-[#333333]/35 text-xs mt-6">
            © {new Date().getFullYear()} Grupo Farrera · Área de Desarrollo y
            Capacitación
          </p>
        </div>
      </div>
    </div>
  );
}
