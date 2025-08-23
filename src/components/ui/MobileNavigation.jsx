// src/components/ui/MobileNavigation.jsx - モバイル専用ナビゲーション
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, MessageSquare, Users, Bell, BarChart3, 
  Settings, Menu, X, ChevronUp 
} from 'lucide-react';
import useResponsive from '../../hooks/useResponsive';

const MobileNavigation = ({ userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMobile } = useResponsive();

  // モバイルでない場合は表示しない
  if (!isMobile) return null;

  const primaryNavItems = [
    { name: 'ダッシュボード', href: '/', icon: Home, roles: ['admin', 'manager', 'operator', 'viewer'] },
    { name: 'メッセージ', href: '/messages', icon: MessageSquare, roles: ['admin', 'manager', 'operator'] },
    { name: 'ユーザー', href: '/users', icon: Users, roles: ['admin', 'manager'] },
    { name: '分析', href: '/analytics', icon: BarChart3, roles: ['admin', 'manager', 'operator', 'viewer'] },
  ];

  const secondaryNavItems = [
    { name: '通知', href: '/notifications', icon: Bell, roles: ['admin', 'manager', 'operator'] },
    { name: '設定', href: '/system', icon: Settings, roles: ['admin'] },
  ];

  const filteredPrimaryItems = primaryNavItems.filter(item => item.roles.includes(userRole));
  const filteredSecondaryItems = secondaryNavItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* メイン固定ナビゲーションバー */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
        <div className="px-4 py-2">
          <div className="flex items-center justify-around">
            {filteredPrimaryItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex flex-col items-center px-3 py-2 text-xs font-medium transition-all duration-200 rounded-xl ${
                    isActive
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-green-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="truncate max-w-[50px]">{item.name}</span>
              </NavLink>
            ))}
            
            {/* 展開ボタン */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 transition-all duration-200 rounded-xl"
            >
              {isExpanded ? <ChevronUp className="h-5 w-5 mb-1" /> : <Menu className="h-5 w-5 mb-1" />}
              <span>その他</span>
            </button>
          </div>
        </div>

        {/* 展開可能なセカンダリメニュー */}
        {isExpanded && (
          <div className="border-t border-gray-200/50 bg-white/98 backdrop-blur-xl">
            <div className="px-4 py-3">
              <div className="grid grid-cols-2 gap-2">
                {filteredSecondaryItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsExpanded(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
                        isActive
                          ? 'text-green-600 bg-green-50 shadow-sm'
                          : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* コンテンツの底部マージン */}
      <div className="h-20" />
    </>
  );
};

export default MobileNavigation;