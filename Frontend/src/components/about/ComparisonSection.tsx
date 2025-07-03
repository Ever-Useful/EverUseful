
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Star, Zap } from "lucide-react";

const ComparisonSection = () => {
  const amoghFeatures = [
    "Unified platform for students, PhDs, professors, and businesses",
    "End-to-end innovation lifecycle management",
    "Cross-disciplinary collaboration tools",
    "Integrated AI marketplace",
    "Sustainability-focused initiatives",
    "Premium mentorship network"
  ];

  const competitors = [
    {
      name: "Student Project Platforms",
      icon: "🎓",
      limitations: [
        "No PhD expertise access",
        "Limited mentorship options",
        "No AI marketplace integration",
        "Fragmented collaboration"
      ]
    },
    {
      name: "Research Networks",
      icon: "🔬",
      limitations: [
        "Limited student participation",
        "No commercialization path",
        "Minimal industry connections",
        "No sustainability focus"
      ]
    },
    {
      name: "Freelance Platforms",
      icon: "💼",
      limitations: [
        "No academic collaboration",
        "Limited project support",
        "Fragmented services",
        "No integrated events"
      ]
    },
    {
      name: "Sustainability Platforms",
      icon: "🌱",
      limitations: [
        "Limited academic integration",
        "No research mentorship",
        "Minimal commercialization",
        "Fragmented approach"
      ]
    }
  ];

  return (
    <section className="py-16 px-2 sm:px-4 lg:px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Why Choose Amogh?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Experience the future of collaborative innovation</p>
        </div>
        
        <div className="space-y-8 lg:space-y-0">
          {/* Amogh Platform - Enhanced with animations */}
          <div className="mb-8 lg:mb-12 group">
            <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl hover:shadow-3xl border-0 relative overflow-hidden mx-auto max-w-5xl transform hover:scale-105 transition-all duration-500">
              {/* Animated background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
              
              <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 px-4 py-2 text-sm md:text-base font-bold rounded-bl-2xl shadow-lg">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  PREMIUM CHOICE
                </div>
              </div>
              
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="text-center mb-8 md:mb-12">
                  <div className="flex justify-center items-center gap-3 mb-4">
                    <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      AMOGH Platform
                    </h3>
                    <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
                  </div>
                  <div className="w-full h-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full shadow-lg"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {amoghFeatures.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transform hover:scale-105 transition-all duration-300 border border-white/20"
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <div className="bg-green-400 rounded-full p-1 shadow-lg">
                        <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <span className="text-base md:text-lg font-semibold leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competitors - Enhanced grid with staggered animations */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {competitors.map((competitor, index) => (
              <Card 
                key={index} 
                className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-red-300 transition-all duration-500 transform hover:-translate-y-2 group"
                style={{ 
                  animationDelay: `${(index + 6) * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl md:text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {competitor.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base mb-3 leading-tight">
                      {competitor.name}
                    </h3>
                    <div className="w-full h-0.5 bg-gradient-to-r from-gray-300 to-red-300 rounded"></div>
                  </div>
                  
                  <div className="space-y-3">
                    {competitor.limitations.map((limitation, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        style={{ 
                          animationDelay: `${(index * 4 + idx) * 0.05}s`,
                          animation: 'slideInLeft 0.4s ease-out forwards'
                        }}
                      >
                        <div className="bg-red-500 rounded-full p-0.5 mt-0.5">
                          <X className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                        <span className="text-xs md:text-sm text-gray-700 font-medium leading-snug">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `
      }} />
    </section>
  );
};

export default ComparisonSection;