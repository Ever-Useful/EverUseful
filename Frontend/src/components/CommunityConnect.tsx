import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Calendar, Award, Coffee, Users } from "lucide-react";
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
// Import your background image
import bgImage from '@/assets/images/community.jpg';

export const CommunityConnect: React.FC = () => {
 

  // Auto-scroll animation
  const controls = useAnimation();
  useEffect(() => {
    controls.start({ x: [-500, 0], transition: { x: { repeat: Infinity, repeatType: 'loop', duration: 20, ease: 'linear' } } });
  }, [controls]);

  return (
    <section id="community" className="relative overflow-hidden py-20">
      {/* Blurred Background Image */}
      <div className="absolute inset-0 -z-20">
        <div
          className="w-full h-full bg-cover bg-center filter blur-xs"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      </div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '200px' }}>
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-white drop-shadow-2xl"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.9)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Elevate Your Innovation Journey
        </motion.h2>
        <motion.p
          className="mt-2 text-base sm:text-lg text-white drop-shadow-xl max-w-md"
          style={{ WebkitTextStroke: '0.5px rgba(255,255,255,0.9)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Connect, collaborate, and grow with a global network of innovators.
        </motion.p>
        <motion.div
          className="mt-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button size="lg" className="px-6 py-3 bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl transition-transform hover:scale-105">
            Join the Community <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      
    </section>
  );
};
