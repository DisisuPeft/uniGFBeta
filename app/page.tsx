import Header from "./ui/landing-farrera/header";
import Hero from "./ui/landing-farrera/hero";
import Stats from "./ui/landing-farrera/stats";
import Areas from "./ui/landing-farrera/areas";
import PlataformaPreview from "./ui/landing-farrera/plataforma-preview";
import ComoFunciona from "./ui/landing-farrera/como-funciona";
// import Comunidad from "./ui/landing-farrera/comunidad";
import CTA from "./ui/landing-farrera/cta";
import Footer from "./ui/landing-farrera/footer";

export default function Page() {
  return (
    <main className="min-h-screen font-sans">
      <Header />
      <Hero />
      <Stats />
      <Areas />
      <PlataformaPreview />
      <ComoFunciona />
      {/* <Comunidad /> */}
      <CTA />
      <Footer />
    </main>
  );
}
