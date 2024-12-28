'use client'

import { useState, useRef } from 'react'
import { FiMail, FiMapPin, FiCalendar, FiEdit, FiCamera } from 'react-icons/fi'
import Image from 'next/image'

export default function ProfileHeader() {
  const [profileImage, setProfileImage] = useState('/images/ayman-wa3r.jpg')
  const [bannerImage, setBannerImage] = useState(null)
  const profileInputRef = useRef(null)
  const bannerInputRef = useRef(null)

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
    }
  }

  const handleBannerImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setBannerImage(imageUrl)
    }
  }

  return (
    <div className="bg-white shadow-sm">
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
        {bannerImage && (
          <div className="absolute inset-0">
            <Image
              src={bannerImage}
              alt="Banner"
              fill
              className="object-cover"
              sizes="100vw"
              priority
              quality={90}
            />
          </div>
        )}
        
        {/* Banner Upload Button */}
        <button 
          onClick={() => bannerInputRef.current?.click()}
          className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors flex items-center gap-2 z-10"
        >
          <FiCamera className="w-5 h-5" />
          <span>Change Banner</span>
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerImageChange}
          className="hidden"
          aria-label="Change banner image"
        />
      </div>
      
      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 pb-6">
          <div className="flex flex-col space-y-4">
            {/* Profile Image */}
            <div className="relative self-start">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src={profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority
                    quality={90}
                  />
                </div>
              </div>
              <button 
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50"
              >
                <FiCamera className="w-4 h-4 text-gray-600" />
              </button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
                aria-label="Change profile image"
              />
            </div>

            {/* Profile Info */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">John Doe</h1>
                <p className="text-gray-600 mt-1">Senior Developer</p>
                <div className="flex flex-wrap gap-4 mt-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    <span>john.doe@example.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>New York, USA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>Joined January 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}