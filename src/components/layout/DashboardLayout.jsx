
// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import MobileNavigation from '../ui/MobileNavigation.jsx';
import MobileBottomNavigation from '../ui/MobileBottomNavigation.jsx';
import { useAuth } from '../../context/AuthContext.js';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* サイドバー */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        userRole={user?.role}
      />
      
      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* ヘッダー */}
        <Header 
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* ページコンテンツ */}
        <main className="flex-1 relative">
          {/* 背景装飾 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/15 to-blue-600/15 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>

        {/* モバイル専用ナビゲーション */}
        <MobileNavigation userRole={user?.role} />
      </div>
      
      {/* モバイルボトムナビゲーション */}
      <MobileBottomNavigation />
    </div>
  );
};

export default DashboardLayout;