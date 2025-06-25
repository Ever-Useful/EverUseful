import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUp, CircleCheck, CirclePlus, FileText, Image, Shield, Users, Briefcase, Globe } from 'lucide-react';
import Header from "@/components/HeaderBackup";
import { lazy, Suspense, useMemo } from "react";
import FeaturedProducts from '@/components/FeaturedProducts';
import IndexHero from '@/components/IndexHero';
import { GlobalCollaborations } from '@/components/GlobalCollaborations';
import { HowItWorks2 } from '@/components/HowItWorks2';
import { SustainabilitySection } from '@/components/SustainabilitySection';

const LazyFooter = lazy(() => import("@/components/Footer").then(module => ({ default: module.Footer })));
const LazyChatbot = lazy(() => import("@/components/Chatbot").then(module => ({ default: module.Chatbot })));

const Index = () => {
  const [visibleSection, setVisibleSection] = useState('');
  const MemoHeader = useMemo(() => <Header />, []);
  

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          setVisibleSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const features = [
    { icon: Shield, title: "Security", desc: "End-to-end encrypted platform with secure transactions" },
    { icon: FileText, title: "Resources", desc: "Access to comprehensive project development resources" },
    { icon: CircleCheck, title: "AI Matching", desc: "Smart algorithm matches projects with right enterprises" },
    { icon: Users, title: "Project Control", desc: "Complete ownership and control over your projects" },
    { icon: CirclePlus, title: "24/7 Support", desc: "Round-the-clock assistance for all your queries" },
    { icon: Image, title: "Mentorship", desc: "Expert guidance from industry professionals" }
  ];

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "500+", label: "Projects Sold" },
    { number: "100+", label: "Enterprise Partners" },
    { number: "500+", label: "Mentors" }
  ];

  const partners = [
    "Microsoft", "Google", "Amazon", "IBM", "Intel", "Oracle", "Salesforce", "Adobe"
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {MemoHeader}
      <IndexHero />      
      <FeaturedProducts />

      {/* Motive & Stats */}
      <section id="motive" className="animate-on-scroll py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">
                Empowering the Next Generation of Innovators
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                AMOGH exists to bridge the gap between academic excellence and real-world application. We provide students with opportunities to monetize their creativity while offering enterprises access to fresh, innovative solutions.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GlobalCollaborations/>
      <HowItWorks2/>
      <SustainabilitySection/>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 animate-gradient-shift"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-400/20 rounded-full filter blur-3xl"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-300">Academic Journey</span>
          </h2>

          <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students and enterprises already accelerating innovation with AMOGH
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl font-medium"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>10,000+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>500+ Enterprises</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>50+ Countries</span>
            </div>
          </div>
        </div>

        {/* Animation styles */}
        <style>{`
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-shift {
      background-size: 200% 200%;
      animation: gradient-shift 8s ease infinite;
    }
  `}</style>
      </section>
      <Suspense fallback={null}>
        <LazyFooter />
        <LazyChatbot />
      </Suspense>
    </div>
  );
};

export default Index;