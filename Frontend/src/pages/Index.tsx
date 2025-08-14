import Header from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ImpactMotive } from "@/components/ImpactMotive";
import { HowItWorks } from "@/components/HowItWorks";
import { CommunityConnect } from "@/components/CommunityConnect";
import { lazy, Suspense, useMemo, useCallback } from "react";

// Lazy load heavy components with better chunking
const LazyGlobalCollaborations = lazy(() => 
  import("@/components/GlobalCollaborations").then(module => ({ 
    default: module.GlobalCollaborations 
  }))
);
const LazyWhatWeProvide = lazy(() => 
  import("@/components/WhatWeProvide").then(module => ({ 
    default: module.WhatWeProvide 
  }))
);
const LazyUpcomingPhase = lazy(() => 
  import("@/components/UpcomingPhase").then(module => ({ 
    default: module.UpcomingPhase 
  }))
);
const LazyFooter = lazy(() => 
  import("@/components/Footer").then(module => ({ 
    default: module.Footer 
  }))
);
const LazyChatbot = lazy(() => 
  import("@/components/Chatbot").then(module => ({ 
    default: module.Chatbot 
  }))
);

// Performance-optimized loading fallback
const OptimizedFallback = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
);

const Index = () => {
  // Memoize components to prevent unnecessary re-renders
  const MemoHeader = useMemo(() => <Header />, []);
  const MemoHero = useMemo(() => <Hero />, []);
  const MemoFeaturedProducts = useMemo(() => <FeaturedProducts />, []);
  const MemoImpactMotive = useMemo(() => <ImpactMotive />, []);
  const MemoHowItWorks = useMemo(() => <HowItWorks deferVideo={true} />, []);
  const MemoCommunityConnect = useMemo(() => <CommunityConnect />, []);

  // Optimize lazy loading with better suspense boundaries
  const renderLazyComponents = useCallback(() => (
    <>
      <Suspense fallback={<OptimizedFallback />}>
        <LazyGlobalCollaborations />
      </Suspense>
      <Suspense fallback={<OptimizedFallback />}>
        <LazyUpcomingPhase />
      </Suspense>
      <Suspense fallback={<OptimizedFallback />}>
        <LazyWhatWeProvide />
      </Suspense>
      <Suspense fallback={<OptimizedFallback />}>
        <LazyFooter />
      </Suspense>
      <Suspense fallback={null}>
        <LazyChatbot />
      </Suspense>
    </>
  ), []);

  return (
    <div className="relative min-h-screen overflow-hidden header-spacer">
      {MemoHeader}
      {MemoHero}
      {MemoFeaturedProducts}
      {MemoImpactMotive}
      {MemoHowItWorks}
      {MemoCommunityConnect}
      {renderLazyComponents()}
    </div>
  );
};

export default Index;
