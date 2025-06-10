
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Users, ArrowRight, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export const FreelancingPreview = () => {
  const featuredFreelancers = [
    {
      name: "Sarah Chen",
      title: "AI/ML Specialist",
      rating: 4.9,
      completedProjects: 47,
      hourlyRate: 85,
      location: "San Francisco",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612e2bc?w=400&h=400&fit=crop&crop=face",
      skills: ["TensorFlow", "Python", "Computer Vision"]
    },
    {
      name: "Alex Rodriguez",
      title: "Blockchain Developer",
      rating: 4.8,
      completedProjects: 32,
      hourlyRate: 95,
      location: "Austin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      skills: ["Solidity", "Web3", "Smart Contracts"]
    },
    {
      name: "Maria Silva",
      title: "UX/UI Designer",
      rating: 4.9,
      completedProjects: 68,
      hourlyRate: 70,
      location: "New York",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      skills: ["Figma", "Design Systems", "Prototyping"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-indigo-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white animate-pulse">
            <Briefcase className="w-3 h-3 mr-1" />
            Expert Freelancers
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
            Connect with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Top Talent
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Work with skilled professionals who bring your innovative projects to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredFreelancers.map((freelancer, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-indigo-200">
                    <AvatarImage src={freelancer.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      {freelancer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
                      {freelancer.name}
                    </h3>
                    <p className="text-slate-600 text-sm">{freelancer.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{freelancer.rating}</span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-slate-600">{freelancer.completedProjects} projects</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{freelancer.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>${freelancer.hourlyRate}/hr</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 group-hover:scale-105">
                  <Users className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in delay-1000">
          <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300 hover:shadow-lg" asChild>
            <Link to="/freelancing">
              View All Freelancers
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
