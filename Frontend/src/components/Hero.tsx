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
    imageUrl:
      "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/Final+amogh+student+studying.avif", // student studying
    label: "Students",
    description: "Join peer communities & showcase projects",
    iconClass: "fas fa-user-graduate",
    // label: "Students"
  },
  {
    id: 2,
    imageUrl:
      "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/amogh+label+pHd+holder.avif", // scientist in lab
    label: "PhD Holders",
    description: "Collaborate on research & funding",
    iconClass: "fas fa-flask",
    // label: "PhD"
  },
  {
    id: 3,
    imageUrl:
      "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/Final_amoghprofessorlecturing.jpg", // professor lecturing
    label: "Professors",
    description: "Share knowledge & mentor next gen",
    iconClass: "fas fa-chalkboard-teacher",
  },
  {
    id: 4,
    imageUrl:
      "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/Final_amoghbusinessmeeting.jpg", // business meeting
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

            <div className="w-full lg:w-1/3 text-center lg:text-left mb-8 sm:mb-10 lg:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in leading-tight px-2 sm:px-0">
                Connect{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Innovation
                </span>{" "}
                with{" "}
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Opportunity
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 md:mb-16 max-w-full sm:max-w-sm lg:max-w-full leading-relaxed animate-fade-in delay-200 px-4 sm:px-0">
                A platform where students, PhD holders, professors, and
                businesses collaborate to transform ideas into real-world impact.
                Join the future of collaborative innovation today.
              </p>
              <div className="flex justify-center lg:justify-start animate-fade-in delay-300">
                <Button
                  size="lg"
                  className="w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 sm:px-6 py-2 text-sm sm:text-base font transform transition-all duration-300 hover:scale-105 shadow-lg font-bold"
                  asChild
                >
                  <Link to="/signup" className="font-bold flex items-center justify-center">
                    <Rocket className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Get Started
                    <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
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
                <div className="grid grid-cols-2 gap-2 sm:gap-3 p-2 sm:p-4">
                  {OPTIONS.map((opt, index) => (
                    <div
                      key={opt.id}
                      className={`
                        relative h-24 sm:h-28 md:h-32 rounded-lg sm:rounded-xl overflow-hidden
                      `}
                    >
                      <img
                        src={opt.imageUrl}
                        alt={opt.label}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-2 sm:p-3">
                        <div className="font-bold text-sm sm:text-base md:text-lg mb-1 leading-tight">
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
