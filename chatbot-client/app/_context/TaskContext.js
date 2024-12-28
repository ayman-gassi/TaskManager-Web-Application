'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const TaskContext = createContext()

// Initialize sample tasks with proper dates
const initialTasks = [
  {
    id: 1,
    title: 'Design System',
    description: 'Create a cohesive design system for the application',
    category: 'Design',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'todo',
    labels: [
      { type: 'design', name: 'Design System' }
    ]
  },
  {
    id: 2,
    title: 'Backend Development',
    description: 'Implement core backend functionality',
    category: 'Development',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'in-progress',
    labels: [
      { type: 'feature', name: 'Backend Development' }
    ]
  },
  {
    id: 3,
    title: 'User Authentication',
    description: 'Implement user login and registration',
    category: 'Backend',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'todo',
    labels: [
      { type: 'feature', name: 'Authentication' }
    ]
  }
]

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks) 
  const [viewPreferences, setViewPreferences] = useState({
    view: 'list',
    sortBy: 'dueDate',
    sortOrder: 'asc',
    filters: {
      priority: 'all',
      status: 'all',
      dueDate: 'all',
      category: 'all'
    }
  })
  const [selectedTasks, setSelectedTasks] = useState([])

  // Export functions
  const exportAsCSV = useCallback(() => {
    const headers = ['Title', 'Description', 'Due Date', 'Priority', 'Status', 'Category']
    const csvContent = tasks.map(task => [
      task.title,
      task.description,
      task.dueDate,
      task.priority,
      task.status,
      task.category
    ].join(','))

    const csv = [headers.join(','), ...csvContent].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tasks.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }, [tasks])

  const exportAsPDF = useCallback(() => {
    const doc = new jsPDF()
    const headers = ['Title', 'Due Date', 'Priority', 'Status']
    const tableData = tasks.map(task => [
      task.title,
      task.dueDate,
      task.priority,
      task.status
    ])

    // Add title
    doc.setFontSize(20)
    doc.text('Tasks List', 14, 15)
    doc.setFontSize(10)

    // Add timestamp
    const timestamp = new Date().toLocaleString()
    doc.text(`Generated on: ${timestamp}`, 14, 25)

    // Add table
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    })

    // Add task details
    let y = doc.lastAutoTable.finalY + 20
    doc.setFontSize(14)
    doc.text('Task Details', 14, y)
    doc.setFontSize(10)

    tasks.forEach((task, index) => {
      y += 15
      if (y > 270) { // Check if we need a new page
        doc.addPage()
        y = 20
      }
      
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${task.title}`, 14, y)
      doc.setFontSize(10)
      y += 7
      
      if (task.description) {
        const lines = doc.splitTextToSize(`Description: ${task.description}`, 180)
        doc.text(lines, 20, y)
        y += (lines.length * 5) + 3
      }
      
      doc.text(`Priority: ${task.priority}`, 20, y)
      y += 5
      doc.text(`Status: ${task.status}`, 20, y)
      y += 5
      doc.text(`Due Date: ${task.dueDate}`, 20, y)
      y += 5
      if (task.category) {
        doc.text(`Category: ${task.category}`, 20, y)
        y += 5
      }
      y += 5 // Add some spacing between tasks
    })

    // Save the PDF
    doc.save('tasks.pdf')
  }, [tasks])

  // View functions
  const changeView = useCallback((view) => {
    setViewPreferences(prev => ({ ...prev, view }))
  }, [])

  // Sort functions
  const sortTasks = useCallback((sortBy) => {
    setViewPreferences(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))

    setTasks(prev => {
      const sorted = [...prev].sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate) - new Date(b.dueDate)
        }
        if (sortBy === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        return a[sortBy].localeCompare(b[sortBy])
      })
      return viewPreferences.sortOrder === 'desc' ? sorted.reverse() : sorted
    })
  }, [viewPreferences.sortOrder])

  // Filter functions
  const applyFilters = useCallback((filters) => {
    setViewPreferences(prev => ({ ...prev, filters }))
  }, [])

  // Refresh function
  const refreshTasks = useCallback(async () => {
    try {
      // Implement your data fetching logic here
      // const response = await fetch('/api/tasks')
      // const data = await response.json()
      // setTasks(data)
      return true
    } catch (error) {
      console.error('Error refreshing tasks:', error)
      return false
    }
  }, [])

  // Bulk actions
  const completeTasks = useCallback((taskIds) => {
    setTasks(prev => prev.map(task => 
      taskIds.includes(task.id) ? { ...task, status: 'completed' } : task
    ))
    setSelectedTasks([])
  }, [])

  const deleteTasks = useCallback(async (taskIds) => {
    try {
      setTasks(prevTasks => prevTasks.filter(task => !taskIds.includes(task.id)))
    } catch (error) {
      console.error('Error deleting tasks:', error)
      throw error
    }
  }, [])

  const addTask = useCallback(async (task) => {
    try {
      // Ensure dates are in ISO format
      const formattedTask = {
        ...task,
        startDate: task.startDate ? new Date(task.startDate).toISOString() : null,
        endDate: task.endDate ? new Date(task.endDate).toISOString() : null,
        id: Date.now() // Simple ID generation
      }

      setTasks(prevTasks => [...prevTasks, formattedTask])
    } catch (error) {
      console.error('Error adding task:', error)
      throw error
    }
  }, [])

  const updateTask = useCallback(async (updatedTask) => {
    try {
      // Ensure dates are in ISO format
      const formattedTask = {
        ...updatedTask,
        startDate: updatedTask.startDate ? new Date(updatedTask.startDate).toISOString() : null,
        endDate: updatedTask.endDate ? new Date(updatedTask.endDate).toISOString() : null
      }

      setTasks(prevTasks => {
        const newTasks = [...prevTasks]
        const taskIndex = newTasks.findIndex(t => t.id === formattedTask.id)
        
        if (taskIndex !== -1) {
          newTasks[taskIndex] = formattedTask
        }
        return newTasks
      })
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }, [])

  const value = {
    tasks,
    selectedTasks,
    viewPreferences,
    setSelectedTasks,
    exportAsCSV,
    exportAsPDF,
    changeView,
    sortTasks,
    applyFilters,
    refreshTasks,
    completeTasks,
    deleteTasks,
    addTask,
    updateTask
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}
