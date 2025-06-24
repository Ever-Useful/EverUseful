import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { Hero } from "@/components/Sustainable/Hero";
import { StatsSection } from "@/components/Sustainable/StatsSection";
import { BenefitsSection } from "@/components/Sustainable/BenefitSection";
import { CommercialSection } from "@/components/Sustainable/CommercialSection";
import { ProjectsSection } from "@/components/Sustainable/ProjectsSection";
// import { TeamSection } from "@/components/Sustainable/TeamSection";
import { BlogSection } from "@/components/Sustainable/BlogSection";

const Sustainable = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <Hero />
      <StatsSection />
      <BenefitsSection />
      <CommercialSection />
      <ProjectsSection />
      {/* <TeamSection /> */}
      <BlogSection />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Sustainable;
