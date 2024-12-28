'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Sidebar from '../Shared/Sidebar'
import SettingsHeader from './SettingsHeader'

export default function SettingsLayout({ children, showSuccess }) {
  const pathname = usePathname()

  const tabs = [
    { name: 'General', href: '/settings' },
    { name: 'Notification', href: '/settings/notification' }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 pl-64">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 pl-64 w-full z-10">
          <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <SettingsHeader showSuccess={showSuccess} headerOnly={true} />
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-12 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto">
            {/* Success Message and Tabs */}
            <div className="px-6 pt-6">
              <SettingsHeader showSuccess={showSuccess} contentOnly={true} />
            </div>
            
            {/* Settings Content */}
            <div className="px-6 py-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
