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
import { lazy, Suspense, useMemo } from "react";

// Lazy load heavy components
const LazyGlobalCollaborations = lazy(() => import("@/components/GlobalCollaborations").then(module => ({ default: module.GlobalCollaborations })));
const LazyWhatWeProvide = lazy(() => import("@/components/WhatWeProvide").then(module => ({ default: module.WhatWeProvide })));
const LazyUpcomingPhase = lazy(() => import("@/components/UpcomingPhase").then(module => ({ default: module.UpcomingPhase })));
const LazyFooter = lazy(() => import("@/components/Footer").then(module => ({ default: module.Footer })));
const LazyChatbot = lazy(() => import("@/components/Chatbot").then(module => ({ default: module.Chatbot })));

// import { FreelancingPreview } from "@/components/FreelancingPreview";

const Index = () => {
  const MemoHeader = useMemo(() => <Header />, []);
  const MemoHero = useMemo(() => <Hero />, []);
  const MemoFeaturedProducts = useMemo(() => <FeaturedProducts />, []);
  const MemoImpactMotive = useMemo(() => <ImpactMotive />, []);
  const MemoHowItWorks = useMemo(() => <HowItWorks deferVideo={true} />, []);
  const MemoCommunityConnect = useMemo(() => <CommunityConnect />, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Optimized Background - Static gradient instead of animated */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)'
        }}
      />

      {/* Single overlay for scanline effect, reduced opacity */}
      <div
        className="fixed inset-0 -z-10 opacity-2"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.07), rgba(255,255,255,0.07) 1px, transparent 1px, transparent 2px)'
        }}
      />

      {/* Main content */}
      {MemoHeader}
      {MemoHero}
      {MemoFeaturedProducts}
      {MemoImpactMotive}
      <Suspense fallback={null}>
        <LazyGlobalCollaborations />
      </Suspense>
      {MemoHowItWorks}
      {MemoCommunityConnect}
      <Suspense fallback={null}>
        <LazyUpcomingPhase />
        <LazyWhatWeProvide />
        <LazyFooter />
        <LazyChatbot />
      </Suspense>
    </div>
  );
};

export default Index;
