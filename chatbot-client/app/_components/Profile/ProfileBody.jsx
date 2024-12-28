'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion'
import { 
  FiEdit2, FiGithub, FiLinkedin, FiTwitter, FiClock, FiCheckCircle, 
  FiAlertCircle, FiBarChart2, FiPlus, FiTrash2, FiInstagram, 
  FiFacebook, FiYoutube, FiSave, FiX, FiLink, FiActivity,
  FiCheck, FiTrash, FiEdit3, FiCalendar, FiFlag, FiUser, FiPhone, FiMail,
  FiUsers, FiFolder, FiStar, FiArchive, FiChevronDown, FiFilter, FiSettings, FiCheckSquare, FiList, FiMapPin, FiPieChart, FiTrendingUp
} from 'react-icons/fi'
import ActivityModal from './ActivityModal'
import ProfileInfoModal from './ProfileInfoModal'
import CategoryModal from './CategoryModal'
import HistorySection from './HistorySection'

export default function ProfileBody() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [newLink, setNewLink] = useState({ platform: '', url: '' })
  const [profileInfo, setProfileInfo] = useState({
    fullName: 'John Doe',
    country: 'USA',
    languages: 'English',
    phone: '(123) 456-7890',
    email: 'john.doe@example.com'
  })
  const [description, setDescription] = useState(
    "Full-stack developer with expertise in React and Node.js. Passionate about building scalable web applications and exploring new technologies."
  )
  const [editedDescription, setEditedDescription] = useState(description)
  const [skills, setSkills] = useState(['React', 'Node.js', 'TypeScript', 'Next.js', 'TailwindCSS'])
  const [newSkill, setNewSkill] = useState('')
  const [isAddingSkill, setIsAddingSkill] = useState(false)

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

  const [socialLinks, setSocialLinks] = useState([])
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      platform: 'github',
      username: 'johndoe',
      connected: true
    },
    {
      platform: 'linkedin',
      username: 'john.doe',
      connected: true
    },
    {
      platform: 'twitter',
      username: '@johndoe',
      connected: true
    }
  ])

  const availablePlatforms = [
    { name: 'GitHub', icon: FiGithub },
    { name: 'LinkedIn', icon: FiLinkedin },
    { name: 'Twitter', icon: FiTwitter },
    { name: 'Instagram', icon: FiInstagram },
    { name: 'Facebook', icon: FiFacebook },
    { name: 'YouTube', icon: FiYoutube }
  ]

  const activities = [
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
  ]

  const [activeTimeFilter, setActiveTimeFilter] = useState('today')

  const [emailPreferences, setEmailPreferences] = useState({
    activityNotifications: false,
    taskUpdates: false,
    weeklySummary: false
  })

  const [privacySettings, setPrivacySettings] = useState({
    isPublic: false,
    showActivity: false,
    showTasks: false
  })

  const [themeSettings, setThemeSettings] = useState({
    currentTheme: 'blue',
    darkMode: false,
    compactView: false
  })

  const [categoryStats] = useState({
    development: { count: 15, total: 20, color: '#4F46E5' }, // Indigo
    design: { count: 8, total: 10, color: '#9333EA' },      // Purple
    marketing: { count: 12, total: 15, color: '#EC4899' },  // Pink
    research: { count: 5, total: 8, color: '#2563EB' },     // Blue
    content: { count: 7, total: 10, color: '#06B6D4' }      // Cyan
  })

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false)

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

  const handleSaveDescription = () => {
    setIsEditingAbout(false)
    setDescription(editedDescription)
    // Add to activity feed
    addActivity('update', 'Profile Description', 'Updated about section')
  }

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill('')
      setIsAddingSkill(false)
      addActivity('update', 'Skills', `Added ${newSkill} to skills`)
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
    addActivity('update', 'Skills', `Removed ${skillToRemove} from skills`)
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

  const handleAddLink = () => {
    if (newLink.platform && newLink.url) {
      const platform = availablePlatforms.find(p => p.name.toLowerCase() === newLink.platform.toLowerCase())
      if (platform) {
        setSocialLinks([
          ...socialLinks,
          {
            id: Date.now(),
            platform: newLink.platform.toLowerCase(),
            url: newLink.url,
            icon: platform.icon
          }
        ])
        setNewLink({ platform: '', url: '' })
        setIsAddingLink(false)
        addActivity('create', 'Social Link')
      }
    }
  }

  const handleDeleteLink = (id) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id))
    addActivity('delete', 'Social Link')
  }

  const handleEditLink = (id) => {
    setEditingId(id)
    const link = socialLinks.find(l => l.id === id)
    setNewLink({ platform: link.platform, url: link.url })
  }

  const handleUpdateLink = (id) => {
    setSocialLinks(socialLinks.map(link => {
      if (link.id === id) {
        const platform = availablePlatforms.find(p => p.name.toLowerCase() === newLink.platform.toLowerCase())
        return {
          ...link,
          platform: newLink.platform.toLowerCase(),
          url: newLink.url,
          icon: platform?.icon || link.icon
        }
      }
      return link
    }))
    setEditingId(null)
    setNewLink({ platform: '', url: '' })
    addActivity('update', 'Social Link')
  }

  const handleSaveProfileInfo = (newInfo) => {
    setProfileInfo(newInfo)
    addActivity('update', 'Profile Information', 'Updated profile information')
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

  const getPlatformColor = (platform) => {
    const colors = {
      github: 'bg-gray-100 text-gray-600',
      linkedin: 'bg-blue-100 text-blue-600',
      twitter: 'bg-sky-100 text-sky-600',
      instagram: 'bg-pink-100 text-pink-600',
      facebook: 'bg-indigo-100 text-indigo-600',
      youtube: 'bg-red-100 text-red-600'
    }
    return colors[platform] || 'bg-gray-100 text-gray-600'
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      github: <FiGithub className="w-5 h-5" />,
      linkedin: <FiLinkedin className="w-5 h-5" />,
      twitter: <FiTwitter className="w-5 h-5" />,
      instagram: <FiInstagram className="w-5 h-5" />,
      facebook: <FiFacebook className="w-5 h-5" />,
      youtube: <FiYoutube className="w-5 h-5" />
    }
    return icons[platform] || <FiLink className="w-5 h-5" />
  }

  const handleDisconnectAccount = (platform) => {
    setConnectedAccounts(connectedAccounts.map(account => 
      account.platform === platform 
        ? { ...account, connected: false }
        : account
    ))
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
    { id: 'archived', label: 'Archived', icon: FiArchive },
    { id: 'activity', label: 'Activity', icon: FiActivity },
    { id: 'social', label: 'Social', icon: FiUsers },
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
  }, [description, isEditingAbout])

  const handleEmailPreference = (key) => {
    setEmailPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePrivacySetting = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleThemeChange = (theme) => {
    setThemeSettings(prev => ({
      ...prev,
      currentTheme: theme
    }))
  }

  const handleDisplaySetting = (key) => {
    setThemeSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleExportData = () => {
    // Implement export functionality
    alert('Exporting your data...')
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement delete account functionality
      alert('Account deletion initiated...')
    }
  }

  return (
    <>
      {/* Main Navigation */}
      <div className="bg-white shadow-sm mb-6 border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8" aria-label="Profile Navigation">
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
              <div className="bg-white rounded-lg shadow-sm p-6 h-[calc(100vh-13rem)]">
                <div className="flex items-center justify-between mb-6">
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

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1 text-sm text-gray-900">{profileInfo.fullName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Country</h3>
                    <p className="mt-1 text-sm text-gray-900">{profileInfo.country}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Languages</h3>
                    <p className="mt-1 text-sm text-gray-900">{profileInfo.languages}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Contacts</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-full">
                          <FiPhone className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600">{profileInfo.phone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-full">
                          <FiMail className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600">{profileInfo.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills and About Column */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* About Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(50vh-8rem)]">
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
                    <textarea
                      ref={textareaRef}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value)
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
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Skills Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 h-[calc(50vh-8rem)]">
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

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full group hover:bg-blue-100 transition-colors"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="w-4 h-4 rounded-full text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
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
                    className="group relative bg-white border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-all duration-300"
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

        {activeTab === 'social' && (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              {/* Social Links Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-full">
                      <FiLink className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
                  </div>
                  {!isAddingLink && (
                    <button
                      onClick={() => setIsAddingLink(true)}
                      className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add Link
                    </button>
                  )}
                </div>

                {/* Add Link Form */}
                {isAddingLink && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Add New Link</h3>
                      <button
                        onClick={() => setIsAddingLink(false)}
                        className="p-1 text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Platform
                        </label>
                        <div className="relative" ref={platformDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                            className="w-full px-3 py-2 text-left border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {newLink.platform ? (
                                  <>
                                    {getPlatformIcon(newLink.platform.toLowerCase())}
                                    <span className="text-sm text-gray-900 capitalize">
                                      {newLink.platform}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm text-gray-500">Select Platform</span>
                                )}
                              </div>
                              <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isPlatformDropdownOpen ? 'transform rotate-180' : ''}`} />
                            </div>
                          </button>
                          {isPlatformDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                              <div className="py-1">
                                {availablePlatforms.map((platform) => (
                                  <button
                                    key={platform.name}
                                    onClick={() => {
                                      setNewLink({ ...newLink, platform: platform.name });
                                      setIsPlatformDropdownOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <platform.icon className="w-5 h-5" />
                                    <span className="text-sm text-gray-900">{platform.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={newLink.url}
                          onChange={(e) =>
                            setNewLink({ ...newLink, url: e.target.value })
                          }
                          placeholder="https://"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsAddingLink(false)}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddLink}
                          className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Add Link
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Links List */}
                <div className="space-y-4">
                  {socialLinks.map((link, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getPlatformColor(link.platform)}`}>
                          {getPlatformIcon(link.platform)}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 capitalize">
                            {link.platform}
                          </h3>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 hover:text-purple-600"
                          >
                            {link.url}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-400 hover:text-purple-600">
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(index)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {socialLinks.length === 0 && !isAddingLink && (
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                        <FiLink className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No social links yet</h3>
                      <p className="text-sm text-gray-500">Add your first social link</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Connected Accounts Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-50 rounded-full">
                      <FiUsers className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Connected Accounts</h2>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {connectedAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getPlatformColor(account.platform)}`}>
                          {getPlatformIcon(account.platform)}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 capitalize">
                            {account.platform}
                          </h3>
                          <p className="text-sm text-gray-500">{account.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDisconnectAccount(account.platform)}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Disconnect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Account Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <FiUser className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Email Preferences */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Email Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={emailPreferences.activityNotifications}
                          onChange={() => handleEmailPreference('activityNotifications')}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-gray-700">Receive activity notifications</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={emailPreferences.taskUpdates}
                          onChange={() => handleEmailPreference('taskUpdates')}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-gray-700">Receive task updates</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={emailPreferences.weeklySummary}
                          onChange={() => handleEmailPreference('weeklySummary')}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-gray-700">Receive weekly summary</span>
                      </label>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={privacySettings.isPublic}
                          onChange={() => handlePrivacySetting('isPublic')}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-gray-700">Make profile public</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={privacySettings.showActivity}
                          onChange={() => handlePrivacySetting('showActivity')}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-gray-700">Show activity status</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={privacySettings.showTasks}
                          onChange={() => handlePrivacySetting('showTasks')}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-gray-700">Allow others to see my tasks</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-full">
                      <FiSettings className="w-4 h-4 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Theme Settings</h2>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button 
                        onClick={() => handleThemeChange('blue')}
                        className={`p-4 border-2 ${themeSettings.currentTheme === 'blue' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'} rounded-lg text-center hover:border-blue-600`}
                      >
                        <span className="block w-full h-2 bg-blue-600 rounded mb-2"></span>
                        <span className="text-sm font-medium text-gray-900">Blue</span>
                      </button>
                      <button 
                        onClick={() => handleThemeChange('purple')}
                        className={`p-4 border-2 ${themeSettings.currentTheme === 'purple' ? 'border-purple-600 bg-purple-50' : 'border-gray-200'} rounded-lg text-center hover:border-purple-600`}
                      >
                        <span className="block w-full h-2 bg-purple-600 rounded mb-2"></span>
                        <span className="text-sm font-medium text-gray-900">Purple</span>
                      </button>
                      <button 
                        onClick={() => handleThemeChange('green')}
                        className={`p-4 border-2 ${themeSettings.currentTheme === 'green' ? 'border-green-600 bg-green-50' : 'border-gray-200'} rounded-lg text-center hover:border-green-600`}
                      >
                        <span className="block w-full h-2 bg-green-600 rounded mb-2"></span>
                        <span className="text-sm font-medium text-gray-900">Green</span>
                      </button>
                    </div>
                  </div>

                  {/* Display Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Display</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Dark Mode</span>
                        <button 
                          onClick={() => handleDisplaySetting('darkMode')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${themeSettings.darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span className={`${themeSettings.darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}></span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Compact View</span>
                        <button 
                          onClick={() => handleDisplaySetting('compactView')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${themeSettings.compactView ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span className={`${themeSettings.compactView ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 rounded-full">
                      <FiTrash2 className="w-4 h-4 text-red-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Account Actions</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={handleExportData}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Export Account Data
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete Account
                  </button>
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

        {activeTab === 'archived' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-50 rounded-full">
                    <FiArchive className="w-5 h-5 text-gray-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Archived Items</h2>
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
                    initial={{ scale: 0.8, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 0.1
                    }}
                    className="relative inline-block mb-6"
                  >
                    <div className="absolute inset-0 bg-gray-200 rounded-full animate-ping opacity-20"></div>
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100">
                      <FiArchive className="w-8 h-8 text-gray-500" />
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
                      No archived items
                    </h3>
                    <p className="text-gray-500">
                      Items you archive will be stored here for future reference
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
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categoryStats={categoryStats}
      />
    </>
  )
}
