'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMoreHorizontal, FiCalendar, FiClock, FiTag, FiCheckCircle, FiEdit2, FiTrash2, FiEye, FiAlertCircle } from 'react-icons/fi'
import { BsClockHistory } from 'react-icons/bs'
import TaskDetailsModal from '../Shared/TaskDetailsModal'
import NoSearchResults from '../Shared/NoSearchResults'
import NoTasks from '../Shared/NoTasks'
import Pagination from '../Shared/Pagination'

const ITEMS_PER_PAGE = 10

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

const TaskList = ({ tasks, searchQuery, onClearSearch, onDeleteTask, onCreateTask }) => {
  const [selectedTask, setSelectedTask] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    })
  }

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return null
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleMenuClick = (taskId, e) => {
    e.stopPropagation()
    setOpenMenuId(openMenuId === taskId ? null : taskId)
  }

  const handleMenuItemClick = (action, task, e) => {
    e.stopPropagation()
    setOpenMenuId(null)
    
    switch(action) {
      case 'view':
        setSelectedTask(task)
        break
      case 'edit':
        // Handle edit action
        console.log('Edit task:', task)
        break
      case 'delete':
        setTaskToDelete(task)
        break
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDeleteTask(taskToDelete.id);
        setTaskToDelete(null);
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const filteredTasks = Object.values(tasks)
    .flat()
    .filter(task => 
      task.title?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
      task.description?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
      task.category?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
    )

  const allTasks = Object.values(tasks).flat()
  const hasNoTasks = allTasks.length === 0
  const hasSearchResults = filteredTasks.length > 0

  // Pagination calculations
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTasks = filteredTasks.slice(startIndex, endIndex)

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Table Header */}
        {!hasNoTasks && (
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
            <div className="col-span-4">Task</div>
            <div className="col-span-2 text-center">Category</div>
            <div className="col-span-2 text-center">Start Date</div>
            <div className="col-span-2 text-center">Days Left</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
        )}

        {/* Task List */}
        <AnimatePresence mode="wait">
          {hasNoTasks ? (
            <NoTasks onCreateTask={onCreateTask} />
          ) : hasSearchResults ? (
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

                  {/* Start Date */}
                  <div className="col-span-2 flex justify-center items-center text-sm text-gray-500">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center px-3 py-1.5 rounded-full bg-gray-50"
                    >
                      <FiCalendar className="w-4 h-4 mr-1 text-gray-400" />
                      {formatDate(task.startDate)}
                    </motion.div>
                  </div>

                  {/* Days Left */}
                  <div className="col-span-2 flex justify-center">
                    {calculateDaysLeft(task.endDate) !== null && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center justify-center min-w-[100px] px-3 py-1.5 rounded-full text-xs font-medium ${
                          calculateDaysLeft(task.endDate) <= 0 
                            ? 'bg-gray-100 text-gray-700 border border-gray-200'
                            : calculateDaysLeft(task.endDate) > 7 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        <BsClockHistory className="w-3.5 h-3.5 mr-1.5" />
                        {calculateDaysLeft(task.endDate) <= 0 
                          ? "Time's up"
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
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <NoSearchResults query={searchQuery} onClearSearch={onClearSearch} />
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
        {taskToDelete && (
          <DeleteConfirmationModal
            isOpen={!!taskToDelete}
            onClose={() => setTaskToDelete(null)}
            onConfirm={handleDeleteConfirm}
            taskTitle={taskToDelete.title}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default TaskList
