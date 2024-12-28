'use client'

import { useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useTheme } from '@/app/_context/ThemeContext'

const CalendarFilter = ({ onSearch, searchQuery = '', onClearSearch }) => {
  const { theme, themes } = useTheme()
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearch = (e) => {
    const value = e.target.value
    setLocalSearch(value)
    onSearch?.(value)
  }

  const handleClear = () => {
    setLocalSearch('')
    onClearSearch?.()
  }

  return (
    <div className={`${themes[theme].primary} px-6 py-4 border-b ${themes[theme].border}`}>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
            value={localSearch}
            onChange={handleSearch}
            className={`w-full pl-10 pr-10 py-2 rounded-lg border ${themes[theme].border} ${themes[theme].primary} ${themes[theme].text} 
              focus:outline-none focus:ring-2 ${themes[theme].focus} focus:border-transparent transition-colors`}
          />
          <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themes[theme].text}`} />
          {localSearch && (
            <button
              onClick={handleClear}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themes[theme].text} ${themes[theme].hover} 
                rounded-full p-1 transition-colors`}
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarFilter
