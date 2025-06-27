
import { Button } from "@/components/ui/button";

export const CommercialSection = () => {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative space-y-8 mb-8 md:mb-0">
            <div className="relative">
              {/* First image - main */}
              <img 
                src="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=500&h=400&fit=crop" 
                alt="Sustainable technology" 
                className="rounded-2xl w-full h-56 sm:h-72 md:h-80 object-cover shadow-lg"
              />
              
              {/* Second image - overlapped top right */}
              <img 
                src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=250&fit=crop" 
                alt="Green innovation" 
                className="hidden sm:block absolute -top-4 -right-4 md:-top-6 md:-right-6 rounded-2xl w-28 h-20 md:w-48 md:h-36 object-cover shadow-xl border-4 border-white"
              />
              
              {/* Third image - overlapped bottom left */}
              <img 
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=250&fit=crop" 
                alt="Environmental solutions" 
                className="hidden sm:block absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 rounded-2xl w-28 h-20 md:w-48 md:h-36 object-cover shadow-xl border-4 border-white"
              />
            </div>
          </div>
          
          <div className="space-y-5 sm:space-y-6">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
              SUSTAINABLE SOLUTIONS
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Green Technology that Works for Tomorrow
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Our platform will soon open submissions for innovative sustainable project solutions that combine cutting-edge technology with environmental responsibility to create lasting positive impact across communities worldwide.
            </p>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-gray-700 text-sm sm:text-base">Submit your carbon neutral projects</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-gray-700 text-sm sm:text-base">Community-driven innovation platform</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-gray-700 text-sm sm:text-base">Global impact measurement</p>
              </div>
            </div>
            
            {/* <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full">
              Learn More
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
};