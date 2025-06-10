
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Users, Heart } from "lucide-react";

export const ProjectShowcase = () => {
  const projects = [
    {
      id: 1,
      title: "EcoTracker App",
      description: "AI-powered carbon footprint tracker helping individuals make sustainable choices",
      category: "Sustainability",
      student: "Sarah Chen",
      university: "MIT",
      rating: 4.9,
      likes: 234,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
      tags: ["AI", "Environment", "Mobile App"]
    },
    {
      id: 2,
      title: "LocalMarket Platform",
      description: "Connecting local farmers directly with consumers through digital marketplace",
      category: "E-commerce",
      student: "Marcus Johnson",
      university: "Stanford",
      rating: 4.8,
      likes: 187,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop",
      tags: ["Platform", "Agriculture", "Local Business"]
    },
    {
      id: 3,
      title: "MindWell VR",
      description: "Virtual reality therapy sessions for mental health support and meditation",
      category: "HealthTech",
      student: "Elena Rodriguez",
      university: "Harvard",
      rating: 4.9,
      likes: 312,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop",
      tags: ["VR", "Mental Health", "Therapy"]
    },
    {
      id: 4,
      title: "CodeMentor AI",
      description: "AI-powered coding assistant specifically designed for beginner programmers",
      category: "EdTech",
      student: "David Park",
      university: "Berkeley",
      rating: 4.7,
      likes: 156,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
      tags: ["AI", "Education", "Programming"]
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Featured Student Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover innovative solutions created by talented students ready to transform into real businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-700 hover:bg-white">
                    {project.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium ml-1">{project.rating}</span>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{project.student}</div>
                      <div className="text-xs text-gray-500">{project.university}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{project.likes}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="p-2">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8">
            View All Projects
            <ExternalLink className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
