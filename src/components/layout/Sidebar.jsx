
// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Bell, 
  BarChart3, 
  Users, 
  Settings, 
  MessageSquare,
  X,
  Send,
  History,
  Smile,
  FileText,
  HelpCircle,
  BookOpen,
  Bot
} from 'lucide-react';
import UserStatusIndicator from '../ui/UserStatusIndicator.jsx';

const Sidebar = ({ sidebarOpen, setSidebarOpen, userRole }) => {
  const location = useLocation();

  // ナビゲーションアイテムの定義
  const navigationItems = [
    {
      name: 'ダッシュボード',
      href: '/',
      icon: Home,
      roles: ['admin', 'manager', 'operator', 'viewer']
    },
    {
      name: 'メッセージ管理',
      href: '/messages',
      icon: MessageSquare,
      roles: ['admin', 'manager', 'operator'],
      subItems: [
        { name: 'メッセージ作成', href: '/messages' },
        { name: '一斉配信', href: '/test-broadcast' },
        { name: '配信履歴', href: '/broadcast-history' },
        { name: 'テンプレート', href: '/templates' },
        { name: '友だち獲得', href: '/friend-growth' }
      ]
    },
    {
      name: 'チャット',
      href: '/chat',
      icon: MessageSquare,
      roles: ['admin', 'manager', 'operator'],
      subItems: [
        { name: 'チャット管理', href: '/chat' },
        { name: 'LINE通話要請', href: '/call-request' },
        { name: '通話履歴', href: '/call-history' }
      ]
    },
    {
      name: '自動化',
      href: '/automation',
      icon: Bot,
      roles: ['admin', 'manager', 'operator'],
      subItems: [
        { name: '自動返信', href: '/automation/auto-reply' }
      ]
    },
    {
      name: '絵文字・スタンプ',
      href: '/emoji-manager',
      icon: Smile,
      roles: ['admin', 'manager', 'operator']
    },
    {
      name: 'ユーザー管理',
      href: '/users',
      icon: Users,
      roles: ['admin', 'manager']
    },
    {
      name: 'プッシュ通知',
      href: '/notifications',
      icon: Bell,
      roles: ['admin', 'manager', 'operator']
    },
    {
      name: '分析・統計',
      href: '/analytics',
      icon: BarChart3,
      roles: ['admin', 'manager', 'operator', 'viewer']
    },
    {
      name: 'LINE設定',
      href: '/line-settings',
      icon: Settings,
      roles: ['admin', 'manager']
    },
    {
      name: 'システム設定',
      href: '/system',
      icon: Settings,
      roles: ['admin']
    },
    {
      name: 'ヘルプ・取扱説明書',
      href: '/user-guide',
      icon: HelpCircle,
      roles: ['admin', 'manager', 'operator', 'viewer']
    }
  ];

  // ユーザーの権限に基づいてナビゲーションアイテムをフィルタリング
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* モバイル用オーバーレイ */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">サイドバーを閉じる</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent 
              navigation={filteredNavigation} 
              currentPath={location.pathname}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </div>
      )}

      {/* デスクトップ用サイドバー */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent 
          navigation={filteredNavigation} 
          currentPath={location.pathname}
        />
      </div>
    </>
  );
};

// サイドバーコンテンツコンポーネント
const SidebarContent = ({ navigation, currentPath, setSidebarOpen }) => {
  const [expandedItems, setExpandedItems] = React.useState(new Set());

  const toggleExpanded = (itemName) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/20">
      {/* ロゴエリア */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-emerald-500/90"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/50 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        <div className="flex items-center relative z-10">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-green-600 font-bold text-lg">L</span>
          </div>
          <h1 className="ml-3 text-white text-lg font-bold tracking-wide">
            LINE管理
          </h1>
        </div>
      </div>

      {/* ナビゲーションメニュー */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = currentPath === item.href || 
                           (item.href !== '/' && currentPath.startsWith(item.href));
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItems.has(item.name);
            
            return (
              <div key={item.name}>
                {/* メインアイテム */}
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-md'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 transition-all duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-500'
                      }`}
                    />
                    <span className="flex-1 text-left">{item.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'transform rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <NavLink
                    to={item.href}
                    onClick={() => setSidebarOpen && setSidebarOpen(false)}
                    className={({ isActive: navIsActive }) => {
                      const active = isActive || navIsActive;
                      return `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-md'
                      }`;
                    }}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 transition-all duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-500'
                      }`}
                    />
                    {item.name}
                  </NavLink>
                )}

                {/* サブアイテム */}
                {hasSubItems && isExpanded && (
                  <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {item.subItems.map((subItem) => {
                      const isSubActive = currentPath === subItem.href;
                      return (
                        <NavLink
                          key={subItem.name}
                          to={subItem.href}
                          onClick={() => setSidebarOpen && setSidebarOpen(false)}
                          className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            isSubActive
                              ? 'bg-green-50 text-green-700 font-medium shadow-sm border-l-2 border-green-400'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:translate-x-1'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 transition-colors duration-200 ${
                            isSubActive ? 'bg-green-400' : 'bg-gray-300'
                          }`} />
                          {subItem.name}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ユーザーステータス */}
        <div className="flex-shrink-0 border-t border-gray-200/50 p-4">
          <UserStatusIndicator />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;