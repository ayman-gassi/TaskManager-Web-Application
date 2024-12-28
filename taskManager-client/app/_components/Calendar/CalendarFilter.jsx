'use client'

import { useState, useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useTheme } from '@/app/_context/ThemeContext'

export default function CalendarFilter({ onSearch, searchQuery = '', onClearSearch }) {
  const { theme, themes } = useTheme()
  const currentTheme = themes[theme] || themes.light
  const searchInputRef = useRef(null)

  const handleSearch = (e) => {
    const value = e.target.value
    onSearch?.(value)
  }

  const handleClearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
    }
    onClearSearch?.()
  }

  return (
    <div className={`px-6 py-3 border-b ${currentTheme.border} ${currentTheme.bg}`}>
      <div className="flex items-center">
        <div className="flex-1 max-w-md relative">
          <div className={`flex items-center rounded-lg border ${currentTheme.border} ${currentTheme.bg} px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500/20`}>
            <FiSearch className={`w-5 h-5 ${currentTheme.text} opacity-40`} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tasks..."
              defaultValue={searchQuery}
              onChange={handleSearch}
              className={`ml-2 flex-1 bg-transparent border-none focus:outline-none text-sm ${currentTheme.text}`}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className={`p-1 hover:bg-gray-100 rounded-full ${currentTheme.text} opacity-60 hover:opacity-100`}
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
