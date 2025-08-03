
export const StatsSection = () => {
  return (
    <section className="relative overflow-hidden py-6 sm:py-8 lg:py-12 xl:py-20 bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-6 left-4 w-16 h-16 sm:w-32 sm:h-32 bg-green-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 right-4 w-20 h-20 sm:w-48 sm:h-48 bg-emerald-400 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-10 h-10 sm:w-24 sm:h-24 bg-teal-400 rounded-full blur-lg"></div>
      </div>


      {/* Sustainable landscape background image */}
      <div className="absolute left-0 top-0 w-full sm:w-1/2 h-40 sm:h-48 md:h-full">
        <img
          src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop"
          alt="Global sustainable initiatives"
          className="w-full h-full object-cover rounded-none sm:rounded-r-3xl opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-900/70 rounded-none sm:rounded-r-3xl"></div>
      </div>


      {/* Overlay card - hidden on mobile, visible on sm and up */}
      <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-3 sm:left-8 sm:translate-x-0 sm:bottom-8 bg-white/95 backdrop-blur-sm text-gray-900 p-3 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl w-11/12 max-w-xs sm:max-w-sm shadow-2xl">
        <h3 className="text-sm sm:text-lg lg:text-2xl font-bold mb-1 sm:mb-3 lg:mb-4 text-emerald-800 text-center sm:text-left">
          Global Impact Through Innovation
        </h3>
        <p className="text-gray-700 text-xs sm:text-sm lg:text-base text-center sm:text-left">
          Worldwide communities embracing sustainability
        </p>
      </div>


      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-end">
          <div className="w-full sm:w-2/5 space-y-4 sm:space-y-6 mt-48 sm:mt-0">
            <div className="text-center sm:text-right">
              <p className="text-xs sm:text-sm font-semibold text-emerald-300 uppercase tracking-wide mb-2">
                LAUNCHING THIS WINTER 2025
              </p>
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
                Revolutionary Sustainable Solutions Worldwide
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-emerald-100 mb-4 sm:mb-6 lg:mb-8 max-w-full sm:max-w-lg mx-auto sm:ml-auto leading-relaxed">
                Transforming communities across continents through innovative eco-friendly technologies. Our comprehensive sustainable project solutions are creating lasting environmental impact globally.
              </p>
            </div>


            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center sm:text-right border border-white/20">
                <p className="text-xs sm:text-sm font-semibold text-emerald-300 mb-1 sm:mb-2">Global Communities</p>
                <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">150+</p>
                <p className="text-xs text-emerald-200">Across 6 continents</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center sm:text-right border border-white/20">
                <p className="text-xs sm:text-sm font-semibold text-emerald-300 mb-1 sm:mb-2">Active Solutions</p>
                <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">75+</p>
                <p className="text-xs text-emerald-200">Making real impact</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center sm:text-right border border-white/20">
                <p className="text-xs sm:text-sm font-semibold text-emerald-300 mb-1 sm:mb-2">Carbon Reduced</p>
                <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">2.5M</p>
                <p className="text-xs text-emerald-200">Tons CO2 annually</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center sm:text-right border border-white/20">
                <p className="text-xs sm:text-sm font-semibold text-emerald-300 mb-1 sm:mb-2">Lives Improved</p>
                <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">50M+</p>
                <p className="text-xs text-emerald-200">People worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};