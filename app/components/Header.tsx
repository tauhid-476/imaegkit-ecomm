"use client"
import { signOut, useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { useNotification } from './Notification'
import { Camera, LogIn, LogOut, Menu, Package, Settings, X } from 'lucide-react'
import Link from 'next/link'

function Header() {
  const { data: session } = useSession()
  const { showNotification } = useNotification()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignout = async () => {
    try {
      await signOut()
      showNotification('Signed out successfully', 'success')
    } catch (error) {
      showNotification('Failed to sign out', 'error')
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full border-b border-white/20 bg-white/10 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section with logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Snap Cart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/orders"
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <Package className="h-5 w-5" />
              <span>Orders</span>
            </Link>

            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Right section with user info and auth */}
          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-sm text-gray-300">
              {session?.user?.email}
            </span>
            
            {session ? (
              <button
                onClick={handleSignout}
                className="hidden md:flex items-center space-x-1 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center space-x-1 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4 px-2">
              <Link
                href="/orders"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="h-5 w-5" />
                <span>Orders</span>
              </Link>

              {session?.user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {session && (
                <>
                  <div className="text-sm text-gray-300 py-2">
                    {session.user.email}
                  </div>
                  <button
                    onClick={() => {
                      handleSignout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}

              {!session && (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header