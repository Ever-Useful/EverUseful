import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';

const FeaturedProjects = () => {
  const featuredProjects = useMemo(() => [
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
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      tags: ["AI", "Sustainability", "IoT"],
      gradient: "from-green-500 to-emerald-600",
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
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      tags: ["Quantum", "Healthcare", "Research"],
      gradient: "from-blue-500 to-purple-600",
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
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      tags: ["Robotics", "Agriculture", "AI"],
      gradient: "from-yellow-500 to-orange-600",
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
      gradient: "from-yellow-500 to-orange-600",
    }
  ], []);

  return (
    <section id="featured" className="animate-on-scroll py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-600">Discover innovative solutions created by talented students</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <CardHeader className="p-0 relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-10 z-10`}></div>
                <img
                  src={`${project.image}?w=600&h=300&fit=crop`}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 z-20">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {project.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-gray-600">{project.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-blue-600">{project.subtitle}</p>
                </div>
                
                <CardDescription className="text-gray-600 line-clamp-3">
                  {project.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{project.author}</p>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">{project.users} users</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
            Explore Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;