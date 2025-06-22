
import { Lightbulb, Users, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ValuesSection = () => {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovative Tech",
      description: "Push boundaries with cutting-edge technology and creative solutions that shape tomorrow."
    },
    {
      icon: Users,
      title: "Inclusive Culture",
      description: "Embrace diversity and create an environment where every voice matters and thrives."
    },
    {
      icon: Globe,
      title: "Global Team",
      description: "Connect with talented individuals from around the world in our distributed workforce."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-olive-dark mb-4">
            Why Join Us?
          </h2>
          <p className="text-xl text-olive max-w-2xl mx-auto">
            Discover what makes our team special and why we're the perfect place to grow your career.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-md rounded-xl"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-mint-light rounded-full flex items-center justify-center mx-auto group-hover:bg-olive transition-colors duration-300">
                    <value.icon className="w-8 h-8 text-olive group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-olive-dark mb-4">
                  {value.title}
                </h3>
                <p className="text-olive leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;