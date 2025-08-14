import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const BlogSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const articles = [
    {
      id: 1,
      category: "BLOCKCHAIN",
      date: "Jul 2, 2024",
      title: "How Blockchain Is Powering Sustainable Supply Chains",
      excerpt: "Discover how blockchain technology is being used to track and verify sustainable practices in global supply chains, increasing transparency and reducing fraud...",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
      readTime: "6 min read",
      articleUrl: "https://chainfly.ai/blog/blockchain-sustainable-supply-chains"
    },
    {
      id: 2,
      category: "AI FOR GOOD",
      date: "Apr 15, 2024",
      title: "AI-Powered Precision Farming: Boosting Yields Sustainably",
      excerpt: "See how AI-driven analytics are helping farmers optimize crop yields, reduce resource use, and promote sustainable agriculture practices...",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      readTime: "6 min read",
      articleUrl: "https://chainfly.ai/blog/ai-precision-farming"
    },
    {
      id: 3,
      category: "CIRCULAR ECONOMY",
      date: "May 28, 2024",
      title: "Zero Waste Manufacturing: Circular Economy in Action",
      excerpt: "Explore how manufacturers are adopting circular economy principles to minimize waste and maximize resource efficiency, creating a more sustainable future...",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
      readTime: "7 min read",
      articleUrl: "https://ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview"
    },
    {
      id: 4,
      category: "GREEN TECHNOLOGY",
      date: "Mar 30, 2024",
      title: "Carbon Capture Innovation: Turning CO2 into Building Materials",
      excerpt: "Revolutionary carbon capture technologies are now converting atmospheric CO2 into concrete and construction materials, helping reduce emissions while creating sustainable building solutions...",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      readTime: "5 min read",
      articleUrl: "https://www.iea.org/reports/direct-air-capture"
    },
    {
      id: 5,
      category: "BIODIVERSITY",
      date: "Feb 12, 2024",
      title: "How Reforestation Projects Are Reversing Climate Change",
      excerpt: "Large-scale reforestation initiatives are proving that nature-based solutions can sequester carbon, restore biodiversity, and provide sustainable livelihoods for local communities worldwide...",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      readTime: "8 min read",
      articleUrl: "https://www.worldwildlife.org/stories/how-reforestation-projects-are-helping-fight-climate-change"
    }
  ];

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

  const handleReadMore = (articleUrl: string) => {
    window.open(articleUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewMore = () => {
    console.log('Navigating to full articles page');
    // Navigate to comprehensive articles page
  };

  return (

    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-stone-50 via-green-25 to-emerald-25">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 sm:mb-12 lg:mb-16 gap-4 md:gap-0">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 sm:mb-4">
              SUSTAINABLE INSIGHTS
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
              Latest Articles on Sustainable Solutions
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Explore real-time insights on how sustainable innovations are optimizing natural resource usage and creating positive environmental impact across the globe.
            </p>
          </div>
          
          <button 
            onClick={handleViewMore}

            className="flex items-center text-gray-900 font-semibold hover:text-green-600 transition-colors group mt-4 md:mt-0"
          >
            View More 
            <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Sliding Articles Container */}
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
              {Math.floor((scrollContainerRef.current?.scrollLeft || 0) / (scrollContainerRef.current?.clientWidth || 320)) + 1} of {articles.length}
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
          
          {/* Articles Slider */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4 px-4 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {articles.map((article) => (

              <div key={article.id} className="flex-shrink-0 w-[calc(100vw-2rem)] sm:w-80 md:w-96 bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                    {article.category}
                  </div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {article.readTime}
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
                    <span>{article.date}</span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-green-600 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  
                  <button
                    onClick={() => handleReadMore(article.articleUrl)}
                    className="flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors group-hover:scale-105 text-sm sm:text-base"
                  >
                    Read More
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
