import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface SuccessAnimationProps {
  isVisible: boolean;
  onClose: () => void;
}

const SuccessAnimation = ({ isVisible, onClose }: SuccessAnimationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 overflow-hidden pointer-events-auto"
          >
            {/* Glowing background effect */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl"
            />

            {/* Main content */}
            <div className="relative z-10 text-center">
              {/* Checkmark circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, duration: 0.5 }}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>

              {/* Sparkles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute top-0 left-0 right-0 bottom-0"
              >
                <Sparkles className="w-6 h-6 text-yellow-400 absolute top-1/4 left-1/4" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute top-1/3 right-1/4" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute bottom-1/4 left-1/3" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute bottom-1/3 right-1/3" />
              </motion.div>

              {/* Text content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Meeting Scheduled!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your meeting has been successfully scheduled.
                </p>
              </motion.div>

              {/* Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Got it!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAnimation; 