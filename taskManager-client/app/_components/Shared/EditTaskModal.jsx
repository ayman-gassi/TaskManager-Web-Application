'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { createPortal } from 'react-dom'

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    status: '',
    labels: []
  })
  const [showCategory, setShowCategory] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [mounted, setMounted] = useState(false)
  const categoryRef = useRef(null)
  const statusRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (task) {
      // Format dates to YYYY-MM-DD for input[type="date"]
      const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date instanceof Date && !isNaN(date) 
          ? date.toISOString().split('T')[0]
          : ''
      }

      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        startDate: formatDateForInput(task.startDate),
        endDate: formatDateForInput(task.endDate),
        status: task.status || '',
        labels: task.labels || []
      })
    }
  }, [task])

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategory(false)
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setShowStatus(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Format dates back to ISO string when saving
    const formattedData = {
      ...formData,
      id: task.id,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
    }
    onSave(formattedData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'todo':
        return 'To Do'
      case 'in-progress':
        return 'In Progress'
      case 'done':
        return 'Done'
      default:
        return 'Select Status'
    }
  }

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-[9999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative" ref={categoryRef}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCategory(!showCategory)
                    setShowStatus(false)
                  }}
                  className="flex flex-row justify-between w-full px-4 py-3 text-[15px] text-gray-700 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                >
                  <span className="select-none">{formData.category || 'Select Category'}</span>
                  <svg 
                    className={`w-6 h-6 transition-transform duration-200 ${showCategory ? 'transform rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className={`absolute w-full py-2 mt-2 bg-white rounded-lg shadow-lg z-10 ${showCategory ? '' : 'hidden'}`}>
                  <div className="max-h-60 overflow-y-auto scrollbar-hide">
                    {[
                      'Design',
                      'Development',
                      'Backend',
                      'Frontend',
                      'Database',
                      'DevOps',
                      'Setup',
                      'Documentation',
                      'Testing',
                      'Security',
                      'Performance',
                      'UI/UX',
                      'Research',
                      'Planning',
                      'Maintenance'
                    ].map((category) => (
                      <button 
                        key={category}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category }))
                          setShowCategory(false)
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-[15px] text-gray-700 bg-white border border-blue-200 rounded-lg shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  min={formData.startDate || ''}
                  className="w-full px-4 py-2 text-[15px] text-gray-700 bg-white border border-blue-200 rounded-lg shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="relative" ref={statusRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowStatus(!showStatus)
                    setShowCategory(false)
                  }}
                  className="flex flex-row justify-between w-full px-4 py-3 text-[15px] text-gray-700 bg-white border border-blue-200 rounded-lg shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <span className="select-none">
                    {formData.status ? getStatusText(formData.status) : 'Select Status'}
                  </span>
                  <svg
                    className={`w-6 h-6 transition-transform duration-200 ${showStatus ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div 
                  className={`absolute w-full py-2 bg-white rounded-lg shadow-lg z-10 ${showStatus ? '' : 'hidden'}`}
                  style={{ bottom: 'calc(100% + 8px)' }} // Position above the input
                >
                  <div className="max-h-60 overflow-y-auto scrollbar-hide">
                    {[
                      { value: 'todo', label: 'To Do' },
                      { value: 'in-progress', label: 'In Progress' },
                      { value: 'done', label: 'Done' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, status: value }))
                          setShowStatus(false)
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
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )

  return mounted ? createPortal(modalContent, document.body) : null
}

export default EditTaskModal
