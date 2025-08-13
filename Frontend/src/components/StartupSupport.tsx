import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Users, DollarSign, BookOpen, User, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

export const StartupSupport = () => {
  const supportFeatures = [
    {
      icon: User,
      title: "Expert Mentorship",
      description: "Connect with industry veterans and successful entrepreneurs who guide you through every step"
    },
    {
      icon: DollarSign,
      title: "Funding Connections",
      description: "Access to angel investors, VCs, and grant opportunities tailored for student entrepreneurs"
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Comprehensive courses on business planning, marketing, legal structures, and more"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join a network of like-minded student entrepreneurs sharing experiences and insights"
    }
  ];

  const successStories = [
    {
      company: "EcoLogistics",
      founder: "Alex Chen",
      description: "Sustainable delivery platform",
      funding: "₹2.5M Series A",
      growth: "500% user growth"
    },
    {
      company: "HealthTracker",
      founder: "Maria Santos",
      description: "Personal health monitoring",
      funding: "₹1.8M Seed",
      growth: "100K+ active users"
    },
    {
      company: "StudyAI",
      founder: "James Kim",
      description: "AI-powered learning assistant",
      funding: "₹3.2M Series A",
      growth: "1M+ students helped"
    }
  ];

  return (
    <section id="startup-support" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <Rocket className="w-3 h-3 mr-1" />
            Startup Accelerator
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Launch Your Startup Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From idea validation to scaling your business, we provide comprehensive support 
            to turn your innovative projects into successful startups
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Everything You Need to Succeed
            </h3>
            
            <div className="space-y-6">
              {supportFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Apply for Program
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h3>
            
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{story.company}</h4>
                      <p className="text-gray-600">Founded by {story.founder}</p>
                      <p className="text-sm text-gray-500 mt-1">{story.description}</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-600">{story.funding}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-600">{story.growth}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Idea into Reality?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join hundreds of student entrepreneurs who have successfully launched their startups 
            through our comprehensive support program
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Start Your Journey Today
            <Rocket className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
