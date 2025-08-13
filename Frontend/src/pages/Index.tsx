import Header from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ImpactMotive } from "@/components/ImpactMotive";
import { HowItWorks } from "@/components/HowItWorks";
import { CommunityConnect } from "@/components/CommunityConnect";
import { lazy, Suspense, useMemo } from "react";

// Lazy load heavy components
const LazyGlobalCollaborations = lazy(() => import("@/components/GlobalCollaborations").then(module => ({ default: module.GlobalCollaborations })));
const LazyWhatWeProvide = lazy(() => import("@/components/WhatWeProvide").then(module => ({ default: module.WhatWeProvide })));
const LazyUpcomingPhase = lazy(() => import("@/components/UpcomingPhase").then(module => ({ default: module.UpcomingPhase })));
const LazyFooter = lazy(() => import("@/components/Footer").then(module => ({ default: module.Footer })));
const LazyChatbot = lazy(() => import("@/components/Chatbot").then(module => ({ default: module.Chatbot })));


const BackUp = () => {
  const MemoHeader = useMemo(() => <Header />, []);
  const MemoHero = useMemo(() => <Hero />, []);
  const MemoFeaturedProducts = useMemo(() => <FeaturedProducts />, []);
  const MemoImpactMotive = useMemo(() => <ImpactMotive />, []);
  const MemoHowItWorks = useMemo(() => <HowItWorks deferVideo={true} />, []);
  const MemoCommunityConnect = useMemo(() => <CommunityConnect />, []);

  return (
    <div className="relative min-h-screen overflow-hidden header-spacer">
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

export default BackUp;
