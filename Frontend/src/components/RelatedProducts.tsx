
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Users, Heart, Eye } from "lucide-react";

export const RelatedProducts = () => {
  const featuredProjects = [
    {
      id: 1,
      title: "EcoTrack",
      subtitle: "Carbon Footprint Monitor",
      description:
        "AI-powered sustainability tracker for businesses and individuals. This tool helps you monitor, analyze, and reduce your carbon emissions with real-time data and actionable insights.",
      category: "Sustainability",
      author: "MIT Research Team",
      rating: 4.9,
      users: "2.5K",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=250&fit=crop",
      tags: ["AI", "Sustainability", "IoT"],
      price: "$1,200",
      likes: 156
    },
    {
      id: 2,
      title: "QuantumMed",
      subtitle: "Drug Discovery Platform",
      description:
        "Quantum computing approach to pharmaceutical research. QuantumMed accelerates the discovery of new drugs by simulating molecular interactions at unprecedented speeds.",
      category: "Healthcare",
      author: "Stanford PhD Collective",
      rating: 4.8,
      users: "1.8K",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      tags: ["Quantum", "Healthcare", "Research"],
      price: "$3,500",
      likes: 203
    },
    {
      id: 3,
      title: "AgriBot",
      subtitle: "Smart Farming Assistant",
      description:
        "Autonomous farming solution with predictive analytics. AgriBot leverages robotics and AI to optimize crop yields and reduce manual labor.",
      category: "Agriculture",
      author: "AgTech Innovators",
      rating: 4.7,
      users: "3.2K",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop",
      tags: ["Robotics", "Agriculture", "AI"],
      price: "$2,800",
      likes: 189
    },
    {
      id: 4,
      title: "ROBot",
      subtitle: "Smart Farming Assistant",
      description:
        "Autonomous farming solution with predictive analytics. ROBot is designed to enhance efficiency and sustainability in agriculture.",
      category: "Agriculture",
      author: "AgTech Innovators",
      rating: 4.7,
      users: "3.2K",
      image: "https://plus.unsplash.com/premium_photo-1678344170545-c3edef92a16e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["Robotics", "Agriculture", "AI"],
      price: "$2,400",
      likes: 167
    }
  ];

  return (
    <div className="bg-white px-6 py-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          View All Products
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProjects.map((project) => (
          <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 bg-white">
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
              <div className="absolute top-3 left-3 flex space-x-2">
                <div className="flex items-center space-x-1 bg-black/60 rounded-full px-2 py-1">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-white text-xs">{project.users}</span>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {project.subtitle}
              </p>
              
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900">{project.rating}</span>
                <div className="flex items-center ml-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 ml-1">{project.users}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-gray-900">{project.price}</span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{project.likes}</span>
                </div>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                View Product
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};