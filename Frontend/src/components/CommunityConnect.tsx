import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const CommunityConnect: React.FC = () => {

  return (
    <section id="community" className="relative overflow-hidden py-16 sm:py-20">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center text-center px-4">
        <motion.h2
          className="text-[17px] sm:text-4xl font-bold text-white drop-shadow-2xl mobile-text-3xl"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.9)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Elevate Your Innovation Journey
        </motion.h2>
        <motion.p
          className="mt-2 text-base text-white drop-shadow-xl max-w-md mobile-text-base"
          style={{ WebkitTextStroke: '0.5px rgba(255,255,255,0.9)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Connect, collaborate, and grow with a global network of innovators.
        </motion.p>
        <motion.div
          className="mt-4 w-full flex justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link to="/connect">
            <Button
              size="lg"
              className="w-full max-w-xs sm:max-w-fit px-6 py-3 bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl transition-transform hover:scale-105 mobile-text-base"
            >
              Join the Community <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
