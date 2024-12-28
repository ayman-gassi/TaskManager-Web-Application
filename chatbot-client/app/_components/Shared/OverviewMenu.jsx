'use client'

import Link from 'next/link'
import { FiGrid, FiList, FiBell, FiCalendar, FiSearch, FiSettings } from 'react-icons/fi'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import NotificationDropdown from './NotificationDropdown'
import ProfileDropdown from '../ProfileDropdown'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/_context/ThemeContext'

export default function OverviewMenu() {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()
  const { theme, themes } = useTheme()
  const currentTheme = themes[theme] || themes.light
  const isCalendarPage = pathname === '/calendar'

  return (
    <nav className={isCalendarPage ? `${currentTheme.primary} border-b ${currentTheme.border}` : "bg-white border-b border-gray-200"}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            <div className="hidden sm:flex sm:space-x-4 h-16">
              <div className="relative flex items-center">
                <Link 
                  href="/overview" 
                  className={`flex items-center h-full px-3 text-sm font-medium group ${
                    pathname === '/overview' 
                      ? 'text-blue-600' 
                      : isCalendarPage 
                        ? `${currentTheme.secondaryText} hover:${currentTheme.text}` 
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <FiGrid className="mr-2 h-4 w-4" />
                    <span>Board</span>
                  </div>
                  <div className={`absolute bottom-0 left-3 right-3 h-0.5 ${isCalendarPage ? currentTheme.accent : 'bg-blue-600'} transition-transform ${
                    pathname === '/overview' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                </Link>
              </div>

              <div className="relative flex items-center">
                <Link 
                  href="/list" 
                  className={`flex items-center h-full px-3 text-sm font-medium group ${
                    pathname === '/list' 
                      ? 'text-blue-600' 
                      : isCalendarPage 
                        ? `${currentTheme.secondaryText} hover:${currentTheme.text}` 
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <FiList className="mr-2 h-4 w-4" />
                    <span>List</span>
                  </div>
                  <div className={`absolute bottom-0 left-3 right-3 h-0.5 ${isCalendarPage ? currentTheme.accent : 'bg-blue-600'} transition-transform ${
                    pathname === '/list' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                </Link>
              </div>

              <div className="relative flex items-center">
                <Link 
                  href="/calendar" 
                  className={`flex items-center h-full px-3 text-sm font-medium group ${
                    pathname === '/calendar' 
                      ? 'text-blue-600'
                      : isCalendarPage 
                        ? `${currentTheme.secondaryText} hover:${currentTheme.text}` 
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </div>
                  <div className={`absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 transition-transform ${
                    pathname === '/calendar' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="ml-6 flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className={`h-4 w-4 ${isCalendarPage ? currentTheme.secondaryText : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className={`block w-full pl-10 pr-4 py-1.5 text-sm ${
                    isCalendarPage 
                      ? `${currentTheme.bg} border ${currentTheme.border} ${currentTheme.text} focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500`
                      : 'bg-white border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-md focus:outline-none placeholder-gray-400`}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2 ${
                  isCalendarPage 
                    ? `${currentTheme.secondaryText} hover:${currentTheme.text}` 
                    : 'text-gray-500 hover:text-gray-700'
                } focus:outline-none`}
              >
                <FiBell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <NotificationDropdown 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)} 
              />
            </div>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                rotate: 45
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-2 text-gray-900 hover:text-blue-600 rounded-full hover:bg-blue-50/80 transition-all duration-200"
              onClick={() => window.location.href = '/settings'}
            >
              <FiSettings className="h-5 w-5" />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center focus:outline-none ml-2 ${
                  isCalendarPage 
                    ? `${currentTheme.secondaryText} hover:${currentTheme.text}` 
                    : ''
                }`}
              >
                <img
                  src="/images/ayman-wa3r.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              </motion.button>
              <ProfileDropdown 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
