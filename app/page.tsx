import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import AISection from "@/components/AISection";
import PlanningLab from "@/components/PlanningLab";
import SkyWaterStories from "@/components/SkyWaterStories";
import MinoSection from "@/components/MinoSection";
import Showcase from "@/components/Showcase";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Experience />
        <About />
        <SkyWaterStories />
        <PlanningLab />
        <MinoSection />
        <AISection />
        <Showcase />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
