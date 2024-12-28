import { motion, AnimatePresence } from 'framer-motion'
import { FiBell } from 'react-icons/fi'

const EmptyNotifications = () => (
  <div className="flex flex-col items-center justify-center py-8 px-4">
    <div className="relative mb-4">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-blue-100/50 rounded-full blur-lg"
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
        className="relative"
      >
        <FiBell className="w-12 h-12 text-blue-500/70" />
      </motion.div>
    </div>
    <h3 className="text-gray-900 font-medium mb-1">No new notifications</h3>
    <p className="text-gray-500 text-sm text-center">
      When you have notifications, they'll show up here
    </p>
  </div>
)

const NotificationDropdown = ({ isOpen, onClose }) => {
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
            className="fixed inset-0 z-40"
          />
          
          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="absolute right-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  Mark all as read
                </button>
              </div>
            </div>
            
            <EmptyNotifications />
            
            <div className="p-4 border-t border-gray-200 bg-gray-50/80">
              <button 
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={onClose}
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationDropdown
