'use client'

import { FiClipboard, FiPlus } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useTask } from '@/app/_context/TaskContext'

export default function NoTasks() {
  const { addTask } = useTask()

  const iconVariants = {
    initial: { rotate: -10, scale: 0.8 },
    animate: {
      rotate: [0, -10, 10, -10, 0],
      scale: 1,
      transition: {
        rotate: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 4,
          ease: "easeInOut",
        },
        scale: {
          duration: 0.3,
        }
      }
    },
    hover: {
      scale: 1.1,
      rotate: 0,
      transition: {
        rotate: {
          duration: 0.3
        }
      }
    }
  }

  const handleCreateTask = () => {
    addTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      category: 'general',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center w-full h-[60vh]"
    >
      <div className="flex flex-col items-center space-y-6 text-center">
        <motion.div 
          variants={iconVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="p-6 bg-blue-50 rounded-full ring-8 ring-blue-50/50 cursor-pointer"
          onClick={handleCreateTask}
        >
          <FiClipboard className="w-12 h-12 text-blue-500" />
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-gray-900">No tasks yet</h3>
          <p className="text-base text-gray-500 max-w-sm">
            Your task list is empty. Create your first task to get started!
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateTask}
          className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-200 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all shadow-sm"
        >
          <FiPlus className="w-4 h-4 mr-1.5" />
          Create Task
        </motion.button>
      </div>
    </motion.div>
  )
}
