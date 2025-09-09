import Header from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ImpactMotive } from "@/components/ImpactMotive";
import { HowItWorks } from "@/components/HowItWorks";
import { CommunityConnect } from "@/components/CommunityConnect";
import { GlobalCollaborations } from "@/components/GlobalCollaborations";
import { WhatWeProvide } from "@/components/WhatWeProvide";
import { UpcomingPhase } from "@/components/UpcomingPhase";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden header-spacer">
      <Header />
      <Hero />
      <FeaturedProducts />
      <ImpactMotive />
      <HowItWorks deferVideo={true} />
      <CommunityConnect />
      <GlobalCollaborations />
      <UpcomingPhase />
      <WhatWeProvide />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;