import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Users, Zap } from "lucide-react";
import heroImage from "@/assets/images/image.png";
import studentsImage from "@/assets/images/students-renewable.jpeg";
import professorsImage from "@/assets/images/professors-consulting.jpg";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onBookConsultation: () => void;
}

export const HeroSection = ({
  onBookConsultation
}: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate('/aboutus');
  };

  return <section className="min-h-screen galaxy-bg py-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight mobile-text-4xl">
                <span className="text-eco-green glow-text">Expert</span>{" "}
                <span className="text-foreground">Consultation</span>{" "}
                <span className="text-eco-blue glow-text">Services</span>
              </h1>
              
              <p className="text-base text-muted-foreground leading-relaxed mobile-text-base">
                Expert consultation for universities, students, and organizations 
                transitioning to sustainable energy solutions. Build a greener tomorrow 
                with our proven strategies.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-eco-green">
                <Leaf className="h-5 w-5" />
                <span>Sustainable Projects</span>
              </div>
              <div className="flex items-center gap-2 text-eco-blue">
                <Zap className="h-5 w-5" />
                <span>Energy Optimization</span>
              </div>
              <div className="flex items-center gap-2 text-eco-purple">
                <Users className="h-5 w-5" />
                <span>Expert Guidance</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="eco-gradient hover:shadow-[var(--shadow-glow)] transition-all duration-300 group" onClick={onBookConsultation}>
                Free Business Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-eco-green text-eco-green hover:bg-eco-green hover:text-background transition-all duration-300"
                onClick={handleLearnMore} 
                >
              
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Main hero image */}
              <div className="col-span-2 relative group">
                <img src={heroImage} alt="Sustainability consultation" className="w-full h-80 object-cover rounded-2xl shadow-[var(--shadow-card)] group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent rounded-2xl" />
              </div>
              
              {/* Overlapped smaller images */}
              <div className="relative group">
                <img src={studentsImage} alt="Students working on renewable energy" className="w-full h-48 object-cover rounded-xl shadow-[var(--shadow-card)] group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-eco-green/20 to-transparent rounded-xl" />
              </div>
              
              <div className="relative group -mt-12">
                <img src={professorsImage} alt="Professors consulting on sustainability" className="w-full h-48 object-cover rounded-xl shadow-[var(--shadow-card)] group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-eco-blue/20 to-transparent rounded-xl" />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-eco-green/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-eco-blue/20 rounded-full blur-xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>;
};