'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiX, FiInfo, FiAlertCircle } from 'react-icons/fi'

const NotificationIcons = {
  success: FiCheck,
  error: FiX,
  info: FiInfo,
  warning: FiAlertCircle
}

const NotificationColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500'
}

const Notification = ({ 
  show, 
  type = 'success', 
  message, 
  position = 'bottom-right',
  duration = 3000,
  onClose
}) => {
  const Icon = NotificationIcons[type]
  const bgColor = NotificationColors[type]

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: position.includes('top') ? -20 : 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position.includes('top') ? -20 : 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed ${positionClasses[position]} z-50 flex items-center space-x-2 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg min-w-[200px]`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{message}</span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-4 hover:opacity-80 transition-opacity"
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

export default Notification
