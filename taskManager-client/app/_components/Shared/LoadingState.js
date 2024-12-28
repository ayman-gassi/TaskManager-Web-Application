import { motion } from 'framer-motion';

const LoadingState = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative mb-3">
          {/* Outer circle */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="w-16 h-16 border-4 border-blue-200 rounded-full"
          />
          
          {/* Inner circle */}
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-8 h-8 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full" />
          </motion.div>

          {/* Background blur effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-blue-100/30 rounded-full blur-xl -z-10"
          />
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-sm font-medium text-gray-600"
          >
            Loading
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ...
            </motion.span>
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingState;
