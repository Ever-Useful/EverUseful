
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lightbulb, TrendingUp, Network, Target, Rocket, ArrowRight } from "lucide-react";

export const FeatureSection = () => {
  const studentFeatures = [
    {
      icon: Lightbulb,
      title: "Showcase Your Innovation",
      description: "Present your projects to a network of businesses looking for fresh ideas and solutions"
    },
    {
      icon: Network,
      title: "Connect with Industry",
      description: "Build relationships with companies and professionals in your field of interest"
    },
    {
      icon: TrendingUp,
      title: "Monetize Your Ideas",
      description: "Turn your academic projects into profitable products or services"
    }
  ];

  const businessFeatures = [
    {
      icon: Target,
      title: "Discover Fresh Talent",
      description: "Find innovative students with cutting-edge ideas and emerging technologies"
    },
    {
      icon: Rocket,
      title: "Accelerate Innovation",
      description: "Partner with students to bring new perspectives to your business challenges"
    },
    {
      icon: Users,
      title: "Build Tomorrow's Team",
      description: "Identify and recruit the next generation of innovators and entrepreneurs"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Empowering Both Sides
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're a student with groundbreaking ideas or a business seeking innovation, 
            we provide the platform to connect and collaborate
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* For Students */}
          <div id="for-students" className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                For Students
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Transform your academic projects into real-world impact and launch your entrepreneurial journey
              </p>
            </div>

            <div className="space-y-6">
              {studentFeatures.map((feature, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Join as Student
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* For Businesses */}
          <div id="for-businesses" className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                For Businesses
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Access a pipeline of innovative solutions and connect with the brightest emerging talent
              </p>
            </div>

            <div className="space-y-6">
              {businessFeatures.map((feature, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="w-full lg:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Partner with Us
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
