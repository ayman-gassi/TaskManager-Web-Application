'use client'

import { useState } from 'react'
import SettingsLayout from '../../_components/Settings/SettingsLayout'

export default function NotificationSettings() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [emailNotif, setEmailNotif] = useState(true)
  const [desktopNotif, setDesktopNotif] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  const handleSave = () => {
    // Add your save logic here
    setShowSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <SettingsLayout showSuccess={showSuccess}>
      <div className="space-y-8">
        <div>
          <h2 className="text-base font-medium text-gray-900 mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3">
                <span className="text-sm font-medium text-gray-700">Email notifications</span>
                <p className="text-sm text-gray-500">Get notified when tasks are assigned to you</p>
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={desktopNotif}
                onChange={(e) => setDesktopNotif(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3">
                <span className="text-sm font-medium text-gray-700">Desktop notifications</span>
                <p className="text-sm text-gray-500">Get notified about task updates and mentions</p>
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3">
                <span className="text-sm font-medium text-gray-700">Weekly digest</span>
                <p className="text-sm text-gray-500">Receive a summary of your tasks every week</p>
              </span>
            </label>
          </div>
        </div>

        <div>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </SettingsLayout>
  )
}
