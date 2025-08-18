
import { ChevronRight, ChevronLeft, Eye, Users, Target, ArrowRight } from "lucide-react";import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const projects = [
  {
    id: 1,
    title: "Clean Water Access",
    description: "Revolutionary water purification and distribution systems for underserved communities worldwide.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop",
    category: "Water Solutions",
    impact: "50M+ people served",

    communities: "Rural & Urban"
  },
  {
    id: 2,
    title: "Renewable Energy Hubs",
    description: "Community-centered solar, wind, and hybrid energy solutions for sustainable power generation.",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&h=400&fit=crop",
    category: "Energy Solutions",
    impact: "75% emission reduction",

    communities: "Remote & Developing"
  },

  {
    id: 3,
    title: "Smart Agriculture",
    description: "AI-powered sustainable farming techniques and crop management systems for food security.",
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&h=400&fit=crop",
    category: "Food Security",
    impact: "40% yield increase",

    communities: "Agricultural & Coastal"
  },
  {
    id: 4,
    title: "Waste Management",
    description: "Circular economy solutions for waste reduction and resource recovery in urban areas.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop",
    category: "Circular Economy",
    impact: "90% waste reduction",

    communities: "Urban & Industrial"
  },
  {
    id: 5,
    title: "Carbon Capture",
    description: "Innovative technologies for capturing and utilizing atmospheric carbon dioxide.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    category: "Climate Tech",
    impact: "1M+ tons CO2 captured",
    communities: "Industrial & Research"
  },
  {
    id: 6,
    title: "Biodiversity Conservation",
    description: "Ecosystem restoration and wildlife conservation through community-based initiatives.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    category: "Conservation",
    impact: "10K+ species protected",

    communities: "Forest & Marine"
  }
];

export const ProjectsSection = () => {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const toggleWatchlist = (projectId: number) => {
    setWatchlist(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // On mobile, scroll by exactly one card width (full width + margins)
      // On desktop, scroll by multiple cards with spacing
      const isMobile = window.innerWidth < 640;
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollAmount = isMobile ? containerWidth : 400; // Use actual container width on mobile
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      let newScroll;
      if (direction === 'left') {
        newScroll = Math.max(0, currentScroll - scrollAmount);
      } else {
        newScroll = currentScroll + scrollAmount;
      }
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (

    <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-gradient-to-br from-stone-50 via-yellow-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-16">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              SOLUTION CATEGORIES
            </p>
            

            <h2 className="heading-section font-bold text-gray-900">
              Sustainable Project Types
            </h2>
          </div>
          <div className="max-w-full md:max-w-md">
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Explore active research projects and join collaborative teams making real-world impact. Connect with experts and contribute to meaningful solutions.
            </p>
          </div>
        </div>
        
        {/* Sliding Projects Container */}
        <div className="relative">
          {/* Navigation Buttons - Visible on Desktop, Hidden on Mobile */}
          <div className="hidden sm:flex justify-between items-center mb-4 sm:mb-6">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all ${
                canScrollLeft 
                  ? 'bg-white/90 hover:bg-white shadow-lg hover:scale-110 text-gray-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
            
            <span className="text-sm sm:text-base text-gray-600 font-medium">
              {Math.floor((scrollContainerRef.current?.scrollLeft || 0) / (scrollContainerRef.current?.clientWidth || 280)) + 1} of {projects.length}
            </span>
            
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all ${
                canScrollRight 
                  ? 'bg-white/90 hover:bg-white shadow-lg hover:scale-110 text-gray-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
          
          {/* Projects Slider */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-3 sm:pb-4 px-4 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex-shrink-0 w-[calc(100vw-2rem)] sm:w-64 md:w-80 group cursor-pointer relative"
              >
                <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="card-media group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                      <span className="bg-white/95 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-gray-800">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-3 sm:p-4 lg:p-6">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-emerald-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center group-hover:bg-emerald-50 transition-colors">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 mx-auto mb-1" />
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900">{project.impact}</p>
                        <p className="text-[9px] sm:text-xs text-gray-500">Impact</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center group-hover:bg-blue-50 transition-colors">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900">{project.teamSize}</p>
                        <p className="text-[9px] sm:text-xs text-gray-500">Team Size</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Always Visible on Mobile */}
                    <div className="flex gap-2 mb-3 sm:mb-4">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-xs h-6 sm:h-8"
                        onClick={() => toggleWatchlist(project.id)}
                      >
                        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        {watchlist.includes(project.id) ? "Watching" : "Watch"}
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs h-6 sm:h-8 px-2 sm:px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBrowseAllProjects();
                        }}
                      >
                        <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </Button>
                    </div>
                    
                    {/* Funding Status - Always Visible */}
                    <div className="pt-2 sm:pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs text-gray-500">Funding:</span>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-900">{project.fundingGoal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}

        <div className="text-center mt-8 sm:mt-10 md:mt-14 lg:mt-16">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Join a Research Team?</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Connect with professors and students worldwide working on sustainable solutions</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base">
              Browse All Projects
            </Button>
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base">
              Submit Your Proposal
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
