import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, DollarSign, Clock, ArrowRight, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

export const FreelancingHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const academicProfiles = [
    {
      id: 1,
      name: "Dr. Elena Vasquez",
      role: "AI Ethics Researcher",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 4.9,
      rate: "Research Collaboration",
      institution: "MIT",
      field: "Computer Science"
    },
    {
      id: 2,
      name: "Prof. Marcus Chen",
      role: "Quantum Computing",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4.8,
      rate: "Peer Review",
      institution: "Stanford",
      field: "Physics"
    },
    {
      id: 3,
      name: "Dr. Amira Hassan",
      role: "Computational Biology",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      rating: 4.7,
      rate: "Co-authorship",
      institution: "Oxford",
      field: "Bioinformatics"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Academic Focus */}
          <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-800 mb-6 leading-tight">
              Global{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">
                Freelance
              </span>{" "}
              <span className="block lg:inline">Network</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Access a global network of skilled freelancers, innovative students, and expert professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-lg px-8 py-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                <Users className="mr-2 w-5 h-5" />
                Find Freelancers
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-slate-400 text-slate-700 hover:bg-slate-50 hover:border-slate-500 text-lg px-8 py-4 backdrop-blur-sm hover:scale-105 transition-all duration-300 font-medium"
              >
                <Briefcase className="mr-2 w-5 h-5" />
                Become a Freelancer
              </Button>
            </div>
          </div>

          {/* Right Content - Academic Profiles - Hidden on mobile */}
          <div className={`relative transition-all duration-1000 delay-300 hidden lg:block ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Main Academic Image */}
            <div className="relative mb-8">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop" 
                alt="Academic researcher in library"
                className="rounded-xl shadow-2xl w-full max-w-md mx-auto lg:max-w-full object-cover h-80 border border-slate-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-xl" />
              
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};