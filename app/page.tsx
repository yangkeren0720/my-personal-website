import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Builds from "@/components/Builds";
import SOPDemo from "@/components/SOPDemo";
import Experience from "@/components/Experience";
import SkyWaterSection from "@/components/SkyWaterSection";
import MinoSection from "@/components/MinoSection";
import BelongSection from "@/components/BelongSection";
import RBRSection from "@/components/RBRSection";
import Multitask from "@/components/Multitask";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";

// One structure: who I am, both skills side by side, a dashboard to try, the resume, then one section per employer holding
// only that job's stories and charts, how I run the roles at once, contact.
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Builds />
        <SOPDemo />
        <Experience />
        <SkyWaterSection />
        <RBRSection />
        <BelongSection />
        <MinoSection />
        <Multitask />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
