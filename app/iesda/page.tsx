import Header from "../ui/landing-iesda/header";
import { Hero } from "../ui/landing-iesda/hero";
import { About } from "../ui/landing-iesda/about";
import { Mission } from "../ui/landing-iesda/mission";
import { Vision } from "../ui/landing-iesda/vission";
import { Programs } from "../ui/landing-iesda/programas";
import { WhyIesda } from "../ui/landing-iesda/why-iesda";
import { Footer } from "../ui/landing-iesda/footer";
import { CTA } from "../ui/landing-iesda/cta";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Mission />
      <Vision />
      <Programs />
      <WhyIesda />
      <CTA />
      <Footer />
    </main>
  );
}
