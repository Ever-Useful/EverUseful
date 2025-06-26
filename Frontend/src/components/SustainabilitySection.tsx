import { Badge } from "@/components/ui/badge";
import { CircleCheck } from "lucide-react";

export const SustainabilitySection = () => {
  return (
    <section id="sustainability" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Centered Coming Soon Badge */}
      <div className="flex justify-center mb-12">
        <Badge 
          variant="secondary" 
          className="text-green-600 bg-green-100 px-6 py-2 text-base font-medium animate-pulse shadow-md"
        >
          Coming Soon
        </Badge>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Gallery - Creative Layout */}
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-4 flex-1">
                <img
                  src="https://images.unsplash.com/photo-1625301840055-7c1b7198cfc0?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Sustainable forest"
                  className="rounded-xl shadow-lg object-cover h-full min-h-[200px]"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1587291376001-b838207de820?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Green energy"
                  className="rounded-xl shadow-lg object-cover h-full min-h-[200px]"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <img
                  src="https://images.unsplash.com/photo-1632103996718-4a47cf68b75e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Eco-friendly city"
                  className="rounded-xl shadow-lg object-cover h-full min-h-[424px]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Empowering <span className="text-green-600">Green Innovation</span> Through Collaboration
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              AMOGH's Sustainable Development Hub will connect eco-conscious enterprises with student innovators. Our upcoming platform will feature specialized tools to accelerate environmental solutions and measure real-world impact.
            </p>
            
            <div className="space-y-4">
              {[
                "Featured sustainable project showcase with impact metrics",
                "Direct partnerships with ESG-focused enterprises",
                "Carbon footprint calculator for projects",
                "Grant and funding opportunities",
                "Community-driven sustainability challenges"
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 mt-1">
                    <CircleCheck className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-gray-700 group-hover:text-green-800 transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              Get Early Access
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};