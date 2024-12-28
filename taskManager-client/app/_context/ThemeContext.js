'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const themes = {
  light: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50',
    accent: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-100',
      green: 'bg-green-500 text-white',
      red: 'bg-red-500 text-white',
      yellow: 'bg-yellow-500 text-white'
    }
  },
  dark: {
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-800',
    accent: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-800',
      green: 'bg-green-600 text-white',
      red: 'bg-red-600 text-white',
      yellow: 'bg-yellow-600 text-white'
    }
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Check if user has theme preference in localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check if user prefers dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const value = {
    theme,
    themes,
    changeTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
