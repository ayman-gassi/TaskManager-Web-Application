import { FiMoreHorizontal, FiPlus, FiEdit2, FiTrash2, FiArrowRight, FiClock, FiCheckCircle, FiRefreshCw, FiSearch, FiEye } from 'react-icons/fi'
import { BsClockHistory, BsPinFill, BsPin } from 'react-icons/bs'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { motion, AnimatePresence, useDragControls, useAnimationControls } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import BoardLoadingState from './LoadingStates'
import NoSearchResults from '../Shared/NoSearchResults'
import TaskDetailsModal from '../Shared/TaskDetailsModal'

const TaskCard = ({ task, onMoveTask, onRemoveTask, columnId, larger = false }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isDraggable, setIsDraggable] = useState(false)
  const [hoveredColumn, setHoveredColumn] = useState(null)
  const [showMoveSubmenu, setShowMoveSubmenu] = useState(false)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const scrollInterval = useRef(null)
  const scrollSpeed = 25
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 })
  const controls = useAnimationControls()
  const doubleClickTimeoutRef = useRef(null)

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`;
  };

  const daysLeft = calculateDaysLeft(task.endDate);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && 
          !menuRef.current.contains(event.target) && 
          !menuButtonRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  useEffect(() => {
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current)
      }
      if (doubleClickTimeoutRef.current) {
        clearTimeout(doubleClickTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleAutoScroll = (clientY) => {
    const scrollThreshold = 150
    const viewportHeight = window.innerHeight
    
    // Clear any existing interval
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current)
    }

    if (clientY < scrollThreshold) {
      // Moderate upward scroll
      scrollInterval.current = setInterval(() => {
        window.scrollBy({
          top: -scrollSpeed,
          behavior: 'auto'
        })
      }, 12) 
    } else if (clientY > viewportHeight - scrollThreshold) {
      // Moderate downward scroll
      scrollInterval.current = setInterval(() => {
        window.scrollBy({
          top: scrollSpeed,
          behavior: 'auto'
        })
      }, 12) 
    }
  }

  const handleDragStart = (event, info) => {
    setIsDraggable(true)
    setDragOrigin({ x: info.point.x, y: info.point.y })
  }

  const handleDrag = (event, info) => {
    handleAutoScroll(event.clientY)

    const dragPoint = { x: event.clientX, y: event.clientY }
    const columns = document.querySelectorAll('.column-drop-zone')
    let currentHoveredColumn = null

    columns.forEach(column => {
      const rect = column.getBoundingClientRect()
      if (
        dragPoint.x >= rect.left &&
        dragPoint.x <= rect.right &&
        dragPoint.y >= rect.top &&
        dragPoint.y <= rect.bottom
      ) {
        currentHoveredColumn = column.getAttribute('data-column-id')
      }
    })

    if (currentHoveredColumn !== hoveredColumn) {
      setHoveredColumn(currentHoveredColumn)
    }
  }

  const handleDragEnd = async (event, info) => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current)
      scrollInterval.current = null
    }

    // Always ensure the card is visible
    await controls.start({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2
      }
    })

    if (!hoveredColumn || hoveredColumn === columnId) {
      // Return to original position if not dropped on a valid column
      await controls.start({
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30
        }
      })
    } else {
      // Move the task after ensuring visibility
      onMoveTask(task.id, columnId, hoveredColumn)
    }

    setHoveredColumn(null)
    setIsDraggable(false)
  }

  const handleDoubleClick = (e) => {
    e.preventDefault()
    setIsDraggable(prev => !prev)
  }

  const boards = [
    { 
      id: 'todo', 
      label: 'To Do',
      icon: <FiClock className="w-4 h-4 text-blue-500" />
    },
    { 
      id: 'in-progress', 
      label: 'In Progress',
      icon: <FiRefreshCw className="w-4 h-4 text-yellow-500" />
    },
    { 
      id: 'done', 
      label: 'Done',
      icon: <FiCheckCircle className="w-4 h-4 text-green-500" />
    },
    { 
      id: 'pinned', 
      label: 'Pinned',
      icon: <BsPinFill className="w-4 h-4 text-purple-500" />
    }
  ]

  const menuItems = [
    { icon: <FiEye className="w-4 h-4" />, label: 'View', color: 'text-indigo-600', action: () => setShowTaskDetails(true) },
    { icon: <FiEdit2 className="w-4 h-4" />, label: 'Edit', color: 'text-blue-600' },
    { 
      icon: <FiArrowRight className="w-4 h-4" />, 
      label: 'Move To', 
      color: 'text-purple-600',
      submenu: true,
      action: () => setShowMoveSubmenu(true)
    },
    columnId === 'pinned' 
      ? { icon: <BsPin className="w-4 h-4" />, label: 'Unpin', color: 'text-yellow-600', action: () => {
          onMoveTask(task.id, 'pinned', task.previousColumn || 'todo')
          setShowMenu(false)
        }}
      : { icon: <BsPinFill className="w-4 h-4" />, label: 'Pin', color: 'text-yellow-600', action: () => {
          const updatedTask = { ...task, previousColumn: columnId }
          onMoveTask(task.id, columnId, 'pinned', updatedTask)
          setShowMenu(false)
        }},
    { icon: <FiTrash2 className="w-4 h-4" />, label: 'Remove', color: 'text-red-600', action: () => {
      onRemoveTask(task.id, columnId)
      setShowMenu(false)
    }}
  ]

  return (
    <>
      <motion.div 
        onDoubleClick={handleDoubleClick}
        animate={controls}
        initial={{ opacity: 1, y: 0 }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          scale: isDraggable ? 1.05 : 1,
          boxShadow: isDraggable 
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
        whileHover={{
          scale: isDraggable ? 1.05 : 1.02,
          y: -5,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
          }
        }}
        style={{
          zIndex: isDraggable ? 9999 : 1,
          position: 'relative',
          pointerEvents: 'auto',
          touchAction: 'none',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
        whileDrag={{
          zIndex: 9999,
          scale: 1.05,
          opacity: 1,
          boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.3)"
        }}
        layoutId={`task-${task.id}`}
        layout
        drag={isDraggable}
        dragSnapToOrigin={!hoveredColumn}
        dragElastic={0.2}
        dragConstraints={{
          top: -1000,
          left: -1000,
          right: 1000,
          bottom: 1000
        }}
        dragTransition={{ 
          power: 0.1,
          timeConstant: 200,
          modifyTarget: target => target
        }}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        transition={{ 
          default: {
            type: "spring",
            stiffness: 500,
            damping: 20,
            mass: 0.8
          }
        }}
        className={`bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 mb-3 
          ${larger ? 'min-h-[160px]' : 'min-h-[120px]'} 
          flex flex-col cursor-pointer relative
          ${isDraggable ? 'cursor-move drag-mode' : ''}`}
      >
        {isDraggable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-purple-100 bg-opacity-20 rounded-lg pointer-events-none"
          />
        )}
        <div className={`flex justify-between items-start mb-3 ${isDraggable ? 'drag-mode' : ''}`}>
          <div className={`flex-1 ${isDraggable ? 'drag-mode' : ''}`}>
            <div className={`flex items-center gap-2 mb-2 ${isDraggable ? 'drag-mode' : ''}`}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full ${isDraggable ? 'drag-mode' : ''}`}
              >
                {task.category || 'Design System'}
              </motion.span>
              {daysLeft !== null && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                    daysLeft > 7 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  <BsClockHistory className="w-3 h-3" />
                  {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                </motion.span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {columnId === 'pinned' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center"
              >
                <BsPinFill className="w-5 h-5 text-yellow-500 -rotate-45" />
              </motion.div>
            )}
            <motion.button
              ref={menuButtonRef}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className={`p-2 rounded-md hover:bg-gray-100 ${showMenu ? 'bg-gray-100' : ''}`}
            >
              <FiMoreHorizontal className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>
        <div className="flex justify-between items-start mt-6 mb-3">
          <div className="flex-1">
            <h3 className={`font-medium text-gray-900 mb-1 ${isDraggable ? 'drag-mode' : ''}`}>{task.title}</h3>
            <p className={`text-sm text-gray-500 line-clamp-2 ${isDraggable ? 'drag-mode' : ''}`}>{task.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-xs text-gray-400 ml-4">
            {task.startDate && (
              <div className="flex items-center whitespace-nowrap">
                <span>Start Date: {formatDate(task.startDate)}</span>
              </div>
            )}
            {task.endDate && (
              <div className="flex items-center whitespace-nowrap">
                <span>Deadline: {formatDate(task.endDate)}</span>
              </div>
            )}
          </div>
        </div>
        <AnimatePresence>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
            >
              <div className="py-1">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <button
                      onClick={item.submenu ? item.action : () => {
                        item.action?.()
                        setShowMoveSubmenu(false)
                      }}
                      className={`${item.color} group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                    {item.submenu && showMoveSubmenu && (
                      <div className="absolute left-full top-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {boards
                            .filter(board => board.id !== columnId)
                            .map((board, boardIndex) => (
                              <button
                                key={boardIndex}
                                onClick={() => {
                                  onMoveTask(task.id, columnId, board.id)
                                  setShowMenu(false)
                                  setShowMoveSubmenu(false)
                                }}
                                className="group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                              >
                                <span className="mr-3">
                                  {board.icon}
                                </span>
                                {board.label}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
      {showTaskDetails && (
        <TaskDetailsModal
          task={task}
          onClose={() => setShowTaskDetails(false)}
        />
      )}
    </>
  )
}

const EmptyState = ({ title, columnId }) => {
  const getIcon = () => {
    switch (columnId) {
      case 'todo':
        return <FiEdit2 className="w-10 h-10 mb-3 text-blue-400" />
      case 'inProgress':
        return <BsClockHistory className="w-10 h-10 mb-3 text-orange-400" />
      case 'done':
        return <AiOutlineCheckCircle className="w-12 h-12 mb-3 text-green-400" />
      case 'pinned':
        return <BsPinFill className="w-10 h-10 mb-3 text-yellow-400" />
      default:
        return null
    }
  }

  const getMessage = () => {
    switch (columnId) {
      case 'todo':
        return "No tasks to do yet"
      case 'inProgress':
        return "No tasks in progress yet"
      case 'done':
        return "No completed tasks yet"
      case 'pinned':
        return "No pinned tasks yet"
      default:
        return `No tasks in ${title} yet`
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-gray-400"
    >
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: [-5, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        {getIcon()}
      </motion.div>
      <p className="text-sm">{getMessage()}</p>
    </motion.div>
  )
}

const LoadingState = ({ columnId }) => {
  const getLoadingColor = () => {
    switch (columnId) {
      case 'todo':
        return 'text-blue-500'
      case 'inProgress':
        return 'text-orange-500'
      case 'done':
        return 'text-green-500'
      case 'pinned':
        return 'text-yellow-500'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          rotate: 360 
        }}
        transition={{ 
          opacity: { duration: 0.2 },
          rotate: { 
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        className={`${getLoadingColor()}`}
      >
        <FiRefreshCw className="w-8 h-8" />
      </motion.div>
    </div>
  )
}

const TaskBoard = ({ tasks, searchQuery = '', onClearSearch }) => {
  const [activeMenu, setActiveMenu] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [taskState, setTaskState] = useState({
    pinned: [],
    todo: [],
    inProgress: [],
    done: []
  })
  const boardMenuRefs = useRef({})

  useEffect(() => {
    // Simulate loading delay and then set the tasks
    const timer = setTimeout(() => {
      setTaskState({
        pinned: Array.isArray(tasks.pinned) ? tasks.pinned : [],
        todo: Array.isArray(tasks.todo) ? tasks.todo : [],
        inProgress: Array.isArray(tasks.inProgress) ? tasks.inProgress : [],
        done: Array.isArray(tasks.done) ? tasks.done : []
      })
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [tasks])

  const handleMenuOpen = (columnId) => {
    setActiveMenu(activeMenu === columnId ? null : columnId)
  }

  const getFilteredTasks = (columnTasks) => {
    if (!searchQuery) return columnTasks;
    
    return columnTasks.filter(task => {
      const searchFields = [
        task.title,
        task.description,
        task.priority,
        task.status,
        task.assignee,
        ...(task.labels || []).map(label => label.name),
        ...(task.assignees || []).map(assignee => assignee.name)
      ].map(field => field?.toLowerCase() || '');
      
      const query = searchQuery.toLowerCase();
      return searchFields.some(field => field.includes(query));
    });
  }

  const hasSearchResults = () => {
    return Object.values(taskState).some(columnTasks => 
      getFilteredTasks(columnTasks).length > 0
    );
  }

  const columns = [
    { 
      id: 'pinned', 
      title: 'Pinned Tasks', 
      icon: <BsPinFill className="w-4 h-4" />,
      headerClass: 'bg-yellow-50 border-yellow-200',
      iconButtonClass: 'hover:bg-yellow-100',
      color: 'yellow',
      description: 'Important pinned tasks'
    },
    { 
      id: 'todo', 
      title: 'To Do', 
      icon: <FiEdit2 className="w-4 h-4" />,
      headerClass: 'bg-blue-50 border-blue-200',
      iconButtonClass: 'hover:bg-blue-100',
      color: 'blue',
      description: 'Tasks to be started'
    },
    { 
      id: 'inProgress', 
      title: 'In Progress',
      icon: <FiClock className="w-4 h-4" />,
      headerClass: 'bg-orange-50 border-orange-200',
      iconButtonClass: 'hover:bg-orange-100',
      color: 'orange',
      description: 'Tasks being worked on'
    },
    { 
      id: 'done', 
      title: 'Done',
      icon: <FiCheckCircle className="w-4 h-4" />,
      headerClass: 'bg-green-50 border-green-200',
      iconButtonClass: 'hover:bg-green-100',
      color: 'green',
      description: 'Completed tasks'
    }
  ]

  const getColumnStyles = (columnId) => {
    const styles = {
      pinned: {
        bg: 'bg-gradient-to-br from-yellow-50 to-white border border-yellow-100',
        text: 'text-yellow-600',
        hover: 'hover:bg-yellow-100',
        menuBorder: 'border-yellow-100',
        menuHover: '#FEF9C3',
        menuText: 'text-yellow-700'
      },
      todo: {
        bg: 'bg-gradient-to-br from-blue-50 to-white border border-blue-100',
        text: 'text-blue-500',
        hover: 'hover:bg-blue-100',
        menuBorder: 'border-blue-100',
        menuHover: '#EBF5FF',
        menuText: 'text-blue-700'
      },
      inProgress: {
        bg: 'bg-gradient-to-br from-orange-50 to-white border border-orange-100',
        text: 'text-orange-500',
        hover: 'hover:bg-orange-100',
        menuBorder: 'border-orange-100',
        menuHover: '#FFF7ED',
        menuText: 'text-orange-700'
      },
      done: {
        bg: 'bg-gradient-to-br from-green-50 to-white border border-green-100',
        text: 'text-green-500',
        hover: 'hover:bg-green-100',
        menuBorder: 'border-green-100',
        menuHover: '#DCFCE7',
        menuText: 'text-green-700'
      }
    }
    return styles[columnId]
  }

  const handleMoveTask = (taskId, fromColumn, toColumn, updatedTask) => {
    // Don't update position if dropping in the same column
    if (fromColumn === toColumn) {
      return;
    }

    setTaskState(prev => {
      const newState = { ...prev };
      const taskIndex = newState[fromColumn].findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        console.log('Task not found:', taskId);
        return prev;
      }
      
      // Remove from old column
      const [task] = newState[fromColumn].splice(taskIndex, 1);
      
      // Add to new column at the end
      if (!Array.isArray(newState[toColumn])) {
        console.log('Initializing column:', toColumn);
        newState[toColumn] = [];
      }
      newState[toColumn] = [...newState[toColumn], updatedTask || task];
      
      console.log('New state:', newState);
      return newState;
    });
  };

  const handleRemoveTask = (taskId, columnId) => {
    setTaskState(prev => ({
      ...prev,
      [columnId]: prev[columnId].filter(task => task.id !== taskId)
    }))
  }

  const handleClearBoard = (columnId) => {
    setTaskState(prev => ({
      ...prev,
      [columnId]: []
    }))
  }

  const handleReloadBoard = (columnId) => {
    // Reset the column to its initial state from props
    setTaskState(prev => ({
      ...prev,
      [columnId]: Array.isArray(tasks[columnId]) 
        ? columnId === 'todo' 
          ? tasks[columnId].map(task => ({ ...task, fromTodo: true }))
          : tasks[columnId]
        : []
    }))
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const activeMenuRef = boardMenuRefs.current[activeMenu]
      if (activeMenuRef && !activeMenuRef.contains(event.target)) {
        setActiveMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeMenu])

  const boardMenuItems = [
    { 
      icon: <FiEdit2 className="w-4 h-4" />, 
      label: 'Edit Board', 
      color: 'text-blue-600',
      onClick: () => {} 
    },
    { 
      icon: <FiTrash2 className="w-4 h-4" />, 
      label: 'Clear Board', 
      color: 'text-red-600',
      onClick: (columnId) => handleClearBoard(columnId)
    }
  ]

  return (
    <div className="flex flex-col space-y-6">
      {isLoading ? (
        <BoardLoadingState 
          columns={columns}
          getColumnStyles={getColumnStyles}
          onMenuOpen={handleMenuOpen}
          boardMenuRefs={boardMenuRefs}
        />
      ) : searchQuery && !hasSearchResults() ? (
        <AnimatePresence mode="wait">
          <NoSearchResults query={searchQuery} onClearSearch={onClearSearch} />
        </AnimatePresence>
      ) : (
        <AnimatePresence>
          {columns.map((column, index) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.1
              }}
            >
              <div 
                data-column-id={column.id}
                className={`p-4 rounded-lg w-full column-drop-zone shadow-sm h-[300px] flex flex-col ${getColumnStyles(column.id).bg}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-medium text-gray-900">{column.title}</h2>
                    <span className={getColumnStyles(column.id).text}>{column.icon}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <motion.button 
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`p-1.5 rounded-md ${getColumnStyles(column.id).text} ${getColumnStyles(column.id).hover}`}
                    >
                      <FiPlus className="w-5 h-5" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReloadBoard(column.id)}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`p-1.5 rounded-md ${getColumnStyles(column.id).text} ${getColumnStyles(column.id).hover}`}
                    >
                      <FiRefreshCw className="w-5 h-5" />
                    </motion.button>
                    <div className="relative" ref={el => boardMenuRefs.current[column.id] = el}>
                      <motion.button 
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveMenu(activeMenu === column.id ? null : column.id)}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`p-1.5 rounded-md ${getColumnStyles(column.id).text} ${getColumnStyles(column.id).hover}`}
                      >
                        <FiMoreHorizontal className="w-5 h-5" />
                      </motion.button>
                      
                      <AnimatePresence>
                        {activeMenu === column.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 5 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10 border-${getColumnStyles(column.id).menuBorder}`}
                          >
                            {boardMenuItems.map((item, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ backgroundColor: getColumnStyles(column.id).menuHover }}
                                className="w-full px-4 py-2 flex items-center space-x-2 text-sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  item.onClick(column.id)
                                  setActiveMenu(null)
                                }}
                              >
                                <span className={item.color}>{item.icon}</span>
                                <span className={getColumnStyles(column.id).menuText}>{item.label}</span>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    {getFilteredTasks(taskState[column.id]).length > 0 ? (
                      getFilteredTasks(taskState[column.id]).map((task) => (
                        <TaskCard 
                          key={`${column.id}-${task.id || Math.random()}`}
                          task={task} 
                          onMoveTask={handleMoveTask}
                          onRemoveTask={handleRemoveTask}
                          columnId={column.id}
                          larger={task.fromTodo}
                        />
                      ))
                    ) : (
                      <div className="md:col-span-2 flex items-center justify-center">
                        <EmptyState 
                          title={searchQuery ? 'No matching tasks' : column.title.toLowerCase()} 
                          columnId={column.id} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}

export default TaskBoard;
