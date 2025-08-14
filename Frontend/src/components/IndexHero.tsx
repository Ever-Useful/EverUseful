import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


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

const IndexHero = () => {
  return (
    <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-white">
        <div
          className="absolute inset-0 opacity-20 color-black"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='40' height='40' fill='none' stroke='%23333f57' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: Intro */}
          <div className="space-y-8 lg:pr-12">
            <div className="space-y-6">
              <h1 className="text-[17px] sm:text-4xl font-bold text-gray-900 leading-tight mobile-text-4xl">
                Transform <span className="text-blue-600">Academic Projects</span> Into Commercial Success
              </h1>
              <p className="text-base text-gray-600 leading-relaxed mobile-text-base">
                AMOGH bridges academia and enterprise. Commercialize your research, offer expertise, and gain real-world experience while generating revenue.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105">
                Get Started Today
              </Button>
            </div>
          </div>

          {/* RIGHT: Gallery */}
          <div className="w-full flex items-center justify-center">
            {/* Desktop: optimized animated cards */}
            <div className="hidden lg:flex overflow-visible w-full h-[500px] py-10">
              {OPTIONS.map((opt) => {
                const isOdd = opt.id % 2 !== 0;
                const animationName = isOdd ? "float-down" : "float-up";
                return (
                  <div
                    key={opt.id}
                    className={`
                      group relative cursor-pointer overflow-hidden
                      bg-center bg-cover flex-[1_1_60px] mx-6 rounded-[64px]
                      transition-all duration-500 ease-out
                      hover:flex-[10_1_600px] hover:rounded-3xl hover:bg-[length:auto_100%]
                    `}
                    style={{
                      backgroundImage: `url(${opt.imageUrl})`,
                      animation: `${animationName} 6s ease-in-out infinite`,
                      willChange: "transform",
                    }}
                  >
                    <img src={opt.imageUrl} alt={opt.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-0" />
                    <div className="absolute bottom-0 left-0 right-0 h-20 transition-all duration-500 ease-out group-hover:h-28"
                      style={{ boxShadow: "inset 0 -80px 80px -80px rgba(0,0,0,0.8)" }} />
                    <div className="absolute right-0 h-10 bottom-2 left-16 transition-all duration-500 ease-out group-hover:bottom-14 group-hover:left-3 z-10">
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
                  style={{ backgroundImage: `url(${opt.imageUrl})` }}
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

      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-down {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
      `}</style>
    </section>
  );
};

export default IndexHero;