'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, ChevronDown,  Menu, Settings, LogOut, HelpCircle, UserCircle, Shield } from 'lucide-react';
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { useRouter } from 'next/navigation';


interface HeaderProps {
  isSidebarCollapsed: boolean;
  onMobileMenuToggle?: () => void;
  onDesktopToggle?: () => void;
}

export function Header({ isSidebarCollapsed, onMobileMenuToggle, onDesktopToggle }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    // Clear any stored user data, tokens, etc.
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Redirect to login page
    router.push('/login');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.header
      layout
      className="
        bg-[#fefefe]
        h-16 flex items-center justify-between px-4 lg:px-2
        relative z-20
      "
    >
      {/* Left section */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuToggle}
          className="
            lg:hidden p-2 rounded-lg transition-all duration-150 ease-in-out
            hover:bg-gray-100
            text-gray-500
            hover:text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle button */}
        <button
          onClick={onDesktopToggle}
          className="
            hidden lg:flex rounded-lg transition-all duration-150 ease-in-out
            hover:bg-gray-100
            text-gray-500
            hover:text-gray-700
            cursor-pointer
            mt-1
          "
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {
            isSidebarCollapsed ? (
              <TbLayoutSidebarRightCollapse className='w-5 h-5' />
            ) : (
              <TbLayoutSidebarLeftCollapse className='w-5 h-5' />
            )
          }
        </button>
        
        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-gray-500">Dashboard</span>
          <ChevronDown className="w-4 h-4 text-gray-500 rotate-[-90deg]" />
          <span className="text-gray-900 font-medium">Overview</span>
        </nav>
        
        {/* Mobile title */}
        <div className="sm:hidden">
          <h1 className="text-lg font-semibold text-gray-900">PolyTex SCM</h1>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-xl mx-4 lg:mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--qb-sidebar-text-muted)]" />
          <input
            type="text"
            placeholder="Search transactions, customers, and more..."
            className="
              w-full pl-10 pr-4 py-2.5
              bg-[var(--input)] border border-[var(--border)]
              rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-[var(--qb-blue-primary)]
              focus:border-transparent
              placeholder:text-[var(--qb-sidebar-text-muted)]
              qb-transition-fast
            "
          />
        </div>
      </div>

      {/* Mobile search button */}
      <div className="md:hidden">
        <button
          className="
            p-2 rounded-lg qb-transition-fast
            hover:bg-[var(--qb-sidebar-hover)]
            text-[var(--qb-sidebar-text-muted)]
            hover:text-[var(--qb-sidebar-text)]
            focus-ring
          "
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 lg:gap-4">

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            relative p-2 rounded-lg
            hover:bg-[var(--qb-sidebar-hover)]
            qb-transition-fast focus-ring
          "
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[var(--qb-sidebar-text-muted)]" />
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="
              absolute -top-1 -right-1 w-3 h-3
              bg-[var(--qb-red)] rounded-full
              flex items-center justify-center
            "
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </motion.span>
        </motion.button>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <motion.button
            onClick={handleUserMenuToggle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              flex items-center gap-2 p-2 rounded-lg
              hover:bg-[var(--qb-sidebar-hover)]
              qb-transition-fast focus-ring
            "
            aria-label="User menu"
            aria-expanded={isUserMenuOpen}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--qb-blue-primary)] to-[var(--qb-blue-dark)] rounded-full flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <motion.div
              animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block"
            >
              <ChevronDown className="w-4 h-4 text-[var(--qb-sidebar-text-muted)]" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="
                  absolute right-0 top-full mt-2 w-64
                  bg-white border border-[var(--border)]
                  rounded-lg shadow-lg z-50
                  overflow-hidden
                "
              >
                {/* User info section */}
                <div className="p-4 border-b border-[var(--border)] bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--qb-blue-primary)] to-[var(--qb-blue-dark)] rounded-full flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        John Doe
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        john.doe@polytex.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <motion.button
                    whileHover={{ backgroundColor: "var(--qb-sidebar-hover)" }}
                    className="
                      w-full flex items-center gap-3 px-4 py-2.5
                      text-left text-sm text-gray-700
                      hover:text-gray-900 qb-transition-fast
                    "
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <UserCircle className="w-4 h-4 text-gray-500" />
                    <span>My Profile</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ backgroundColor: "var(--qb-sidebar-hover)" }}
                    className="
                      w-full flex items-center gap-3 px-4 py-2.5
                      text-left text-sm text-gray-700
                      hover:text-gray-900 qb-transition-fast
                    "
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Account Settings</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ backgroundColor: "var(--qb-sidebar-hover)" }}
                    className="
                      w-full flex items-center gap-3 px-4 py-2.5
                      text-left text-sm text-gray-700
                      hover:text-gray-900 qb-transition-fast
                    "
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span>Security & Privacy</span>
                  </motion.button>

                  <div className="my-1 border-t border-[var(--border)]"></div>

                  <motion.button
                    whileHover={{ backgroundColor: "var(--qb-sidebar-hover)" }}
                    className="
                      w-full flex items-center gap-3 px-4 py-2.5
                      text-left text-sm text-gray-700
                      hover:text-gray-900 qb-transition-fast
                    "
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                    <span>Help & Support</span>
                  </motion.button>

                  <div className="my-1 border-t border-[var(--border)]"></div>

                  <motion.button
                    whileHover={{ backgroundColor: "var(--qb-red-light)" }}
                    className="
                      w-full flex items-center gap-3 px-4 py-2.5
                      text-left text-sm text-red-600
                      hover:text-red-700 qb-transition-fast
                    "
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
