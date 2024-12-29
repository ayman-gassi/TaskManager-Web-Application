'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiX } from 'react-icons/fi'

export default function SuccessAlert({ message, isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-green-50 text-green-800 rounded-lg shadow-lg p-4 flex items-center gap-3 pr-12 relative">
            <FiCheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm font-medium">{message}</p>
            <button
              onClick={onClose}
              className="absolute right-2 top-2 p-1 hover:bg-green-100 rounded-full transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
