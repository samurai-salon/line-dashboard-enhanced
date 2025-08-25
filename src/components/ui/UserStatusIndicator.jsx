// src/components/ui/UserStatusIndicator.jsx - スタイリッシュなユーザーステータス表示
import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Shield, Crown, Star, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import useResponsive from '../../hooks/useResponsive.js';

const UserStatusIndicator = ({ showDetails = false }) => {
  const { user, logout } = useAuth();
  const { isMobile } = useResponsive();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // クリック外でメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ロール別のアイコンとカラー
  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return {
          icon: Crown,
          label: '管理者',
          bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-600',
          textColor: 'text-purple-600',
          bgLight: 'bg-purple-50'
        };
      case 'manager':
        return {
          icon: Shield,
          label: 'マネージャー',
          bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
          textColor: 'text-blue-600',
          bgLight: 'bg-blue-50'
        };
      case 'operator':
        return {
          icon: Star,
          label: 'オペレーター',
          bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
          textColor: 'text-green-600',
          bgLight: 'bg-green-50'
        };
      default:
        return {
          icon: User,
          label: 'ユーザー',
          bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
          textColor: 'text-gray-600',
          bgLight: 'bg-gray-50'
        };
    }
  };

  const roleInfo = getRoleInfo(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="relative" ref={userMenuRef}>
      {/* ユーザーボタン */}
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-xl transition-all duration-200 group"
      >
        {/* アバター */}
        <div className="relative">
          <div className={`w-10 h-10 rounded-xl ${roleInfo.bgColor} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          {/* オンライン状態インジケーター */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
        </div>

        {/* ユーザー情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.company || user?.name || 'ユーザー'}
            </p>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.bgLight} ${roleInfo.textColor}`}>
              <RoleIcon className="h-3 w-3 mr-1" />
              {roleInfo.label}
            </div>
          </div>
          <p className="text-xs text-gray-500 truncate">
            {user?.department || user?.email || 'user@example.com'}
          </p>
        </div>

        {/* 展開アイコン */}
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            showUserMenu ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* ユーザーメニュードロップダウン */}
      {showUserMenu && (
        <div className={`absolute right-0 ${isMobile ? 'bottom-full mb-2' : 'top-full mt-2'} w-64 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 animate-in slide-in-from-bottom-2 duration-200 z-50`}>
          <div className="p-4 border-b border-gray-100">
            {/* ユーザープロフィール詳細 */}
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl ${roleInfo.bgColor} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {user?.company || user?.name || 'ユーザー'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.department || user?.email || 'user@example.com'}
                </p>
                {user?.email && (
                  <p className="text-xs text-gray-400 mt-1">
                    {user.email}
                  </p>
                )}
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${roleInfo.bgLight} ${roleInfo.textColor}`}>
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {roleInfo.label}
                </div>
              </div>
            </div>

            {/* 統計情報 */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-lg font-semibold text-gray-900">147</div>
                <div className="text-xs text-gray-500">送信メッセージ</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-lg font-semibold text-gray-900">23</div>
                <div className="text-xs text-gray-500">今日のアクティビティ</div>
              </div>
            </div>
          </div>

          {/* メニューアイテム */}
          <div className="p-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <Settings className="h-4 w-4 text-gray-500" />
              <span>設定</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <User className="h-4 w-4 text-gray-500" />
              <span>プロフィール</span>
            </button>
            
            <hr className="my-2 border-gray-100" />
            
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
            >
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatusIndicator;