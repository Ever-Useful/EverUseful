import React from 'react';
import campusImage from '@/assets/images/campus.jpeg';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

const CampusAmbassadorPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-800 via-fuchsia-700 to-rose-600 overflow-hidden mt-8 sm:mt-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Text Content */}
              <div className="text-white z-10">
                {/* Campus Program badge: hidden on mobile, shown on sm+ */}
                <div className="hidden sm:inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full mb-4 sm:mb-6">
                  <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">Campus Program</span>
                </div>
                <h1 className="text-3xl mobile-text-2xl font-bold mb-4 sm:mb-6 leading-tight">
                  Become a <span className="text-amber-300">Campus Ambassador</span> and Lead the Change
                </h1>
                <p className="text-base mobile-text-base mb-6 sm:mb-8 max-w-lg leading-relaxed">
                  Represent our brand on your campus, gain valuable leadership experience, and unlock exclusive perks
                  while helping students discover amazing opportunities.
                </p>
                {/* Buttons: always in a row */}
                <div className="flex flex-row gap-3 sm:gap-4">
                  <button className="bg-white text-rose-700 hover:bg-rose-50 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transform transition duration-300 hover:scale-105 w-full sm:w-auto">
                    Apply Now
                  </button>
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition duration-300 w-full sm:w-auto">
                    Learn More
                  </button>
                </div>
                <div className="mt-8 sm:mt-10 flex flex-wrap gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-400 rounded-full w-4 h-4" />
                    <span className="text-xs sm:text-base">Leadership Training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-400 rounded-full w-4 h-4" />
                    <span className="text-xs sm:text-base">Exclusive Swag</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-cyan-400 rounded-full w-4 h-4" />
                    <span className="text-xs sm:text-base">Networking Opportunities</span>
                  </div>
                </div>
              </div>
              {/* Image Section */}
              <div className="relative z-10 mt-8 lg:mt-0">
                <div className="rounded-xl w-full h-56 sm:h-96 lg:h-[500px] overflow-hidden shadow-2xl transform rotate-1 transition duration-700 hover:rotate-0">
                  <img
                    src={campusImage}
                    alt="Campus life and students"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20" />
                </div>
                <div className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-6 bg-white/90 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-lg w-44 sm:w-64">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">Join 500+ Campus Leaders</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Across 120+ universities worldwide</p>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-8 sm:h-16 bg-gradient-to-t from-purple-900/30 to-transparent" />
        </div>

        {/* Benefits Section */}
        <div className="py-10 sm:py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Why Become a Campus Ambassador?</h2>
              <p className="text-base sm:text-lg text-gray-600">
                Our program offers unique benefits to help you grow personally and professionally while making an impact on your campus.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  title: "Leadership Development",
                  desc: "Enhance your leadership and management skills through real-world experience.",
                  icon: "🚀"
                },
                {
                  title: "Networking Opportunities",
                  desc: "Connect with industry professionals and like-minded students across the globe.",
                  icon: "🌐"
                },
                {
                  title: "Exclusive Perks",
                  desc: "Receive swag, event invitations, and special discounts on our products.",
                  icon: "🎁"
                },
                {
                  title: "Career Advancement",
                  desc: "Gain valuable experience to boost your resume and stand out to employers.",
                  icon: "💼"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-lg overflow-hidden flex items-center justify-center text-3xl sm:text-4xl bg-gray-100">
                    <span role="img" aria-label={item.title}>{item.icon}</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-base text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-10 sm:py-16 md:py-24 bg-gradient-to-br from-rose-50 to-pink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Hear From Our Ambassadors</h2>
              <p className="text-base sm:text-lg text-gray-600">
                Discover how our program has helped students grow and succeed.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  name: "Alex Johnson",
                  university: "Stanford University",
                  quote: "The Campus Ambassador program transformed my leadership skills and helped me secure an amazing internship.",
                  image: "👩‍🎓"
                },
                {
                  name: "Marcus Chen",
                  university: "MIT",
                  quote: "I built a network of talented peers and industry professionals that continues to benefit me today.",
                  image: "👨‍💻"
                },
                {
                  name: "Sophia Williams",
                  university: "University of Michigan",
                  quote: "The exclusive events and mentorship opportunities made this experience truly invaluable.",
                  image: "👩‍🏫"
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-5xl">{testimonial.image}</div>
                    <div>
                      <p className="text-sm sm:text-lg italic text-gray-700 mb-2 sm:mb-4">"{testimonial.quote}"</p>
                      <div>
                        <div className="font-bold text-gray-900 text-xs sm:text-base">{testimonial.name}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{testimonial.university}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-10 sm:py-16 bg-gradient-to-r from-purple-900 to-rose-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to Make an Impact on Your Campus?</h2>
            <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-10 max-w-3xl mx-auto">
              Join our elite team of Campus Ambassadors and start your leadership journey today.
            </p>
            {/* Buttons: always in a row */}
            <div className="flex flex-row justify-center gap-3 sm:gap-4">
              <button className="bg-amber-400 hover:bg-amber-300 text-purple-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transform transition duration-300 hover:scale-105 w-full sm:w-auto">
                Apply Now
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition duration-300 w-full sm:w-auto">
                Download Info Pack
              </button>
            </div>
            <p className="mt-4 sm:mt-6 text-white/80 text-xs sm:text-base">
              Applications close on August 30, 2023
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CampusAmbassadorPage;