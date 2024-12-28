'use client'
import { useState, useCallback, useEffect } from 'react'
import TaskBoard from '../_components/Overview/TaskBoard'
import OverviewMenu from '../_components/Shared/OverviewMenu'
import TaskHeader from '../_components/Overview/TaskHeader'
import TaskFilters from '../_components/Shared/TaskFilters'
import Sidebar from '../_components/Shared/Sidebar'
import { FiSettings, FiMoreHorizontal } from 'react-icons/fi'

export default function Overview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [tasks, setTasks] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      todo: [
        {
          id: 'task1',
          title: 'Overdue Task',
          description: 'This task is overdue',
          category: 'Design',
          dueDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'todo'
        },
        {
          id: 'task2',
          title: 'Due Today',
          description: 'This task is due today',
          category: 'Development',
          dueDate: today.toISOString().split('T')[0],
          status: 'todo'
        },
        {
          id: 'task3',
          title: 'Due in 3 Days',
          description: 'This task is due soon',
          category: 'Frontend',
          dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'todo'
        },
        {
          id: 'task4',
          title: 'Due in 7 Days',
          description: 'This task is due in a week',
          category: 'Backend',
          dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'todo'
        },
        {
          id: 'task5',
          title: 'Due in 14 Days',
          description: 'This task is due in two weeks',
          category: 'Database',
          dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'todo'
        }
      ],
      inProgress: [],
      done: [],
      pinned: []
    };
  });

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);



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
  );
}
