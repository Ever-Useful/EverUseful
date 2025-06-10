
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, DollarSign, Users, Heart, Eye, ArrowRight } from "lucide-react";

export const ProductGrid = () => {
  const projects = [
    {
      id: 1,
      title: "AI-Powered Climate Change Prediction Model",
      description: "Advanced machine learning system for predicting climate patterns and environmental changes with 95% accuracy.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
      category: "AI & Sustainability",
      price: "$2,500",
      duration: "2 months",
      rating: 4.9,
      reviews: 127,
      author: "Dr. Sarah Chen",
      authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      skills: ["Machine Learning", "Python", "Climate Science"],
      views: 1540,
      likes: 284
    },
    {
      id: 2,
      title: "Blockchain-Based Supply Chain Tracker",
      description: "Transparent supply chain management system using blockchain technology for ethical sourcing verification.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
      category: "Blockchain",
      price: "$3,200",
      duration: "3 months",
      rating: 4.8,
      reviews: 89,
      author: "Michael Rodriguez",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      skills: ["Blockchain", "Solidity", "React"],
      views: 2100,
      likes: 456
    },
    {
      id: 3,
      title: "Smart Health Monitoring IoT Device",
      description: "Wearable device that monitors vital signs and provides real-time health analytics using advanced sensors.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      category: "HealthTech",
      price: "$1,800",
      duration: "6 weeks",
      rating: 4.7,
      reviews: 156,
      author: "Lisa Johnson",
      authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face",
      skills: ["IoT", "Hardware", "Mobile App"],
      views: 980,
      likes: 187
    },
    {
      id: 4,
      title: "Sustainable Energy Management System",
      description: "Smart grid solution for optimizing renewable energy distribution and reducing carbon footprint.",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop",
      category: "Sustainable Tech",
      price: "$4,500",
      duration: "4 months",
      rating: 5.0,
      reviews: 78,
      author: "Dr. Raj Patel",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      skills: ["Energy Systems", "Python", "Data Analytics"],
      views: 1765,
      likes: 389
    },
    {
      id: 5,
      title: "Educational VR Platform for Remote Learning",
      description: "Immersive virtual reality platform that enhances online education with interactive 3D environments.",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=250&fit=crop",
      category: "EdTech",
      price: "$2,800",
      duration: "10 weeks",
      rating: 4.6,
      reviews: 203,
      author: "Emma Watson",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      skills: ["VR Development", "Unity", "3D Modeling"],
      views: 1320,
      likes: 245
    },
    {
      id: 6,
      title: "Fintech Mobile Payment Solution",
      description: "Secure peer-to-peer payment app with advanced encryption and seamless user experience.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
      category: "FinTech",
      price: "$3,800",
      duration: "12 weeks",
      rating: 4.8,
      reviews: 167,
      author: "James Wilson",
      authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
      skills: ["React Native", "Cybersecurity", "API Development"],
      views: 2240,
      likes: 478
    }
  ];

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Showing {projects.length} of 2,540 projects</span>
          <select className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2">
            <option>Most Recent</option>
            <option>Highest Rated</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gray-800/60 border-gray-700 overflow-hidden">
            <div className="relative">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {project.category}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70">
                  <Heart className="w-4 h-4 text-white" />
                </Button>
                <div className="flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-white text-xs">{project.views}</span>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={project.authorImage} 
                  alt={project.author}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-300 text-sm">{project.author}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 text-sm">{project.rating}</span>
                  <span className="text-gray-500 text-sm">({project.reviews})</span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{project.price}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{project.duration}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-pink-400">
                  <Heart className="w-3 h-3" />
                  <span className="text-sm">{project.likes}</span>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                View Details
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
          Load More Projects
        </Button>
      </div>
    </div>
  );
};
