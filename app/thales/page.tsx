import QuienesSomosPage from "../ui/landing-thales/about";
import Header from "../ui/landing-thales/header";
import Hero from "../ui/landing-thales/hero";
import FilosofiaEducativa from "../ui/landing-thales/filosofia-thales";
import OfertaEducativaPage from "../ui/landing-thales/oferta";
import ContactoPage from "../ui/landing-thales/contacto";
import Footer from "../ui/landing-thales/footer";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-[linear-gradient(135deg,#1E3A5F_0%,#1F6F8A_45%)] font-sans">
      <Header />
      <main className="flex flex-col flex-1 w-full">
        <Hero />
        <QuienesSomosPage />
        <FilosofiaEducativa />
        <OfertaEducativaPage />
        <ContactoPage />
      </main>
      <Footer />
    </div>
  );
}
