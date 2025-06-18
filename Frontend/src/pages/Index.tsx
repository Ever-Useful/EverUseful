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
import { lazy, Suspense } from "react";

// Lazy load heavy components
const LazyChatbot = lazy(() => import("@/components/Chatbot").then(module => ({ default: module.Chatbot })));

// import { FreelancingPreview } from "@/components/FreelancingPreview";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Optimized Background - Static gradient instead of animated */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)'
        }}
      />

      {/* Simplified scanline overlay - reduced opacity and removed animation */}
      <div
        className="fixed inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 2px)'
        }}
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
      
      {/* Lazy load chatbot */}
      <Suspense fallback={null}>
        <LazyChatbot />
      </Suspense>
    </div>
  );
};

export default Index;
