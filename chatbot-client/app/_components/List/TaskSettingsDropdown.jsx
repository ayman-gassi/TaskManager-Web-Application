'use client'

import { useState } from 'react'
import { FiFilter, FiList, FiColumns, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/app/_context/ThemeContext'
import Notification from '../Shared/Notification'

export default function TaskSettingsDropdown({ isOpen, onClose }) {
  const { theme, themes } = useTheme()
  const [showNotification, setShowNotification] = useState(false)
  const [settings, setSettings] = useState({
    defaultFilters: {
      showCompleted: true,
      showUpcoming: true,
      showOverdue: true,
    },
    categories: [
      { id: 'work', name: 'Work', color: '#3B82F6' },
      { id: 'personal', name: 'Personal', color: '#10B981' },
      { id: 'shopping', name: 'Shopping', color: '#F59E0B' },
    ],
    visibleColumns: {
      dueDate: true,
      category: true,
      priority: true,
      status: true,
      assignee: true,
    }
  })

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSave = () => {
    // Save settings logic here
    onClose()
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 1500)
  }

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`absolute right-0 mt-2 w-80 ${themes[theme].bg} rounded-lg shadow-lg border ${themes[theme].border} z-[999]`}
        >
          <div className="p-4 space-y-4">
            {/* Default Filters */}
            <div>
              <label className={`flex items-center text-sm font-medium ${themes[theme].text} mb-2`}>
                <FiFilter className="w-4 h-4 mr-2" />
                Default Filters
              </label>
              <div className="space-y-2">
                {Object.entries(settings.defaultFilters).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleSettingChange('defaultFilters', key, e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themes[theme].text}`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className={`flex items-center text-sm font-medium ${themes[theme].text} mb-2`}>
                <FiList className="w-4 h-4 mr-2" />
                Categories
              </label>
              <div className="space-y-2">
                {settings.categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className={`text-sm ${themes[theme].text}`}>{category.name}</span>
                    </div>
                    <button className={`text-sm ${themes[theme].text} hover:text-blue-500`}>
                      Edit
                    </button>
                  </div>
                ))}
                <button className={`text-sm text-blue-500 hover:text-blue-600 mt-2`}>
                  + Add Category
                </button>
              </div>
            </div>

            {/* Column Management */}
            <div>
              <label className={`flex items-center text-sm font-medium ${themes[theme].text} mb-2`}>
                <FiColumns className="w-4 h-4 mr-2" />
                Visible Columns
              </label>
              <div className="space-y-2">
                {Object.entries(settings.visibleColumns).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleSettingChange('visibleColumns', key, e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themes[theme].text}`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={handleSave}
                className={`w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center`}
              >
                <FiCheck className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <AnimatePresence>
        {showNotification && (
          <Notification
            message="Settings saved successfully"
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
