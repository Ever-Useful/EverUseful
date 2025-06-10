"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";

interface Leader {
  name: string;
  position: string;
  image: string;
  quote: string;
  company: string;
  rating: number;
}

export const TrustedByLeaders: React.FC = () => {
  const leaders: Leader[] = [
    {
      name: "Dr. Sarah Chen",
      position: "Former Director of Innovation, Google",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote:
        "AMOGH is revolutionizing how we approach collaborative innovation. Their platform has enabled breakthrough solutions.",
      company: "Google",
      rating: 5,
    },
    {
      name: "Prof. Michael Rodriguez",
      position: "Dean of Engineering, MIT",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote:
        "The quality of research and innovation happening on AMOGH is unprecedented. It's the future of academic collaboration.",
      company: "MIT",
      rating: 5,
    },
    {
      name: "Lisa Johnson",
      position: "Chief Technology Officer, Tesla",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      quote:
        "AMOGH's sustainable innovation focus aligns perfectly with our mission. We've found amazing talent here.",
      company: "Tesla",
      rating: 5,
    },
    {
      name: "Dr. Raj Patel",
      position: "Head of AI Research, Microsoft",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote:
        "The AI-powered matching system on AMOGH has connected us with brilliant minds we never would have found otherwise.",
      company: "Microsoft",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-cyan-50/20 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-[10%] w-64 h-64 bg-cyan-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2">
            Trusted by Visionary Leaders
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Pioneering innovators choose AMOGH to drive transformative projects forward
          </p>
        </div>

        <div className="relative py-6">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1.1}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={700}
            grabCursor={true}
            breakpoints={{
              640: { slidesPerView: 1.3, spaceBetween: 16 },
              1024: { slidesPerView: 1.6, spaceBetween: 24 },
            }}
            className="!overflow-visible px-4"
          >
            {leaders.map((leader, idx) => (
              <SwiperSlide key={idx}>
                <motion.div 
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-gradient-to-br from-white/90 to-slate-50 rounded-2xl p-4 shadow-xl max-w-lg mx-auto transform-gpu
                             backdrop-blur-sm border border-white/80 relative overflow-hidden"
                >
                  {/* Card background elements */}
                  <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan-300/10 rounded-full blur-xl"></div>
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-300/10 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-cyan-200 blur-md opacity-60"></div>
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="relative w-24 h-24 rounded-full object-cover border-2 border-white shadow-inner"
                        />
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center items-center mb-2">
                          {[...Array(leader.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="ml-2 text-xs font-semibold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full">
                            {leader.company}
                          </span>
                        </div>
                        <blockquote className="relative px-3 text-sm text-slate-700 italic">
                          <span className="absolute -left-2 -top-2 text-slate-300 text-2xl">“</span>
                          {leader.quote}
                        </blockquote>
                        <h3 className="mt-3 text-sm font-bold text-slate-900">
                          {leader.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {leader.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center mt-10">
          <Button className="inline-flex items-center bg-white text-gray-600 border border-gray-600 hover:bg-cyan-600 hover:text-white px-5 py-2 rounded-2xl font-semibold transition-all group">
            Join Industry Leaders
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};