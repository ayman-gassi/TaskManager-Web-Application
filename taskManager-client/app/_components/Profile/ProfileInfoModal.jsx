'use client'

import { motion } from 'framer-motion'
import { FiX, FiUser, FiGlobe, FiMessageCircle, FiPhone, FiMail, FiSave } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useUser } from '@/app/_context/UserContext'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function ProfileInfoModal({ isOpen, onClose, initialData, onSave }) {
  const { updateUserName, updateUserEmail, updateUserPhone, updateUserLanguages, updateUserLocation } = useUser()
  const [formData, setFormData] = useState(() => {
    // Initialize form data with proper handling of empty/none values
    const data = {
      fullName: initialData?.fullName || '',
      country: initialData?.country || '',
      languages: initialData?.languages || '',
      phone: initialData?.phone || '',
      email: initialData?.email || ''
    };
    
    // Clean up 'none' values
    if (data.languages === 'none') data.languages = '';
    if (data.phone === 'none') data.phone = '';
    
    return data;
  });

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attention, setAttention] = useState(null)

  useEffect(() => {
    if (initialData) {
      setFormData(prev => {
        const newData = {
          fullName: initialData.fullName || prev.fullName,
          country: initialData.country || prev.country,
          languages: initialData.languages === 'none' ? '' : (initialData.languages || prev.languages),
          phone: initialData.phone === 'none' ? '' : (initialData.phone || prev.phone),
          email: initialData.email || prev.email
        };
        return newData;
      });
    }
  }, [initialData]);

  const validateForm = () => {
    // Check if any changes were made
    const hasChanges = Object.keys(formData).some(key => formData[key] !== initialData[key]);
    if (!hasChanges) {
      setAttention("No changes were made to update");
      return false;
    }

    // Validate email
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate full name
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }

    // Clear any previous messages
    setError(null);
    setAttention(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError(null);
    setAttention(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.put('http://localhost:9000/api/users/profile', {
        fullName: formData.fullName,
        location: formData.country,
        languages: formData.languages || 'none',
        phoneNumber: formData.phone || 'none',
        email: formData.email
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.state) {
        const { user } = response.data;
        updateUserName(user.fullName);
        updateUserLocation(user.location);
        updateUserLanguages(user.languages);
        updateUserPhone(user.phoneNumber);
        updateUserEmail(user.email);

        onSave({
          fullName: user.fullName,
          country: user.location,
          languages: user.languages,
          phone: user.phoneNumber,
          email: user.email
        });

        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Please login again to update your profile');
        Cookies.remove('token');
        localStorage.removeItem('token');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null

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
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            {attention && (
              <div className="p-3 text-sm text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                {attention}
              </div>
            )}
            
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
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#16A34A] rounded-lg hover:bg-[#15803D] transition-colors ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Updating...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
