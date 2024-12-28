'use client'

import Link from 'next/link'
import { FiUser, FiHelpCircle, FiCheckCircle, FiLogOut } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function ProfileDropdown({ isOpen, onClose }) {
  const router = useRouter()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleLogout = () => {
    // Add your logout logic here
    router.push('/')
  }

  const menuItems = [
    { icon: FiUser, text: 'My Profile', href: '/profile' },
    { icon: FiHelpCircle, text: 'FAQ', href: '/faq' },
    { icon: FiCheckCircle, text: 'Verified', className: 'text-green-500', static: true, iconClassName: 'text-green-500' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[998]"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div 
        ref={dropdownRef} 
        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-[999] backdrop-blur-sm"
      >
        <div className="px-6 py-4 border-b border-gray-100/60">
          <div className="flex items-center space-x-4">
            <img
              src="/images/ayman-wa3r.jpg"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm hover:border-blue-400 transition-colors duration-200"
            />
            <div>
              <p className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Ayman</p>
              <p className="text-sm text-gray-500">@ayman_wa3r</p>
            </div>
          </div>
        </div>
        
        <div className="py-2">
          {menuItems.map((item, index) => (
            item.static ? (
              <div
                key={index}
                className="flex items-center px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80"
              >
                <item.icon className={`mr-3 h-5 w-5 ${item.iconClassName || ''}`} />
                <span className={item.className || ''}>{item.text}</span>
              </div>
            ) : (
              <Link
                key={index}
                href={item.href}
                onClick={onClose}
                className="flex items-center px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors duration-200"
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span className={item.className || ''}>{item.text}</span>
              </Link>
            )
          ))}
        </div>
        
        <div className="px-4 py-3 border-t border-gray-100/60">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
