'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Responsive Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
        theme="legacy-dark"
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <Header 
          isSidebarCollapsed={isSidebarCollapsed} 
          onMobileMenuToggle={toggleMobileSidebar}
          onDesktopToggle={toggleSidebar}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-[#fefefe]">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
