// src/components/Hero.tsx

import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import Students from "../assets/images/Students.jpeg";
import PhD from "../assets/images/phdscholars.jpeg";
import Professors from "../assets/images/professors.jpeg";
import Business from "../assets/images/Business.jpeg";


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
    imageUrl: Students,
    description: "Join peer communities & showcase projects",
    iconClass: "fas fa-user-graduate",
    label: "Students"
  },
  {
    id: 2,
    imageUrl: PhD,
    description: "Collaborate on research & funding",
    iconClass: "fas fa-flask",
    label: "PhD"
  },
  {
    id: 3,
    imageUrl: Professors,
    label: "Professors",
    description: "Share knowledge & mentor next gen",
    iconClass: "fas fa-chalkboard-teacher",
  },
  {
    id: 4,
    imageUrl: Business,
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

      <section className="relative overflow-hidden py-14 sm:py-16 bg-[#0a0f24]">
        {/* Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='40' height='40' fill='none' stroke='%23333f57' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container relative mx-auto px-2 sm:px-6 lg:px-32 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* LEFT: Text + Button */}

            <div className="w-full lg:w-1/3 text-center lg:text-left mb-10 lg:mb-0">
              <h1 className="text-[17px] sm:text-4xl font-bold text-white mb-4 animate-fade-in leading-tight mobile-text-4xl">
                Connect{" "}

                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Innovation
                </span>{" "}
                with{" "}
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Opportunity
                </span>
              </h1>
              <p className="text-[12px] sm:text-base text-gray-300 mb-8 sm:mb-16 max-w-full sm:max-w-sm lg:max-w-full leading-relaxed animate-fade-in delay-200 mobile-text-base">
                A platform where students, PhD holders, professors, and
                businesses collaborate to transform ideas into real-world impact.
                Join the future of collaborative innovation today.
              </p>
              <div className="flex justify-center lg:justify-start animate-fade-in delay-300">
                <Button
                  size="lg"
                  className="w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 hover:shadow-md border-0"
                  asChild
                >
                  <Link to="/signup" className="font-bold flex items-center justify-center">
                    <Rocket className="mr-2 w-5 h-5" />
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT: Gallery */}
            <div className="w-full lg:w-2/3 flex items-center justify-center">
              {/* Desktop: animated cards */}
              <div className="hidden lg:flex overflow-visible w-full h-[560px] py-[40px]">
                {OPTIONS.map((opt) => {
                  // Determine which animation and baseline to use:
                  const isOdd = opt.id % 2 !== 0;
                  const animationName = isOdd ? "float-down" : "float-up";
                  return (
                    <div
                      key={opt.id}
                      className={`group relative cursor-pointer overflow-hidden bg-center bg-cover flex-[1_1_60px] mx-[24px] rounded-[64px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[10_1_600px] hover:rounded-[32px] hover:bg-[length:auto_100%]`}
                      style={{backgroundImage: `url(${opt.imageUrl})`, animationName, animationDuration: "5s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite",}}
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
                          left-14
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

              {/* Mobile: flexbox focusing on labels */}
              <div className="lg:hidden w-full">
                <div className="grid grid-cols-2 gap-3 p-4">
                  {OPTIONS.map((opt, index) => (
                    <div
                      key={opt.id}
                      className={`
                        relative h-32 rounded-xl overflow-hidden
                      `}
                    >
                      <img
                        src={opt.imageUrl}
                        alt={opt.label}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-3">
                        <div className="font-bold text-lg sm:text-xl mb-1 leading-tight">
                          {opt.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
