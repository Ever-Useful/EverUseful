


import React, { useEffect, useState } from "react";

const HeroSection = () => {
  const fullText = "About Amogh";
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, currentIndex + 1));
      currentIndex++;
      if (currentIndex === fullText.length) {
        clearInterval(interval);
        // Add a small delay before hiding the cursor and underline
        setTimeout(() => {
          setIsTypingComplete(true);
        }, 500);
      }
    }, 100); // typing speed in ms

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            {/* Enhanced heading with better typography */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {displayedText}
                </span>
              </h1>
            </div>

            <div className="space-y-6">
              <p className="text-xl sm:text-2xl text-blue-700 font-bold transform transition-all duration-700 hover:scale-105">
                Amogh is a curated platform where innovation meets opportunity.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Amogh is a unique platform that brings together talented student innovators, passionate researchers, 
                experienced developers, and visionary investors — creating a collaborative ecosystem where bold ideas become real-world solutions.
              </p>
            </div>
          </div>
          
          {/* Right side - Enhanced Image Layout */}
          <div className="relative">
            {/* Main large image with overlay */}
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Team collaboration" 
                className="w-full h-64 sm:h-80 object-cover rounded-3xl shadow-2xl transform transition-all duration-500 group-hover:scale-105" 
              />
              <div className="absolute bottom-6 left-6 z-20 text-white">
                <h3 className="text-xl font-bold mb-2">Collaborative Innovation</h3>
                <p className="text-sm opacity-90">Where great minds come together</p>
              </div>
            </div>

            {/* Bottom images in a more dynamic layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left image with hover effect */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Innovation workspace" 
                  className="w-full h-40 object-cover transform transition-all duration-500 group-hover:scale-110" 
                />
                <div className="absolute bottom-3 left-3 z-20 text-white">
                  <h4 className="text-sm font-bold">Innovation Hub</h4>
                </div>
              </div>
              
              {/* Right image with hover effect */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Technology collaboration" 
                  className="w-full h-40 object-cover transform transition-all duration-500 group-hover:scale-110" 
                />
                <div className="absolute bottom-3 left-3 z-20 text-white">
                  <h4 className="text-sm font-bold">Tech Solutions</h4>
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
