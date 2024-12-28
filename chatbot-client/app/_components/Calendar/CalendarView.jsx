'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi'

const MiniCalendar = ({ currentDate, onDateChange }) => {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handlePrevMonth = () => {
    onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
  }

  const handleNextMonth = () => {
    onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = index + 1
          const isToday = new Date().getDate() === date &&
                         new Date().getMonth() === currentDate.getMonth() &&
                         new Date().getFullYear() === currentDate.getFullYear()
          
          return (
            <div
              key={date}
              className={`text-xs p-1 ${
                isToday
                  ? 'bg-blue-100 text-blue-600 rounded-full font-medium'
                  : 'text-gray-700'
              }`}
            >
              {date}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CalendarView = ({ tasks, searchQuery, onClearSearch, onDeleteTask, onCreateTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('Month')
  const [activeFilters, setActiveFilters] = useState({
    viewAll: true,
    personal: false,
    business: false,
    family: false,
    holiday: false,
    etc: false
  })

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
  }

  const getTasksForDate = (date) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    ).toISOString().split('T')[0]

    return Object.values(tasks)
      .flat()
      .filter(task => {
        const taskDate = new Date(task.startDate).toISOString().split('T')[0]
        return taskDate === dateStr
      })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'done':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleFilterChange = (filterName) => {
    if (filterName === 'viewAll') {
      setActiveFilters({
        ...Object.keys(activeFilters).reduce((acc, key) => ({
          ...acc,
          [key]: key === 'viewAll'
        }), {})
      })
    } else {
      setActiveFilters({
        ...activeFilters,
        viewAll: false,
        [filterName]: !activeFilters[filterName]
      })
    }
  }

  const filterTasks = (tasks) => {
    if (activeFilters.viewAll) return tasks

    return tasks.filter(task => {
      const category = task.category?.toLowerCase()
      return Object.entries(activeFilters).some(([key, value]) => 
        value && category === key.toLowerCase()
      )
    })
  }

  return (
    <div className="flex gap-4">
      <div className="w-64 space-y-4">
        <button
          onClick={onCreateTask}
          className="w-full flex items-center justify-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] group"
        >
          <FiPlus className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform duration-200" />
          Add Task
        </button>
        <MiniCalendar currentDate={currentDate} onDateChange={setCurrentDate} />
        
        {/* Task Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Task Filters</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.viewAll}
                onChange={() => handleFilterChange('viewAll')}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">View All</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.personal}
                onChange={() => handleFilterChange('personal')}
                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="text-sm text-gray-600">Personal</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.business}
                onChange={() => handleFilterChange('business')}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">Business</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.family}
                onChange={() => handleFilterChange('family')}
                className="w-4 h-4 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-600">Family</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.holiday}
                onChange={() => handleFilterChange('holiday')}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">Holiday</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.etc}
                onChange={() => handleFilterChange('etc')}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">ETC</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevMonth}
                  className="px-2 py-1 border rounded-md hover:bg-blue-50 text-blue-600 hover:border-blue-200"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextMonth}
                  className="px-2 py-1 border rounded-md hover:bg-blue-50 text-blue-600 hover:border-blue-200"
                >
                  <FiChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['Month', 'Week', 'Day', 'List'].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === viewType
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {viewType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Week days */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-white p-2 text-center">
                <span className="text-sm font-medium text-gray-500">{day}</span>
              </div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="bg-white p-2 min-h-[120px]" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const date = index + 1
              const dayTasks = filterTasks(getTasksForDate(date))
              const isToday = new Date().getDate() === date && 
                             new Date().getMonth() === currentDate.getMonth() &&
                             new Date().getFullYear() === currentDate.getFullYear()
              
              return (
                <div
                  key={date}
                  className={`bg-white p-2 min-h-[120px] border-t ${
                    isToday ? 'ring-2 ring-blue-600 ring-inset' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {date}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`text-xs p-1.5 rounded-md ${getStatusColor(task.status)} cursor-pointer hover:opacity-90 transition-opacity`}
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-xs opacity-75 truncate">
                            {task.category}
                          </span>
                          <span className="text-xs capitalize">
                            {task.status === 'in-progress' ? 'In Progress' : task.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView