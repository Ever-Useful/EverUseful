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
      title: "Global Reach",
      value: 50,
      suffix: "+",
      description: "Countries connected through our platform",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Lightbulb,
      title: "Innovation Projects",
      value: 1200,
      suffix: "+",
      description: "Breakthrough solutions developed",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Success Rate",
      value: 89,
      suffix: "%",
      description: "Projects successfully commercialized",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Users,
      title: "Community Members",
      value: 25000,
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
            <h2 className="text-lg sm:text-3xl font-semibold text-gray-800 mb-2 sm:mb-4">
              Transforming Ideas into Reality
            </h2>
            <p className="text-xs sm:text-lg text-gray-600 max-w-5xl mx-auto">
              Measuring our success through the positive change we create in the innovation ecosystem
            </p>
          </div>
          {/* 2x2 grid on mobile, 4-col grid on desktop */}
          <div
            ref={impactRef}
            className="
              grid grid-cols-2 grid-rows-2 gap-2
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
                  px-1 py-1 sm:p-0
                ">
                  <CardContent className="p-2 sm:p-6 flex flex-col flex-grow justify-between">
                    <div className={`w-7 h-7 sm:w-14 sm:h-14 ${impact.iconBg} rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-4`}>
                      <impact.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${impact.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-base sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 text-center">
                        {impactInView ? <CountUp end={impact.value} duration={2} suffix={impact.suffix} /> : "0"}
                      </div>
                      <h3 className="text-[11px] sm:text-lg font-semibold text-gray-800 text-center">{impact.title}</h3>
                      <p className="text-[9px] sm:text-sm text-gray-600 text-center mt-1">{impact.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Motive Section */}
      <section id="mission" className="py-8 sm:py-12 bg-gradient-to-r from-gray-700/5 via-gray-800/10 to-gray-700/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[85vw]">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-lg sm:text-3xl font-semibold text-gray-100 mb-2 sm:mb-4">
              Why <span className="text-indigo-400 text-xl sm:text-4xl font-extrabold">AMOGH</span> Exists
            </h2>
            <p className="text-xs sm:text-lg text-gray-200 max-w-5xl mx-auto">
              Driven by the belief that innovation should know no boundaries, we're building a world where every idea has the potential to create positive impact
            </p>
          </div>
          <div ref={motiveRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8">
            {motives.map((motive, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                animate={motiveInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full bg-white shadow-lg rounded-xl">
                  <CardContent className="p-2 sm:p-6 flex flex-row mt-0">
                    <div className="w-7 h-7 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <motive.icon className="text-indigo-600 w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-lg font-bold text-gray-900 mb-1 ml-2 sm:ml-4">{motive.title}</h3>
                      <p className="text-[10px] sm:text-sm text-gray-600 ml-2 sm:ml-4">{motive.description}</p>
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
