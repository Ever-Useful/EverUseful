import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Shield, Award, Globe, Users, Zap, Brain, FlaskConical, Leaf, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const benefits = [
  {
    icon: Brain,
    title: "AI-Powered Efficiency",
    description: "Leverage intelligent automation to streamline operations and boost productivity by up to 300%.",
    percentage: "300%",
    color: "from-blue-600 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:border-blue-400"
  },
  {
    icon: DollarSign,
    title: "Cost Optimization",
    description: "Reduce operational costs by up to 60% through smart resource management and automation.",
    percentage: "60%",
    color: "from-emerald-600 to-green-600",
    bgColor: "from-emerald-50 to-green-50",
    borderColor: "border-emerald-200",
    hoverColor: "hover:border-emerald-400"
  },
  {
    icon: Shield,
    title: "Risk Mitigation",
    description: "Advanced AI systems provide 24/7 monitoring and proactive threat detection.",
    percentage: "99.9%",
    color: "from-purple-600 to-violet-600",
    bgColor: "from-purple-50 to-violet-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:border-purple-400"
  },
  {
    icon: Award,
    title: "Innovation Leadership",
    description: "Stay ahead of competition with cutting-edge R&D and sustainable development solutions.",
    percentage: "100%",
    color: "from-orange-600 to-red-600",
    bgColor: "from-orange-50 to-red-50",
    borderColor: "border-orange-200",
    hoverColor: "hover:border-orange-400"
  },
  {
    icon: Globe,
    title: "Environmental Impact",
    description: "Reduce carbon footprint by up to 80% with renewable energy and sustainable practices.",
    percentage: "80%",
    color: "from-teal-600 to-cyan-600",
    bgColor: "from-teal-50 to-cyan-50",
    borderColor: "border-teal-200",
    hoverColor: "hover:border-teal-400"
  },
  {
    icon: Users,
    title: "Expert Network",
    description: "Access to PhD mentors and industry experts for comprehensive solution development.",
    percentage: "500+",
    color: "from-indigo-600 to-purple-600",
    bgColor: "from-indigo-50 to-purple-50",
    borderColor: "border-indigo-200",
    hoverColor: "hover:border-indigo-400"
  }
];

export const BenefitsSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-20 px-4 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-200 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-cyan-200 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 text-sm font-semibold">Why Choose Our Services</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-slate-800">Transform Your Business with</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Intelligent Solutions
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Experience unprecedented growth and efficiency through our comprehensive suite of AI, R&D, 
            sustainability, and renewable energy solutions designed for the modern enterprise.
          </p>
        </div>

        {/* Interactive Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card 
                  className={`relative overflow-hidden bg-gradient-to-br ${benefit.bgColor} border-2 ${benefit.borderColor} ${benefit.hoverColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-xl"></div>
                  </div>

                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                        {/* {benefit.percentage} */}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0">
                    <CardDescription className="text-slate-600 leading-relaxed text-base group-hover:text-slate-700 transition-colors">
                      {benefit.description}
                    </CardDescription>
                    
                    {/* Interactive Arrow - REMOVED */}
                    {/* <div className="mt-6 flex items-center gap-2 text-slate-500 group-hover:text-slate-700 transition-colors">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
                    </div> */}
                  </CardContent>
                  
                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`}></div>
                </Card>

                {/* Floating Elements on Hover */}
                {isHovered && (
                  <>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-ping delay-300"></div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Call to Action - REMOVED */}
        {/* <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg hover:shadow-xl">
            <span>Ready to Transform Your Business?</span>
            <TrendingUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform duration-300" />
          </div>
        </div> */}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </section>
  );
};