'use client'

import { useState, useCallback, useEffect } from 'react'
import TaskList from '../_components/List/TaskList'
import TaskListGrid from '../_components/List/TaskListGrid'
import OverviewMenu from '../_components/Shared/OverviewMenu'
import TaskHeader from '../_components/List/ListTaskHeader'
import TaskFilters from '../_components/Shared/TaskFilters'
import Sidebar from '../_components/Shared/Sidebar'
import { useTask } from '../_context/TaskContext'

export default function ListPage() {
  const { viewPreferences, tasks, addTask, deleteTasks, updateTask } = useTask()
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate dates for 10 days from now
  const today = new Date()
  const tenDaysFromNow = new Date(today)
  tenDaysFromNow.setDate(today.getDate() + 10)
  
  const startDate = today.toISOString().split('T')[0]
  const endDate = tenDaysFromNow.toISOString().split('T')[0]

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])


  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <OverviewMenu />
        <TaskHeader />
        <TaskFilters onSearch={setSearchQuery} searchQuery={searchQuery} onClearSearch={handleClearSearch} />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {viewPreferences.view === 'grid' ? (
              <TaskListGrid 
                tasks={tasks} 
                searchQuery={searchQuery}
                onDeleteTasks={deleteTasks}
                onUpdateTask={updateTask}
                onCreateTask={addTask}
                onClearSearch={handleClearSearch}
              />
            ) : (
              <TaskList 
                tasks={tasks} 
                searchQuery={searchQuery} 
                onClearSearch={handleClearSearch}
                onDeleteTasks={deleteTasks}
                onUpdateTask={updateTask}
                onCreateTask={addTask}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
