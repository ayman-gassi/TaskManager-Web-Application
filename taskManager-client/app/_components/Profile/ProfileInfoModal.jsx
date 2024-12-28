'use client'

import { motion } from 'framer-motion'
import { FiX, FiUser, FiGlobe, FiMessageCircle, FiPhone, FiMail, FiSave } from 'react-icons/fi'
import { useState } from 'react'

export default function ProfileInfoModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    country: '',
    languages: '',
    phone: '',
    email: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const inputFields = [
    {
      id: 'fullName',
      label: 'Full Name',
      icon: FiUser,
      type: 'text',
      placeholder: 'John Doe'
    },
    {
      id: 'country',
      label: 'Country',
      icon: FiGlobe,
      type: 'text',
      placeholder: 'USA'
    },
    {
      id: 'languages',
      label: 'Languages',
      icon: FiMessageCircle,
      type: 'text',
      placeholder: 'English, Spanish'
    },
    {
      id: 'phone',
      label: 'Contact',
      icon: FiPhone,
      type: 'tel',
      placeholder: '(123) 456-7890'
    },
    {
      id: 'email',
      label: 'Email',
      icon: FiMail,
      type: 'email',
      placeholder: 'john.doe@example.com'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Profile Information</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {inputFields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <field.icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    placeholder={field.placeholder}
                    className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiSave className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
