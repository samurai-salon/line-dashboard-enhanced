
// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // クリック外でメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mockNotifications = [
    { id: 1, message: '新しいユーザーが登録されました', time: '5分前', unread: true },
    { id: 2, message: 'プッシュ通知の送信が完了しました', time: '10分前', unread: true },
    { id: 3, message: 'システムメンテナンスのお知らせ', time: '1時間前', unread: false },
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <div className="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50">
      {/* モバイルメニューボタン */}
      <button
        type="button"
        className="px-4 border-r border-gray-200/50 text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden transition-all duration-200"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">サイドバーを開く</span>
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1 px-4 flex justify-between">
        {/* 検索バー */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-lg mx-auto">
            <label htmlFor="search-field" className="sr-only">検索</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search-field"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-200"
                placeholder="検索..."
                type="search"
              />
            </div>
          </div>
        </div>

        {/* 右側のメニュー */}
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          {/* 通知ベル */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 rounded-xl bg-gray-50/50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="sr-only">通知を表示</span>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs flex items-center justify-center font-bold shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 通知ドロップダウン */}
            {showNotifications && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">通知</h3>
                  </div>
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}
                    >
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-green-600 hover:text-green-900">
                      すべて表示
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ユーザーメニュー */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="sr-only">ユーザーメニューを開く</span>
              {/* アバター画像 */}
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              {/* ユーザー情報 */}
              <div className="ml-3 hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email?.split('@')[0] || 'ゲストユーザー'}
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <span>{user?.email || 'メールアドレスなし'}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                    user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                    user?.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                    user?.role === 'operator' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user?.role === 'super_admin' ? 'スーパー管理者' :
                     user?.role === 'admin' ? '管理者' :
                     user?.role === 'manager' ? 'マネージャー' :
                     user?.role === 'operator' ? 'オペレーター' : '閲覧者'}
                  </span>
                </div>
              </div>
              
              {/* ドロップダウン矢印 */}
              <svg className="ml-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* ユーザードロップダウン */}
            {showUserMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {/* ユーザー詳細ヘッダー */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-semibold">
                            {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name || user?.email?.split('@')[0] || 'ゲストユーザー'}
                        </p>
                        <p className="text-xs text-gray-600">{user?.email || 'メールアドレスなし'}</p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user?.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                            user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user?.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                            user?.role === 'operator' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user?.role === 'super_admin' ? 'スーパー管理者' :
                             user?.role === 'admin' ? '管理者' :
                             user?.role === 'manager' ? 'マネージャー' :
                             user?.role === 'operator' ? 'オペレーター' : '閲覧者'}
                          </span>
                          {user?.isActive !== undefined && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.isActive ? 'アクティブ' : '無効'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {user?.lastLoginAt && (
                      <div className="mt-2 text-xs text-gray-500">
                        最終ログイン: {new Date(user.lastLoginAt).toLocaleString('ja-JP')}
                      </div>
                    )}
                  </div>
                  <a
                    href="/profile"
                    className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                    プロフィール
                  </a>
                  <a
                    href="/settings"
                    className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                    設定
                  </a>
                  <button
                    onClick={logout}
                    className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                    ログアウト
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;