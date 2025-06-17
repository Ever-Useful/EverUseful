
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, ArrowLeft, Users, Heart, Eye } from "lucide-react";
import Slider from "react-slick";

import React, { useRef } from "react";

export const RelatedProducts = () => {
  const sliderRef = useRef<Slider | null>(null);

  const featuredProjects = [
    {
      id: 1,
      title: "EcoTrack",
      subtitle: "Carbon Footprint Monitor",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=250&fit=crop",
      tags: ["AI", "Sustainability", "IoT"],
    },
    {
      id: 2,
      title: "QuantumMed",
      subtitle: "Drug Discovery Platform",
      category: "Healthcare",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      tags: ["Quantum", "Healthcare", "Research"],
    },
    {
      id: 3,
      title: "AgriBot",
      subtitle: "Smart Farming Assistant",
      category: "Agriculture",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop",
      tags: ["Robotics", "Agriculture", "AI"],
    },
    {
      id: 4,
      title: "ROBot",
      subtitle: "Smart Farming Assistant",
      category: "Agriculture",
      image: "https://plus.unsplash.com/premium_photo-1678344170545-c3edef92a16e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["Robotics", "Agriculture", "AI"],
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

    const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // hide default arrows
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-white px-6 py-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
      </div>

      <Slider {...sliderSettings} ref={sliderRef}>
        {featuredProjects.map((project) => (
          <div key={project.id} className="px-2">
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 bg-white h-full flex flex-col justify-between">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {project.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.subtitle}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-gray-300 text-gray-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto" size="sm">
                  View Product
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </Slider>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => sliderRef.current?.slickPrev()}
          aria-label="Previous Slide"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => sliderRef.current?.slickNext()}
          aria-label="Next Slide"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};