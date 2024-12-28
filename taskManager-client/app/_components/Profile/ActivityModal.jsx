'use client'

import React, { useState } from 'react'
import { FiX, FiActivity, FiCalendar, FiCheckCircle, FiFilter, FiCheck } from 'react-icons/fi'
import { motion } from 'framer-motion'

const ActivityModal = ({ isOpen, onClose, activities, formatTimestamp, getActivityMessage }) => {
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All Activities', icon: FiActivity, color: 'blue' },
    { id: 'complete', label: 'Completed', icon: FiCheck, color: 'green' },
    { id: 'update', label: 'Updates', icon: FiActivity, color: 'purple' },
    { id: 'create', label: 'Created', icon: FiActivity, color: 'indigo' },
    { id: 'priority', label: 'Priority', icon: FiActivity, color: 'orange' },
    { id: 'deadline', label: 'Deadline', icon: FiCalendar, color: 'pink' }
  ]

  const filteredActivities = activities.filter(activity => {
    if (activeFilter === 'all') return true
    return activity.type === activeFilter
  })

  const getActivityIcon = (type) => {
    const icons = {
      'complete': FiCheckCircle,
      'update': FiActivity,
      'comment': FiFilter,
      'file': FiFilter,
      'github': FiFilter,
      'deadline': FiCalendar,
      'default': FiActivity
    }
    return icons[type] || icons.default
  }

  const getActivityColor = (type) => {
    const colors = {
      'complete': 'text-green-500 bg-green-50',
      'update': 'text-blue-500 bg-blue-50',
      'comment': 'text-purple-500 bg-purple-50',
      'file': 'text-orange-500 bg-orange-50',
      'github': 'text-gray-500 bg-gray-50',
      'deadline': 'text-indigo-500 bg-indigo-50',
      'default': 'text-gray-500 bg-gray-50'
    }
    return colors[type] || colors.default
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-4 sm:align-middle sm:max-w-xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-full">
                  <FiActivity className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Activity History</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modern Filters */}
            <div className="mt-5 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                <FiFilter className="w-4 h-4" />
                <span>Filter activities by:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filters.map((filter) => {
                  const isActive = activeFilter === filter.id
                  const Icon = filter.icon
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                        transition-all duration-200 relative overflow-hidden
                        ${isActive 
                          ? `bg-${filter.color}-100 text-${filter.color}-700 ring-1 ring-${filter.color}-500 ring-offset-1` 
                          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? `text-${filter.color}-600` : 'text-gray-400'}`} />
                      <span>{filter.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeFilterIndicator"
                          className={`absolute inset-0 bg-${filter.color}-50 opacity-50`}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="px-5 py-4 max-h-[45vh] overflow-y-auto">
            <div className="relative">
              <div className="absolute top-0 left-4 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-5">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="relative flex gap-4 items-start group">
                    <div className="absolute -left-2 w-7 h-7 flex items-center justify-center">
                      <div className={`p-1.5 rounded-full ${activity.color.replace('text-', 'bg-').replace('500', '50')}`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                    </div>
                    <div className="flex-1 ml-7 bg-white rounded-md p-3 border border-gray-100 group-hover:border-gray-200 transition-all duration-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{getActivityMessage(activity)}</span>
                        <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                      </div>
                      {activity.details && (
                        <p className="mt-1 text-sm text-gray-600">{activity.details}</p>
                      )}
                      {activity.meta && (
                        <div className="mt-2 flex items-center gap-3">
                          {activity.meta.map((item, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                              <span className="text-xs text-gray-500">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-5 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Showing {filteredActivities.length} of {activities.length} activities
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityModal
