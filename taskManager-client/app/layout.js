'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from './_context/ThemeContext'
import { TaskProvider } from './_context/TaskContext'
import { UserProvider } from './_context/UserContext'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <TaskProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
