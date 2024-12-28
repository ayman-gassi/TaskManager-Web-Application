'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'
import { useEffect } from 'react'

const icons = {
  success: <FiCheckCircle className="w-5 h-5 text-green-400" />,
  error: <FiAlertCircle className="w-5 h-5 text-red-400" />,
  info: <FiInfo className="w-5 h-5 text-blue-400" />
}

const colors = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
}

export default function Notification({ 
  show, 
  type = 'info', 
  message, 
  onClose,
  autoClose = true 
}) {
  useEffect(() => {
    let timeoutId
    if (show && autoClose) {
      timeoutId = setTimeout(() => {
        onClose?.()
      }, 3000)
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [show, autoClose, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`flex items-center px-4 py-3 rounded-lg shadow-lg border ${colors[type]}`}>
            <span className="flex items-center">
              {icons[type]}
              <span className="ml-2 text-sm font-medium">{message}</span>
            </span>
            {!autoClose && (
              <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
