import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Heart, MessageCircle } from "lucide-react";
import { freelancersData } from "@/utils/freelancerData";

export const FreelancerGrid = () => {
  const navigate = useNavigate();

  const handleViewProfile = (freelancerId: number) => {
    navigate(`/freelancer/${freelancerId}`);
  };

  return (
    <section className="bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-300 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Featured Professionals</h2>
            <p className="text-slate-600 text-lg">Connect with verified experts worldwide</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-700 font-medium">Showing {freelancersData.length} of 25,000+ professionals</span>
            <select className="bg-white border border-slate-300 text-slate-800 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>Top Rated</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {freelancersData.map((freelancer) => (
            <Card key={freelancer.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-slate-200 overflow-hidden flex flex-col h-full">
              <CardContent className="p-8 flex flex-col h-full">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img 
                        src={freelancer.image} 
                        alt={freelancer.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white shadow-sm ${
                        freelancer.availability === "Available" ? "bg-emerald-500" : "bg-amber-500"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors mb-1">
                        {freelancer.name}
                      </h3>
                      <p className="text-slate-600 font-medium text-base mb-2">{freelancer.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold">{freelancer.rating}</span>
                          <span>({freelancer.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{freelancer.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-rose-400 hover:text-rose-500 hover:bg-rose-50 p-2">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{freelancer.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {freelancer.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                  {freelancer.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-500 border-slate-200">
                      +{freelancer.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">${freelancer.hourlyRate}</div>
                    <div className="text-xs text-slate-500 font-medium">per hour</div>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <div className="text-2xl font-bold text-slate-900">{freelancer.completedProjects}</div>
                    <div className="text-xs text-slate-500 font-medium">projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{freelancer.responseTime}</div>
                    <div className="text-xs text-slate-500 font-medium">response</div>
                  </div>
                </div>

                {/* Spacer to push buttons to bottom */}
                <div className="flex-grow"></div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                    onClick={() => handleViewProfile(freelancer.id)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 font-medium">
            Load More Professionals
          </Button>
        </div>
      </div>
    </section>
  );
};