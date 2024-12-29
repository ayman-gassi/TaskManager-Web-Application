'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [profileImage, setProfileImage] = useState(null)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userJob, setUserJob] = useState('')
  const [userPhone, setUserPhone] = useState('none')
  const [userLanguages, setUserLanguages] = useState('none')
  const [userLocation, setUserLocation] = useState('Casablanca, Morocco')
  const [userAbout, setUserAbout] = useState('')
  const [userSkills, setUserSkills] = useState([])

  useEffect(() => {
    // First try to load from localStorage
    const loadFromLocalStorage = () => {
      const storedImage = localStorage.getItem('profileImage')
      const storedName = localStorage.getItem('userName')
      const storedEmail = localStorage.getItem('userEmail')
      const storedJob = localStorage.getItem('userJob')
      const storedPhone = localStorage.getItem('userPhone')
      const storedLanguages = localStorage.getItem('userLanguages')
      const storedLocation = localStorage.getItem('userLocation')
      const storedAbout = localStorage.getItem('userAbout')
      const storedSkills = JSON.parse(localStorage.getItem('userSkills') || '[]')
      
      if (storedImage) setProfileImage(storedImage)
      if (storedName && storedName !== '') setUserName(storedName)
      if (storedEmail && storedEmail !== '') setUserEmail(storedEmail)
      if (storedJob && storedJob !== '') setUserJob(storedJob)
      if (storedPhone && storedPhone !== 'none') setUserPhone(storedPhone)
      if (storedLanguages && storedLanguages !== 'none') setUserLanguages(storedLanguages)
      if (storedLocation && storedLocation !== '') setUserLocation(storedLocation)
      if (storedAbout && storedAbout !== '') setUserAbout(storedAbout)
      if (storedSkills && storedSkills.length > 0) setUserSkills(storedSkills)
    }

    loadFromLocalStorage();
  }, [])

  const updateProfileImage = (newImage) => {
    setProfileImage(newImage)
    if (newImage) {
      localStorage.setItem('profileImage', newImage)
    } else {
      localStorage.removeItem('profileImage')
    }
  }

  const updateUserName = (newName) => {
    setUserName(newName)
    if (newName) {
      localStorage.setItem('userName', newName)
    } else {
      localStorage.removeItem('userName')
    }
  }

  const updateUserEmail = (newEmail) => {
    setUserEmail(newEmail)
    if (newEmail) {
      localStorage.setItem('userEmail', newEmail)
    } else {
      localStorage.removeItem('userEmail')
    }
  }

  const updateUserJob = (newJob) => {
    setUserJob(newJob)
    if (newJob) {
      localStorage.setItem('userJob', newJob)
    } else {
      localStorage.removeItem('userJob')
    }
  }

  const updateUserPhone = (newPhone) => {
    setUserPhone(newPhone)
    if (newPhone) {
      localStorage.setItem('userPhone', newPhone)
    } else {
      localStorage.removeItem('userPhone')
    }
  }

  const updateUserLanguages = (newLanguages) => {
    setUserLanguages(newLanguages)
    if (newLanguages) {
      localStorage.setItem('userLanguages', newLanguages)
    } else {
      localStorage.removeItem('userLanguages')
    }
  }

  const updateUserLocation = (newLocation) => {
    setUserLocation(newLocation)
    if (newLocation) {
      localStorage.setItem('userLocation', newLocation)
    } else {
      localStorage.removeItem('userLocation')
    }
  }

  const updateUserAbout = async (newAbout) => {
    try {
      const token = Cookies.get('token');
      if (token) {
        // Update in database
        const response = await axios.put('http://localhost:9000/api/users/profile', 
          { about: newAbout },
          { 
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.state) {
          // If database update successful, update local state and storage
          setUserAbout(newAbout);
          localStorage.setItem('userAbout', newAbout);
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // If no token, just update local state and storage
        setUserAbout(newAbout);
        localStorage.setItem('userAbout', newAbout);
      }
    } catch (error) {
      console.error('Error updating about:', error);
      // Still update local state and storage even if database update fails
      setUserAbout(newAbout);
      localStorage.setItem('userAbout', newAbout);
    }
  }

  const updateUserSkills = async (newSkills) => {
    try {
      console.log('Attempting to update skills to:', newSkills); // Debug log
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await axios.put('http://localhost:9000/api/users/profile', {
        skills: newSkills
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Server response:', response.data); // Debug log

      if (response.data.state) {
        setUserSkills(newSkills)
        localStorage.setItem('userSkills', JSON.stringify(newSkills))
        console.log('Skills updated successfully:', newSkills); // Debug log
        return true
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Skills update error:', error)
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await axios.delete('http://localhost:9000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.state) {
        // Clear all local storage
        localStorage.clear()
        // Clear all cookies
        Cookies.remove('token')
        // Reset all state
        setProfileImage(null)
        setUserName('')
        setUserEmail('')
        setUserJob('')
        setUserPhone('none')
        setUserLanguages('none')
        setUserLocation('Casablanca, Morocco')
        setUserAbout('')
        setUserSkills([])
        
        // Redirect to login page with correct path
        window.location.href = '/auth/login'
        return true
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  return (
    <UserContext.Provider
      value={{
        profileImage,
        userName,
        userEmail,
        userJob,
        userPhone,
        userLanguages,
        userLocation,
        userAbout,
        userSkills,
        updateProfileImage,
        updateUserName,
        updateUserEmail,
        updateUserJob,
        updateUserPhone,
        updateUserLanguages,
        updateUserLocation,
        updateUserAbout,
        updateUserSkills,
        deleteAccount
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
