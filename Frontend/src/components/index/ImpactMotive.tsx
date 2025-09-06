import { Card, CardContent } from "@/components/ui/card";
import { Target, Globe, Lightbulb, TrendingUp, Users, Zap, Leaf, Heart } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import bgImage from "@/assets/images/bg1.jpg";

export const ImpactMotive = () => {
  const { ref: impactRef, inView: impactInView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { ref: motiveRef, inView: motiveInView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const impacts = [
    {
      icon: Globe,
      title: "Reach",
      value: 'Worldwide',
      suffix: "",
      description: "Countries connected through our platform",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Lightbulb,
      title: "Innovation Projects",
      value: 100,
      suffix: "+",
      description: "Breakthrough solutions developed",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Success Rate",
      value: 100,
      suffix: "%",
      description: "Projects successfully commercialized",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Users,
      title: "Community Members",
      value: 1000,
      suffix: "+",
      description: "Active innovators and collaborators",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    }
  ];

  const motives = [
    { icon: Target, title: "Bridging the Innovation Gap", description: "We connect brilliant minds with real-world opportunities, ensuring no great idea goes unnoticed." },
    { icon: Leaf, title: "Sustainable Future Focus", description: "Promoting eco-friendly solutions and sustainable development through collaborative innovation." },
    { icon: Zap, title: "Accelerating Progress", description: "Fast-tracking the journey from concept to market through our comprehensive support ecosystem." },
    { icon: Heart, title: "Democratizing Innovation", description: "Making innovation accessible to everyone, regardless of background or resources." }
  ];

  return (
    <>
      {/* Impact Section */}
      <section
        id="impact"
        className="relative py-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-xs"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-[85vw]">
          <div className="text-center mb-8 sm:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 animate-fade-in leading-tight px-2 sm:px-0">
              Transforming Ideas into Reality
            </h1>
            <p className="text-base text-gray-600 max-w-5xl mx-auto mobile-text-base">
              Measuring our success through the positive change we create in the innovation ecosystem
            </p>
          </div>
          {/* 2x2 grid on mobile, 4-col grid on desktop */}
          <div
            ref={impactRef}
            className="
              grid grid-cols-2 grid-rows-2 gap-3
              sm:grid-cols-4 sm:grid-rows-1 sm:gap-8
              mb-8 sm:mb-20
              max-w-xs mx-auto sm:max-w-none
            "
          >
            {impacts.map((impact, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={impactInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="
                  h-full flex flex-col bg-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 rounded-xl border border-gray-200
                  p-3 sm:p-6
                ">
                  <CardContent className="p-0 flex flex-col flex-grow items-center text-center">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 ${impact.iconBg} rounded-full flex items-center justify-center mb-3 sm:mb-4`}>
                      <impact.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${impact.iconColor}`} />
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-2 text-center">
                      {impactInView
                        ? (typeof impact.value === "number"
                            ? <CountUp end={impact.value} duration={2} suffix={impact.suffix} />
                            : impact.value)
                        : "0"}
                    </div>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800 text-center mb-1 sm:mb-2">{impact.title}</h3>
                    <p className="hidden sm:block text-xs sm:text-sm text-gray-600 text-center leading-tight">{impact.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Motive Section */}
      <section id="mission" className="relative overflow-hidden py-14 sm:py-16 bg-[#002f48]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[85vw]">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in leading-tight px-2 sm:px-0">
              Why <span className="text-indigo-400 font-extrabold">AMOGH</span> Exists
            </h2>
            <p className="text-base text-gray-200 max-w-5xl mx-auto mobile-text-base">
              Driven by the belief that innovation should know no boundaries, we're building a world where every idea has the potential to create positive impact
            </p>
          </div>
          <div ref={motiveRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {motives.map((motive, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                animate={motiveInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full bg-white shadow-lg rounded-xl">
                  <CardContent className="p-4 sm:p-6 flex flex-row items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <motive.icon className="text-indigo-600 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-2">{motive.title}</h3>
                      <p className="text-sm sm:text-sm text-gray-600 leading-relaxed">{motive.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
