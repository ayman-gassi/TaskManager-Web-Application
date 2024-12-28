import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiMail } from 'react-icons/fi'
import { useState } from 'react'

const EmptyNotifications = () => (
  <div className="flex flex-col items-center justify-center py-8 px-4">
    <div className="relative mb-5">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ 
          rotate: [0, 10, 0, -10, 0],
          scale: [1, 1.1, 1, 1.1, 1]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative bg-gradient-to-br from-white to-gray-50 p-2.5 rounded-xl shadow-sm"
      >
        <FiBell className="w-10 h-10 text-blue-500/80" />
      </motion.div>
    </div>
    <h3 className="text-gray-900 font-semibold text-sm mb-1.5 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">No new notifications</h3>
    <p className="text-gray-500 text-xs text-center leading-relaxed">
      When you have notifications, they'll show up here
    </p>
  </div>
)

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[998]"
          />
          
          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-[999] backdrop-blur-sm"
          >
            <div className="p-3 border-b border-gray-100/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Notifications</h2>
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">0 New</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-50/80 relative group transition-all duration-200"
                >
                  <FiMail className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -top-9 left-1/2 transform -translate-x-1/2 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg"
                      >
                        Mark all as read
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
            
            <EmptyNotifications />
            
            <div className="p-3 border-t border-gray-100/60">
              <button 
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center space-x-2"
                onClick={onClose}
              >
                <span>View all notifications</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationDropdown
