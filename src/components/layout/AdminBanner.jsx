// src/components/layout/AdminBanner.jsx - 管理者情報バナー
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Settings, User, LogOut, Crown, Shield, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

const AdminBanner = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // クリック外でドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
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
          bgColor: 'bg-red-500',
          textColor: 'text-red-600',
          bgLight: 'bg-red-50'
        };
      case 'manager':
        return {
          icon: Shield,
          label: 'マネージャー',
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-600',
          bgLight: 'bg-blue-50'
        };
      case 'operator':
        return {
          icon: Star,
          label: 'オペレーター',
          bgColor: 'bg-green-500',
          textColor: 'text-green-600',
          bgLight: 'bg-green-50'
        };
      default:
        return {
          icon: User,
          label: 'ユーザー',
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-600',
          bgLight: 'bg-gray-50'
        };
    }
  };

  const roleInfo = getRoleInfo(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="relative">
      {/* 管理者バナー - 案2: コンパクト統合レイアウト */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* 第1行: 会社名 | システム名 - シンプル版 */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-base md:text-lg font-bold flex items-center space-x-3">
                  <span>Samurai Arc.株式会社</span>
                  <span className="text-blue-200">|</span>
                  <span className="text-blue-100 font-medium text-sm md:text-base">LINE管理システム</span>
                </h1>
              </div>
            </div>

            {/* 第2行: ユーザー情報 */}
            <div className="flex items-center justify-between">
              <div className="flex-1"></div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                >
                  {/* アバター */}
                  <div className={`w-7 h-7 ${roleInfo.bgColor} rounded-lg flex items-center justify-center shadow-sm`}>
                    <span className="text-white font-semibold text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>

                  {/* ユーザー情報 */}
                  <div className="text-left">
                    <div className="text-xs md:text-sm font-medium flex items-center space-x-1 md:space-x-2">
                      <span className="hidden sm:inline">{user?.name || user?.email?.split('@')[0] || '管理者'}</span>
                      <span className="hidden sm:inline text-blue-200">-</span>
                      <span className="text-blue-100">{roleInfo.label}</span>
                    </div>
                  </div>

                  {/* 展開アイコン */}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    showDropdown ? 'transform rotate-180' : ''
                  }`} />
                </button>

              {/* ドロップダウンメニュー */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-200">
                    {/* ユーザープロフィール詳細 */}
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${roleInfo.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-semibold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name || '管理者'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email || 'admin@samuraiarc.com'}
                        </p>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${roleInfo.bgLight} ${roleInfo.textColor}`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleInfo.label}
                        </div>
                      </div>
                    </div>

                    {/* 会社情報 */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs font-medium text-blue-900">所属企業</div>
                      <div className="text-sm font-semibold text-blue-800">Samurai Arc.株式会社</div>
                    </div>
                  </div>

                  {/* メニューアイテム */}
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>プロフィール</span>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span>設定</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBanner;