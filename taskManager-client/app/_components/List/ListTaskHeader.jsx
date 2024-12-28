'use client'

import { useState, useRef, useEffect } from 'react'
import { FiSettings, FiMoreHorizontal, FiDownload, FiGrid, FiFilter, FiRefreshCw, FiList, FiColumns, FiCheckSquare } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import TaskSettingsDropdown from './TaskSettingsDropdown'
import TaskMoreDropdown from './TaskMoreDropdown'

export default function ListTaskHeader() {
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
    // Add refresh logic here
    setShowRefreshNotif(true)
    setTimeout(() => setShowRefreshNotif(false), 1500)
  }

  return (
    <div className="bg-white px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <div className="flex items-center space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
            <span className="mr-1">+</span>
            New Task
          </button>
          
          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiSettings className="w-5 h-5" />
            </button>
            <TaskSettingsDropdown 
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>

          <div className="relative" ref={moreMenuRef}>
            <motion.button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              animate={{ 
                rotate: showMoreMenu ? 90 : 0,
                scale: showMoreMenu ? 1.1 : 1
              }}
              transition={{ 
                duration: 0.2,
                ease: "easeInOut"
              }}
            >
              <FiMoreHorizontal className="w-5 h-5" />
            </motion.button>
            <TaskMoreDropdown 
              isOpen={showMoreMenu}
              onClose={() => setShowMoreMenu(false)}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
