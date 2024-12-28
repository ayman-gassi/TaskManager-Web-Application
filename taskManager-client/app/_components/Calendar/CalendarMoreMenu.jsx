'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiRefreshCw, FiPrinter, FiDownload } from 'react-icons/fi'
import { useTheme } from '@/app/_context/ThemeContext'

const CalendarMoreMenu = ({ isOpen, onClose, onRefresh, tasks = [] }) => {
  const { theme, themes } = useTheme()

  const handleItemClick = (action) => {
    if (typeof action === 'function') {
      action()
    }
    onClose()
  }

  const exportTasks = () => {
    // Add headers for the CSV
    const headers = ['Title', 'Status', 'Start Date', 'End Date', 'Priority', 'Description'].join(',')
    
    // Format tasks data
    const taskRows = tasks.map(task => {
      const startDate = task.startDate ? new Date(task.startDate).toLocaleDateString() : ''
      const endDate = task.endDate ? new Date(task.endDate).toLocaleDateString() : ''
      
      return [
        // Escape special characters and wrap in quotes to handle commas in text
        `"${(task.title || '').replace(/"/g, '""')}"`,
        `"${(task.status || '').replace(/"/g, '""')}"`,
        `"${startDate}"`,
        `"${endDate}"`,
        `"${(task.priority || '').replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`
      ].join(',')
    })

    // Combine headers and data
    const csvContent = [headers, ...taskRows].join('\n')

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().split('T')[0]
    
    link.href = url
    link.download = `tasks_export_${timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const menuItems = [
    {
      icon: <FiRefreshCw className="w-4 h-4" />,
      label: 'Refresh Calendar',
      action: onRefresh,
    },
    {
      icon: <FiPrinter className="w-4 h-4" />,
      label: 'Print Tasks',
      action: () => window.print(),
    },
    {
      icon: <FiDownload className="w-4 h-4" />,
      label: 'Export Tasks',
      action: exportTasks,
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className={`absolute right-0 mt-2 w-48 ${themes[theme].primary} rounded-lg shadow-lg border ${themes[theme].border} py-1 z-50`}
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item.action)}
              className={`w-full px-4 py-2 flex items-center space-x-2 ${themes[theme].text} ${themes[theme].hover} transition-colors
                ${index !== menuItems.length - 1 ? `border-b ${themes[theme].border}` : ''}`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CalendarMoreMenu
