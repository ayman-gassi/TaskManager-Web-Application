'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  themes: {},
  changeTheme: () => {},
})

export const themes = {
  light: {
    primary: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50',
    secondary: 'bg-gray-50',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    accentText: 'text-white',
    focus: 'focus:ring-blue-500'
  },
  dark: {
    primary: 'bg-gray-800',
    text: 'text-white',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
    secondary: 'bg-gray-700',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    accentText: 'text-white',
    focus: 'focus:ring-blue-400'
  },
  blue: {
    primary: 'bg-blue-50',
    text: 'text-gray-900',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100',
    secondary: 'bg-blue-100',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    accentText: 'text-white',
    focus: 'focus:ring-blue-500'
  },
  green: {
    primary: 'bg-green-50',
    text: 'text-gray-900',
    border: 'border-green-200',
    hover: 'hover:bg-green-100',
    secondary: 'bg-green-100',
    accent: 'bg-[#158B41]',
    accentHover: 'hover:bg-[#107235]',
    accentText: 'text-white',
    focus: 'focus:ring-[#158B41]'
  }
}

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('light')

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('calendar-theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  const changeTheme = (newTheme) => {
    if (themes[newTheme]) {
      setCurrentTheme(newTheme)
      localStorage.setItem('calendar-theme', newTheme)
    }
  }

  const value = {
    theme: currentTheme,
    themes,
    changeTheme,
  }

  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
