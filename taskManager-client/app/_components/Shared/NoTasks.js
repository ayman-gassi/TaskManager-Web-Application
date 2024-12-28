'use client'

import { motion } from 'framer-motion'
import { FiInbox, FiPlus } from 'react-icons/fi'

export default function NoTasks({ onCreateTask }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="bg-blue-50 rounded-full p-6 mb-6 ring-8 ring-blue-50/50">
        <FiInbox className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
      <p className="text-sm text-gray-500 mb-8">Get started by creating your first task</p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        onClick={onCreateTask}
      >
        <FiPlus className="w-5 h-5 mr-1.5" />
        Create New Task
      </motion.button>
    </motion.div>
  )
}
