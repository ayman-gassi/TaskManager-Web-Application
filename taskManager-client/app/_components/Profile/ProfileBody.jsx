'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion'
import { 
  FiEdit2, FiClock, FiCheckCircle, 
  FiAlertCircle, FiBarChart2, FiPlus, FiTrash2,
  FiCheck, FiTrash, FiEdit3, FiCalendar, FiFlag, FiUser, FiPhone, FiMail,
  FiFolder, FiStar, FiChevronDown, FiFilter, FiSettings, FiCheckSquare, FiList, FiMapPin, FiPieChart, FiTrendingUp,
  FiActivity, FiX, FiSave, FiAward, FiChevronRight, FiBriefcase, FiCommand, FiGrid
} from 'react-icons/fi'
import { useUser } from '@/app/_context/UserContext'
import ActivityModal from './ActivityModal'
import ProfileInfoModal from './ProfileInfoModal'
import CategoryModal from './CategoryModal'
import SkillModal from './SkillModal'
import HistorySection from './HistorySection'
import SuccessAlert from '../Notifications/SuccessAlert'
import AboutModal from './AboutModal'
import DeleteAccountModal from './DeleteAccountModal'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function ProfileBody() {
  const { userName, userEmail, userJob, userPhone, userLanguages, userLocation, userAbout, updateUserAbout, userSkills, updateUserSkills, deleteAccount } = useUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [editedDescription, setEditedDescription] = useState(userAbout || '')
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('error')
  const [isSkillsLoading, setIsSkillsLoading] = useState(true)
  const [isAboutLoading, setIsAboutLoading] = useState(true)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false)

  // Update editedDescription when userAbout changes
  useEffect(() => {
    setEditedDescription(userAbout || '')
    setIsAboutLoading(false)
  }, [userAbout])

  useEffect(() => {
    if (userSkills) {
      setIsSkillsLoading(false)
    }
  }, [userSkills])

  const [profileInfo, setProfileInfo] = useState({
    fullName: userName || 'John Doe',
    country: userLocation || 'Casablanca, Morocco',
    languages: userLanguages || 'none',
    phone: userPhone || 'none',
    email: userEmail || 'john.doe@example.com'
  })
  const [newLink, setNewLink] = useState({ platform: '', url: '' })
  const [newSkill, setNewSkill] = useState('')
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const validateSkill = (skill) => {
    // Check if skill already exists
    if (userSkills.includes(skill.trim())) {
      setAlertMessage('This skill already exists')
      setAlertType('error')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return false
    }

    // Check skill length (max 20 characters)
    if (skill.trim().length > 20) {
      setAlertMessage('Skill name must be less than 20 characters')
      setAlertType('error')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return false
    }

    return true
  }

  const handleAddSkill = async () => {
    const trimmedSkill = newSkill.trim()
    if (!trimmedSkill) return

    if (!validateSkill(trimmedSkill)) {
      setNewSkill('')
      return
    }

    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      // Update skills in the database
      const response = await axios.put(
        'http://localhost:9000/api/users/profile',
        {
          skills: [...userSkills, trimmedSkill],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.state) {
        updateUserSkills([...userSkills, trimmedSkill])
        setNewSkill('')
        addActivity('update', 'Skills', `Added ${trimmedSkill} to skills`)
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error updating skills:', error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const updatedSkills = userSkills.filter(skill => skill !== skillToRemove)
      await updateUserSkills(updatedSkills)
      addActivity('update', 'Skills', `Removed ${skillToRemove} from skills`)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Failed to remove skill:', error)
      setError(error.message || 'Failed to remove skill')
    }
  }

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Implement User Authentication',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-01-05',
      progress: 100
    },
    {
      id: 2,
      title: 'Design Dashboard Layout',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-01-10',
      progress: 65
    },
    {
      id: 3,
      title: 'API Integration',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-15',
      progress: 30
    }
  ])

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'complete',
      taskTitle: 'User Authentication',
      timestamp: '2024-01-02T10:30:00',
      icon: FiCheck,
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'update',
      taskTitle: 'API Integration',
      details: 'Updated progress to 65%',
      timestamp: '2024-01-02T09:15:00',
      icon: FiEdit3,
      color: 'text-blue-500'
    },
    {
      id: 3,
      type: 'create',
      taskTitle: 'Design Dashboard Layout',
      timestamp: '2024-01-01T16:45:00',
      icon: FiPlus,
      color: 'text-purple-500'
    },
    {
      id: 4,
      type: 'priority',
      taskTitle: 'API Integration',
      details: 'Changed priority to High',
      timestamp: '2024-01-01T14:20:00',
      icon: FiFlag,
      color: 'text-orange-500'
    },
    {
      id: 5,
      type: 'deadline',
      taskTitle: 'User Authentication',
      details: 'Changed due date to Jan 15',
      timestamp: '2024-01-01T11:10:00',
      icon: FiCalendar,
      color: 'text-indigo-500'
    }
  ])

  const [activeTimeFilter, setActiveTimeFilter] = useState('today')

  const [emailPreferences, setEmailPreferences] = useState({
    activityNotifications: false,
    taskUpdates: false,
    weeklySummary: false
  })

  const [categoryStats] = useState({
    development: { count: 15, total: 20, color: '#4F46E5' }, // Indigo
    design: { count: 8, total: 10, color: '#9333EA' },      // Purple
    marketing: { count: 12, total: 15, color: '#EC4899' },  // Pink
    research: { count: 5, total: 8, color: '#2563EB' },     // Blue
    content: { count: 7, total: 10, color: '#06B6D4' }      // Cyan
  })

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const platformDropdownRef = useRef(null)

  // Close platform dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target)) {
        setIsPlatformDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setProfileInfo(prev => ({
      ...prev,
      fullName: userName || '',
      country: userLocation || '',
      languages: userLanguages || '',
      phone: userPhone || '',
      email: userEmail || ''
    }))
  }, [userName, userEmail, userPhone, userLanguages, userLocation])

  const handleSaveDescription = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      // Update user info in the database
      const response = await axios.put('http://localhost:9000/api/users/profile', {
        about: editedDescription.trim() || 'No description provided'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.state) {
        setIsEditingAbout(false)
        updateUserAbout(editedDescription)
        // Add to activity feed
        addActivity('update', 'Profile Description', 'Updated about section')
        // Show success message
        setAlertType('success')
        setAlertMessage('Profile updated successfully!')
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      console.error('About update error:', err)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Please login again to update your profile')
        // Clear invalid token
        Cookies.remove('token')
        localStorage.removeItem('token')
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to update about section')
      }
    }
  }

  const addActivity = (type, taskTitle, details = '') => {
    const newActivity = {
      id: Date.now(),
      type,
      taskTitle,
      details,
      timestamp: new Date().toISOString(),
      icon: type === 'complete' ? FiCheck :
            type === 'update' ? FiEdit3 :
            type === 'create' ? FiPlus :
            type === 'priority' ? FiFlag :
            type === 'deadline' ? FiCalendar :
            FiActivity,
      color: type === 'complete' ? 'text-green-500' :
             type === 'update' ? 'text-blue-500' :
             type === 'create' ? 'text-purple-500' :
             type === 'priority' ? 'text-orange-500' :
             type === 'deadline' ? 'text-indigo-500' :
             'text-gray-500'
    }
    activities.unshift(newActivity)
  }

  const handleSaveProfileInfo = (newInfo) => {
    setProfileInfo(newInfo)
    addActivity('update', 'Profile Information', 'Updated profile information')
    setShowSuccess(true)
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60))
        return `${diffInMinutes} minutes ago`
      }
      return `${diffInHours} hours ago`
    }
    
    if (diffInHours < 48) {
      return 'Yesterday'
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'complete':
        return `Completed task "${activity.taskTitle}"`
      case 'update':
        return `Updated task "${activity.taskTitle}"`
      case 'create':
        return `Created new task "${activity.taskTitle}"`
      case 'priority':
        return `Updated priority for "${activity.taskTitle}"`
      case 'deadline':
        return `Updated deadline for "${activity.taskTitle}"`
      default:
        return `Modified task "${activity.taskTitle}"`
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-600'
      case 'in-progress':
        return 'bg-yellow-50 text-yellow-600'
      case 'pending':
        return 'bg-gray-50 text-gray-600'
      case 'overdue':
        return 'bg-red-50 text-red-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />
      case 'in-progress':
        return <FiClock className="w-4 h-4" />
      case 'pending':
        return <FiClock className="w-4 h-4" />
      case 'overdue':
        return <FiAlertCircle className="w-4 h-4" />
      default:
        return <FiCircle className="w-4 h-4" />
    }
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-orange-500'
      default:
        return 'text-gray-500'
    }
  }

  const handleEmailPreference = (key) => {
    setEmailPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleExportData = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Call the export endpoint
      const response = await axios({
        method: 'GET',
        url: 'http://localhost:9000/api/users/export-data',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important for downloading files
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'user_data.json';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // Show success message with success style
      setAlertType('success');
      setAlertMessage('Data exported successfully!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      setAlertType('error');
      setAlertMessage('Failed to export data. Please try again.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      setIsDeleteAccountModalOpen(false)
      setAlertType('success')
      setAlertMessage('Account deleted successfully')
      setShowAlert(true)
    } catch (error) {
      console.error('Error deleting account:', error)
      setAlertType('error')
      setAlertMessage('Failed to delete account. Please try again.')
      setShowAlert(true)
    }
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
  }

  const averageProgress = Math.round(
    tasks.reduce((acc, task) => acc + task.progress, 0) / tasks.length
  )

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'tasks', label: 'Tasks', icon: FiCheckSquare },
    { id: 'favorites', label: 'Favorites', icon: FiStar },
    { id: 'activity', label: 'Activity', icon: FiActivity },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ]

  const textareaRef = useRef(null)

  // Auto-resize textarea
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    if (isEditingAbout) {
      autoResizeTextarea()
    }
  }, [isEditingAbout])

  const [isEditingSkills, setIsEditingSkills] = useState(false)

  const handleUpdateSkills = async (newSkills) => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      // Update skills in the database
      const response = await axios.put(
        'http://localhost:9000/api/users/profile',
        {
          skills: newSkills,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.state) {
        updateUserSkills(newSkills)
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
        setIsSkillModalOpen(false)
      }
    } catch (error) {
      console.error('Error updating skills:', error)
      setError(error.message || 'Failed to update skills')
    }
  }

  return (
    <>
      <SuccessAlert 
        message="Profile updated successfully!" 
        isVisible={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
      {/* Alert Notification */}
      {showAlert && (
        <div className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
          alertType === 'success' 
            ? 'bg-green-50 text-green-600' 
            : 'bg-red-50 text-red-600'
        }`}>
          {alertType === 'success' ? (
            <FiCheckCircle className="w-5 h-5" />
          ) : (
            <FiAlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{alertMessage}</span>
        </div>
      )}
      {/* Main Navigation */}
      <div className="bg-white shadow-sm mb-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex justify-center space-x-8" aria-label="Profile Navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === item.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Profile Info Column */}
            <div className="col-span-12 lg:col-span-4">
              {/* Profile Info Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 max-h-[calc(340vh-13rem)] max-w-full min-h-[calc(113vh-13rem)] min-w-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-50 rounded-full">
                      <FiUser className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Profile Info</h2>
                  </div>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-base font-medium text-gray-500 mb-3">Full Name</h3>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-full">
                        <FiUser className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-base text-gray-900">{profileInfo.fullName}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-500 mb-3">Country</h3>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-full">
                        <FiMapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-base text-gray-900">{profileInfo.country}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-500 mb-3">Languages</h3>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-full">
                        <FiCommand className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-base text-gray-900">{profileInfo.languages}</p>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-base font-medium text-gray-900 mb-6">Contacts</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-full">
                          <FiPhone className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-base text-gray-600">{profileInfo.phone}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-full">
                          <FiMail className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-base text-gray-600">{profileInfo.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills and About Column */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* About Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(65vh-8rem)] max-h-[calc(100vh-8rem)] max-w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-full">
                      <FiUser className="w-4 h-4 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">About</h2>
                  </div>
                  <button
                    onClick={() => setIsEditingAbout(!isEditingAbout)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {isEditingAbout ? <FiX className="w-4 h-4" /> : <FiEdit2 className="w-4 h-4" />}
                  </button>
                </div>

                {isEditingAbout ? (
                  <div className="space-y-6">
                    {error && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                        {error}
                      </div>
                    )}
                    <textarea
                      ref={textareaRef}
                      value={editedDescription}
                      onChange={(e) => {
                        setEditedDescription(e.target.value)
                        autoResizeTextarea()
                      }}
                      className="w-full px-4 py-3 text-base text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px] overflow-hidden resize-none"
                      placeholder="Write something about yourself..."
                    />
                    <div className="flex justify-end pb-6">
                      <button
                        onClick={handleSaveDescription}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <FiSave className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap max-w-full">
                    {isAboutLoading ? (
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ) : editedDescription.trim() ? (
                      <p className="text-gray-600 whitespace-pre-wrap">{editedDescription}</p>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="p-3 bg-purple-50 rounded-full mb-3">
                          <FiCommand className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-base font-medium text-gray-900 mb-1">No Description Added</h3>
                          <p className="text-sm text-gray-500">Click the "Edit" button to add your description</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Skills Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(65vh-8rem)] max-h-[calc(100vh-8rem)] max-w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <FiBarChart2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                  </div>
                  <button
                    onClick={() => setIsAddingSkill(!isAddingSkill)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {isAddingSkill ? <FiX className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                  </button>
                </div>

                {isAddingSkill && (
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a skill..."
                      className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                )}

                <div className="relative h-[120px] w-full overflow-hidden">
                  {isSkillsLoading ? (
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto scrollbar-hide hover:scrollbar-default transition-all pr-2">
                      {userSkills.length > 0 ? (
                        <>
                          {userSkills.slice(0, 5).map((skill, index) => (
                            <motion.span
                              key={skill}
                              initial={isAddingSkill ? { scale: 0 } : false}
                              animate={isAddingSkill ? { scale: 1 } : false}
                              exit={isAddingSkill ? { scale: 0 } : false}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-base bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors shrink-0"
                            >
                              {skill}
                              <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="p-1 hover:bg-blue-200 rounded-full"
                              >
                                <FiX className="w-3.5 h-3.5" />
                              </button>
                            </motion.span>
                          ))}
                          {userSkills.length > 5 && (
                            <button
                              onClick={() => setIsSkillModalOpen(true)}
                              className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow group shrink-0"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-sm">
                                  +{userSkills.length - 5}
                                </span>
                                <span className="hidden sm:inline">more skills</span>
                              </span>
                              <FiChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center h-[120px]">
                          <div className="p-3 bg-blue-50 rounded-full mb-3">
                            <FiAward className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-base font-medium text-gray-900 mb-1">No Skills Added</h3>
                            <p className="text-sm text-gray-500">Click the "Add Skills" button to get started</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <HistorySection />
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Task Statistics Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-50 rounded-full">
                    <FiPieChart className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Task Statistics</h2>
                </div>
              </div>
              
              <div className="p-6">
                {/* Time Filter */}
                <div className="flex gap-2 mb-6">
                  <button 
                    onClick={() => setActiveTimeFilter('today')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      activeTimeFilter === 'today'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => setActiveTimeFilter('week')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      activeTimeFilter === 'week'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setActiveTimeFilter('month')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      activeTimeFilter === 'month'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Month
                  </button>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Completed Tasks</span>
                      <div className="p-1.5 bg-green-100 rounded-full">
                        <FiCheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">24</span>
                      <span className="text-sm text-green-600">+12.5%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">In Progress</span>
                      <div className="p-1.5 bg-blue-100 rounded-full">
                        <FiClock className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">8</span>
                      <span className="text-sm text-blue-600">Active</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Total Tasks</span>
                      <div className="p-1.5 bg-indigo-100 rounded-full">
                        <FiList className="w-4 h-4 text-indigo-600" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {Object.values(categoryStats).reduce((sum, category) => sum + category.total, 0)}
                      </span>
                      <span className="text-sm text-indigo-600">tasks</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                      <div className="p-1.5 bg-purple-100 rounded-full">
                        <FiTrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">75%</span>
                      <span className="text-sm text-purple-600">+5%</span>
                    </div>
                  </div>
                </div>

                {/* Category Progress */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Category Progress</h3>
                    <button
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(categoryStats).map(([category, stats]) => (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: stats.color }}
                            ></span>
                            <span className="text-sm text-gray-600 capitalize">{category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {stats.count}/{stats.total}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({Math.round((stats.count / stats.total) * 100)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: stats.color,
                              width: `${(stats.count / stats.total) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Last Task Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-50 rounded-full">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Last Task</h2>
                </div>
              </div>
              
              {tasks.length > 0 ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(tasks[0].status)}`} />
                        <h3 className="text-base font-medium text-gray-900">
                          {tasks[0].title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiClock className="w-4 h-4 text-gray-500" />
                          <span>Due {tasks[0].dueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {tasks[0].status === 'completed' ? (
                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <FiAlertCircle className="w-4 h-4 text-indigo-500" />
                          )}
                          <span className="capitalize">{tasks[0].status.replace('-', ' ')}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm font-medium text-indigo-600">{tasks[0].progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(tasks[0].progress)} transition-all duration-500`}
                            style={{ width: `${tasks[0].progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <FiCheckSquare className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No tasks yet</h3>
                  <p className="text-sm text-gray-500">Create your first task to get started</p>
                </div>
              )}
            </div>

            {/* Recent Tasks Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-full">
                    <FiClock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
                </div>
              </div>
              <div className="space-y-4">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="group relative bg-white border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                          <h3 className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FiClock className="w-4 h-4 text-gray-500" />
                            <span>Due {task.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {task.status === 'completed' ? (
                              <FiCheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <FiAlertCircle className="w-4 h-4 text-indigo-500" />
                            )}
                            <span className="capitalize">{task.status.replace('-', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(task.progress)} transition-all duration-500`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Activity Feed */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-full">
                    <FiActivity className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTimeFilter('today')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTimeFilter === 'today'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => setActiveTimeFilter('week')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTimeFilter === 'week'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setActiveTimeFilter('month')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTimeFilter === 'month'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Month
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-0 left-4 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-8">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="relative flex gap-4 items-start">
                      <div className="absolute -left-2 w-8 h-8 flex items-center justify-center">
                        <div className={`p-1.5 rounded-full ${activity.color.replace('text-', 'bg-').replace('500', '100')}`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 ml-8">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{activity.title}</span>
                          <span className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                        </div>
                        {activity.details && (
                          <p className="mt-1 text-sm text-gray-500">{activity.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsActivityModalOpen(true)}
                  className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiChevronDown className="w-4 h-4" />
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Account Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <FiUser className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Email Preferences */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Preferences</h3>
                        <p className="text-sm text-gray-500">Manage your email notification settings</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-full">
                            <FiActivity className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-900">Activity Notifications</label>
                            <p className="text-sm text-gray-500">Get notified about your account activity</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={emailPreferences.activityNotifications}
                            onChange={() => handleEmailPreference('activityNotifications')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-full">
                            <FiCheckSquare className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-900">Task Updates</label>
                            <p className="text-sm text-gray-500">Receive updates about your tasks</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={emailPreferences.taskUpdates}
                            onChange={() => handleEmailPreference('taskUpdates')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-full">
                            <FiClock className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-900">Weekly Summary</label>
                            <p className="text-sm text-gray-500">Get a weekly summary of your activity</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={emailPreferences.weeklySummary}
                            onChange={() => handleEmailPreference('weeklySummary')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 rounded-full">
                      <FiTrash2 className="w-4 h-4 text-red-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Export Data</h3>
                      <p className="text-sm text-gray-500">Download a copy of your data</p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      Export
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-red-600">Delete Account</h3>
                      <p className="text-sm text-red-500">Permanently delete your account and all data</p>
                    </div>
                    <button
                      onClick={() => setIsDeleteAccountModalOpen(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-50 rounded-full">
                    <FiStar className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Favorite Items</h2>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="py-16 px-6"
              >
                <div className="max-w-sm mx-auto text-center">
                  <motion.div 
                    initial={{ scale: 0.8, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 0.1
                    }}
                    className="relative inline-block mb-6"
                  >
                    <div className="absolute inset-0 bg-yellow-100 rounded-full animate-ping opacity-20"></div>
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100">
                      <FiStar className="w-8 h-8 text-yellow-500" />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.2
                    }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-gray-500">
                      Items you mark as favorite will appear here for quick access
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activities={activities}
        formatTimestamp={formatTimestamp}
        getActivityMessage={getActivityMessage}
      />
      <ProfileInfoModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialData={profileInfo}
        onSave={handleSaveProfileInfo}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        description={editedDescription}
      />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categoryStats={categoryStats}
      />
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        skills={userSkills}
        onUpdateSkills={handleUpdateSkills}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirmDelete={handleDeleteAccount}
      />
    </>
  )
}
