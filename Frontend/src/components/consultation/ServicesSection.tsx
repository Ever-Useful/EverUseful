import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Zap, Building, Users, BarChart3, Settings } from "lucide-react";

const services = [
  {
    icon: Leaf,
    title: "Sustainability Assessment",
    description: "Comprehensive analysis of your current energy usage and environmental impact with actionable recommendations.",
    color: "eco-green",
    details: "• Site energy audit\n• Carbon footprint evaluation\n• Sustainability roadmap"
  },
  {
    icon: Zap,
    title: "Renewable Energy Planning",
    description: "Custom renewable energy solutions including solar, wind, and hybrid systems tailored to your needs.",
    color: "eco-blue",
    details: "• Feasibility studies\n• System design & sizing\n• ROI analysis"
  },
  {
    icon: Building,
    title: "Campus Energy Optimization",
    description: "Smart energy management systems for educational institutions to reduce costs and carbon footprint.",
    color: "eco-purple",
    details: "• Building automation\n• Demand response strategies\n• Energy efficiency upgrades"
  },
  {
    icon: Users,
    title: "Student Training Programs",
    description: "Educational workshops and certification programs for students interested in renewable energy careers.",
    color: "eco-orange",
    details: "• Hands-on workshops\n• Certification courses\n• Career guidance"
  },
  {
    icon: BarChart3,
    title: "Energy Analytics",
    description: "Advanced monitoring and reporting systems to track energy performance and sustainability metrics.",
    color: "eco-green",
    details: "• Real-time dashboards\n• Custom reporting\n• Data-driven insights"
  },
  {
    icon: Settings,
    title: "Implementation Support",
    description: "End-to-end project management from planning to installation and ongoing maintenance support.",
    color: "eco-blue",
    details: "• Project coordination\n• Vendor management\n• Ongoing maintenance"
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-20 px-4 lg:px-8 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-eco-green glow-text">Our Services</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide comprehensive sustainability consulting services to help educational institutions 
            and organizations transition to renewable energy solutions. Our expert team guides you through 
            every step of your sustainable transformation journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="relative group">
                <Card className="interactive-card bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 h-full">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-${service.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-8 w-8 text-${service.color}`} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-center leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {/* Popup Content
                <div className="absolute inset-0 bg-card/95 backdrop-blur-md border border-primary/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 group-hover:z-10 shadow-2xl p-6 flex flex-col justify-center">
                  <div className="text-center space-y-4">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-${service.color}/20 flex items-center justify-center`}>
                      <IconComponent className={`h-10 w-10 text-${service.color}`} />
                    </div>
                    <h3 className={`text-2xl font-bold text-${service.color}`}>{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="text-left">
                      <h4 className="font-semibold text-foreground mb-2">What's Included:</h4>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {service.details}
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};