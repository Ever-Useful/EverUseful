
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Users, ArrowRight, Briefcase, Star, Building } from "lucide-react";

export const CareerSection = () => {
  const jobOpenings = [
    {
      title: "Senior AI Research Engineer",
      company: "AMOGH Labs",
      location: "San Francisco, CA",
      type: "Full-time",
              salary: "₹150K - ₹200K",
      experience: "5+ years",
      skills: ["Python", "TensorFlow", "Deep Learning"],
      posted: "2 days ago"
    },
    {
      title: "Blockchain Developer",
      company: "Innovation Hub",
      location: "Austin, TX",
      type: "Remote",
              salary: "₹120K - ₹160K",
      experience: "3+ years",
      skills: ["Solidity", "Web3", "Smart Contracts"],
      posted: "1 week ago"
    },
    {
      title: "Product Manager - Sustainability",
      company: "GreenTech Solutions",
      location: "Seattle, WA",
      type: "Hybrid",
              salary: "₹110K - ₹140K",
      experience: "4+ years",
      skills: ["Product Strategy", "Agile", "Sustainability"],
      posted: "3 days ago"
    },
    {
      title: "UX/UI Designer",
      company: "Design Collective",
      location: "New York, NY",
      type: "Full-time",
              salary: "₹90K - ₹120K",
      experience: "2+ years",
      skills: ["Figma", "Design Systems", "User Research"],
      posted: "5 days ago"
    }
  ];

  const careerStats = [
    { value: "500+", label: "Job Opportunities", icon: Briefcase },
    { value: "95%", label: "Placement Rate", icon: Star },
    { value: "200+", label: "Partner Companies", icon: Building },
    { value: "50K+", label: "Career Connections", icon: Users }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-32 right-16 w-5 h-5 bg-purple-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 left-10 w-4 h-4 bg-indigo-400 rounded-full animate-pulse opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white animate-pulse text-lg px-6 py-2">
            <Briefcase className="w-5 h-5 mr-2" />
            💼 CAREER OPPORTUNITIES
          </Badge>
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-800 mb-6">
            Launch Your{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Dream Career
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Connect with innovative companies, find exciting opportunities, and build the career 
            you've always dreamed of in the world of technology and innovation.
          </p>
        </div>

        {/* Career Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {careerStats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group animate-scale-in bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all duration-500 shadow-lg hover:shadow-xl"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-slate-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {jobOpenings.map((job, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-blue-200 bg-white/90 backdrop-blur-sm animate-scale-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                    {job.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {job.posted}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{job.experience}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs hover:scale-110 transition-transform duration-200">
                        {typeof skill === 'string' ? skill : (skill as any)?.name || (skill as any)?.expertise || 'Unknown Skill'}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 group-hover:scale-105">
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in delay-1000">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg px-8 py-4">
            <Briefcase className="mr-2 w-6 h-6" />
            View All Opportunities
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};
