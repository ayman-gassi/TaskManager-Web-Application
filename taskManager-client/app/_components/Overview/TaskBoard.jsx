import { FiMoreHorizontal, FiPlus, FiEdit2, FiTrash2, FiArrowRight, FiClock, FiCheckCircle, FiRefreshCw, FiSearch, FiEye, FiArchive, FiCalendar } from 'react-icons/fi'
import { BsClockHistory, BsPinFill, BsPin } from 'react-icons/bs'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { motion, AnimatePresence, useDragControls, useAnimationControls } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import BoardLoadingState from './LoadingStates'
import Noresults from './Noresults'
import TaskDetailsModal from '../Shared/TaskDetailsModal'
import EditTaskModal from '../Shared/EditTaskModal'
import DeleteCardModal from '../Shared/DeleteCardModal'

const CARD_DIMENSIONS = {
  width: 550,
  height: 250
};

const TaskCard = ({ task, onMoveTask, onRemoveTask, onUpdateTask, onToggleStar, onArchiveTask, columnId, larger = false }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isDraggable, setIsDraggable] = useState(false)
  const [hoveredColumn, setHoveredColumn] = useState(null)
  const [showMoveSubmenu, setShowMoveSubmenu] = useState(false)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isStarred, setIsStarred] = useState(task?.isStarred || false)
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const scrollInterval = useRef(null)
  const controls = useAnimationControls()
  const doubleClickTimeoutRef = useRef(null)

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const today = new Date();
    
    // Reset hours to compare just dates
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (!(d instanceof Date) || isNaN(d)) return '';
    
    return d.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  const daysLeft = calculateDaysLeft(task?.dueDate);

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

  const handleDragStart = (event, info) => {
    setIsDraggable(true);
    const rect = event.target.getBoundingClientRect();
    
    // Calculate offset from mouse to card's top-left corner
    setDragOffset({
      x: info.point.x - rect.left,
      y: info.point.y - rect.top
    });

    // Set initial position
    setCardPosition({
      x: rect.left,
      y: rect.top
    });
  };

  const handleDrag = (event, info) => {
    const threshold = 100;
    const speed = 5;
    const mouseY = event.clientY;
    const windowHeight = window.innerHeight;

    // Get the current scroll position
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Auto-scroll based on mouse position
    if (mouseY < threshold && scrollY > 0) {
      // Scroll up when near top
      window.scrollTo({
        top: Math.max(0, scrollY - speed),
        behavior: 'auto'
      });
    } else if (mouseY > windowHeight - threshold && scrollY < maxScroll) {
      // Scroll down when near bottom
      window.scrollTo({
        top: Math.min(maxScroll, scrollY + speed),
        behavior: 'auto'
      });
    }

    // Update card position to follow mouse exactly
    setCardPosition({
      x: event.clientX - dragOffset.x,
      y: event.clientY + window.scrollY - dragOffset.y
    });

    // Check for column hover
    const dragPoint = { x: event.clientX, y: event.clientY };
    const columns = document.querySelectorAll('.column-drop-zone');
    let currentHoveredColumn = null;

    columns.forEach(column => {
      const rect = column.getBoundingClientRect();
      if (
        dragPoint.x >= rect.left &&
        dragPoint.x <= rect.right &&
        dragPoint.y >= rect.top &&
        dragPoint.y <= rect.bottom
      ) {
        currentHoveredColumn = column.getAttribute('data-column-id');
      }
    });

    if (currentHoveredColumn !== hoveredColumn) {
      setHoveredColumn(currentHoveredColumn);
    }
  };

  const handleDragEnd = async (event, info) => {
    setIsDraggable(false);
    setCardPosition({ x: 0, y: 0 });
    setDragOffset({ x: 0, y: 0 });

    if (!hoveredColumn || hoveredColumn === columnId) {
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
      });
    } else {
      onMoveTask(task.id, columnId, hoveredColumn)
    }

    setHoveredColumn(null);
  }

  const handleDoubleClick = (e) => {
    if (!isDraggable) {
      const rect = e.currentTarget.getBoundingClientRect()
      setCardPosition({ x: rect.left, y: rect.top })
    }
    setIsDraggable(prev => !prev)
  }

  const handleToggleStar = (e) => {
    e.stopPropagation()
    setIsStarred(!isStarred)
    onToggleStar()
  }

  const handleArchiveTask = (taskId) => {
    // Archive functionality will be implemented later
    console.log('Archive functionality coming soon:', taskId)
  }

  const handleMenuOpen = (columnId) => {
    setActiveMenu(activeMenu === columnId ? null : columnId)
  }

  const boards = [
    { 
      id: 'todo', 
      label: 'To Do',
      icon: <FiClock className="w-4 h-4 text-blue-500" />,
      className: 'mb-4'
    },
    { 
      id: 'inProgress', 
      label: 'In Progress',
      icon: <FiRefreshCw className="w-4 h-4 text-yellow-500" />,
      className: 'mb-4'
    },
    { 
      id: 'done', 
      label: 'Done',
      icon: <FiCheckCircle className="w-4 h-4 text-green-500" />,
      className: ''
    },
    { 
      id: 'pinned', 
      label: 'Pinned',
      icon: <BsPinFill className="w-4 h-4 text-yellow-500" />,
      className: 'mb-4'
    }
  ]

  const menuItems = [
    { 
      icon: <FiEye className="w-4 h-4" />, 
      label: 'View', 
      color: 'text-indigo-600', 
      action: () => {
        setShowTaskDetails(true)
        setShowMenu(false)
      }
    },
    { 
      icon: <FiEdit2 className="w-4 h-4" />, 
      label: 'Edit', 
      color: 'text-blue-600',
      action: () => {
        setShowEditModal(true)
        setShowMenu(false)
      }
    },
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
      setShowMenu(false);
      setShowDeleteModal(true);
    }},
    { icon: <FiArchive className="w-4 h-4" />, label: 'Archive', color: 'text-gray-600', action: () => {
      // Archive functionality will be implemented later
      setShowMenu(false)
    }}
  ]

  useEffect(() => {
    let scrollInterval;
    
    const handleScroll = () => {
      if (isDraggable) {
        // Update position based on current mouse position
        const mouseY = window.event?.clientY;
        if (mouseY !== undefined) {
          setCardPosition(prev => ({
            ...prev,
            y: mouseY + window.scrollY - dragOffset.y
          }));
        }
      }
    };

    if (isDraggable) {
      window.addEventListener('scroll', handleScroll);
      prevScrollY.current = window.scrollY;
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDraggable, dragOffset.y]);

  const prevScrollY = useRef(0);

  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      if (isDraggable) {
        setCardPosition(prev => ({
          ...prev,
          y: mousePosition.current.y + window.scrollY - dragOffset.y
        }));
      }
    };

    if (isDraggable) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDraggable]);

  return (
    <motion.div 
      onDoubleClick={handleDoubleClick}
      animate={controls}
      initial={{ opacity: 1, y: 0 }}
      drag={isDraggable}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{
        zIndex: isDraggable ? 9999 : 1,
        position: isDraggable ? 'fixed' : 'relative',
        cursor: isDraggable ? 'grab' : 'default',
        touchAction: 'none',
        width: `${CARD_DIMENSIONS.width}px`,
        maxWidth: `${CARD_DIMENSIONS.width}px`,
        minHeight: `${CARD_DIMENSIONS.height}px`,
        maxHeight: `${CARD_DIMENSIONS.height}px`,
        overflow: 'hidden',
        left: isDraggable ? `${cardPosition.x}px` : 'auto',
        top: isDraggable ? `${cardPosition.y}px` : 'auto',
        transform: 'none'
      }}
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
      whileDrag={{
        scale: 1.1,
        boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        cursor: "grabbing",
        zIndex: 9999
      }}
      layoutId={`task-${task.id}`}
      layout
      transition={{ 
        default: {
          type: "spring",
          stiffness: 500,
          damping: 20,
          mass: 0.8
        }
      }}
      className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 ${boards.find(board => board.id === columnId)?.className || ''} 
        flex flex-col cursor-pointer relative
        ${isDraggable ? 'cursor-move drag-mode' : ''}`}
    >
      <div 
        className={`flex items-center flex-wrap gap-3 mb-6`}
      >
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-2.5 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700 shrink-0`}
        >
          {task?.category || 'Design System'}
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-2.5 py-1 text-sm font-medium rounded-full flex items-center gap-1 shrink-0 ${
            daysLeft >= 7 
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          <FiClock className="w-4 h-4" />
          {daysLeft <= 0 ? "Time's up" : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`}
        </motion.span>
        <div className="flex items-center whitespace-nowrap gap-2 text-sm text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full shrink-0">
          <FiCalendar className="w-4 h-4" />
          <span>{formatDate(task.createdAt || new Date())} - {formatDate(task.dueDate || new Date())}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className={`font-medium text-gray-900 mb-4 truncate ${isDraggable ? 'drag-mode' : ''}`}>
          {task?.title || 'Untitled Task'}
        </h3>
        <p className={`text-sm text-gray-500 line-clamp-3 flex-1 overflow-hidden ${isDraggable ? 'drag-mode' : ''}`}>
          {task?.description || 'No description'}
        </p>
      </div>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.2 }}
            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
            style={{
              width: '200px',
              top: 'auto',
              right: '0',
              transform: 'translateY(-100%)',
              marginTop: '-8px'
            }}
          >
            {!showMoveSubmenu ? (
              menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={(e) => item.action ? item.action(e) : handleMenuItemClick(item.label.toLowerCase(), task, e)}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  whileHover={{ backgroundColor: '#F3F4F6' }}
                >
                  <span className={item.color}>{item.icon}</span>
                  <span className="text-gray-700">{item.label}</span>
                  {item.submenu && (
                    <FiArrowRight className="w-4 h-4 ml-auto text-gray-400" />
                  )}
                </motion.button>
              ))
            ) : (
              <>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                  Move to
                </div>
                {boards.map((board, index) => (
                  <motion.button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (board.id !== columnId) {
                        onMoveTask(task.id, columnId, board.id)
                      }
                      setShowMenu(false)
                      setShowMoveSubmenu(false)
                    }}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    whileHover={{ backgroundColor: '#F3F4F6' }}
                    disabled={board.id === columnId}
                  >
                    <span className="text-gray-500">{board.icon}</span>
                    <span className="text-gray-700">{board.label}</span>
                    {board.id === columnId && (
                      <span className="ml-auto text-xs text-gray-400">Current</span>
                    )}
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => setShowMoveSubmenu(false)}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 text-gray-500 border-t border-gray-100"
                  whileHover={{ backgroundColor: '#F3F4F6' }}
                >
                  <FiArrowRight className="w-4 h-4 rotate-180" />
                  <span>Back</span>
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTaskDetails && (
          <TaskDetailsModal
            task={task}
            onClose={() => setShowTaskDetails(false)}
            onUpdate={onUpdateTask}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEditModal && (
          <EditTaskModal
            task={task}
            onClose={() => setShowEditModal(false)}
            onSave={(updatedTask) => {
              onUpdateTask(updatedTask)
              setShowEditModal(false)
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteCardModal
            task={task}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={(taskId, status) => {
              onRemoveTask(taskId, status || columnId);
              setShowDeleteModal(false);
            }}
          />
        )}
      </AnimatePresence>
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <button
          onClick={handleToggleStar}
          className={`p-1.5 rounded-full transition-colors ${
            isStarred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            animate={isStarred ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isStarred ? "currentColor" : "none"}
              stroke="currentColor"
              className="w-5 h-5"
              strokeWidth={isStarred ? "0" : "2"}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </motion.div>
        </button>
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
    </motion.div>
  )
}

const EmptyState = ({ title, columnId }) => {
  const getIcon = () => {
    switch (columnId) {
      case 'todo':
        return <FiEdit2 className="w-16 h-16 mb-4 text-blue-400" />
      case 'inProgress':
        return <BsClockHistory className="w-16 h-16 mb-4 text-orange-400" />
      case 'done':
        return <AiOutlineCheckCircle className="w-[80px] h-[80px] mb-4 text-green-400" />
      case 'pinned':
        return <BsPinFill className="w-16 h-16 mb-4 text-yellow-400" />
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
      className="flex flex-col items-center justify-center text-gray-400 px-4"
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
        className="flex items-center justify-center"
      >
        {getIcon()}
      </motion.div>
      <p className="text-lg font-medium text-center">{getMessage()}</p>
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
  const [taskState, setTaskState] = useState(tasks);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [dateFormatKey, setDateFormatKey] = useState(0);

  useEffect(() => {
    setDateFormatKey(prev => prev + 1);
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [scrollPositions, setScrollPositions] = useState({});
  const boardRefs = useRef({});
  const boardMenuRefs = useRef({});

  useEffect(() => {
    setTaskState(tasks);
  }, [tasks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateTask = useCallback((taskId, updates) => {
    setTaskState(prev => {
      const newTasks = { ...prev }
      Object.keys(newTasks).forEach(status => {
        newTasks[status] = newTasks[status].map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })
      return newTasks
    })
  }, [])

  const handleToggleStar = (taskId) => {
    const currentTask = Object.values(tasks).flat().find(task => task.id === taskId)
    if (currentTask) {
      handleUpdateTask(taskId, { isStarred: !currentTask.isStarred })
    }
  }

  const handleArchiveTask = (taskId) => {
    // Archive functionality will be implemented later
    console.log('Archive functionality coming soon:', taskId)
  }

  const handleMenuOpen = (columnId) => {
    setActiveMenu(activeMenu === columnId ? null : columnId)
  }

  const hasSearchResults = useCallback(() => {
    return Object.values(taskState).some(column => 
      (column || []).filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).length > 0
    );
  }, [taskState, searchQuery]);

  const getFilteredTasks = useCallback((columnId) => {
    const tasks = taskState[columnId] || [];
    if (!searchQuery) return tasks;

    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [taskState, searchQuery]);

  const handleScroll = useCallback((columnId, direction) => {
    const board = boardRefs.current[columnId]
    if (!board) return;

    const scrollAmount = 480; // Width of one card
    const currentScroll = board.scrollLeft;
    const maxScroll = board.scrollWidth - board.clientWidth;
    
    let newScroll;
    if (direction === 'left') {
      newScroll = Math.max(0, currentScroll - scrollAmount);
    } else {
      newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
    }
    
    board.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
    
    setScrollPositions(prev => ({
      ...prev,
      [columnId]: newScroll
    }));
  }, []);

  const showLeftArrow = useCallback((columnId) => {
    return (scrollPositions[columnId] || 0) > 0;
  }, [scrollPositions]);

  const showRightArrow = useCallback((columnId) => {
    const board = boardRefs.current[columnId]
    if (!board) return false;
    
    const currentScroll = scrollPositions[columnId] || 0;
    const maxScroll = board.scrollWidth - board.clientWidth;
    
    return currentScroll < maxScroll;
  }, [scrollPositions]);

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
      
      // Add to new column at the beginning
      if (!Array.isArray(newState[toColumn])) {
        console.log('Initializing column:', toColumn);
        newState[toColumn] = [];
      }
      newState[toColumn] = [updatedTask || task, ...newState[toColumn]];
      
      console.log('New state:', newState);
      return newState;
    });
  };

  const handleRemoveTask = (taskId, columnId) => {
    setTaskState(prev => ({
      ...prev,
      [columnId]: prev[columnId].filter(task => task.id !== taskId)
    }));
    // Close any open menus
    setActiveMenu(null);
  };

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

  useEffect(() => {
    const handleBoardScroll = (columnId) => {
      const board = boardRefs.current[columnId]
      if (board) {
        setScrollPositions(prev => ({
          ...prev,
          [columnId]: board.scrollLeft
        }));
      }
    }

    Object.keys(boardRefs.current).forEach(columnId => {
      const board = boardRefs.current[columnId]
      if (board) {
        board.addEventListener('scroll', () => handleBoardScroll(columnId))
        // Initialize scroll positions
        handleBoardScroll(columnId)
      }
    })

    return () => {
      Object.keys(boardRefs.current).forEach(columnId => {
        const board = boardRefs.current[columnId]
        if (board) {
          board.removeEventListener('scroll', () => handleBoardScroll(columnId))
        }
      })
    }
  }, [taskState])

  const handleAddTask = (columnId) => {
    // Add task functionality will be implemented later
    console.log('Add task functionality coming soon:', columnId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 relative z-0">
      {searchQuery && !hasSearchResults() ? (
        <AnimatePresence mode="wait">
          <Noresults query={searchQuery} onClearSearch={onClearSearch} />
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                data-column-id={column.id}
                className={`p-4 rounded-lg w-full column-drop-zone shadow-sm h-[350px] flex flex-col relative ${getColumnStyles(column.id).bg}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-medium text-gray-900">{column.title}</h2>
                    <span className={getColumnStyles(column.id).text}>{column.icon}</span>
                    <span className={`ml-2 inline-flex items-center justify-center px-3.5 py-1.5 text-sm font-medium rounded-full
                      ${column.id === 'todo' ? 'bg-blue-50 text-blue-700' :
                        column.id === 'inProgress' ? 'bg-orange-50 text-orange-700' :
                        column.id === 'done' ? 'bg-green-50 text-green-700' :
                        'bg-yellow-50 text-yellow-700'}
                      transition-all duration-200 min-w-[28px] shadow-sm`}>
                      {getFilteredTasks(column.id).length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 relative z-10">
                    <motion.button 
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddTask(column.id)}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`p-1.5 rounded-md ${getColumnStyles(column.id).text} ${getColumnStyles(column.id).hover} cursor-pointer`}
                    >
                      <FiPlus className="w-5 h-5" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReloadBoard(column.id)}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`p-1.5 rounded-md ${getColumnStyles(column.id).text} ${getColumnStyles(column.id).hover} cursor-pointer`}
                    >
                      <FiRefreshCw className="w-5 h-5" />
                    </motion.button>
                    <div className="relative" ref={el => boardMenuRefs.current[column.id] = el}>
                      <motion.button 
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleMenuOpen(column.id)}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`p-1.5 rounded-md ${getColumnStyles(column.id).text} ${getColumnStyles(column.id).hover} cursor-pointer`}
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

                <div className="relative flex-1">
                  <div
                    ref={el => boardRefs.current[column.id] = el}
                    className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth h-[350px] py-2 px-4"
                    style={{ width: '100%' }}
                    onScroll={(e) => {
                      const target = e.target;
                      setScrollPositions(prev => ({
                        ...prev,
                        [column.id]: target.scrollLeft
                      }));
                    }}
                  >
                    {getFilteredTasks(column.id).length > 0 ? (
                      getFilteredTasks(column.id).map((task) => (
                        <div 
                          key={`${task.id}-${dateFormatKey}`} 
                          className="flex-shrink-0"
                          style={{ 
                            width: `${CARD_DIMENSIONS.width}px`,
                            minWidth: `${CARD_DIMENSIONS.width}px`,
                            maxWidth: `${CARD_DIMENSIONS.width}px`
                          }}
                        >
                          <TaskCard
                            key={`${task.id}-${dateFormatKey}`}
                            task={task}
                            columnId={column.id}
                            onMoveTask={handleMoveTask}
                            onRemoveTask={handleRemoveTask}
                            onUpdateTask={(updates) => handleUpdateTask(task.id, updates)}
                            onToggleStar={() => handleToggleStar(task.id)}
                            larger={task.fromTodo}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center -mt-32">
                        <EmptyState 
                          title={searchQuery ? 'No matching tasks' : `No ${column.title.toLowerCase()} tasks`} 
                          columnId={column.id} 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Scroll Arrows */}
                  {getFilteredTasks(column.id).length > 1 && (
                    <>
                      {/* Left Arrow */}
                      <AnimatePresence>
                        {scrollPositions[column.id] > 0 && (
                          <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={() => handleScroll(column.id, 'left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                          >
                            <svg
                              className="w-6 h-6 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {/* Right Arrow */}
                      <AnimatePresence>
                        {boardRefs.current[column.id] && 
                         getFilteredTasks(column.id).length * CARD_DIMENSIONS.width > boardRefs.current[column.id].clientWidth && 
                         (!scrollPositions[column.id] || 
                          scrollPositions[column.id] < 
                          boardRefs.current[column.id].scrollWidth - boardRefs.current[column.id].clientWidth) && (
                          <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onClick={() => handleScroll(column.id, 'right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                          >
                            <svg
                              className="w-6 h-6 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}

export default TaskBoard;
