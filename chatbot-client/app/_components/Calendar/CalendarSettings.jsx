'use client'

import { useState, useEffect } from 'react'
import { FiClock, FiGlobe, FiCalendar, FiEye, FiUsers, FiBell } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Notification from '../Shared/Notification'
import { useTheme } from '@/app/_context/ThemeContext'

const CalendarSettings = ({ isOpen, onClose, defaultView, onSettingsChange }) => {
  const { theme, changeTheme, themes } = useTheme()
  const currentTheme = themes[theme] || themes.light
  const [showNotification, setShowNotification] = useState(false)
  const [tempSettings, setTempSettings] = useState({
    defaultView: defaultView || 'month',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    workingHours: {
      start: '09:00',
      end: '17:00',
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    theme: theme,
    notifications: true,
    sharedCalendars: []
  })

  // Reset temp settings when modal is opened
  useEffect(() => {
    if (isOpen) {
      setTempSettings({
        defaultView: defaultView || 'month',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        workingHours: {
          start: '09:00',
          end: '17:00',
          workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        theme: theme,
        notifications: true,
        sharedCalendars: []
      })
    }
  }, [isOpen, defaultView, theme])

  const handleSettingChange = (key, value) => {
    setTempSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Apply all settings at once when save is clicked
    if (tempSettings.theme !== theme) {
      changeTheme(tempSettings.theme)
    }
    onSettingsChange?.(tempSettings)
    onClose()
    setTimeout(() => {
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 1500)
    }, 100)
  }

  const handleClose = () => {
    // Reset theme if it was changed but not saved
    if (tempSettings.theme !== theme) {
      changeTheme(theme)
    }
    onClose()
  }

  const timeZones = [
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Europe/Paris'
  ]

  const themeOptions = [
    { id: 'light', name: 'Light Theme', icon: '☀️' },
    { id: 'dark', name: 'Dark Theme', icon: '🌙' }
  ]

  const inputClasses = `w-full px-3 py-2 border ${currentTheme.border} rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
    ${currentTheme.bg} ${currentTheme.text} transition-colors`

  const labelClasses = `flex items-center text-sm font-medium ${currentTheme.text} mb-2`

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute right-0 mt-2 w-80 ${currentTheme.bg} rounded-lg shadow-lg border ${currentTheme.border} z-50`}
          >
            <div className="p-4 space-y-4">
              {/* Default View */}
              <div>
                <label className={labelClasses}>
                  <FiCalendar className="w-4 h-4 mr-2" />
                  Default View
                </label>
                <select
                  value={tempSettings.defaultView}
                  onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                  className={inputClasses}
                >
                  {['day', 'week', 'month', 'year'].map(view => (
                    <option key={view} value={view}>
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Zone */}
              <div>
                <label className={labelClasses}>
                  <FiGlobe className="w-4 h-4 mr-2" />
                  Time Zone
                </label>
                <select
                  value={tempSettings.timeZone}
                  onChange={(e) => handleSettingChange('timeZone', e.target.value)}
                  className={inputClasses}
                >
                  {timeZones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              {/* Working Hours */}
              <div>
                <label className={labelClasses}>
                  <FiClock className="w-4 h-4 mr-2" />
                  Working Hours
                </label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={tempSettings.workingHours.start}
                    onChange={(e) => handleSettingChange('workingHours', { ...tempSettings.workingHours, start: e.target.value })}
                    className={inputClasses}
                  />
                  <span className={currentTheme.text}>to</span>
                  <input
                    type="time"
                    value={tempSettings.workingHours.end}
                    onChange={(e) => handleSettingChange('workingHours', { ...tempSettings.workingHours, end: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className={labelClasses}>
                  <FiEye className="w-4 h-4 mr-2" />
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSettingChange('theme', option.id)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center space-x-2
                        ${tempSettings.theme === option.id 
                          ? 'bg-blue-500 text-white'
                          : `${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`
                        }
                        hover:bg-blue-500 hover:text-white hover:border-transparent`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div>
                <label className={labelClasses}>
                  <FiBell className="w-4 h-4 mr-2" />
                  Notifications
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full 
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                    after:transition-all peer-checked:bg-blue-500`}></div>
                </label>
              </div>

              {/* Save and Cancel Buttons */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                    border border-gray-300 rounded-lg transition-colors duration-200 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                    rounded-lg transition-all duration-200 shadow-sm hover:shadow
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showNotification && (
          <Notification
            message="Settings saved successfully!"
            type="success"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default CalendarSettings
