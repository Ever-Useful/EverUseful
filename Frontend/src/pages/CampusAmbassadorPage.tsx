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
        <div className="relative bg-gradient-to-r from-purple-800 via-fuchsia-700 to-rose-600 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-white z-10">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full mb-6">
                  <span className="text-sm font-medium uppercase tracking-wider">Campus Program</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Become a <span className="text-amber-300">Campus Ambassador</span> and Lead the Change
                </h1>

                <p className="text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
                  Represent our brand on your campus, gain valuable leadership experience, and unlock exclusive perks
                  while helping students discover amazing opportunities.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-rose-700 hover:bg-rose-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition duration-300 hover:scale-105">
                    Apply Now
                  </button>
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg transition duration-300">
                    Learn More
                  </button>
                </div>

                <div className="mt-10 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-400 rounded-full w-4 h-4" />
                    <span>Leadership Training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-400 rounded-full w-4 h-4" />
                    <span>Exclusive Swag</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-cyan-400 rounded-full w-4 h-4" />
                    <span>Networking Opportunities</span>
                  </div>
                </div>
              </div>

              {/* Image Section - Enhanced with actual campus image */}
              <div className="relative z-10">
                <div className="rounded-xl w-full h-96 lg:h-[500px] overflow-hidden shadow-2xl transform rotate-1 transition duration-700 hover:rotate-0">
                  <img
                    src={campusImage}
                    alt="Campus life and students"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20" />
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg w-64">
                  <h3 className="font-bold text-gray-800">Join 500+ Campus Leaders</h3>
                  <p className="text-sm text-gray-600 mt-1">Across 120+ universities worldwide</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-purple-900/30 to-transparent" />
        </div>

        {/* Benefits Section */}
        <div className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Become a Campus Ambassador?</h2>
              <p className="text-lg text-gray-600">
                Our program offers unique benefits to help you grow personally and professionally while making an impact on your campus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-16 h-16 mb-4 rounded-lg overflow-hidden flex items-center justify-center text-4xl bg-gray-100">
                    <span role="img" aria-label={item.title}>{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16 md:py-24 bg-gradient-to-br from-rose-50 to-pink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hear From Our Ambassadors</h2>
              <p className="text-lg text-gray-600">
                Discover how our program has helped students grow and succeed.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{testimonial.image}</div>
                    <div>
                      <p className="text-lg italic text-gray-700 mb-4">"{testimonial.quote}"</p>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.university}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-purple-900 to-rose-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make an Impact on Your Campus?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
              Join our elite team of Campus Ambassadors and start your leadership journey today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-amber-400 hover:bg-amber-300 text-purple-900 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition duration-300 hover:scale-105">
                Apply Now
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg transition duration-300">
                Download Info Pack
              </button>
            </div>
            <p className="mt-6 text-white/80">
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