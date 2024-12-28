'use client'

import { useState } from 'react'
import { FiClock, FiGlobe, FiCalendar, FiEye, FiUsers, FiBell } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Notification from '../Shared/Notification'
import { useTheme } from '@/app/_context/ThemeContext'

const CalendarSettings = ({ isOpen, onClose, defaultView, onSettingsChange }) => {
  const { theme, changeTheme, themes } = useTheme()
  const [showNotification, setShowNotification] = useState(false)
  const [settings, setSettings] = useState({
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

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    // If theme is changed, update it immediately
    if (key === 'theme') {
      changeTheme(value)
    }
  }

  const handleSave = () => {
    onSettingsChange?.(settings)
    onClose()
    setTimeout(() => {
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 1500)
    }, 100)
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
    { id: 'light', name: 'Light Theme' },
    { id: 'dark', name: 'Dark Theme' },
    { id: 'blue', name: 'Blue Theme' },
    { id: 'green', name: 'Green Theme' }
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute right-0 mt-2 w-80 ${themes[theme].primary} rounded-lg shadow-lg border ${themes[theme].border} z-50`}
          >
            <div className="p-4 space-y-4">
              {/* Default View */}
              <div>
                <label className={`flex items-center text-sm font-medium ${themes[theme].text} mb-2`}>
                  <FiCalendar className="w-4 h-4 mr-2" />
                  Default View
                </label>
                <select
                  value={settings.defaultView}
                  onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                  className={`w-full px-3 py-2 border ${themes[theme].border} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themes[theme].primary} ${themes[theme].text}`}
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
                <label className={`flex items-center text-sm font-medium ${themes[theme].text} mb-2`}>
                  <FiGlobe className="w-4 h-4 mr-2" />
                  Time Zone
                </label>
                <select
                  value={settings.timeZone}
                  onChange={(e) => handleSettingChange('timeZone', e.target.value)}
                  className={`w-full px-3 py-2 border ${themes[theme].border} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themes[theme].primary} ${themes[theme].text}`}
                >
                  {timeZones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              {/* Working Hours */}
              <div>
                <label className={`flex items-center text-sm font-medium ${themes[theme].text} mb-2`}>
                  <FiClock className="w-4 h-4 mr-2" />
                  Working Hours
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => handleSettingChange('workingHours', {
                      ...settings.workingHours,
                      start: e.target.value
                    })}
                    className={`px-3 py-2 border ${themes[theme].border} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themes[theme].primary} ${themes[theme].text}`}
                  />
                  <input
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => handleSettingChange('workingHours', {
                      ...settings.workingHours,
                      end: e.target.value
                    })}
                    className={`px-3 py-2 border ${themes[theme].border} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themes[theme].primary} ${themes[theme].text}`}
                  />
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className={`flex items-center text-sm font-medium ${themes[theme].text} mb-2`}>
                  <FiEye className="w-4 h-4 mr-2" />
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSettingChange('theme', option.id)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors
                        ${settings.theme === option.id 
                          ? `${themes[theme].accent} ${themes[theme].accentText}`
                          : `${themes[theme].primary} ${themes[theme].text} ${themes[theme].border} border`
                        }
                        ${settings.theme === option.id ? '' : themes[theme].hover}`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div>
                <label className={`flex items-center text-sm font-medium ${themes[theme].text} mb-2`}>
                  <FiBell className="w-4 h-4 mr-2" />
                  Notifications
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500`}
                  />
                  <span className={`ml-2 text-sm ${themes[theme].text}`}>Enable notifications</span>
                </label>
              </div>

              {/* Shared Calendars */}
              <div>
                <label className={`flex items-center text-sm font-medium ${themes[theme].text} mb-2`}>
                  <FiUsers className="w-4 h-4 mr-2" />
                  Shared Calendars
                </label>
                <button
                  onClick={() => {/* Implement shared calendar management */}}
                  className={`w-full px-3 py-2 text-sm text-blue-600 ${themes[theme].hover} rounded-md transition-colors`}
                >
                  Manage Shared Calendars
                </button>
              </div>
            </div>

            <div className={`border-t ${themes[theme].border} p-4`}>
              <button
                onClick={handleSave}
                className={`w-full px-4 py-2 ${themes[theme].accent} ${themes[theme].accentText} rounded-md ${themes[theme].accentHover} transition-colors`}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Notification
        show={showNotification}
        type="success"
        message="Settings saved successfully!"
        position="bottom-right"
        duration={1500}
      />
    </>
  )
}

export default CalendarSettings
