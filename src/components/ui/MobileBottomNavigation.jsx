// src/components/ui/MobileBottomNavigation.jsx - モバイル専用ボトムナビゲーション
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, MessageSquare, Users, Send, BarChart3, Settings 
} from 'lucide-react';

const MobileBottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'ホーム' },
    { path: '/messages', icon: MessageSquare, label: 'メッセージ' },
    { path: '/chats', icon: MessageSquare, label: 'チャット' },
    { path: '/users', icon: Users, label: 'ユーザー' },
    { path: '/analytics', icon: BarChart3, label: '分析' },
    { path: '/settings', icon: Settings, label: '設定' }
  ];

  return (
    <nav className="mobile-nav md:hidden">
      <div className="grid grid-cols-6 h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;