'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiSearch, 
  FiFolder, 
  FiPlusCircle,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiList
} from 'react-icons/fi';

const EmptyState = ({ icon: Icon, title, description, type = 'default' }) => {
  const colors = {
    default: { bg: 'bg-gray-50', icon: 'text-gray-400', ring: 'ring-gray-200' },
    success: { bg: 'bg-green-50', icon: 'text-green-500', ring: 'ring-green-200' },
    warning: { bg: 'bg-yellow-50', icon: 'text-yellow-500', ring: 'ring-yellow-200' },
    error: { bg: 'bg-red-50', icon: 'text-red-500', ring: 'ring-red-200' },
    info: { bg: 'bg-blue-50', icon: 'text-blue-500', ring: 'ring-blue-200' }
  };

  const color = colors[type];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-12 text-center px-4"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`${color.bg} p-4 rounded-full mb-4 ring-4 ${color.ring} relative`}
      >
        <Icon className={`w-8 h-8 ${color.icon}`} />
        {type === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full ring-4 ring-red-200"
          />
        )}
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-semibold text-gray-900 mb-2"
      >
        {title}
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-gray-500 max-w-sm"
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

const CategoryModal = ({ isOpen, onClose, categoryStats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const filterOptions = {
    all: 'All Progress',
    'high-progress': 'High Progress (≥ 70%)',
    'low-progress': 'Low Progress (< 70%)'
  };

  const filteredCategories = useMemo(() => {
    return Object.entries(categoryStats)
      .filter(([category]) => 
        category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(([_, stats]) => {
        const progress = (stats.count / stats.total) * 100;
        switch (filterType) {
          case 'high-progress':
            return progress >= 70;
          case 'low-progress':
            return progress < 70;
          default:
            return true;
        }
      });
  }, [categoryStats, searchTerm, filterType]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">All Categories</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="relative flex-1" ref={filterRef}>
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex flex-row justify-between w-full px-4 py-2 text-[15px] text-gray-700 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                >
                  <span className="select-none">{filterOptions[filterType]}</span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${showFilter ? 'transform rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className={`absolute w-full py-2 mt-2 bg-white rounded-lg shadow-lg z-10 ${showFilter ? '' : 'hidden'}`}>
                  {Object.entries(filterOptions).map(([value, label]) => (
                    <button 
                      key={value}
                      onClick={() => {
                        setFilterType(value);
                        setShowFilter(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 max-h-[65vh] overflow-y-auto">
            {Object.keys(categoryStats).length === 0 ? (
              <EmptyState
                icon={FiPlusCircle}
                title="No Categories Available"
                description="Get started by creating your first task category. Categories help you organize and track your work more effectively."
                type="info"
              />
            ) : filteredCategories.length === 0 ? (
              <EmptyState
                icon={FiAlertCircle}
                title="No Matching Categories"
                description={`We couldn't find any categories matching "${searchTerm}". Try a different search term or adjust your filters.`}
                type="warning"
              />
            ) : (
              <div className="grid gap-4">
                {filteredCategories.map(([category, stats]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: stats.color }}
                        ></span>
                        <h3 className="text-base font-medium text-gray-900 capitalize">{category}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {stats.count}/{stats.total}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({Math.round((stats.count / stats.total) * 100)}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: stats.color,
                          width: `${(stats.count / stats.total) * 100}%` 
                        }}
                      ></div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="bg-white px-3 py-2 rounded">
                        <div className="text-sm text-gray-500">Done</div>
                        <div className="text-base font-medium text-gray-900">{stats.count}</div>
                      </div>
                      <div className="bg-white px-3 py-2 rounded">
                        <div className="text-sm text-gray-500">Left</div>
                        <div className="text-base font-medium text-gray-900">{stats.total - stats.count}</div>
                      </div>
                      <div className="bg-white px-3 py-2 rounded">
                        <div className="text-sm text-gray-500">Progress</div>
                        <div className="text-base font-medium text-gray-900">
                          {Math.round((stats.count / stats.total) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CategoryModal;
