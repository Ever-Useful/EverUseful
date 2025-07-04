import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Eye, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import React, { useRef, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Define Project type if not imported from elsewhere
interface Project {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  image: string;
  tags?: string[];
  description?: string;
  rating?: number;
  reviews?: number;
  views?: number;
  likes?: number;
  price: number;
}

export const RelatedProducts = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [startIndex, setStartIndex] = React.useState(0);
  const [slideDirection, setSlideDirection] = React.useState<'left' | 'right' | null>(null);
  const isMobile = useIsMobile();
  
  // Adjust products per page based on screen size
  const getProductsPerPage = () => {
    if (isMobile) return 1;
    return window.innerWidth >= 1024 ? 4 : 2;
  };
  
  const [productsPerPage, setProductsPerPage] = useState(getProductsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setProductsPerPage(getProductsPerPage());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/marketplace/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const featuredProjects = [
    {
      id: 1,
      title: "EcoTrack",
      subtitle: "Carbon Footprint Monitor",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=250&fit=crop",
      tags: ["AI", "Sustainability", "IoT"],
      description: "Revolutionary platform for tracking environmental impact",
      rating: 4.8,
      reviews: 124,
      views: 1200,
      price: 2500
    },
    {
      id: 2,
      title: "QuantumMed",
      subtitle: "Drug Discovery Platform",
      category: "Healthcare",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      tags: ["Quantum", "Healthcare", "Research"],
      description: "Advanced AI-powered drug discovery and development platform",
      rating: 4.9,
      reviews: 87,
      views: 980,
      price: 4200
    },
    {
      id: 3,
      title: "AgriBot",
      subtitle: "Smart Farming Assistant",
      category: "Agriculture",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop",
      tags: ["Robotics", "Agriculture", "AI"],
      description: "Intelligent robotic system for automated farming operations",
      rating: 4.7,
      reviews: 156,
      views: 1450,
      price: 3200
    },
    {
      id: 4,
      title: "ROBot",
      subtitle: "Smart Farming Assistant",
      category: "Agriculture",
      image: "https://plus.unsplash.com/premium_photo-1678344170545-c3edef92a16e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["Robotics", "Agriculture", "AI"],
      description: "Next-generation robotics for precision agriculture",
      rating: 4.6,
      reviews: 203,
      views: 1800,
      price: 2800
    },
    {
      id: 5,
      title: "EcoTrack",
      subtitle: "Carbon Footprint Monitor",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=250&fit=crop",
      tags: ["AI", "Sustainability", "IoT"],
    },
    {
      id: 6,
      title: "QuantumMed",
      subtitle: "Drug Discovery Platform",
      category: "Healthcare",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      tags: ["Quantum", "Healthcare", "Research"],
    },
    {
      id: 7,
      title: "AgriBot",
      subtitle: "Smart Farming Assistant",
      category: "Agriculture",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop",
      tags: ["Robotics", "Agriculture", "AI"],
    },
    {
      id: 8,
      title: "ROBot",
      subtitle: "Smart Farming Assistant",
      category: "Agriculture",
      image: "https://plus.unsplash.com/premium_photo-1678344170545-c3edef92a16e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["Robotics", "Agriculture", "AI"],
    }
  ];

  // Use featuredProjects if API projects are not available
  const displayProjects = projects.length > 0 ? projects : featuredProjects;

  const handlePrev = () => {
    setSlideDirection('left');
    setTimeout(() => {
      setStartIndex((prev) =>
        prev === 0 ? Math.max(displayProjects.length - productsPerPage, 0) : prev - productsPerPage
      );
      setSlideDirection(null);
    }, 200);
  };

  const handleNext = () => {
    setSlideDirection('right');
    setTimeout(() => {
      setStartIndex((prev) =>
        prev + productsPerPage >= displayProjects.length ? 0 : prev + productsPerPage
      );
      setSlideDirection(null);
    }, 200);
  };

  if (loading) {
    return (
      <div className={`container mx-auto ${isMobile ? 'px-4' : 'px-6'} py-8`}>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`container mx-auto ${isMobile ? 'px-4' : 'px-6'} py-8`}>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (

    <div className={`container mx-auto ${isMobile ? 'px-4' : 'px-6'} py-8`}>
      
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="relative">
          <div className={classNames(
            "transition-all duration-300 ease-in-out",
            {
              "-translate-x-full opacity-0": slideDirection === 'right',
              "translate-x-full opacity-0": slideDirection === 'left',
              "opacity-100 translate-x-0": !slideDirection
            }
          )}>
            {displayProjects.slice(startIndex, startIndex + 1).map((project) => (
              <Link to={`/product/${project.id}`} key={project.id} className="block">
                <Card className="hover:shadow-lg transition-shadow duration-200 bg-white rounded-lg">

    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous"
          className="rounded-full"
          onClick={handlePrev}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className={classNames(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 transition-transform duration-300",
          {
            "-translate-x-10 opacity-0": slideDirection === 'right',
            "translate-x-10 opacity-0": slideDirection === 'left',
            "opacity-100": !slideDirection
          }
        )}>
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => {
            if (projects.length === 0) return null;
            const idx = (startIndex + i) % projects.length;
            const project = projects[idx];
            if (!project) return null;
            return (
              <Link to={`/product/${project.id}`} key={i + '-' + project.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">

                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-32 xs:h-36 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-0.5">
                      {project.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-base mb-1 text-gray-900 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-gray-900">{project.rating ?? '--'}</span>
                        <span className="text-xs text-gray-500">
                          ({project.reviews ?? 0})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span className="text-xs">{project.views ?? 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">
                        ${project.price?.toLocaleString?.() ?? '--'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1"
                      >
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous"
              className="rounded-full w-12 h-12 shadow-md"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(displayProjects.length / productsPerPage) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(startIndex / productsPerPage) === i ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next"
              className="rounded-full w-12 h-12 shadow-md"
              onClick={handleNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        /* Desktop Layout */
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous"
            className="rounded-full flex-shrink-0"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className={classNames(
            "grid gap-6 flex-1 transition-all duration-300 ease-in-out",
            {
              "grid-cols-1 md:grid-cols-2": productsPerPage === 2,
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": productsPerPage === 4,
              "-translate-x-10 opacity-0": slideDirection === 'right',
              "translate-x-10 opacity-0": slideDirection === 'left',
              "opacity-100 translate-x-0": !slideDirection
            }
          )}>
            {Array.from({ length: productsPerPage }).map((_, i) => {
              if (displayProjects.length === 0) return null;
              const idx = (startIndex + i) % displayProjects.length;
              const project = displayProjects[idx];
              return (
                <Link to={`/product/${project.id}`} key={i + '-' + project.id}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200 rounded-lg">
                    <div className="relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-28 md:h-32 lg:h-36 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5">
                        {project.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base mb-1 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{project.rating ?? '--'}</span>
                          <span className="text-xs text-gray-500">
                            ({project.reviews ?? 0})
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Eye className="w-3 h-3" />
                          <span className="text-xs">{project.views ?? 0}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-base font-bold text-gray-900">
                          ${project.price?.toLocaleString?.() ?? '--'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 text-base p-1"
                        >
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            aria-label="Next"
            className="rounded-full flex-shrink-0"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
};