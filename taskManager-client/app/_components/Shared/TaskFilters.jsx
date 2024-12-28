import { FiSearch, FiX, FiTag, FiUser, FiFlag } from 'react-icons/fi'
import { BsFilter, BsClockHistory } from 'react-icons/bs'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

export default function TaskFilters({ onSearch, searchQuery = '', onClearSearch }) {
  const [showFilter, setShowFilter] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filterOptions = [
    { icon: <BsClockHistory className="w-4 h-4" />, label: 'Days Left', color: 'text-orange-600' },
    { icon: <FiTag className="w-4 h-4" />, label: 'Category', color: 'text-purple-600' },
    { icon: <FiFlag className="w-4 h-4" />, label: 'Status', color: 'text-blue-600' },
  ]

  return (
    <div className="bg-white px-6 py-3 border-y border-gray-200 relative z-50">
      <div className="flex items-center justify-between">
        {/* Search input */}
        <div className="relative w-48">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery || ''}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 w-full text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </motion.div>
            </button>
          )}
        </div>

        {/* Filter button with dropdown */}
        <div className="relative" ref={filterRef}>
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              backgroundColor: '#F3F4F6',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilter(!showFilter)}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17
            }}
            className={`h-10 px-4 flex items-center justify-center gap-2 border border-gray-200 rounded-lg text-gray-600 bg-white hover:border-gray-300 ${showFilter ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
          >
            <BsFilter className="w-5 h-5" />
            <span className="text-sm font-medium">Filter</span>
          </motion.button>

          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                {filterOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: '#F9FAFB' }}
                    className="w-full px-4 py-2 flex items-center space-x-3 text-sm"
                    onClick={() => {
                      // Handle filter option click
                      setShowFilter(false)
                    }}
                  >
                    <span className={option.color}>{option.icon}</span>
                    <span className="text-gray-700">{option.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
