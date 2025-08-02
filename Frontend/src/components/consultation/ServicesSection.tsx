import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Cloud, FlaskConical, Leaf, Zap } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Agents",
    heading: "Intelligent AI Agents for Business Automation",
    description: "Our advanced AI Agents automate complex workflows, provide real-time data insights, and deliver personalized customer interactions. Enhance productivity, reduce costs, and scale seamlessly with 24/7 intelligent business support.",
    color: "eco-blue",
    details: "• Workflow automation\n• Real-time data insights\n• Personalized customer interactions\n• 24/7 intelligent support"
  },
  {
    icon: FlaskConical,
    title: "Research & Development (R&D) Services",
    heading: "Expert-Led R&D & Innovation Support",
    description: "From concept to commercialization, connect with top PhD mentors to drive technology scouting, prototype development, and continuous improvement. Unlock tailored solutions to stay ahead in a competitive market.",
    color: "eco-purple",
    details: "• Technology scouting\n• Prototype development\n• PhD mentor connections\n• Continuous improvement"
  },
  {
    icon: Leaf,
    title: "Sustainable Development Solutions",
    heading: "Holistic Sustainable Development Strategies",
    description: "Implement research-driven solutions aligned with UN Sustainable Development Goals to promote green innovation, social equity, and positive environmental and societal impact—positioning your business as a responsible leader.",
    color: "eco-green",
    details: "• UN SDG alignment\n• Green innovation\n• Social equity focus\n• Environmental impact"
  },
  {
    icon: Zap,
    title: "Renewable Energy Solutions",
    heading: "Clean, Efficient Renewable Energy Technologies",
    description: "Adopt solar, wind, hydropower, and bioenergy solutions to reduce your carbon footprint, lower energy costs, and support global clean energy transitions while complying with evolving regulations.",
    color: "eco-orange",
    details: "• Solar & wind solutions\n• Hydropower & bioenergy\n• Carbon footprint reduction\n• Regulatory compliance"
  },
  {
    icon: Cloud,
    title: "Custom API Solutions",
    heading: " Tailored API Development & Integration",
    description: "Unlock seamless connectivity and automation with our custom-built APIs.",
    color: "eco-blue",
    details: " We design, develop, and integrate APIs tailored to your unique business needs—enabling secure data exchange, enhancing scalability, and powering digital transformation across platforms."
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
            We provide comprehensive consulting services to help businesses and organizations 
            leverage AI technology, drive innovation through R&D, implement sustainable solutions, 
            and transition to renewable energy. Our expert team guides you through every step of your transformation journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="relative group">
                <Card className="interactive-card bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 h-full">
                  <CardHeader className="text-center">
                    <div className={`w-10 h-10 mx-auto rounded-full bg-${service.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-8 w-8 text-${service.color}`} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <h3 className="text-lg font-bold text-foreground mt-2">
                      {service.heading}
                    </h3>
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