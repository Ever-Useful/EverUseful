// src/components/Hero.tsx

import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

type Option = {
  id: number;
  imageUrl: string;
  label: string;
  description: string;
  iconClass: string;
};

const OPTIONS: Option[] = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", // student studying
    label: "Students",
    description: "Join peer communities & showcase projects",
    iconClass: "fas fa-user-graduate",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80", // scientist in lab
    label: "PhD Holders",
    description: "Collaborate on research & funding",
    iconClass: "fas fa-flask",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", // professor lecturing
    label: "Professors",
    description: "Share knowledge & mentor next gen",
    iconClass: "fas fa-chalkboard-teacher",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80", // business meeting
    label: "Business",
    description: "Discover solutions & partnerships",
    iconClass: "fas fa-briefcase",
  },
];

export const Hero = () => {
  return (
    <>
      {/* Optimized floating animations */}
      <style>
        {`
        @keyframes float-down {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        `}
      </style>

      <section className="relative overflow-hidden py-20 sm:py-16 bg-[#0a0f24]">
        {/* Simplified background layers - reduced complexity */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='40' height='40' fill='none' stroke='%23333f57' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-32 z-10">
          {/* FLEX ROW for desktop, COLUMN for mobile */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* LEFT: Text + Button */}
            <div className="w-full lg:w-1/3 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 animate-fade-in">
                Connect
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Innovation
                </span>
                with{" "}
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Opportunity
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-16 max-w-sm lg:max-w-full leading-relaxed animate-fade-in delay-200">
                A platform where students, PhD holders, professors, and
                businesses collaborate to transform ideas into real‐world impact.
                Join the future of collaborative innovation today.
              </p>
              <div className="flex justify-center lg:justify-start animate-fade-in delay-300">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 text-base transform transition-all duration-300 hover:scale-105 shadow-lg"
                  asChild
                >
                  <Link to="/signup">
                    <Rocket className="mr-2 w-5 h-5" />
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT: Gallery */}
            <div className="w-full lg:w-2/3 flex items-center justify-center">
              {/* Desktop: optimized animated cards */}
              <div className="hidden lg:flex overflow-visible w-full h-[560px] py-[40px]">
                {OPTIONS.map((opt) => {
                  // Simplified animation logic
                  const isOdd = opt.id % 2 !== 0;
                  const animationName = isOdd ? "float-down" : "float-up";
                  return (
                    <div
                      key={opt.id}
                      className={`
                        group
                        relative
                        cursor-pointer
                        overflow-hidden
                        bg-center
                        bg-cover
                        flex-[1_1_60px]
                        mx-[24px]
                        rounded-[64px]
                        transition-all
                        duration-500
                        ease-out
                        hover:flex-[10_1_600px]
                        hover:rounded-[32px]
                        hover:bg-[length:auto_100%]
                      `}
                      style={{
                        backgroundImage: `url(${opt.imageUrl})`,
                        animationName,
                        animationDuration: "6s",
                        animationTimingFunction: "ease-in-out",
                        animationIterationCount: "infinite",
                        willChange: "transform",
                      }}
                    >
                      {/* Use img tag for accessibility and lazy loading */}
                      <img src={opt.imageUrl} alt={opt.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-0" />
                      {/* Simplified shadow overlay */}
                      <div
                        className="
                          absolute
                          bottom-0
                          left-0
                          right-0
                          h-[80px]
                          transition-all
                          duration-500
                          ease-out
                          group-hover:h-[120px]
                        "
                        style={{
                          boxShadow:
                            "inset 0 -80px 80px -80px rgba(0,0,0,0.8)",
                        }}
                      />
                      {/* Label & Icon */}
                      <div
                        className="
                          absolute
                          right-0
                          h-[40px]
                          bottom-[8px]
                          left-[64px]
                          transition-all
                          duration-500
                          ease-out
                          group-hover:bottom-[54px]
                          group-hover:left-[12px]
                          z-10
                        "
                      >
                        <div className="flex items-center text-white">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
                            <i className={`${opt.iconClass} text-sm`}></i>
                          </div>
                          <div>
                            <div className="font-bold text-sm">{opt.label}</div>
                            <div className="text-xs opacity-80 max-w-0 group-hover:max-w-[200px] transition-all duration-500 ease-out overflow-hidden">
                              {opt.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile: simplified static cards */}
              <div className="lg:hidden grid grid-cols-2 gap-4 w-full">
                {OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className="relative h-48 rounded-2xl overflow-hidden bg-center bg-cover"
                    style={{
                      backgroundImage: `url(${opt.imageUrl})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="font-bold">{opt.label}</div>
                      <div className="text-sm opacity-80">{opt.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
