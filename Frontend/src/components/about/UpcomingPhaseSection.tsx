
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Target } from "lucide-react";

const UpcomingPhaseSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Sustainable Innovation Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-blue-900/80"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
        
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Upcoming Events & Speaker Talks</h2>
          <p className="text-green-100 text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
           Join industry leaders and innovators at our exclusive events.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group cursor-pointer">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Innovation Support" 
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <Lightbulb className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Innovation Support</h3>
              <p className="text-green-100 leading-relaxed">
                Connect sustainable innovators with resources, mentorship, and funding opportunities 
                to accelerate green technology development.
              </p>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Investment Matching" 
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <TrendingUp className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Investment Matching</h3>
              <p className="text-blue-100 leading-relaxed">
                AI-powered matching system to connect sustainable startups with investors 
                who share their vision for a greener future.
              </p>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80" 
                  alt="Impact Tracking" 
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <Target className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Impact Tracking</h3>
              <p className="text-purple-100 leading-relaxed">
                Comprehensive metrics and analytics to measure and showcase the environmental 
                impact of sustainable innovations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingPhaseSection;