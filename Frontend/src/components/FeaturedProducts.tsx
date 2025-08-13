"use client";

import React, { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  TrendingUp,
  Users,
  ArrowRight,
  ExternalLink,
  X,
} from "lucide-react";
import {
  Card as UICard,
  CardHeader as UICardHeader,
  CardTitle as UICardTitle,
  CardDescription as UICardDescription,
  CardContent as UICardContent,
} from "@/components/ui/card";

export const FeaturedProducts: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const navigate = useNavigate();
  const featuredProjects = useMemo(
    () => [
      {
        id: 1,
        title: "EcoTrack",
        subtitle: "Carbon Footprint Monitor",
        description:
          "AI-powered sustainability tracker for businesses and individuals. This tool helps you monitor, analyze, and reduce your carbon emissions with real-time data and actionable insights.",
        category: "Sustainability",
        author: "MIT Research Team",
        rating: 4.9,
        users: "2.5K",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
        tags: ["AI", "Sustainability", "IoT"],
        gradient: "from-green-500 to-emerald-600",
        href: "https://www.chainfly.co/"
      },
      {
        id: 2,
        title: "QuantumMed",
        subtitle: "Drug Discovery Platform",
        description:
          "Quantum computing approach to pharmaceutical research. QuantumMed accelerates the discovery of new drugs by simulating molecular interactions at unprecedented speeds.",
        category: "Healthcare",
        author: "Stanford PhD Collective",
        rating: 4.8,
        users: "1.8K",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        tags: ["Quantum", "Healthcare", "Research"],
        gradient: "from-blue-500 to-purple-600",
        href: "https://www.chainfly.co/"
      },
      {
        id: 3,
        title: "AgriBot",
        subtitle: "Smart Farming Assistant",
        description:
          "Autonomous farming solution with predictive analytics. AgriBot leverages robotics and AI to optimize crop yields and reduce manual labor.",
        category: "Agriculture",
        author: "AgTech Innovators",
        rating: 4.7,
        users: "3.2K",
        image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
        tags: ["Robotics", "Agriculture", "AI"],
        gradient: "from-yellow-500 to-orange-600",
        href: "https://www.chainfly.co/"
      },
      {
        id: 4,
        title: "ROBot",
        subtitle: "Smart Farming Assistant",
        description:
          "Autonomous farming solution with predictive analytics. ROBot is designed to enhance efficiency and sustainability in agriculture.",
        category: "Agriculture",
        author: "AgTech Innovators",
        rating: 4.7,
        users: "3.2K",
        image: "https://plus.unsplash.com/premium_photo-1678344170545-c3edef92a16e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tags: ["Robotics", "Agriculture", "AI"],
        gradient: "from-yellow-500 to-orange-600",
        href: "https://www.chainfly.co/"
      },
    ],
    []
  );

  // Overlay for background blur/dim when a card is expanded
  const Overlay = () =>
    expanded !== null ? (
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"></div>
    ) : null;

  // New responsive popup component
  const ProjectModal = ({ project }: { project: typeof featuredProjects[0] }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setExpanded(null)}
      />
      
             {/* Modal */}
       <div className="relative w-full max-w-4xl h-[400px] overflow-hidden bg-white rounded-2xl shadow-2xl">
         {/* Close button */}
         <button
           className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
           onClick={() => setExpanded(null)}
           aria-label="Close"
         >
           <X className="w-5 h-5 text-gray-700" />
         </button>

         {/* Content */}
         <div className="flex flex-col lg:flex-row h-full">
           {/* Image section */}
           <div className="w-full lg:w-2/5 h-full relative overflow-hidden">
             <img
               src={project.image}
               alt={project.title}
               className="w-full h-full object-cover object-center"
               style={{ 
                 width: '100%',
                 height: '100%',
                 objectFit: 'cover'
               }}
             />
             <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-20`} />
             <Badge variant="outline" className="absolute top-3 left-3 bg-white/95 text-gray-800 shadow-lg border-0 hover:bg-white/95">
               {project.category}
             </Badge>
           </div>

          {/* Content section */}
          <div className="w-full lg:w-3/5 p-6 lg:p-8 flex flex-col">
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {project.title}
              </h2>
              <p className="text-sm lg:text-base text-gray-600 mb-4">
                {project.subtitle}
              </p>
              <p className="text-sm lg:text-base text-gray-700 mb-6 leading-relaxed">
                {project.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs rounded-full px-3 py-1 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Project info */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                <span className="font-medium">{project.author}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{project.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{project.users}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect button */}
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => {
                window.open(project.href, "_blank", "noopener,noreferrer");
              }}
            >
              Connect to Project
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="featured" className="relative py-14 bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden  will-change-transform transform-gpu">
      {/* Overlay for blur/dim */}
      <Overlay />

      {/* Project Modal */}
      {expanded !== null && (
        <ProjectModal
          project={featuredProjects.find((p) => p.id === expanded)!}
        />
      )}

      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[92vw] relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-[17px] sm:text-4xl font-bold text-black mb-4 animate-fade-in leading-tight mobile-text-4xl">
            Discover <span className="text-blue-600">Game-Changing</span> Projects
          </h1>
          <p className="text-[12px] sm:text-base text-gray-600 mb-8 sm:mb-16 max-w-full sm:max-w-sm lg:max-w-full leading-relaxed animate-fade-in delay-200 mobile-text-base">
            Explore innovative solutions from our talented community.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProjects.map((p) => (
                         <UICard
               key={p.id}
               className={`group flex flex-col rounded-2xl border border-gray-200 bg-white/90 shadow transition-all duration-300 h-full cursor-pointer
                 ${expanded === p.id ? "z-40" : ""}
                 ${expanded !== null && expanded !== p.id ? "pointer-events-none opacity-40" : ""}
                 hover:scale-105 hover:shadow-2xl`}
               style={{
                 minHeight: 340,
                 maxWidth: 340,
                 margin: "0 auto",
               }}
             >
              {/* Image */}
              <div
                className="relative w-full"
                style={{
                  aspectRatio: "4/2.5",
                  minHeight: 90,
                  maxHeight: 120,
                  overflow: "hidden",
                  borderRadius: "1rem 1rem 0 0",
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${p.gradient} opacity-20`}
                />
                <Badge variant="outline" className="absolute top-3 left-3 h-7 px-3 text-xs rounded-full bg-white/95 text-gray-800 shadow border-0 hover:bg-white/95">
                  {p.category}
                </Badge>
              </div>
              {/* Content */}
              <UICardContent className="flex flex-col flex-1 px-4 pt-2 pb-0">
                
                  <UICardTitle className="text-lg md:text-lg font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </UICardTitle>
                  <p className="text-sm text-gray-500">{p.subtitle}</p>
                
                <UICardDescription
                  className="text-gray-600 text-sm mb-1 leading-relaxed"
                >
                  {p.description}
                </UICardDescription>
                <div className="flex flex-wrap gap-1 mb-1">
                  {p.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="text-xs rounded-full px-2.5 py-1 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
                {/* Footer */}
                {/* <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-medium truncate">{p.author}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{p.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>{p.users}</span>
                    </div>
                  </div>
                </div> */}
                <Button
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-4 transition-all duration-200 hover:shadow-md border-0 -mb-2"
                  onClick={() => setExpanded(p.id)}
                >
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </UICardContent>
            </UICard>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="sm:hidden">
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {featuredProjects.map((p) => (
                         <UICard
                   key={p.id}
                   className={`
                     flex-shrink-0 snap-start
                     w-[80vw] max-w-xs
                     transition-all duration-300
                     rounded-2xl border border-gray-200 bg-white/95 shadow-lg
                     group flex flex-col cursor-pointer
                     ${expanded === p.id ? "z-40" : ""}
                     ${expanded !== null && expanded !== p.id ? "pointer-events-none opacity-40" : ""}
                     hover:scale-105 hover:shadow-2xl hover:border-blue-200
                   `}
                   style={{
                     minHeight: 240,
                     marginRight: 0,
                   }}
                 >
                {/* Image */}
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: "4/2.5",
                    minHeight: 70,
                    maxHeight: 90,
                    borderRadius: "1rem 1rem 0 0",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${p.gradient} opacity-30`}
                  />
                  <Badge variant="outline" className="absolute top-2 left-2 h-6 px-2 mobile-text-xs rounded-full bg-white/95 text-gray-800 shadow-lg border-0 hover:bg-white/95">
                    {p.category}
                  </Badge>
                </div>
                {/* Content */}
                <UICardContent className="flex flex-col flex-1 px-4 pt-2 pb-0">
                    <UICardTitle className="mobile-text-2xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </UICardTitle>
                    <p className="mobile-text-base text-gray-500">{p.subtitle}</p>
                  
                  <UICardDescription
                    className="text-gray-600 mobile-text-base mb-1 leading-relaxed"
                  >
                    {p.description}
                  </UICardDescription>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {p.tags.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="mobile-text-base rounded-full px-2 py-1 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                  {/* Footer */}
                  {/* <div className="flex items-center justify-between mobile-text-sm text-gray-500 mb-1">
                    <span className="font-medium truncate">{p.author}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{p.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span>{p.users}</span>
                      </div>
                    </div>
                  </div> */}
                  <Button
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-0 py-2.5 -mb-2"
                    onClick={() => setExpanded(p.id)}
                  >
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </UICardContent>
              </UICard>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <div className="text-center mt-14">
          <Button
            onClick={() => navigate("/marketplace")}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200 hover:shadow-md border-0 mobile-text-2xl"
          >
            <TrendingUp className="mr-2 w-5 h-5" />
            View All Projects
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scoped CSS for bounce animation and mobile font sizes */}
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.96); }
          60% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(.68,-0.55,.27,1.55);
        }
        /* Hide scrollbar for horizontal scroll on mobile */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
