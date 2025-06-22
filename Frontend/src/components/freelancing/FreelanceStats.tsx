import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, Globe, TrendingUp, Target, Lightbulb, Zap, Heart } from "lucide-react";

export const FreelanceStats = () => {
  const academicStats = [
    {
      icon: Users,
      title: "Active Freelancers",
      value: "2,500+",
      description: "Creative individuals",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: Globe,
      title: "Universities",
      value: "150+",
      description: "Global academic institutions",
      color: "from-green-400 to-emerald-400"
    },
    {
      icon: TrendingUp,
      title: "Success Rate",
      value: "94%",
      description: "increasing Users",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: Zap,
      title: "Avg Response Time",
      value: "4.2 hours",
      description: "Academic peer response",
      color: "from-teal-400 to-green-400"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Academic pattern overlay */}
      <div className="absolute inset-0 bg-[url(&quot;data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E&quot;)] opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4 font-serif">
            Academic Network <span className="bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">Statistics</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">
            Join a thriving community of scholars, researchers, and academic innovators advancing knowledge across disciplines
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {academicStats.map((stat, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-500 hover:scale-105 bg-white/80 backdrop-blur-sm border-slate-200 text-center hover:bg-white/95"
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1 font-serif">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-600 mb-1">{stat.title}</div>
                <div className="text-xs text-slate-500 font-medium">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom section with academic features */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-slate-200 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-serif">
              Trusted by Leading Academic Institutions
            </h3>
            <div className="flex flex-wrap justify-center gap-8 text-slate-600">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Peer-Reviewed Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="font-medium">International Reach</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium">Research Excellence</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-medium">Collaborative Spirit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};