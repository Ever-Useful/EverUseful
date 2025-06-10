"use client";

import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export const FeaturedProducts: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const featuredProjects = [
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
      image: "https://images.unsplash.com/photo-1500673922987-e212871fe992",
      tags: ["Robotics", "Agriculture", "AI"],
      gradient: "from-yellow-500 to-orange-600",
    }
  ];

  // Overlay for background blur/dim when a card is expanded
  const Overlay = () =>
    expanded !== null ? (
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"></div>
    ) : null;

  // The expanded card (modal-like) on click
  const ExpandedCard = ({ project }: { project: typeof featuredProjects[0] }) => (
    <div className="fixed z-50 inset-0 flex items-center justify-center px-2 py-4 sm:px-4 sm:py-8">
      <div
        className={`
          bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in relative
          w-full max-w-[95vw] sm:max-w-4xl
          flex flex-col sm:flex-row
          h-auto sm:h-[360px]
        `}
        style={{ minWidth: 0 }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-1 shadow hover:bg-gray-100 transition"
          onClick={() => setExpanded(null)}
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
        {/* Image */}
        <div className="w-full sm:w-[30%] min-w-[180px] flex-shrink-0 h-48 sm:h-full relative">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-center"
            style={{ aspectRatio: "4/3" }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-20`}
          />
          <Badge className="absolute top-3 left-3 h-7 px-3 text-xs rounded-full bg-white/95 text-gray-800 shadow">
            {project.category}
          </Badge>
        </div>
        {/* Content */}
        <div className="w-full sm:w-[70%] flex flex-col px-4 py-4 sm:px-8 sm:py-6 overflow-y-auto">
          <div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              {project.title}
            </h3>
            <div className="text-xs sm:text-base text-gray-500 mb-2">{project.subtitle}</div>
            <div className="text-sm sm:text-lg text-gray-700 mb-4">{project.description}</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="text-xs rounded-full px-2 py-1 border-blue-100 bg-blue-50 text-blue-700"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 mt-auto">
            <span className="font-medium truncate">{project.author}</span>
            <div className="flex items-center gap-3">
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
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md text-base font-semibold rounded-lg transition-all duration-300">
            Connect
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300" />
          </Button>
        </div>
      </div>
      {/* Click outside to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setExpanded(null)}
        aria-label="Close"
      />
    </div>
  );

  return (
    <section
      id="featured" className="relative py-14 bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden  will-change-transform transform-gpu">
      {/* Overlay for blur/dim */}
      <Overlay />

      {/* Expanded Card Modal */}
      {expanded !== null && (
        <ExpandedCard
          project={featuredProjects.find((p) => p.id === expanded)!}
        />
      )}

      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[92vw] relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            Discover <span className="text-blue-600">Game-Changing</span> Projects
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore innovative solutions from our talented community.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProjects.map((p) => (
            <Card
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
                <Badge className="absolute top-3 left-3 h-7 px-3 text-xs rounded-full bg-white/95 text-gray-800 shadow">
                  {p.category}
                </Badge>
              </div>
              {/* Content */}
              <div className="flex flex-col flex-1 px-5 py-4">
                <CardHeader className="px-0 pb-1">
                  <CardTitle className="text-lg md:text-xl font-extrabold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </CardTitle>
                  <p className="text-xs text-gray-500 mb-1">{p.subtitle}</p>
                </CardHeader>
                <CardDescription
                  className="text-gray-600 text-sm mb-3 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                >
                  {p.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="text-xs rounded-full px-2 py-1 border-blue-100 bg-blue-50 text-blue-700"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
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
                </div>
                <Button
                  className="mt-auto w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md text-sm font-semibold rounded-lg transition-all duration-300"
                  onClick={() => setExpanded(p.id)}
                >
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="sm:hidden">
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {featuredProjects.map((p) => (
              <div
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
                  <Badge className="absolute top-2 left-2 h-6 px-2 text-[11px] rounded-full bg-white/95 text-gray-800 shadow">
                    {p.category}
                  </Badge>
                </div>
                {/* Content */}
                <div className="flex flex-col flex-1 px-3 py-3">
                  <CardHeader className="px-0 pb-1">
                    <CardTitle className="text-base font-extrabold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mb-1">{p.subtitle}</p>
                  </CardHeader>
                  <CardDescription
                    className="text-gray-600 text-xs mb-2 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                  >
                    {p.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.tags.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="text-[10px] rounded-full px-1 py-0.5 border-blue-100 bg-blue-50 text-blue-700"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
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
                  </div>
                  <Button
                    className="mt-auto w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md text-xs font-semibold rounded-lg transition-all duration-300 py-2"
                    onClick={() => setExpanded(p.id)}
                  >
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <div className="text-center mt-14">
          <Button
            size="lg"
            variant="outline"
            className="hover:scale-105 transition-all duration-300 border-blue-200 text-blue-700 font-semibold rounded-lg"
          >
            <TrendingUp className="mr-2 w-5 h-5" />
            View All Projects
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scoped CSS for bounce animation */}
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
