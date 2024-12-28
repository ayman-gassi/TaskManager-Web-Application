'use client'

import { useState, useEffect, useRef } from 'react'
import ProfileHeader from '../_components/Profile/ProfileHeader'
import ProfileBody from '../_components/Profile/ProfileBody'
import Sidebar from '../_components/Shared/Sidebar'

export default function ProfilePage() {
  const [timeFormat, setTimeFormat] = useState('24')
  const [showLanguage, setShowLanguage] = useState(false)
  const [showTimezone, setShowTimezone] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English (Default)')
  const [selectedTimezone, setSelectedTimezone] = useState('UTC (Default)')
  const [showSuccess, setShowSuccess] = useState(false)
  
  const languageRef = useRef(null)
  const timezoneRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setShowLanguage(false)
      }
      if (timezoneRef.current && !timezoneRef.current.contains(event.target)) {
        setShowTimezone(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSave = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex-1 pl-64">
        <ProfileHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileBody>
            <div className="space-y-10">
              <div>
                <h2 className="text-[15px] font-medium text-gray-700 mb-3">Language</h2>
                <div className="w-full max-w-md">
                  <div className="relative" ref={languageRef}>
                    <button 
                      onClick={() => {
                        setShowLanguage(!showLanguage)
                        setShowTimezone(false)
                      }}
                      className="flex flex-row justify-between w-full px-4 py-3 text-[15px] text-gray-700 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                    >
                      <span className="select-none">{selectedLanguage}</span>
                      <svg 
                        className={`w-6 h-6 transition-transform duration-200 ${showLanguage ? 'transform rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <div className={`absolute w-full py-2 mt-2 bg-white rounded-lg shadow-lg z-10 ${showLanguage ? '' : 'hidden'}`}>
                      <button 
                        onClick={() => {
                          setSelectedLanguage('English (Default)')
                          setShowLanguage(false)
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        English (Default)
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedLanguage('Spanish')
                          setShowLanguage(false)
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        Spanish
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedLanguage('French')
                          setShowLanguage(false)
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        French
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[15px] font-medium text-gray-700 mb-3">Timezone</h2>
                <div className="w-full max-w-md">
                  <div className="relative" ref={timezoneRef}>
                    <button 
                      onClick={() => {
                        setShowTimezone(!showTimezone)
                        setShowLanguage(false)
                      }}
                      className="flex flex-row justify-between w-full px-4 py-3 text-[15px] text-gray-700 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                    >
                      <span className="select-none">{selectedTimezone}</span>
                      <svg 
                        className={`w-6 h-6 transition-transform duration-200 ${showTimezone ? 'transform rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <div className={`absolute w-full py-2 mt-2 bg-white rounded-lg shadow-lg z-10 ${showTimezone ? '' : 'hidden'}`}>
                      <button 
                        onClick={() => {
                          setSelectedTimezone('UTC (Default)')
                          setShowTimezone(false)
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        UTC (Default)
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedTimezone('EST (UTC-5)')
                          setShowTimezone(false)
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        EST (UTC-5)
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedTimezone('PST (UTC-8)')
                          setShowTimezone(false)
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        PST (UTC-8)
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedTimezone('CET (UTC+1)')
                          setShowTimezone(false)
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        CET (UTC+1)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[15px] font-medium text-gray-700 mb-3">Time Format</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setTimeFormat('24')}
                    className={`h-12 px-6 text-[15px] rounded-full transition-all ${
                      timeFormat === '24'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200'
                    }`}
                  >
                    24 Hours
                  </button>
                  <button
                    onClick={() => setTimeFormat('12')}
                    className={`h-12 px-6 text-[15px] rounded-full transition-all ${
                      timeFormat === '12'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200'
                    }`}
                  >
                    12 Hours
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSave}
                  className="h-11 px-5 bg-blue-600 text-white text-[15px] font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </ProfileBody>
        </main>
      </div>
    </div>
  )
}
