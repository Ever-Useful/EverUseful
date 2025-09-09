import Header from '@/components/Header';
import {Footer} from '@/components/Footer';
import { lazy, Suspense, useMemo, useCallback } from "react";
import React from 'react';

const Hero = React.lazy(() => 
    import('@/components/index/Hero').then(module => ({ 
        default: module.Hero 
    }))
); 
const FeaturedProducts = React.lazy(() => 
    import('@/components/index/FeaturedProducts').then(module => ({ 
        default: module.FeaturedProducts 
    }))
); 
const ImpactMotive = React.lazy(() => 
    import('@/components/index/ImpactMotive').then(module => ({ 
        default: module.ImpactMotive 
    }))
); 
const HowItWorks = React.lazy(() => 
    import('@/components/index/HowItWorks').then(module => ({ 
        default: module.HowItWorks 
    }))
); 
const CommunityConnect = React.lazy(() => 
    import('@/components/index/CommunityConnect').then(module => ({ 
        default: module.CommunityConnect 
    }))
); 
const GlobalCollaborations = React.lazy(() => 
    import('@/components/index/GlobalCollaborations').then(module => ({ 
        default: module.GlobalCollaborations 
    }))
); 
const UpcomingPhase = React.lazy(() => 
    import('@/components/index/UpcomingPhase').then(module => ({ 
        default: module.UpcomingPhase 
    }))
); 
const WhatWeProvide = React.lazy(() => 
    import('@/components/index/WhatWeProvide').then(module => ({ 
        default: module.WhatWeProvide 
    }))
); 

const Index = () => {
    return (
        <>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                <Hero />
                <FeaturedProducts />
                <ImpactMotive />
                <HowItWorks deferVideo={true} />
                <CommunityConnect />
                <GlobalCollaborations />
                <UpcomingPhase />
                <WhatWeProvide />
            </Suspense>
            <Footer />
        </>
    )
}

export default Index;