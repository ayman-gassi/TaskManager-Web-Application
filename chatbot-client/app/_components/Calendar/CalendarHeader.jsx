'use client'

import { useState, useRef, useEffect } from 'react'
import { FiSettings, FiMoreHorizontal } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import CalendarSettings from './CalendarSettings'
import CalendarMoreMenu from './CalendarMoreMenu'
import Notification from '../Shared/Notification'
import { useTheme } from '@/app/_context/ThemeContext'

export default function TaskHeader({ 
  defaultView, 
  onSettingsChange,
  onRefresh,
  tasks = []
}) {
  const { theme, themes } = useTheme()
  const currentTheme = themes[theme] || themes.light
  const [showSettings, setShowSettings] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showRefreshNotif, setShowRefreshNotif] = useState(false)
  
  const settingsRef = useRef(null)
  const moreMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRefresh = () => {
    onRefresh?.()
    setShowRefreshNotif(true)
    setTimeout(() => setShowRefreshNotif(false), 1500)
  }

  return (
    <div className={`${currentTheme.primary} px-6 py-4`}>
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${currentTheme.text}`}>Calendar</h1>
        <div className="flex items-center space-x-2">
          <div className="relative" ref={settingsRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg ${currentTheme.hover} transition-colors`}
            >
              <FiSettings className={`w-5 h-5 ${currentTheme.text}`} />
            </motion.button>
            <AnimatePresence>
              {showSettings && (
                <CalendarSettings
                  isOpen={showSettings}
                  onClose={() => setShowSettings(false)}
                  defaultView={defaultView}
                  onSettingsChange={onSettingsChange}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={moreMenuRef}>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`p-2 rounded-lg ${currentTheme.hover} transition-colors`}
            >
              <FiMoreHorizontal className={`w-5 h-5 ${currentTheme.text}`} />
            </motion.button>
            <AnimatePresence>
              {showMoreMenu && (
                <CalendarMoreMenu
                  isOpen={showMoreMenu}
                  onClose={() => setShowMoreMenu(false)}
                  onRefresh={handleRefresh}
                  tasks={tasks}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Notification
        show={showRefreshNotif}
        type="success"
        message="Calendar refreshed successfully!"
        position="bottom-right"
        duration={1500}
      />
    </div>
  )
}
