import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, Eye, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import React, { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

// Define Project type if not imported from elsewhere
// You can move this to a types file if needed
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const PRODUCTS_PER_PAGE = 4;
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  const featuredProjects: Project[] = [
    {
      id: 1,
      title: "EcoTrack",
      subtitle: "Carbon Footprint Monitor",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=250&fit=crop",
      tags: ["AI", "Sustainability", "IoT"],
      price: 99,
      description: "Track your carbon footprint easily.",
      rating: 4.5,
      reviews: 120,
      views: 2000,
      likes: 300,
    },
    {
      id: 2,
      title: "QuantumMed",
      subtitle: "Drug Discovery Platform",
      category: "Healthcare",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      tags: ["Quantum", "Healthcare", "Research"],
      price: 199,
      description: "Accelerate drug discovery with quantum computing.",
      rating: 4.8,
      reviews: 80,
      views: 1500,
      likes: 250,
    },
    {
      id: 3,
      title: "AgriBot",
      subtitle: "Smart Farming Assistant",
      category: "Agriculture",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop",
      tags: ["Robotics", "Agriculture", "AI"],
      price: 149,
      description: "Automate your farm with AgriBot.",
      rating: 4.2,
      reviews: 60,
      views: 1100,
      likes: 180,
    },
    {
      id: 4,
      title: "ROBot",
      subtitle: "Smart Farming Assistant",
      category: "Agriculture",
      image: "https://plus.unsplash.com/premium_photo-1678344170545-c3edef92a16e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["Robotics", "Agriculture", "AI"],
      price: 179,
      description: "Next-gen robot for smart farming.",
      rating: 4.6,
      reviews: 90,
      views: 1300,
      likes: 210,
    },
    // Add more as needed
  ];

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
        setProjects(featuredProjects); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const handlePrev = () => {
    setSlideDirection('left');
    setTimeout(() => {
      setStartIndex((prev) =>
        prev === 0 ? Math.max(projects.length - PRODUCTS_PER_PAGE, 0) : prev - PRODUCTS_PER_PAGE
      );
      setSlideDirection(null);
    }, 200);
  };

  const handleNext = () => {
    setSlideDirection('right');
    setTimeout(() => {
      setStartIndex((prev) =>
        prev + PRODUCTS_PER_PAGE >= projects.length ? 0 : prev + PRODUCTS_PER_PAGE
      );
      setSlideDirection(null);
    }, 200);
  };

  return (
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
            return (
              <Link to={`/product/${project.id}`} key={i + '-' + project.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                      {project.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{project.rating ?? '--'}</span>
                        <span className="text-sm text-gray-500">
                          ({project.reviews ?? 0})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{project.views ?? 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${project.price?.toLocaleString?.() ?? '--'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View Details
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
          className="rounded-full"
          onClick={handleNext}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
      <style>{`
        .transition-transform {
          transition-property: transform, opacity;
        }
      `}</style>
    </div>
  );
};