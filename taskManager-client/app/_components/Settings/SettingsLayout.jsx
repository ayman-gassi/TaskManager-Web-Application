'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '../Shared/Sidebar'
import SettingsHeader from './SettingsHeader'
import { motion, AnimatePresence } from 'framer-motion'

export default function SettingsLayout({ children, showSuccess }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 pl-64">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 pl-64 w-full z-50">
          <div className="flex justify-end px-6 py-2">
            <SettingsHeader showSuccess={false} headerOnly={true} />
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-8 min-h-screen z-40 relative">
          <div className="pl-8">
            {/* Success Message and Tabs */}
            <div className="pt-4 max-w-3xl">
              <SettingsHeader showSuccess={false} contentOnly={true} />
            </div>
            
            {/* Settings Content */}
            <div className="py-6 max-w-3xl">
              {children}
            </div>
          </div>
        </div>

        {/* Fixed Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-6 right-6 flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
