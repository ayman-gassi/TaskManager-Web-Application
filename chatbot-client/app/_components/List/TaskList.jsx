'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiMoreVertical, FiTrash2, FiEdit2, FiCheckSquare, FiMoreHorizontal, FiClock, FiTag, FiCheckCircle, FiEye, FiAlertCircle } from 'react-icons/fi'
import { BsClockHistory } from 'react-icons/bs'
import TaskDetailsModal from '../Shared/TaskDetailsModal'
import NoSearchResults from '../Shared/NoSearchResults'
import NoTasks from '../Shared/NoTasks'
import Pagination from '../Shared/Pagination'
import EditTaskModal from '../Shared/EditTaskModal'
import Notification from '../Shared/Notification'

const ITEMS_PER_PAGE = 10

const TaskList = ({ tasks, searchQuery, onClearSearch, onDeleteTasks, onUpdateTask, onCreateTask }) => {
  const [selectedTask, setSelectedTask] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const menuRef = useRef(null)

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

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

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (!(date instanceof Date) || isNaN(date)) return ''
      
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      // Reset time part for comparison
      today.setHours(0, 0, 0, 0)
      tomorrow.setHours(0, 0, 0, 0)
      date.setHours(0, 0, 0, 0)
      
      if (date.getTime() === today.getTime()) {
        return 'Today'
      } else if (date.getTime() === tomorrow.getTime()) {
        return 'Tomorrow'
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return null
    try {
      const end = new Date(endDate)
      if (!(end instanceof Date) || isNaN(end)) return null
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)
      
      const diffTime = end - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch (error) {
      console.error('Error calculating days left:', error)
      return null
    }
  }

  const handleMenuClick = (taskId, e) => {
    e.stopPropagation()
    setOpenMenuId(openMenuId === taskId ? null : taskId)
  }

  const handleMenuItemClick = (action, task, e) => {
    e.stopPropagation()
    setOpenMenuId(null)
    
    switch (action) {
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
      default:
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

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setTaskToDelete(null)
  }

  const handleEditSave = async (updatedTask) => {
    try {
      await onUpdateTask(updatedTask)
      setShowEditModal(false)
      setTaskToEdit(null)
      setNotification({ show: true, type: 'success', message: 'Task updated successfully' })
    } catch (error) {
      console.error('Error updating task:', error)
      setNotification({ show: true, type: 'error', message: 'Failed to update task' })
    }
  }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
  }

  const filteredTasks = Object.values(tasks)
    .flat()
    .filter(task => 
      !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const allTasks = Object.values(tasks).flat()
  const hasNoTasks = allTasks.length === 0
  const hasSearchResults = filteredTasks.length > 0

  // Pagination calculations
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTasks = filteredTasks.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Table Header */}
        {!hasNoTasks && (
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
            <div className="col-span-4">Task</div>
            <div className="col-span-2 text-center">Category</div>
            <div className="col-span-2 text-center">Date Range</div>
            <div className="col-span-2 text-center">Time Remaining</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
        )}

        {/* Task List */}
        <AnimatePresence mode="wait">
          {hasNoTasks ? (
            <NoTasks />
          ) : !filteredTasks.length && searchQuery ? (
            <NoSearchResults query={searchQuery} onClear={onClearSearch} />
          ) : (
            <>
              {currentTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Task Title */}
                  <div className="col-span-4">
                    <button 
                      onClick={() => setSelectedTask(task)}
                      className="text-left group"
                    >
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 truncate">
                          {task.description}
                        </p>
                      )}
                    </button>
                  </div>

                  {/* Category */}
                  <div className="col-span-2 flex justify-center">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center justify-center min-w-[90px] px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {task.category}
                    </motion.span>
                  </div>

                  {/* Task Dates */}
                  <div className="col-span-2 flex flex-col justify-center items-center text-sm">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center justify-center min-w-[100px] px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
                    >
                      <FiCalendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      <span className="whitespace-nowrap">
                        {task.startDate && task.endDate ? (
                          <>
                            <span>{formatDate(task.startDate)}</span>
                            <span className="mx-1">-</span>
                            <span>{formatDate(task.endDate)}</span>
                          </>
                        ) : (
                          'No dates set'
                        )}
                      </span>
                    </motion.div>
                  </div>

                  {/* Time Remaining */}
                  <div className="col-span-2 flex justify-center items-center text-sm">
                    {calculateDaysLeft(task.endDate) !== null && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center justify-center min-w-[100px] px-3 py-1.5 rounded-full text-xs font-medium ${
                          calculateDaysLeft(task.endDate) <= 0 
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : calculateDaysLeft(task.endDate) <= 7 
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : 'bg-green-100 text-green-700 border border-green-200'
                        }`}
                      >
                        <BsClockHistory className="w-3.5 h-3.5 mr-1.5" />
                        {calculateDaysLeft(task.endDate) <= 0 
                          ? "Overdue"
                          : `${calculateDaysLeft(task.endDate)} ${calculateDaysLeft(task.endDate) === 1 ? 'day' : 'days'} left`
                        }
                      </motion.div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex justify-center">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
                        ${task.status === 'todo' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}
                    >
                      {task.status === 'todo' ? 'To Do' :
                       task.status === 'in-progress' ? 'InProgress' :
                       'Done'}
                    </motion.span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-center relative" ref={menuRef}>
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
                          className="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                        >
                          <button
                            onClick={(e) => handleMenuItemClick('view', task, e)}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <FiEye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          <button
                            onClick={(e) => handleMenuItemClick('edit', task, e)}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <FiEdit2 className="w-4 h-4 mr-2" />
                            Edit Task
                          </button>
                          <button
                            onClick={(e) => handleMenuItemClick('delete', task, e)}
                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                          >
                            <FiTrash2 className="w-4 h-4 mr-2" />
                            Delete Task
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FiAlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Delete Task
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this task? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Notification */}
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </>
  )
}

export default TaskList
