import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ImpactMotive } from "@/components/ImpactMotive";
import { GlobalCollaborations } from "@/components/GlobalCollaborations";
import { HowItWorks } from "@/components/HowItWorks";
import { CommunityConnect } from "@/components/CommunityConnect";
import { UpcomingPhase } from "@/components/UpcomingPhase";
import { WhatWeProvide } from "@/components/WhatWeProvide";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

// import { FreelancingPreview } from "@/components/FreelancingPreview";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden transform-gpu">
      {/* Rotating Conic-Gradient Background */}
      <div
        className="fixed inset-0 -z-10 bg-[conic-gradient(from_0deg_at_50%_50%,_rgb(10,25,47),_rgb(22,60,107),_rgb(10,25,47))] opacity-80 animate-spin-slow"
        style={{ animationDuration: "30s" }}
      />

      {/* Scanline Overlay */}
      <div
        className="fixed inset-0 -z-10 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_1px,transparent_1px,transparent_2px)] animate-scroll-vertical"
        style={{ animationDuration: "4s" }}
      />

      {/* Main content */}
      <Header />
      <Hero />
      <FeaturedProducts/>
      {/* <FreelancingPreview /> */}
      <ImpactMotive />
      <GlobalCollaborations />
      <HowItWorks />

      {/* <TrustedByLeaders /> */}
      <CommunityConnect />
      <UpcomingPhase />
      <WhatWeProvide />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
