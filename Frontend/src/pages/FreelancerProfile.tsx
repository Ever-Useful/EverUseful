import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, DollarSign, Heart, ArrowLeft, Calendar, Award, Users } from "lucide-react";
import { getFreelancerById } from "@/utils/freelancerData";
import { ChatBox } from "@/components/ChatBox";

const FreelancerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const freelancer = getFreelancerById(Number(id));

  if (!freelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Freelancer not found</h1>
          <Button onClick={() => navigate("/")} className="bg-purple-600 hover:bg-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const portfolioProjects = [
    {
      title: "E-commerce Platform Redesign",
      description: "Complete UI/UX overhaul for a major retailer",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop",
      technologies: ["React", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "Mobile Banking App",
      description: "Secure and intuitive banking application",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop",
      technologies: ["React Native", "Node.js", "MongoDB"]
    },
    {
      title: "AI-Powered Analytics Dashboard",
      description: "Real-time data visualization and insights platform",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      technologies: ["Python", "TensorFlow", "D3.js"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                <Heart className="w-4 h-4 mr-2" />
                Save to Favorites
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <img 
                  src={freelancer.image} 
                  alt={freelancer.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
                />
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white ${
                  freelancer.availability === "Available" ? "bg-green-400" : "bg-yellow-400"
                }`} />
              </div>
              
              <div className="flex-1">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{freelancer.name}</h1>
                  <p className="text-xl text-gray-600 mb-4">{freelancer.title}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{freelancer.rating}</span>
                      <span className="text-gray-600">({freelancer.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{freelancer.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 max-w-2xl">{freelancer.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">${freelancer.hourlyRate}</div>
                  <div className="text-sm opacity-90">per hour</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancer.completedProjects}</div>
                  <div className="text-sm opacity-90">projects</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancer.responseTime}</div>
                  <div className="text-sm opacity-90">response</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancer.reviews}</div>
                  <div className="text-sm opacity-90">reviews</div>
                </CardContent>
              </Card>
            </div>

            {/* Skills Section */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-3">
                  {freelancer.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1 text-sm border-purple-300 text-purple-700 bg-purple-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioProjects.map((project, index) => (
                    <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability Card */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <Badge 
                  className={`mb-4 ${
                    freelancer.availability === "Available" 
                      ? "bg-green-100 text-green-800 border-green-300" 
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                  }`}
                >
                  {freelancer.availability}
                </Badge>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Usually responds in {freelancer.responseTime}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Timezone: {freelancer.location.includes('CA') ? 'PST' : freelancer.location.includes('NY') ? 'EST' : 'GMT'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ChatBox */}
            <ChatBox 
              freelancerName={freelancer.name}
              freelancerImage={freelancer.image}
              freelancerRating={freelancer.rating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;