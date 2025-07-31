
export const StatsSection = () => {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20 bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-6 left-4 w-16 h-16 sm:w-32 sm:h-32 bg-green-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 right-4 w-20 h-20 sm:w-48 sm:h-48 bg-emerald-400 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-10 h-10 sm:w-24 sm:h-24 bg-teal-400 rounded-full blur-lg"></div>
      </div>

         {/* Sustainable landscape background image - hidden on mobile */}
      <div className="absolute left-0 top-0 w-1/2 h-full hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop"
          alt="Global sustainable initiatives"
          className="w-full h-full object-cover rounded-none sm:rounded-r-3xl opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-900/70 rounded-none sm:rounded-r-3xl"></div>
      </div>

      {/* Overlay card - hidden on mobile */}
      <div className="absolute left-8 bottom-8 bg-white/95 backdrop-blur-sm text-gray-900 p-8 rounded-2xl max-w-sm shadow-2xl hidden md:block">
        <h3 className="text-base sm:text-2xl font-bold mb-1 sm:mb-4 text-emerald-800 text-center sm:text-left">
          Global Impact Through Innovation
        </h3>
        <p className="text-gray-700 text-xs sm:text-base text-center sm:text-left">
          Worldwide communities embracing sustainability
        </p>
      </div>

      <div className="relative z-10 container mx-auto px-2 sm:px-6">
        <div className="flex  md:justify-end justify-center">
          <div className="w-full md:w-1/2 space-y-6 md:pl-8 pl-0">
            <div className="text-center md:text-right">
              <p className="text-xl md:text-2xl font-extrabold text-emerald-200 uppercase tracking-wide mb-2 drop-shadow-lg">
                LAUNCHING THIS WINTER 2025
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Revolutionary Sustainable Solutions Worldwide
              </h2>
              <p className="text-base md:text-lg text-emerald-100 mb-8 max-w-lg mx-auto md:ml-auto">
                Transforming communities across continents through innovative eco-friendly technologies. Our comprehensive sustainable project solutions are creating lasting environmental impact globally.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-8">
               <div className="text-center md:text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                <p className="text-xs md:text-sm font-semibold text-emerald-300 mb-2">Global Communities</p>
                <p className="text-3xl md:text-5xl font-bold text-white mb-2">150+</p>
                <p className="text-xs text-emerald-200">Across 6 continents</p>
              </div>
              <div className="text-center md:text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                <p className="text-xs md:text-sm font-semibold text-emerald-300 mb-2">Active Solutions</p>
                <p className="text-3xl md:text-5xl font-bold text-white mb-2">75+</p>
                <p className="text-xs text-emerald-200">Making real impact</p>
              </div>
               <div className="text-center md:text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                <p className="text-xs md:text-sm font-semibold text-emerald-300 mb-2">Carbon Reduced</p>
                <p className="text-3xl md:text-5xl font-bold text-white mb-2">2.5M</p>
                <p className="text-xs text-emerald-200">Tons CO2 annually</p>
              </div>
              <div className="text-center md:text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                <p className="text-xs md:text-sm font-semibold text-emerald-300 mb-2">Lives Improved</p>
                <p className="text-3xl md:text-5xl font-bold text-white mb-2">50M+</p>
                <p className="text-xs text-emerald-200">People worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};