
import { ChevronRight, ChevronLeft, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

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
  const [wishlist, setWishlist] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const toggleWishlist = (projectId: number) => {
    setWishlist(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Scroll amount is smaller on mobile for better UX
      const scrollAmount =
        window.innerWidth < 640 ? 220 : window.innerWidth < 1024 ? 320 : 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

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

  // Hide scroll buttons on small screens (mobile)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-stone-50 via-yellow-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10 md:mb-16">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 sm:mb-4">
              SOLUTION CATEGORIES
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Sustainable Project Types
            </h2>
          </div>
          <div className="max-w-full md:max-w-md">
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Explore the diverse range of sustainable project solutions across various communities. From water access to renewable energy, discover impactful innovations that communities can implement.
            </p>
          </div>
        </div>

        {/* Sliding Projects Container */}
        <div className="relative">
          {/* Navigation Buttons (hide on mobile) */}
          {!isMobile && canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          )}

          {!isMobile && canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          )}

          {/* Projects Slider */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide pb-3 sm:pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex-shrink-0 w-64 sm:w-80 relative group transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-[3/2] object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay on hover (always visible on mobile) */}
                  <div className="absolute inset-0 bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{project.title}</h3>
                      <p className="text-xs sm:text-sm mb-2 sm:mb-3">{project.description}</p>
                      <div className="space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs">
                        <p>
                          <span className="font-semibold">Category:</span> {project.category}
                        </p>
                        <p>
                          <span className="font-semibold">Impact:</span> {project.impact}
                        </p>
                        <p>
                          <span className="font-semibold">Communities:</span> {project.communities}
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-3 sm:mt-4">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-xs"
                        >
                          Learn More
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-white border-white hover:bg-white hover:text-black text-xs"
                          onClick={() => toggleWishlist(project.id)}
                        >
                          {wishlist.includes(project.id) ? (
                            <Heart className="w-3 h-3 fill-current" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                          {wishlist.includes(project.id) ? "Saved" : "Save"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium text-gray-800">
                    {project.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-10 sm:mt-14 md:mt-16">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
            Ready to Contribute Your Ideas?
          </h3>
          <p className="text-gray-600 mb-4 sm:mb-6">
            Join professors and students worldwide in building sustainable solutions
          </p>
          <Button className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base">
            Get Notified When Submissions Open
          </Button>
        </div>
      </div>
    </section>
  );
};