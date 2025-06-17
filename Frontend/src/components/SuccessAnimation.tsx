import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface SuccessAnimationProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const SuccessAnimation = ({ 
  isVisible, 
  onClose, 
  title = "Success!", 
  message = "Operation completed successfully." 
}: SuccessAnimationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
              }
            }}
            exit={{ 
              scale: 0.5, 
              opacity: 0, 
              y: 50,
              transition: {
                duration: 0.2
              }
            }}
            className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.2
                }
              }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: {
                  delay: 0.4,
                  duration: 0.3
                }
              }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {title}
              </h3>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
            </motion.div>

            {/* Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: {
                  delay: 0.6,
                  duration: 0.3
                }
              }}
              className="flex justify-center"
            >
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAnimation; 