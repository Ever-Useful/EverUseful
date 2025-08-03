import { Search } from "lucide-react";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  LightBulbIcon,
  SparklesIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

import marketplaceBackdrop from "@/assets/images/marketplace.jpg";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface MarketplaceHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const MarketplaceHero = ({ searchQuery, onSearchChange }: MarketplaceHeroProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const isMobile = useIsMobile();

  return (
    <section
      className={`relative flex items-center justify-center px-3 sm:px-4 lg:px-6 overflow-hidden ${
        isMobile ? "min-h-[40vh] py-6" : "min-h-[70vh] py-8"
      }`}
    >
      {/* Blurred, semi-transparent image as background */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `url(${marketplaceBackdrop}) center center / cover no-repeat`,
          filter: "blur(1.5px)",
          opacity: 0.9,
        }}
        aria-hidden="true"
      />
      
      {/* Diagonal Grid SVG Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        width="100%"
        height="100%"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        <g stroke="#ffffff18" strokeWidth="1">
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1={i * 180}
              y1="0"
              x2="0"
              y2={i * 180}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <line
              key={i + 12}
              x1="100%"
              y1={i * 180}
              x2={window.innerWidth - i * 180}
              y2="100%"
            />
          ))}
        </g>
      </svg>

      {/* Floating Icons - Responsive positioning */}
      <AcademicCapIcon className="floating-icon absolute top-4 sm:top-8 left-4 sm:left-8 w-8 h-8 sm:w-11 sm:h-11 text-blue-900 drop-shadow-xl" style={{ animationDelay: "0s", zIndex: 2 }} />
      <BriefcaseIcon className="floating-icon absolute top-16 sm:top-24 right-12 sm:right-24 w-7 h-7 sm:w-9 sm:h-9 text-orange-800 drop-shadow-xl" style={{ animationDelay: "0.5s", zIndex: 2 }} />
      <GlobeAltIcon className="floating-icon absolute bottom-8 sm:bottom-16 left-8 sm:left-20 w-10 h-10 sm:w-12 sm:h-12 text-red-900 drop-shadow-xl" style={{ animationDelay: "1.2s", zIndex: 2 }} />
      <LightBulbIcon className="floating-icon absolute bottom-4 sm:bottom-8 right-6 sm:right-10 w-6 h-6 sm:w-8 sm:h-8 text-yellow-700 drop-shadow-xl" style={{ animationDelay: "0.8s", zIndex: 2 }} />
      <SparklesIcon className="floating-icon absolute top-1/2 left-1/4 w-6 h-6 sm:w-7 sm:h-7 text-indigo-900 drop-shadow-xl" style={{ animationDelay: "1.5s", zIndex: 2 }} />
      <UserGroupIcon className="floating-icon absolute top-8 sm:top-12 right-1/4 w-7 h-7 sm:w-9 sm:h-9 text-purple-900 drop-shadow-xl" style={{ animationDelay: "0.3s", zIndex: 2 }} />
      <RocketLaunchIcon className="floating-icon absolute bottom-16 sm:bottom-24 left-1/2 w-8 h-8 sm:w-10 sm:h-10 text-purple-900 drop-shadow-xl" style={{ animationDelay: "1.1s", zIndex: 2 }} />
      <StarIcon className="floating-icon absolute top-1/3 right-6 sm:right-12 w-6 h-6 sm:w-7 sm:h-7 text-pink-900 drop-shadow-xl" style={{ animationDelay: "0.7s", zIndex: 2 }} />

      {/* Main Content */}
      <div
        className={`relative z-10 w-full max-w-2xl mx-auto text-center rounded-2xl sm:rounded-3xl shadow-2xl
          ${isMobile ? "py-6 px-4" : "py-10 sm:py-16 px-6 sm:px-10"} backdrop-blur-md`}
        style={{
          background: "rgba(232,244,255,0.93)",
          border: "1px solid #b6d4fe",
        }}
      >
        <h1 className="text-4xl font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-sm bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-400 bg-clip-text text-transparent mobile-text-4xl">
          Empowering Innovation, Globally
        </h1>
        
        {!isMobile && (
          <p className="text-base mb-6 sm:mb-8 max-w-2xl mx-auto text-slate-700 font-medium leading-relaxed mobile-text-base">
            Join the world's brightest minds—explore, collaborate, and create in the next-generation global marketplace.
          </p>
        )}
        
        {/* Search Bar */}
        <form className={`w-full ${isMobile ? "max-w-sm" : "max-w-lg"} mx-auto`}>
          <div className="flex items-center bg-white/90 border border-blue-100 rounded-full shadow-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-300 transition">
            <Search className="ml-3 sm:ml-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder={isMobile ? "Search products, services..." : "Search for products, services, or talents..."}
              value={searchQuery}
              onChange={handleSearch}
              className={`flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none
                ${isMobile ? "px-3 py-3 text-sm" : "px-4 py-3 text-base"}`}
            />
          </div>
        </form>
      </div>

      {/* Floating Animation Styles */}
      <style>{`
        .floating-icon {
          animation: floatY 5s ease-in-out infinite alternate;
        }
        @keyframes floatY {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.96;
          }
          50% {
            transform: translateY(-18px) scale(1.09) rotate(-2deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.96;
          }
        }
        @media (max-width: 640px) {
          .floating-icon {
            animation-duration: 4s;
          }
        }
      `}</style>
    </section>
  );
};
