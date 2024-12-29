'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiBell, FiUser, FiSettings } from 'react-icons/fi'
import NotificationDropdown from '../Shared/NotificationDropdown'
import ProfileDropdown from '../ProfileDropdown'
import { motion } from 'framer-motion'
import { useUser } from '@/app/_context/UserContext'
import Image from 'next/image'

export default function SettingsHeader({ showSuccess, headerOnly, contentOnly }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const { profileImage } = useUser()
  const [showTooltip, setShowTooltip] = useState(false)
  const [activeTab, setActiveTab] = useState(pathname)

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (storedName) setUserName(storedName)
  }, [])

  useEffect(() => {
    setActiveTab(pathname)
  }, [pathname])

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen)
    setIsProfileOpen(false)
  }

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen)
    setIsNotifOpen(false)
  }

  const handleTabClick = (href) => {
    setActiveTab(href)
    router.push(href)
  }

  const tabs = [
    { name: 'General', href: '/settings' },
    { name: 'Notification', href: '/settings/notification' }
  ]

  // Header elements (notification and profile)
  const headerElements = (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNotifClick}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiBell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </motion.button>
        <NotificationDropdown 
          isOpen={isNotifOpen} 
          onClose={() => setIsNotifOpen(false)} 
        />
      </div>
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProfileClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="flex items-center focus:outline-none relative"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
            {profileImage ? (
              <Image
                src={`http://localhost:9000${profileImage}`}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : userName ? (
              userName.charAt(0).toUpperCase()
            ) : (
              <FiUser className="h-6 w-6" />
            )}
          </div>
          {showTooltip && userName && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
              {userName}
            </div>
          )}
        </motion.button>
        <ProfileDropdown 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
        />
      </div>
    </div>
  )

  // Content elements (success message and tabs)
  const contentElements = (
    <>
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <FiSettings className="h-12 w-12 text-blue-600 animate-spin-slow -mt-1" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">
              Settings
            </h1>
            <p className="mt-3 text-sm text-gray-500 font-medium">
              Customize your workspace and preferences
            </p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-sm mb-6">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          Settings saved successfully!
        </div>
      )}
      {/* Tabs */}
      <nav className="flex space-x-1 bg-gray-100/80 p-1 rounded-lg" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab.href)}
            className={`
              flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 text-center
              ${activeTab === tab.href
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </>
  )

  if (headerOnly) {
    return headerElements
  }

  if (contentOnly) {
    return contentElements
  }

  return (
    <div className="border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        {contentElements}
      </div>
    </div>
  )
}
