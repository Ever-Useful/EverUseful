import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const BlogSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const articles = [
    {
      id: 1,
      category: "RENEWABLE ENERGY",
      date: "Dec 23, 2024",
      title: "Solar Power Revolution: How Communities Are Achieving Energy Independence",
      excerpt: "Discover how rural communities across Africa and Asia are transforming their lives through innovative solar microgrids, reducing energy costs by 70% while creating local employment opportunities...",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=300&fit=crop",
      readTime: "5 min read",
      articleUrl: "https://www.greentechmedia.com/articles/read/solar-communities-energy-independence"
    },
    {
      id: 2,
      category: "WATER CONSERVATION",
      date: "Dec 22, 2024",
      title: "Smart Water Management: Reducing Consumption by 60% in Urban Areas",
      excerpt: "Learn how IoT-enabled water systems and rainwater harvesting are helping cities optimize water usage, ensuring sustainable supply for growing populations while preserving natural resources...",
      image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=300&fit=crop",
      readTime: "4 min read",
      articleUrl: "https://www.waterworld.com/international/desalination/article/14201004/smart-water-management-systems"
    },
    {
      id: 3,
      category: "CIRCULAR ECONOMY",
      date: "Dec 21, 2024",
      title: "Zero Waste Manufacturing: Turning Industrial Waste into Valuable Resources",
      excerpt: "Explore groundbreaking examples of factories achieving zero waste through innovative recycling processes, converting 95% of production waste into reusable materials and alternative energy sources...",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
      readTime: "6 min read",
      articleUrl: "https://www.ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview"
    },
    {
      id: 4,
      category: "SUSTAINABLE AGRICULTURE",
      date: "Dec 20, 2024",
      title: "Precision Farming: Maximizing Crop Yields While Minimizing Environmental Impact",
      excerpt: "Discover how AI-driven farming techniques are helping farmers increase productivity by 40% while reducing water usage, pesticides, and soil degradation through data-driven agriculture...",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      readTime: "7 min read",
      articleUrl: "https://www.fao.org/digital-agriculture/en/"
    },
    {
      id: 5,
      category: "GREEN TECHNOLOGY",
      date: "Dec 19, 2024",
      title: "Carbon Capture Innovation: Turning CO2 into Building Materials",
      excerpt: "Revolutionary carbon capture technologies are now converting atmospheric CO2 into concrete and construction materials, helping reduce emissions while creating sustainable building solutions...",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      readTime: "5 min read",
      articleUrl: "https://www.iea.org/reports/direct-air-capture"
    },
    {
      id: 6,
      category: "BIODIVERSITY",
      date: "Dec 18, 2024",
      title: "Ecosystem Restoration: How Reforestation Projects Are Reversing Climate Change",
      excerpt: "Large-scale reforestation initiatives are proving that nature-based solutions can sequester carbon, restore biodiversity, and provide sustainable livelihoods for local communities worldwide...",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      readTime: "8 min read",
      articleUrl: "https://www.unep.org/news-and-stories/story/ecosystem-restoration-peoples-livelihoods-and-climate"
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
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

  const handleReadMore = (articleUrl: string) => {
    window.open(articleUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewMore = () => {
    console.log('Navigating to full articles page');
    // Navigate to comprehensive articles page
  };

  return (
    <section className="py-20 bg-gradient-to-br from-stone-50 via-green-25 to-emerald-25">
      <div className="container mx-auto px-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <div className="mb-8 md:mb-0">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              SUSTAINABLE INSIGHTS
            </p>
             <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Latest Articles on Sustainable Solutions</h2>
            <p className="text-base md:text-lg text-gray-600 mt-4 max-w-2xl">
              Explore real-time insights on how sustainable innovations are optimizing natural resource usage and creating positive environmental impact across the globe.
            </p>
          </div>
          
          <button 
            onClick={handleViewMore}
            className="hidden md:flex items-center text-gray-900 font-semibold hover:text-green-600 transition-colors group"
          >
            View More 
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Sliding Articles Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          )}
          
          {/* Articles Slider */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {articles.map((article) => (
              <div key={article.id} className="flex-shrink-0 w-80 md:w-96 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {article.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {article.readTime}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500">
                    <span>{article.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">{article.excerpt}</p>
                  
                  <button
                    onClick={() => handleReadMore(article.articleUrl)}
                    className="flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors group-hover:scale-105"
                  >
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
