import Header from "../Header";

import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToJobs = () => {
    const jobsSection = document.getElementById('job-listings');
    jobsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
   
    <section className="bg-mint-dark min-h-screen flex items-center">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-olive-dark leading-tight">
                Build Tomorrow, Together
              </h1>
              <p className="text-xl lg:text-2xl text-olive leading-relaxed max-w-lg">
                Shape the future of technology with passionate innovators who believe in making an impact together.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={scrollToJobs}
                className="bg-olive hover:bg-olive-dark text-white px-8 py-4 text-lg rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              >
                See Open Roles
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-olive text-olive hover:bg-olive hover:text-white px-8 py-4 text-lg rounded-lg transition-all duration-300"
              >
                Learn About Us
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center"
                alt="Diverse team collaborating in modern workspace"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Floating accent */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-olive rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-mint-dark rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;