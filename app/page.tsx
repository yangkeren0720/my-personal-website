import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Builds from "@/components/Builds";
import SOPDemo from "@/components/SOPDemo";
import Experience from "@/components/Experience";
import SkyWaterSection from "@/components/SkyWaterSection";
import MinoSection from "@/components/MinoSection";
import BelongSection from "@/components/BelongSection";
import RBRSection from "@/components/RBRSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";

// One structure: who I am, the resume timeline right away (recruiters asked to see the background first), both skills
// side by side, a dashboard to try, then one section per employer holding
// only that job's stories and charts (full-time supply chain work first, the side business last), contact.
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Builds />
        <SOPDemo />
        <SkyWaterSection />
        <MinoSection />
        <BelongSection />
        <RBRSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
