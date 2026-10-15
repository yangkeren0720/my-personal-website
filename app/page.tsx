import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import AISection from "@/components/AISection";
import SupplyChain from "@/components/SupplyChain";
import PlanningLab from "@/components/PlanningLab";
import Management from "@/components/Management";
import Dashboard from "@/components/Dashboard";
import Showcase from "@/components/Showcase";
import Projects from "@/components/Projects";
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
        <SupplyChain />
        <PlanningLab />
        <Dashboard />
        <AISection />
        <Management />
        <Showcase />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
