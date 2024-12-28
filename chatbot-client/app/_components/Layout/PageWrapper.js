'use client'

import { useTheme } from '@/app/_context/ThemeContext'
import { useState, useEffect } from 'react'

const PageWrapper = ({ children }) => {
  const { theme, themes } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During server-side rendering, return a basic wrapper
  if (!mounted) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className={`${themes[theme].primary} min-h-screen`}>
      {children}
    </div>
  )
}

export default PageWrapper
