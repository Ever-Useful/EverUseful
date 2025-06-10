
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, DollarSign, Heart, MessageCircle } from "lucide-react";

export const FreelancerGrid = () => {
  const freelancers = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "AI Research Scientist",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviews: 127,
      hourlyRate: 85,
      location: "San Francisco, CA",
      availability: "Available",
      skills: ["Machine Learning", "Python", "TensorFlow", "Research"],
      description: "PhD in AI with 8+ years experience in machine learning research and development.",
      completedProjects: 45,
      responseTime: "2 hours"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "Blockchain Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviews: 89,
      hourlyRate: 75,
      location: "Austin, TX",
      availability: "Available",
      skills: ["Solidity", "Web3", "Smart Contracts", "React"],
      description: "Full-stack blockchain developer specializing in DeFi and NFT platforms.",
      completedProjects: 32,
      responseTime: "1 hour"
    },
    {
      id: 3,
      name: "Lisa Johnson",
      title: "UX/UI Designer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      reviews: 156,
      hourlyRate: 65,
      location: "New York, NY",
      availability: "Busy until Feb 15",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      description: "Senior UX designer with expertise in creating intuitive digital experiences.",
      completedProjects: 67,
      responseTime: "4 hours"
    },
    {
      id: 4,
      name: "Dr. Raj Patel",
      title: "Data Scientist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5.0,
      reviews: 78,
      hourlyRate: 90,
      location: "London, UK",
      availability: "Available",
      skills: ["Python", "R", "Machine Learning", "Statistics"],
      description: "Data scientist with PhD in Statistics, specialized in predictive modeling.",
      completedProjects: 28,
      responseTime: "3 hours"
    },
    {
      id: 5,
      name: "Emma Watson",
      title: "Mobile App Developer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4.6,
      reviews: 203,
      hourlyRate: 70,
      location: "Toronto, CA",
      availability: "Available",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      description: "Mobile app developer with 6+ years experience in cross-platform development.",
      completedProjects: 54,
      responseTime: "2 hours"
    },
    {
      id: 6,
      name: "James Wilson",
      title: "Cybersecurity Expert",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviews: 167,
      hourlyRate: 95,
      location: "Berlin, DE",
      availability: "Available",
      skills: ["Penetration Testing", "Security Audits", "Compliance", "Risk Assessment"],
      description: "Certified cybersecurity professional with expertise in enterprise security.",
      completedProjects: 38,
      responseTime: "1 hour"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Top Freelancers</h2>
            <p className="text-gray-400">Connect with skilled professionals worldwide</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Showing {freelancers.length} of 25,000+ freelancers</span>
            <select className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2">
              <option>Top Rated</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <Card key={freelancer.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gray-800/60 border-gray-700 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <img 
                      src={freelancer.image} 
                      alt={freelancer.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                      freelancer.availability === "Available" ? "bg-green-400" : "bg-yellow-400"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                      {freelancer.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-1">{freelancer.title}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{freelancer.rating}</span>
                        <span>({freelancer.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{freelancer.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-pink-400 hover:text-pink-300 p-1">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-gray-300 text-sm mb-4">{freelancer.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {freelancer.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {skill}
                    </Badge>
                  ))}
                  {freelancer.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                      +{freelancer.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-4 py-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-white font-bold">${freelancer.hourlyRate}</div>
                    <div className="text-gray-400 text-xs">per hour</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{freelancer.completedProjects}</div>
                    <div className="text-gray-400 text-xs">projects</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{freelancer.responseTime}</div>
                    <div className="text-gray-400 text-xs">response</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    View Profile
                  </Button>
                </div>

                <div className="mt-3 text-center">
                  <Badge 
                    className={`${
                      freelancer.availability === "Available" 
                        ? "bg-green-600 text-white" 
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {freelancer.availability}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Load More Freelancers
          </Button>
        </div>
      </div>
    </section>
  );
};
