
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, DollarSign, Clock, Globe, Award, TrendingUp, Shield } from "lucide-react";

export const FreelanceStats = () => {
  const stats = [
    {
      icon: Users,
      title: "Active Freelancers",
      value: "25,000+",
      description: "Skilled professionals worldwide",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Star,
      title: "Average Rating",
      value: "4.8/5",
      description: "Based on 50K+ reviews",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: DollarSign,
      title: "Total Paid Out",
      value: "$2.5M+",
      description: "To freelancers globally",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: "Avg Response Time",
      value: "2.5 hours",
      description: "Fast communication",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Countries",
      value: "50+",
      description: "Global talent pool",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Award,
      title: "Success Rate",
      value: "94%",
      description: "Project completion",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Skills Categories",
      value: "200+",
      description: "Diverse expertise",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      value: "85%",
      description: "Identity & skill verified",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Platform <span className="text-purple-400">Statistics</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of successful collaborations on our global freelance platform
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gray-800/60 border-gray-700 text-center"
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-300 mb-1">{stat.title}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
