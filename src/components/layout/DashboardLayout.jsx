
// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import MobileNavigation from '../ui/MobileNavigation.jsx';
import MobileBottomNavigation from '../ui/MobileBottomNavigation.jsx';
import { useAuth } from '../../context/AuthContext.js';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* フルスクリーンメインコンテンツエリア */}
      <div className="flex flex-col min-h-screen">
        {/* ヘッダー */}
        <Header showMenuButton={false} />
        
        {/* ページコンテンツ - ボトムナビゲーション分のマージンを追加 */}
        <main className="flex-1 relative pb-16">
          {/* 背景装飾 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/15 to-blue-600/15 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 py-6 sm:py-8">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* 全画面対応ボトムナビゲーション */}
      <MobileBottomNavigation />
    </div>
  );
};

export default DashboardLayout;