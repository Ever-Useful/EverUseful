
import { Target, Zap } from "lucide-react";

const MissionVisionSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: 2 columns side by side with highlighted content only */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {/* Mission - Mobile */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-4 h-4 text-blue-600 mr-1" />
              <h3 className="text-sm font-bold text-gray-800">Mission</h3>
            </div>
            <p className="text-xs text-blue-600 font-semibold leading-tight">
              We're on a mission to bridge the gap between talent and opportunity.
            </p>
          </div>

          {/* Vision - Mobile */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 text-purple-600 mr-1" />
              <h3 className="text-sm font-bold text-gray-800">Vision</h3>
            </div>
            <p className="text-xs text-purple-600 font-semibold leading-tight">
              We see Amogh as the launchpad for the next generation of problem-solvers, entrepreneurs, and researchers.
            </p>
          </div>
        </div>

        {/* Desktop: Original layout with image and full content */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Modern workspace collaboration" 
              className="w-full h-64 lg:h-80 xl:h-96 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
          </div>

          {/* Mission and Vision Content */}
          <div>
            {/* Mission */}
            <div className="mb-6 md:mb-8 ">
              <div className="flex items-center mb-3 md:mb-4">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mr-2 md:mr-3 animate-bounce" />
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 animate-pulse">Our Mission</h3>
              </div>
              <p className="text-sm md:text-base lg:text-lg text-blue-600 mb-2 md:mb-3 font-semibold">
                We're on a mission to bridge the gap between talent and opportunity.
              </p>
              <p className="text-gray-700 text-xs md:text-sm lg:text-base leading-relaxed">
                Every year, thousands of student projects go unnoticed due to a lack of the right exposure and support. 
                Amogh empowers technically skilled students to present their innovations while providing a channel for 
                professionals and businesses to engage, mentor, and elevate those ideas.
              </p>
            </div>

            {/* Vision */}
            <div>
              <div className="flex items-center mb-3 md:mb-4">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-purple-600 mr-2 md:mr-3 animate-spin-slow" />
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 animate-pulse">Our Vision</h3>
              </div>
              <p className="text-gray-700 text-xs md:text-sm lg:text-base leading-relaxed mb-3 md:mb-4">
                Our vision is to build a future-ready innovation ecosystem — one that allows technically sound students to thrive, 
                connects them to the right collaborators, and helps them drive change through real-world solutions.
              </p>
              <p className="text-purple-600 text-sm md:text-base lg:text-lg font-semibold">
                We see Amogh as the launchpad for the next generation of problem-solvers, entrepreneurs, and researchers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;