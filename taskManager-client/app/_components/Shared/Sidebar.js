'use client'
import Link from 'next/link'
import { SiTask } from "react-icons/si"
import { RiDashboardLine, RiSettings4Line, RiUser3Line, RiLayoutGridLine, RiTaskLine, RiMoreLine, RiLogoutBoxLine } from 'react-icons/ri'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...')
  }

  const handleProfileClick = () => {
    router.push('/profile')
    setShowDropdown(false)
  }

  return (
    <div className="fixed inset-y-0 left-0 bg-white w-64 border-r border-gray-200 flex flex-col">
      {/* Logo section */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <Link href="/" className="text-[#1D4ED8] flex items-center">
          <SiTask className="h-7 w-7" />
          <h1 className="ml-2.5 font-semibold text-lg">Star Company</h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-4">
        <div className="space-y-4">
          <Link 
            href="/dashboard" 
            className={`flex items-center px-2 py-2 rounded-lg group ${
              pathname === '/dashboard' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <RiDashboardLine className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <Link 
            href="/tasks" 
            className={`flex items-center justify-between px-2 py-2 rounded-lg group ${
              pathname === '/tasks' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <RiTaskLine className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">Tasks</span>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100">10</span>
          </Link>

          <Link 
            href="/overview" 
            className={`flex items-center px-2 py-2 rounded-lg group ${
              pathname === '/overview' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <RiLayoutGridLine className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Overview</span>
          </Link>

          <Link 
            href="/settings" 
            className={`flex items-center px-2 py-2 rounded-lg group ${
              pathname === '/settings' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <RiSettings4Line className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <Link 
            href="/profile" 
            className={`flex items-center px-2 py-2 rounded-lg group ${
              pathname === '/profile' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <RiUser3Line className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Profile section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <div className="relative h-8 w-8">
              <Image
                src="/images/ayman-wa3r.jpg"
                alt="Profile"
                className="rounded-full object-cover"
                fill
                sizes="32px"
              />
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-900">Ayman Wa3r</div>
              <div className="text-xs text-gray-500">ayman@tkrees.com</div>
            </div>
          </div>
          <button 
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <RiMoreLine className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-1">
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <RiUser3Line className="h-4 w-4 mr-2" />
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <RiLogoutBoxLine className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
