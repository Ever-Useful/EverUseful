import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, DollarSign, Shield, Award, Globe, Users } from "lucide-react";
import benefitsImage from "@/assets/images/benefits-image.png"; 

const benefits = [
  {
    icon: TrendingDown,
    title: "Reduce Carbon Footprint",
    description: "Cut emissions by up to 80% with our proven renewable energy strategies.",
    percentage: "80%",
    color: "eco-green"
  },
  {
    icon: DollarSign,
    title: "Lower Energy Costs",
    description: "Save thousands annually on electricity bills through efficient energy systems.",
    percentage: "60%",
    color: "eco-blue"
  },
  {
    icon: Shield,
    title: "Energy Independence",
    description: "Reduce reliance on grid electricity and protect against rising energy costs.",
    percentage: "95%",
    color: "eco-purple"
  },
  {
    icon: Award,
    title: "Sustainability Certification",
    description: "Achieve green building certifications and sustainability recognition.",
    percentage: "100%",
    color: "eco-orange"
  },
  {
    icon: Globe,
    title: "Environmental Impact",
    description: "Contribute to global climate goals and environmental preservation.",
    percentage: "∞",
    color: "eco-green"
  },
  {
    icon: Users,
    title: "Community Leadership",
    description: "Become a sustainability leader and inspire others in your community.",
    percentage: "★★★★★",
    color: "eco-blue"
  }
];

export const BenefitsSection = () => {
  return (
    <section className="py-20 px-4 lg:px-8 galaxy-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-eco-green glow-text">Features & Benefits</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the transformative impact of sustainable energy solutions on your organization, 
            community, and the environment.
          </p>
        </div>

        {/* Full Width Image */}
        <div className="relative mb-16 group">
          <div className="relative overflow-hidden rounded-2xl">
            <img 
              src={benefitsImage} 
              alt="Sustainability benefits visualization"
              className="w-full h-[400px] lg:h-[500px] object-cover shadow-[var(--shadow-card)] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent group-hover:from-background/80 group-hover:via-background/20 transition-all duration-500" />
            
            {/* Floating stats */}
            <div className="absolute top-6 left-6 bg-eco-green/90 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm opacity-90">Projects Completed</div>
            </div>
            
            <div className="absolute bottom-6 right-6 bg-eco-blue/90 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm opacity-90">Client Satisfaction</div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-eco-green/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-eco-blue/20 rounded-full blur-xl animate-pulse" />
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card 
                key={index} 
                className="interactive-card bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-12 h-12 rounded-full bg-${benefit.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-6 w-6 text-${benefit.color}`} />
                    </div>
                    <div className={`text-2xl font-bold text-${benefit.color} group-hover:scale-110 transition-transform duration-300`}>
                      {benefit.percentage}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};