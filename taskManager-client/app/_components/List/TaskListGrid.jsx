'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMoreHorizontal, FiCalendar, FiEye, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi'
import { useTheme } from '@/app/_context/ThemeContext'
import TaskDetailsModal from '../Shared/TaskDetailsModal'
import NoSearchResults from '../Shared/NoSearchResults'
import NoTasks from '../Shared/NoTasks'
import EditTaskModal from '../Shared/EditTaskModal'
import Notification from '../Shared/Notification'

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full"
      >
        <div className="flex items-center justify-center mb-4 text-red-600">
          <FiAlertCircle className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete Task</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete "{taskTitle}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function TaskListGrid({ tasks, searchQuery, onClearSearch, onDeleteTasks, onUpdateTask }) {
  const { theme, themes } = useTheme()
  const [hoveredTaskId, setHoveredTaskId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const menuRef = useRef(null)

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Combine all tasks into a single array
  const allTasks = Object.values(tasks).flat()
  const hasNoTasks = allTasks.length === 0

  // Filter tasks based on search query
  const filteredTasks = allTasks.filter(task => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower)
    )
  })

  const hasSearchResults = filteredTasks.length > 0

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'in-progress':
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      case 'done':
        return 'bg-green-100 text-green-800 border border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'design':
        return 'bg-purple-100 text-purple-800 border border-purple-200'
      case 'development':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'backend':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
      case 'frontend':
        return 'bg-pink-100 text-pink-800 border border-pink-200'
      case 'database':
        return 'bg-cyan-100 text-cyan-800 border border-cyan-200'
      case 'devops':
        return 'bg-teal-100 text-teal-800 border border-teal-200'
      case 'setup':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
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
        return status
    }
  }

  const getLabelColor = (type) => {
    switch (type) {
      case 'feature':
        return 'bg-purple-100 text-purple-800'
      case 'bug':
        return 'bg-red-100 text-red-800'
      case 'design':
        return 'bg-indigo-100 text-indigo-800'
      case 'documentation':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit'
        })
      : ''
  }

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null
    const end = new Date(endDate)
    if (!(end instanceof Date) || isNaN(end)) return null
    
    const today = new Date()
    const diffTime = end - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDaysRemainingText = (days) => {
    if (days < 0) return "Time's up"
    if (days === 0) return 'Due today'
    return `${days} ${days === 1 ? 'day' : 'days'} left`
  }

  const getDaysRemainingColor = (days) => {
    if (days <= 0) return 'bg-red-100 text-red-800 border border-red-200'
    if (days <= 3) return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    return 'bg-green-100 text-green-800 border border-green-200'
  }

  const handleMenuClick = (taskId, event) => {
    event.preventDefault()
    event.stopPropagation()
    setOpenMenuId(openMenuId === taskId ? null : taskId)
  }

  const handleMenuItemClick = (action, task, e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenMenuId(null)
    
    switch(action) {
      case 'view':
        setSelectedTask(task)
        break
      case 'edit':
        setTaskToEdit(task)
        setShowEditModal(true)
        break
      case 'delete':
        setTaskToDelete(task)
        setShowDeleteModal(true)
        break
    }
  }

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      try {
        const response = await fetch(`/api/tasks/${taskToDelete.id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await onDeleteTasks([taskToDelete.id])
          setShowDeleteModal(false)
          setTaskToDelete(null)
          setNotification({
            show: true,
            type: 'success',
            message: `Task "${taskToDelete.title}" deleted successfully`
          })
        } else {
          setNotification({
            show: true,
            type: 'error',
            message: 'Failed to delete task'
          })
        }
      } catch (error) {
        console.error('Error deleting task:', error)
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to delete task'
        })
      }
    }
  }

  const handleEditSave = async (updatedTask) => {
    try {
      await onUpdateTask(updatedTask)
      setShowEditModal(false)
      setTaskToEdit(null)
      showNotification('success', 'Task updated successfully')
    } catch (error) {
      console.error('Error updating task:', error)
      showNotification('error', 'Failed to update task')
    }
  }

  return (
    <>
      {!filteredTasks.length && searchQuery ? (
        <NoSearchResults query={searchQuery} onClear={onClearSearch} />
      ) : !tasks.length ? (
        <div className="w-full">
          <NoTasks />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredTasks.map(task => {
              const daysRemaining = getDaysRemaining(task.endDate)
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${themes[theme].bg} rounded-lg shadow-sm border ${themes[theme].border} overflow-hidden relative`}
                  onMouseEnter={() => setHoveredTaskId(task.id)}
                  onMouseLeave={() => setHoveredTaskId(null)}
                >
                  {/* Card Header */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className={`font-medium ${themes[theme].text} line-clamp-2`}>
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex items-start gap-2">
                        {/* Status Badge */}
                        <span className={`${getStatusColor(task.status)} text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap`}>
                          {getStatusText(task.status)}
                        </span>
                        {/* Menu Button */}
                        <div className="relative" ref={menuRef}>
                          <motion.button
                            onClick={(e) => handleMenuClick(task.id, e)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <motion.div
                              initial={{ rotate: 0 }}
                              animate={{ rotate: openMenuId === task.id ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
                            </motion.div>
                          </motion.button>

                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {openMenuId === task.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  <button
                                    onClick={(e) => handleMenuItemClick('view', task, e)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                  >
                                    <FiEye className="mr-2 h-4 w-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={(e) => handleMenuItemClick('edit', task, e)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                  >
                                    <FiEdit2 className="mr-2 h-4 w-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={(e) => handleMenuItemClick('delete', task, e)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    role="menuitem"
                                  >
                                    <FiTrash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Days Remaining Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getDaysRemainingColor(daysRemaining)}`}>
                        {getDaysRemainingText(daysRemaining)}
                      </span>
                    </div>

                    <p className={`text-sm ${themes[theme].text} opacity-60 mb-4 line-clamp-2`}>
                      {task.description}
                    </p>

                    {/* Date Information */}
                    <div className="flex items-center space-x-2 mb-4">
                      <FiCalendar className={`w-4 h-4 ${themes[theme].text} opacity-60`} />
                      <span className={`text-xs ${themes[theme].text} opacity-60`}>
                        {task.startDate && task.endDate ? (
                          `${formatDate(task.startDate)} - ${formatDate(task.endDate)}`
                        ) : (
                          'No dates set'
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Categories and Labels */}
                  <div className="px-4 pb-4 flex flex-wrap gap-2">
                    {/* Category */}
                    {task.category && (
                      <span className={`${getCategoryColor(task.category)} text-xs px-2.5 py-0.5 rounded-full`}>
                        {task.category}
                      </span>
                    )}

                    {/* Labels */}
                    {task.labels?.map((label, index) => (
                      <span
                        key={index}
                        className={`${getLabelColor(label.type)} text-xs px-2.5 py-0.5 rounded-full`}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Notification */}
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            taskTitle={taskToDelete?.title}
          />
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      {showEditModal && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setTaskToEdit(null)
          }}
          onSave={handleEditSave}
          task={taskToEdit}
        />
      )}
    </>
  )
}
