'use client'

import { useState, useCallback, useEffect } from 'react'
import CalendarView from '../_components/Calendar/CalendarView'
import OverviewMenu from '../_components/Shared/OverviewMenu'
import TaskHeader from '../_components/Calendar/CalendarHeader'
import TaskFilters from '../_components/Calendar/CalendarFilter'
import Sidebar from '../_components/Shared/Sidebar'
import LoadingState from '../_components/Shared/LoadingState'
import { useTheme } from '@/app/_context/ThemeContext'

export default function Calendar() {
  const { theme, themes } = useTheme()
  const [tasks, setTasks] = useState({
    backlog: [],
    todo: [
      {
        id: 1,
        title: 'Design System',
        description: 'Create a cohesive design system for the application',
        category: 'Design',
        startDate: '2023-12-20',
        endDate: '2023-12-24',
        status: 'todo',
        labels: [
          { type: 'design', name: 'Design System' }
        ],
        assignees: [
          { name: 'Alice Brown', avatar: 'https://ui-avatars.com/api/?name=Alice+Brown' }
        ],
        comments: 5,
        attachments: 2
      },
      {
        id: 2,
        title: 'Backend Development',
        description: 'Implement core backend functionality',
        category: 'Development',
        startDate: '2023-12-15',
        endDate: '2023-12-22',
        status: 'in-progress',
        labels: [
          { type: 'feature', name: 'Backend Development' }
        ],
        assignees: [
          { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' }
        ],
        comments: 3,
        attachments: 1
      },
      {
        id: 3,
        title: 'Initial Setup',
        description: 'Set up development environment',
        category: 'Setup',
        startDate: '2023-12-10',
        endDate: '2023-12-12',
        status: 'done',
        labels: [
          { type: 'setup', name: 'Initial Setup' }
        ],
        assignees: [
          { name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' }
        ],
        comments: 2,
        attachments: 0
      },
      {
        id: 4,
        title: 'User Authentication',
        description: 'Implement user login and registration',
        category: 'Development',
        startDate: '2023-12-18',
        endDate: '2023-12-25',
        status: 'todo',
        labels: [
          { type: 'feature', name: 'User Authentication' }
        ],
        assignees: [
          { name: 'Alice Brown', avatar: 'https://ui-avatars.com/api/?name=Alice+Brown' }
        ],
        comments: 5,
        attachments: 2
      },
      {
        id: 5,
        title: 'Database Schema',
        description: 'Design and implement database structure',
        category: 'Database',
        startDate: '2023-12-14',
        endDate: '2023-12-21',
        status: 'in-progress',
        labels: [
          { type: 'database', name: 'Database Schema' }
        ],
        assignees: [
          { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' }
        ],
        comments: 3,
        attachments: 1
      },
      {
        id: 6,
        title: 'API Documentation',
        description: 'Create comprehensive API documentation',
        category: 'Documentation',
        startDate: '2023-12-16',
        endDate: '2023-12-23',
        status: 'todo',
        labels: [
          { type: 'documentation', name: 'API Documentation' }
        ],
        assignees: [
          { name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' }
        ],
        comments: 2,
        attachments: 0
      },
      {
        id: 7,
        title: 'UI Components',
        description: 'Build reusable UI components',
        category: 'Frontend',
        startDate: '2023-12-19',
        endDate: '2023-12-26',
        status: 'in-progress',
        labels: [
          { type: 'frontend', name: 'UI Components' }
        ],
        assignees: [
          { name: 'Alice Brown', avatar: 'https://ui-avatars.com/api/?name=Alice+Brown' }
        ],
        comments: 5,
        attachments: 2
      },
      {
        id: 8,
        title: 'Testing Framework',
        description: 'Set up testing infrastructure',
        category: 'Testing',
        startDate: '2023-12-13',
        endDate: '2023-12-20',
        status: 'done',
        labels: [
          { type: 'testing', name: 'Testing Framework' }
        ],
        assignees: [
          { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' }
        ],
        comments: 3,
        attachments: 1
      },
      {
        id: 9,
        title: 'Performance Optimization',
        description: 'Optimize application performance',
        category: 'Development',
        startDate: '2023-12-17',
        endDate: '2023-12-24',
        status: 'todo',
        labels: [
          { type: 'performance', name: 'Performance Optimization' }
        ],
        assignees: [
          { name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' }
        ],
        comments: 2,
        attachments: 0
      },
      {
        id: 10,
        title: 'Security Audit',
        description: 'Conduct security assessment',
        category: 'Security',
        startDate: '2023-12-21',
        endDate: '2023-12-28',
        status: 'todo',
        labels: [
          { type: 'security', name: 'Security Audit' }
        ],
        assignees: [
          { name: 'Alice Brown', avatar: 'https://ui-avatars.com/api/?name=Alice+Brown' }
        ],
        comments: 5,
        attachments: 2
      },
      {
        id: 11,
        title: 'Deployment Setup',
        description: 'Configure deployment pipeline',
        category: 'DevOps',
        startDate: '2023-12-22',
        endDate: '2023-12-29',
        status: 'todo',
        labels: [
          { type: 'devops', name: 'Deployment Setup' }
        ],
        assignees: [
          { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' }
        ],
        comments: 3,
        attachments: 1
      },
    ],
    inProgress: [
      {
        id: 3,
        title: 'Implement authentication',
        description: 'Add user login and registration functionality',
        category: 'Backend',
        startDate: '2024-12-15',
        endDate: '2024-12-28',
        status: 'in-progress',
        labels: [
          { type: 'feature', name: 'Authentication' }
        ],
        assignees: [
          { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' }
        ],
        comments: 3,
        attachments: 1
      }
    ],
    done: [
      {
        id: 4,
        title: 'Setup project structure',
        description: 'Initialize Next.js project and configure basic settings',
        category: 'Setup',
        startDate: '2024-12-10',
        endDate: '2024-12-15',
        status: 'done',
        labels: [
          { type: 'setup', name: 'Project Setup' }
        ],
        assignees: [
          { name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' }
        ],
        comments: 2,
        attachments: 0
      }
    ]
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [defaultView, setDefaultView] = useState('month')

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

  const handleDeleteTask = useCallback((taskId) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks }
      Object.keys(newTasks).forEach(status => {
        newTasks[status] = newTasks[status].filter(task => task.id !== taskId)
      })
      return newTasks
    })
  }, [])

  const handleSettingsChange = (settings) => {
    if (settings.defaultView) {
      setDefaultView(settings.defaultView)
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className={`min-h-screen ${themes[theme].primary}`}>
      <Sidebar />
      <div className={`pl-64 ${themes[theme].text}`}>
        <OverviewMenu />
        <TaskHeader
          defaultView={defaultView}
          onSettingsChange={handleSettingsChange}
        />
        <TaskFilters onSearch={setSearchQuery} searchQuery={searchQuery} onClearSearch={handleClearSearch} />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <CalendarView 
              tasks={tasks} 
              searchQuery={searchQuery} 
              onClearSearch={handleClearSearch}
              onDeleteTask={handleDeleteTask}
              defaultView={defaultView}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
