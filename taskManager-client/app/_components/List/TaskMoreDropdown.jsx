'use client'

import { useState } from 'react'
import { FiDownload, FiGrid, FiFilter, FiRefreshCw, FiCheckSquare, FiList, FiCalendar, FiClock, FiStar, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/app/_context/ThemeContext'
import { useTask } from '@/app/_context/TaskContext'
import Notification from '../Shared/Notification'
import { useRouter } from 'next/navigation'

export default function TaskMoreDropdown({ isOpen, onClose }) {
  const { theme, themes } = useTheme()
  const {
    viewPreferences,
    selectedTasks,
    exportAsCSV,
    exportAsPDF,
    changeView,
    sortTasks,
    refreshTasks,
    completeTasks,
    deleteTasks
  } = useTask()
  const router = useRouter()

  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const showSuccessNotification = (message) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 1500)
  }

  const handleExport = async (format) => {
    try {
      if (format === 'csv') {
        await exportAsCSV()
      } else {
        await exportAsPDF()
      }
      showSuccessNotification(`Tasks exported as ${format.toUpperCase()}`)
      onClose()
    } catch (error) {
      showSuccessNotification('Failed to export tasks')
    }
  }

  const handleViewChange = (view) => {
    changeView(view)
    showSuccessNotification(`View changed to ${view}`)
  }

  const handleSort = (sortBy) => {
    sortTasks(sortBy)
    showSuccessNotification(`Sorted by ${sortBy}`)
  }

  const handleRefresh = async () => {
    const success = await refreshTasks()
    if (!success) {
      router.refresh()
    }
    showSuccessNotification(success ? 'Tasks refreshed' : 'Failed to refresh tasks')
    if (success) onClose()
  }

  const handleBulkAction = async (action) => {
    if (selectedTasks.length === 0) {
      showSuccessNotification('No tasks selected')
      return
    }

    try {
      if (action === 'complete') {
        await completeTasks(selectedTasks)
        showSuccessNotification('Selected tasks marked as complete')
      } else if (action === 'delete') {
        await deleteTasks(selectedTasks)
        showSuccessNotification('Selected tasks deleted')
      }
      onClose()
    } catch (error) {
      showSuccessNotification(`Failed to ${action} tasks`)
    }
  }

  if (!isOpen) return null

  const renderMainMenu = () => (
    <div className="py-2">
      {/* Export Options */}
      <div className="px-4 py-2">
        <h3 className={`text-sm font-medium ${themes[theme].text} mb-2`}>Export As</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleExport('csv')}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${themes[theme].border} border hover:bg-gray-100 flex items-center justify-center`}
          >
            <FiDownload className="w-4 h-4 mr-2" />
            CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${themes[theme].border} border hover:bg-gray-100 flex items-center justify-center`}
          >
            <FiDownload className="w-4 h-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* View Preferences */}
      <div className="px-4 py-2 border-t border-gray-200">
        <h3 className={`text-sm font-medium ${themes[theme].text} mb-2`}>View</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleViewChange('list')}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              viewPreferences.view === 'list'
                ? 'bg-blue-500 text-white'
                : `${themes[theme].border} border hover:bg-gray-100`
            } flex items-center justify-center`}
          >
            <FiList className="w-4 h-4 mr-2" />
            List
          </button>
          <button
            onClick={() => handleViewChange('grid')}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              viewPreferences.view === 'grid'
                ? 'bg-blue-500 text-white'
                : `${themes[theme].border} border hover:bg-gray-100`
            } flex items-center justify-center`}
          >
            <FiGrid className="w-4 h-4 mr-2" />
            Grid
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-4 py-2 border-t border-gray-200">
        <h3 className={`text-sm font-medium ${themes[theme].text} mb-2`}>Sort By</h3>
        <div className="space-y-1">
          {[
            { id: 'dueDate', icon: FiCalendar, label: 'Due Date' },
            { id: 'priority', icon: FiStar, label: 'Priority' },
            { id: 'status', icon: FiCheckSquare, label: 'Status' },
            { id: 'created', icon: FiClock, label: 'Created Date' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleSort(id)}
              className={`w-full px-3 py-2 text-sm rounded-lg transition-colors hover:bg-gray-100 flex items-center justify-between`}
            >
              <div className="flex items-center">
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </div>
              {viewPreferences.sortBy === id && (
                viewPreferences.sortOrder === 'asc' ? 
                <FiArrowUp className="w-4 h-4" /> : 
                <FiArrowDown className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-200">
        <button
          onClick={handleRefresh}
          className="w-full px-3 py-2 text-sm rounded-lg transition-colors hover:bg-gray-100 flex items-center"
        >
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`absolute right-0 mt-2 w-80 ${themes[theme].bg} rounded-lg shadow-lg border ${themes[theme].border} z-[999]`}
        >
          {renderMainMenu()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showNotification && (
          <Notification
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
