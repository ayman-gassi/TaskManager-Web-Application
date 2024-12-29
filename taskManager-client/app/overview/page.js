'use client';

import { useState, useCallback, useEffect } from 'react';
import TaskBoard from '../_components/Overview/TaskBoard';
import OverviewMenu from '../_components/Shared/OverviewMenu';
import TaskHeader from '../_components/Overview/TaskHeader';
import TaskFilters from '../_components/Shared/TaskFilters';
import Sidebar from '../_components/Shared/Sidebar';
import { FiSettings, FiMoreHorizontal } from 'react-icons/fi';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { FiCoffee } from 'react-icons/fi';

export default function Overview() {
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
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

  useEffect(() => {
    let timer;
    if (searchQuery) {
      timer = setTimeout(() => {
        console.log('Searching for:', searchQuery);
        // Implement your search logic here
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const showWelcomeMessage = () => {
      // Check if user just logged in and hasn't shown welcome message yet
      if (searchParams.get('welcome') === 'true' && !hasShownWelcome) {
        const userName = localStorage.getItem('userName');
        if (!userName) return; // Don't show welcome if no username

        const currentHour = new Date().getHours();
        let greeting = '';
        if (currentHour < 12) greeting = 'Good morning';
        else if (currentHour < 18) greeting = 'Good afternoon';
        else greeting = 'Good evening';

        // Clear any existing toasts first
        toast.dismiss();

        // Show welcome toast
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <FiCoffee className="h-10 w-10 text-blue-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {greeting}, {userName}! 👋
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Welcome back to your task management dashboard. Let's make today productive!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  router.replace('/overview', { scroll: false });
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-center',
        });

        // Mark that we've shown the welcome message
        setHasShownWelcome(true);
        
        // Remove the welcome parameter from URL after toast duration
        setTimeout(() => {
          router.replace('/overview', { scroll: false });
        }, 5000);
      }
    };

    // Show welcome message with a slight delay to ensure proper mounting
    const timer = setTimeout(showWelcomeMessage, 100);
    return () => clearTimeout(timer);
  }, [searchParams, hasShownWelcome, router]);

  return (
    <div>
      <Toaster />
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
    </div>
  );
}
