'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FiBell } from 'react-icons/fi'
import NotificationDropdown from '../Shared/NotificationDropdown'
import ProfileDropdown from '../ProfileDropdown'

export default function SettingsHeader({ showSuccess, headerOnly, contentOnly }) {
  const pathname = usePathname()
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen)
    setIsProfileOpen(false) // Close profile dropdown when opening notifications
  }

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen)
    setIsNotifOpen(false) // Close notifications when opening profile dropdown
  }

  const tabs = [
    { name: 'General', href: '/settings' },
    { name: 'Notification', href: '/settings/notification' }
  ]

  // Header elements (notification and profile)
  const headerElements = (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <button
          onClick={handleNotifClick}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiBell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <NotificationDropdown 
          isOpen={isNotifOpen} 
          onClose={() => setIsNotifOpen(false)} 
        />
      </div>
      <div className="relative">
        <button
          onClick={handleProfileClick}
          className="flex items-center focus:outline-none"
        >
          <img
            src="/images/ayman-wa3r.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors"
          />
        </button>
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
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${pathname === tab.href
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.name}
          </Link>
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
