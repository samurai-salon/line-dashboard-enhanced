// src/components/ui/MobileBottomNavigation.jsx - モバイル専用ボトムナビゲーション
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, MessageSquare, Users, BarChart3, Settings, Bell, Bot, Smile, HelpCircle
} from 'lucide-react';

const MobileBottomNavigation = () => {
  const location = useLocation();

  // サイドバーの全メニューを下部ナビゲーション用に最適化
  const navItems = [
    { path: '/', icon: Home, label: 'ダッシュボード' },
    { path: '/messages', icon: MessageSquare, label: 'メッセージ管理' },
    { path: '/chat', icon: MessageSquare, label: 'チャット' },
    { path: '/automation/auto-reply', icon: Bot, label: '自動化' },
    { path: '/emoji-manager', icon: Smile, label: '絵文字' },
    { path: '/users', icon: Users, label: 'ユーザー管理' },
    { path: '/notifications', icon: Bell, label: 'プッシュ通知' },
    { path: '/analytics', icon: BarChart3, label: '分析・統計' },
    { path: '/line-settings', icon: Settings, label: 'LINE設定' },
    { path: '/system', icon: Settings, label: 'システム設定' },
    { path: '/user-guide', icon: HelpCircle, label: 'ヘルプ' }
  ];

  return (
    <nav className="mobile-nav md:hidden">
      {/* 横スクロール可能なナビゲーション */}
      <div className="flex overflow-x-auto h-full px-2 scrollbar-hide">
        <div className="flex space-x-1 min-w-max h-full items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item flex-shrink-0 ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;