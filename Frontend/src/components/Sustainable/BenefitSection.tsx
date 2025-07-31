import { ChevronRight, Wind, Zap, Plug, Wrench } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Wind,
      title: "Renewable Source",
      description: "Harness clean, sustainable energy from natural resources."
    },
    {
      icon: Zap,
      title: "Easy Installation",
      description: "Quick and hassle-free setup for immediate energy savings."
    },
    {
      icon: Plug,
      title: "Low Maintenance",
      description: "Minimal upkeep required, ensuring long-term reliability."
    },
    {
      icon: Wrench,
      title: "Affordable Power",
      description: "Cost-effective solutions that lower your energy bills."
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-stone-100 via-green-50 to-emerald-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-y-2 md:gap-x-2">
            <div className="flex-1 md:flex-none mb-6 md:mb-0 md:mr-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              WHY CHOOSE US
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Benefits</h2>
          </div>
          <div className="flex flex-1 items-start md:items-center w-full md:w-auto">
            <div className="flex flex-col flex-1">
              <p className="text-base text-gray-700 mb-1">
              By choosing us, you gain access to reliable, affordable, and sustainable energy solutions tailored to your needs. 
              Our commitment ensures a seamless experience from installation to ongoing support, empowering you to embrace a greener future with confidence. <br />
             <p className="text-base text-gray-600 ">

               Discover how our expertise and innovative approach make renewable energy accessible and beneficial for everyone.
               </p>
              </p>
            </div>
            {/* <button className="flex items-center text-gray-900 font-semibold hover:text-green-600 transition-colors whitespace-nowrap ml-0 md:ml-auto">
              View More <ChevronRight className="ml-2 w-5 h-5" />
            </button> */}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-green-100 text-center hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 transition-all">
                  <benefit.icon className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
              </div>
             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4">{benefit.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{benefit.description}</p>
      
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
