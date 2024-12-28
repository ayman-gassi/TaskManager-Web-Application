import { motion, AnimatePresence } from 'framer-motion'
import { FiRefreshCw, FiPlus, FiMoreHorizontal } from 'react-icons/fi'

const LoadingSpinner = ({ columnId }) => {
  const getLoadingColor = () => {
    switch (columnId) {
      case 'todo':
        return 'text-blue-500'
      case 'inProgress':
        return 'text-orange-500'
      case 'done':
        return 'text-green-500'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          rotate: 360 
        }}
        transition={{ 
          opacity: { duration: 0.2 },
          rotate: { 
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        className={`${getLoadingColor()}`}
      >
        <FiRefreshCw className="w-8 h-8" />
      </motion.div>
    </div>
  )
}

export const BoardLoadingState = ({ columns, getColumnStyles, onMenuOpen, boardMenuRefs }) => {
  return (
    <AnimatePresence>
      {columns.map(column => (
        <motion.div 
          key={column.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`p-4 rounded-lg w-full column-drop-zone shadow-sm h-[300px] flex flex-col ${getColumnStyles(column.id).bg}`}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="font-medium text-gray-900">{column.title}</h2>
              <span className={getColumnStyles(column.id).text}>{column.icon}</span>
            </div>
            <div className="flex items-center space-x-1">
              <motion.button 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`p-1.5 rounded-md ${getColumnStyles(column.id).text} ${getColumnStyles(column.id).hover}`}
              >
                <FiPlus className="w-5 h-5" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.2, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`p-1.5 rounded-md ${getColumnStyles(column.id).text} ${getColumnStyles(column.id).hover}`}
              >
                <FiRefreshCw className="w-5 h-5" />
              </motion.button>
              <div className="relative" ref={el => boardMenuRefs.current[column.id] = el}>
                <motion.button 
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onMenuOpen(column.id)}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`p-1.5 rounded-md ${getColumnStyles(column.id).text} ${getColumnStyles(column.id).hover}`}
                >
                  <FiMoreHorizontal className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <LoadingSpinner columnId={column.id} />
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export default BoardLoadingState
