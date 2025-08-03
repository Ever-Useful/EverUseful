


import React, { useEffect, useState } from "react";

const HeroSection = () => {
  const fullText = "About Amogh";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, currentIndex + 1));
      currentIndex++;
      if (currentIndex === fullText.length) {
        clearInterval(interval);
      }
    }, 100); // typing speed in ms

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div>
           <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              <span
                className="inline-block py-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent font-[Dancing Script] font-extrabold"
              >
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            

            <p className="text-xl text-blue-600 font-semibold mb-6 transform transition-all duration-700 hover:scale-105">
              Amogh is a curated platform where innovation meets opportunity.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Amogh is a unique platform that brings together talented student innovators, passionate researchers, 
              experienced developers, and visionary investors — creating a collaborative ecosystem where bold ideas become real-world solutions.
            </p>
          </div>
          
          {/* Right side - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Top image - spans full width */}
              <div className="col-span-2">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Team collaboration" 
                  className="w-full h-48 object-cover rounded-2xl shadow-lg" 
                />
              </div>
              
              {/* Bottom left image */}
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Innovation workspace" 
                  className="w-full h-40 object-cover rounded-2xl shadow-lg" 
                />
              </div>
              
              {/* Bottom right image */}
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Technology collaboration" 
                  className="w-full h-40 object-cover rounded-2xl shadow-lg" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
