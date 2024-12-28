'use client'

import { useState, useMemo } from 'react'
import { 
  FiSearch, FiCalendar, FiClock, FiFilter, 
  FiCheckCircle, FiXCircle, FiAlertCircle, 
  FiChevronDown, FiChevronUp
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function HistorySection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Sample task history data
  const taskHistory = [
    {
      id: 1,
      title: 'Implement User Authentication',
      status: 'completed',
      date: '2024-01-25',
      priority: 'high',
      description: 'Implemented JWT authentication system'
    },
    {
      id: 2,
      title: 'Design Dashboard Layout',
      status: 'cancelled',
      date: '2024-01-20',
      priority: 'medium',
      description: 'Created responsive dashboard design'
    },
    {
      id: 3,
      title: 'API Integration',
      status: 'completed',
      date: '2024-01-15',
      priority: 'high',
      description: 'Integrated third-party APIs'
    },
    // Add more history items...
  ]

  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ]

  const statusFilters = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'in-progress', label: 'In Progress' }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <FiXCircle className="w-5 h-5 text-red-500" />
      case 'in-progress':
        return <FiClock className="w-5 h-5 text-blue-500" />
      default:
        return <FiAlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isWithinDateRange = (date) => {
    const taskDate = new Date(date)
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)

    switch (selectedDate) {
      case 'today':
        return taskDate.toDateString() === today.toDateString()
      case 'week':
        return taskDate >= weekAgo
      case 'month':
        return taskDate >= monthAgo
      case 'year':
        return taskDate >= yearAgo
      default:
        return true
    }
  }

  const filteredTasks = useMemo(() => {
    return taskHistory.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
      const matchesDate = isWithinDateRange(task.date)

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [searchQuery, selectedStatus, selectedDate])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <FiClock className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Task History</h2>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <FiFilter className="w-4 h-4" />
            Filters
            {isFilterOpen ? (
              <FiChevronUp className="w-4 h-4" />
            ) : (
              <FiChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-4 overflow-hidden"
            >
              {/* Date Filter */}
              <div className="flex flex-wrap gap-2">
                {dateFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedDate(filter.value)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                      ${selectedDate === filter.value
                        ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                      transition-all duration-200
                    `}
                  >
                    <FiCalendar className="w-4 h-4" />
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedStatus(filter.value)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                      ${selectedStatus === filter.value
                        ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                      transition-all duration-200
                    `}
                  >
                    {getStatusIcon(filter.value)}
                    {filter.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task List */}
      <div className="divide-y divide-gray-100">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getStatusIcon(task.status)}</div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="w-4 h-4" />
                        {formatDate(task.date)}
                      </div>
                      <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                      <div className={`
                        px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${task.priority === 'high' 
                          ? 'bg-red-50 text-red-600' 
                          : task.priority === 'medium'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-green-50 text-green-600'
                        }
                      `}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="py-16 px-6"
          >
            <div className="max-w-sm mx-auto text-center">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.1
                }}
                className="relative inline-block mb-6"
              >
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100">
                  <FiSearch className="w-8 h-8 text-blue-500" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  ease: "easeOut",
                  delay: 0.2
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-500 mb-6">
                  We couldn't find any tasks matching your current filters. Try adjusting your search criteria or clearing some filters.
                </p>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedDate('all')
                      setSelectedStatus('all')
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <FiFilter className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
