"use client"
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { useNotification } from './Notification';
import { Home, LogIn, LogOut, Package, Settings } from 'lucide-react';
import Link from 'next/link';

function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignout = async () => {
    try {
      await signOut();
      showNotification('Signed out successfully', 'success');
    } catch (error) {
      showNotification('Failed to sign out', 'error');
      console.error('Error signing out:', error);
    }
  }

  //navbar with a link to / and notification --> welcome to imagekitshop
  //sessio? --> user's email
  //if session.user.role ==="admin" , a link to admin dashboard
  // link to /orders
  //signout button (if session) else login button 

  return (
    <nav className="fixed top-0 left-0 w-full border-b border-white/20 bg-white/10 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section with logo and primary links */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">ImageKitShop</span>
            </Link>
          </div>

          {/* Center section with navigation links */}
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
            {session ? (
              <>
                <span className="hidden md:block text-sm text-gray-300">
                  {session.user.email}
                </span>
                <button
                  onClick={handleSignout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

}

export default Header