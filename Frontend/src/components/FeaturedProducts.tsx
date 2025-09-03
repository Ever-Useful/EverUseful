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

  // New improved modal popup
  const ProjectModal = ({ project }: { project: typeof featuredProjects[0] }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setExpanded(null)}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-[95vw] lg:max-w-4xl w-full h-[400px] sm:h-[380px] overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 z-20 bg-white/90 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          onClick={() => setExpanded(null)}
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
        
        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section - Full height, no white space */}
          <div className="w-full lg:w-2/5 h-32 sm:h-48 lg:h-full relative overflow-hidden">
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
            <Badge 
              variant="outline" 
              className="absolute top-2 left-2 lg:top-3 lg:left-3 bg-white/95 text-gray-800 border-0 shadow-sm text-xs lg:text-sm px-2 py-1 lg:px-3 lg:py-1.5"
            >
              {project.category}
            </Badge>
          </div>
          
          {/* Content Section */}
          <div className="w-full lg:w-3/5 p-4 sm:p-6 lg:p-8 flex flex-col">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900 mb-2">
                {project.title}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-2 sm:mb-4">
                {project.subtitle}
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-2 py-1 text-xs sm:text-sm border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50 hover:border-blue-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Project Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <span>{project.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span>{project.users} users</span>
              </div>
              <div className="text-gray-500">
                by {project.author}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors duration-200 hover:shadow-lg text-sm sm:text-base"
                onClick={() => {
                  window.open(project.href, "_blank", "noopener,noreferrer");
                }}
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Connect to Project
              </Button>
            </div>
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
          <h1 className="sm:text-4xl font-bold text-black mb-4 animate-fade-in leading-tight mobile-text-2xl">
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
                <p className="absolute top-3 left-3 h-7 px-3 flex items-center justify-center text-xs rounded-full bg-white/95 text-gray-800 shadow">
                  {p.category}
                </p>
              </div>
              {/* Content */}
              <UICardContent className="flex flex-col flex-1">
                
                  <UICardTitle className="mt-2 text-lg md:text-lg font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </UICardTitle>
                  <p className="text-xs text-gray-500">{p.subtitle}</p>
            
                <UICardDescription
                  className="text-gray-600 text-sm overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                >
                  {p.description}
                </UICardDescription>
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="mt-2 text-xs rounded-full px-2 py-1 border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-50 hover:border-blue-100"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
                {/* Footer */}
                <Button
                  className="mt-1 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md text-sm font-bold rounded-lg transition-all duration-300"
                  onClick={() => setExpanded(p.id)}
                >
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
                  transition-transform duration-300
                  rounded-2xl border border-gray-200 bg-white/90 shadow
                  group flex flex-col cursor-pointer
                  ${expanded === p.id ? "z-40" : ""}
                  ${expanded !== null && expanded !== p.id ? "pointer-events-none opacity-40" : ""}
                  hover:scale-105 hover:shadow-2xl
                `}
                style={{
                  minHeight: 240,
                  marginRight: 0,
                }}
              >
                {/* Image */}
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio: "4/2.5",
                    minHeight: 70,
                    maxHeight: 90,
                    overflow: "hidden",
                    borderRadius: "1rem 1rem 0 0",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${p.gradient} opacity-20`}
                  />
                  <p className="flex items-center justify-center absolute top-2 left-2 h-6 px-2 mobile-text-xs rounded-full bg-white/95 text-gray-800 shadow">
                    {p.category}
                  </p>
                </div>
                {/* Content */}
                <UICardContent className="flex flex-col flex-1 px-3">
                  
                    <UICardTitle className="mt-2 mobile-text-xl font-extrabold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </UICardTitle>
                    <p className="mobile-text-base text-gray-500 mb-1">{p.subtitle}</p>
               
                  <UICardDescription
                    className="text-gray-600 mobile-text-base mb-2 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                  >
                    {p.description}
                  </UICardDescription>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.tags.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="mt-2 mobile-text-base rounded-full px-1 py-0.5 border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-50 hover:border-blue-100"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                  {/* Footer */}

                  <Button
                    className="mt-1 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md mobile-text-base font-bold rounded-lg transition-all duration-300 py-2"
                    onClick={() => {
                      window.open("https://www.chainfly.co/", "_blank", "noopener,noreferrer");
                    }}
                  >
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
            variant="outline"
            className="hover:scale-105 transition-all duration-300 border-blue-200 text-blue-700 font-bold rounded-lg mobile-text-xl"
          >
            <TrendingUp className="mr-2 w-5 h-5" />
            View All Projects
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scoped CSS for animations and mobile font sizes */}
      <style>{`
        @keyframes slide-in-from-bottom-2 {
          0% { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-in {
          animation: slide-in-from-bottom-2 0.3s ease-out;
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
