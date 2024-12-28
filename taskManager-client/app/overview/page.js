'use client'
import { useState, useCallback, useEffect } from 'react'
import TaskBoard from '../_components/Overview/TaskBoard'
import OverviewMenu from '../_components/Shared/OverviewMenu'
import TaskHeader from '../_components/Shared/TaskHeader'
import TaskFilters from '../_components/Shared/TaskFilters'
import Sidebar from '../_components/Shared/Sidebar'
import LoadingState from '../_components/Shared/LoadingState'
import { FiSettings, FiMoreHorizontal } from 'react-icons/fi'

export default function Overview() {
  const [tasks, setTasks] = useState({
    backlog: [],
    todo: [
      {
        id: 2,
        title: 'Update design system',
        description: 'Implement new design tokens and components',
        category: 'Design System',
        startDate: '2024-12-20',
        endDate: '2024-12-31',
        labels: [
          { type: 'design', name: 'Design System' }
        ],
        assignees: [
          { name: 'Alice Brown', avatar: 'https://ui-avatars.com/api/?name=Alice+Brown' }
        ],
        comments: 5,
        attachments: 2
      }
    ],
    inProgress: [],
    done: []
  })

  const [searchQuery, setSearchQuery] = useState('')
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

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64"> 
        <OverviewMenu />
        <TaskHeader />
        <TaskFilters onSearch={setSearchQuery} searchQuery={searchQuery} onClearSearch={handleClearSearch} />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <TaskBoard tasks={tasks} searchQuery={searchQuery} onClearSearch={handleClearSearch} />
          </div>
        </main>
      </div>
    </div>
  )
}
