import Header from "./ui/landing-cinfa/header";
import HeroSection from "./ui/landing-cinfa/hero";
import AboutCINFA from "./ui/landing-cinfa/about-cinfa";
import AcademicModel from "./ui/landing-cinfa/academic-model";
import InstitutesPreview from "./ui/landing-cinfa/institutos";
import WhyCINFA from "./ui/landing-cinfa/why-cinfa";
import CallToAction from "./ui/landing-cinfa/call-to-action";
import Footer from "./ui/landing-cinfa/footer";

export default function Page() {
  return (
    <main className="min-h-screen font-sans">
      <Header />
      <HeroSection />
      <AboutCINFA />
      <AcademicModel />
      <InstitutesPreview />
      <WhyCINFA />
      <CallToAction />
      <Footer />
    </main>
  );
}
