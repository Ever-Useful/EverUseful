import { Header } from "@/components/Header";
import HeroSection from "@/components/about/HeroSection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
// import WhoWeServeSection from "@/components/about/WhoWeServeSection";
import ComparisonSection from "@/components/about/ComparisonSection";
import TeamSection from "@/components/about/TeamSection";
import EventsSection from "@/components/about/EventsSection";
import FAQSection from "@/components/about/FAQSection";
// import TestimonialsSection from "@/components/about/TestimonialsSection";
import CTASection from "@/components/about/CTASection";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 animate-gradient-live text-white">
      <Header />
      <HeroSection />
      <MissionVisionSection />
      {/* <WhoWeServeSection /> */}
      <ComparisonSection />
      <TeamSection />
      {/* <UpcomingPhaseSection /> */}
      <EventsSection />
        <FAQSection /> 
      {/* <TestimonialsSection />  */}
       <CTASection />
      {/* <test deployment /> */}
      <Footer />
    </div>
  );
};

export default About;