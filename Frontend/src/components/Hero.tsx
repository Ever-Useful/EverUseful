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
      {/* ─── Floating Animations for Desktop ─── */}
      <style>
        {`
        @keyframes float-down {
          0%   { transform: translateY(50px); }
          50%  { transform: translateY(25px); }
          100% { transform: translateY(50px); }
        }
        @keyframes float-up {
          0%   { transform: translateY(-50px); }
          50%  { transform: translateY(-25px); }
          100% { transform: translateY(-50px); }
        }
        `}
      </style>

      <section className="relative overflow-hidden py-20 sm:py-16 bg-[#0a0f24]">
        {/* ── Technical Background Layers ── */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='40' height='40' fill='none' stroke='%23333f57' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cg fill='none' stroke='%2360779a' stroke-width='0.3'%3E%3Cpath d='M0 200 L400 200 M200 0 L200 400'/%3E%3Cpath d='M100 0 L100 400 M300 0 L300 400'/%3E%3Cpath d='M0 100 L400 100 M0 300 L400 300'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "400px 400px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='0.5' fill='%239C92AC' fill-opacity='0.05'/%3E%3C/svg%3E")`,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-32 z-10">
          {/* FLEX ROW for desktop, COLUMN for mobile */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* LEFT: Text + Button */}
            <div className="w-full lg:w-1/3 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 animate-slide-in-left delay-400">
                Connect{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Innovation
                </span>{" "}
                with{" "}
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Opportunity
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-16 max-w-sm lg:max-w-full leading-relaxed animate-slide-in-left delay-600">
                A platform where students, PhD holders, professors, and
                businesses collaborate to transform ideas into real‐world impact.
                Join the future of collaborative innovation today.
              </p>
              <div className="flex justify-center lg:justify-start animate-slide-in-left delay-800">
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
              {/* Desktop: original animated cards */}
              <div className="hidden lg:flex overflow-visible w-full h-[560px] py-[40px]">
                {OPTIONS.map((opt) => {
                  // Determine which animation and baseline to use:
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
                        duration-700
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        hover:flex-[10_1_600px]
                        hover:rounded-[32px]
                        hover:bg-[length:auto_100%]
                      `}
                      style={{
                        backgroundImage: `url(${opt.imageUrl})`,
                        animationName,
                        animationDuration: "5s",
                        animationTimingFunction: "ease-in-out",
                        animationIterationCount: "infinite",
                      }}
                    >
                      {/* Shadow overlay at bottom for gradient effect ONLY on hover */}
                      <div
                        className="
                          absolute
                          bottom-0
                          left-0
                          right-0
                          h-[80px]
                          transition-all
                          duration-700
                          ease-[cubic-bezier(0.22,1,0.36,1)]
                          group-hover:h-[120px]
                        "
                        style={{
                          boxShadow:
                            "inset 0 -120px 120px -120px rgba(0,0,0,0.8), inset 0 -120px 120px -100px rgba(0,0,0,0.6)",
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
                          duration-700
                          ease-[cubic-bezier(0.22,1,0.36,1)]
                          group-hover:bottom-[54px]
                          group-hover:left-[12px]
                          z-10
                          text-shadow-lg
                        "
                        style={{
                          textShadow: "0 0 8px rgba(0,0,0,0.75)",
                        }}
                      >
                        <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                          <i className={`${opt.iconClass} text-gray-800`} />
                        </div>
                        <div className="flex flex-col justify-center ml-2 text-white whitespace-pre">
                          <div
                            className="
                              relative
                              transition-all
                              duration-700
                              ease-[cubic-bezier(0.22,1,0.36,1)]
                              left-[16px]
                              opacity-0
                              group-hover:left-0
                              group-hover:opacity-100
                              font-semibold
                              text-lg
                            "
                            style={{
                              textShadow: "0 0 8px rgba(0,0,0,0.75)",
                            }}
                          >
                            {opt.label}
                          </div>
                          <div
                            className="
                              relative
                              transition-all
                              duration-700
                              ease-[cubic-bezier(0.22,1,0.36,1)]
                              delay-150
                              left-[16px]
                              opacity-0
                              group-hover:left-0
                              group-hover:opacity-100
                              text-sm
                              text-gray-200
                            "
                            style={{
                              textShadow: "0 0 6px rgba(0,0,0,0.6)",
                            }}
                          >
                            {opt.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile: Collage grid */}
              <div className="flex lg:hidden w-full max-w-[400px] mx-auto mt-8">
                <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-[240px]">
                  {/* Top left: large */}
                  <div className="row-span-2 col-span-2 rounded-2xl overflow-hidden relative shadow-lg">
                    <img
                      src={OPTIONS[0].imageUrl}
                      alt={OPTIONS[0].label}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1 text-xs text-white">
                      {OPTIONS[0].label}
                    </div>
                  </div>
                  {/* Top right: small */}
                  <div className="row-span-1 col-span-1 rounded-xl overflow-hidden relative shadow-md">
                    <img
                      src={OPTIONS[1].imageUrl}
                      alt={OPTIONS[1].label}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1 py-0.5 text-xs text-white">
                      {OPTIONS[1].label}
                    </div>
                  </div>
                  {/* Bottom left: small */}
                  <div className="row-span-1 col-span-1 rounded-xl overflow-hidden relative shadow-md">
                    <img
                      src={OPTIONS[2].imageUrl}
                      alt={OPTIONS[2].label}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1 py-0.5 text-xs text-white">
                      {OPTIONS[2].label}
                    </div>
                  </div>
                  {/* Bottom right: medium */}
                  <div className="row-span-2 col-span-2 rounded-2xl overflow-hidden relative shadow-lg">
                    <img
                      src={OPTIONS[3].imageUrl}
                      alt={OPTIONS[3].label}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1 text-xs text-white">
                      {OPTIONS[3].label}
                    </div>
                  </div>
                </div>
              </div>
              {/* End mobile collage */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
