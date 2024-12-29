import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Define protected routes that require authentication
  const protectedPaths = ['/overview', '/profile', '/calendar', '/list', '/contact', '/guide', '/settings']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  // Define authentication paths (login/register)
  const authPaths = ['/auth/login', '/auth/register']
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))

  // Redirect authenticated users trying to access auth pages to overview
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/overview', request.url))
  }

  // Redirect unauthenticated users trying to access protected pages to login
  if (isProtectedPath && !token) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete('token') // Clear any invalid tokens
    return response
  }

  return NextResponse.next()
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    '/overview/:path*',
    '/profile/:path*',
    '/calendar/:path*',
    '/list/:path*',
    '/contact/:path*',
    '/guide/:path*',
    '/settings/:path*',
    '/auth/:path*'
  ]
}
