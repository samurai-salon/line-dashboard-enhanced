// src/components/layout/UserStatusIndicator.jsx - ログインユーザー状態表示コンポーネント
import React from 'react';
import { Clock, Shield, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserStatusIndicator = ({ showDetails = false }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm">未ログイン</span>
      </div>
    );
  }

  const getStatusColor = () => {
    if (!user.isActive) return 'text-gray-500';
    return 'text-green-500';
  };

  const getRoleBadge = () => {
    const roleConfig = {
      super_admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'スーパー管理者' },
      admin: { bg: 'bg-red-100', text: 'text-red-800', label: '管理者' },
      manager: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'マネージャー' },
      operator: { bg: 'bg-green-100', text: 'text-green-800', label: 'オペレーター' },
      viewer: { bg: 'bg-gray-100', text: 'text-gray-800', label: '閲覧者' }
    };

    const config = roleConfig[user.role] || roleConfig.viewer;
    return config;
  };

  const roleConfig = getRoleBadge();

  return (
    <div className="flex items-center space-x-3">
      {/* オンライン状態インジケーター */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Wifi className={`h-4 w-4 ${getStatusColor()}`} />
          <div className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ${
            user.isActive ? 'bg-green-400' : 'bg-gray-400'
          } ring-1 ring-white`}></div>
        </div>
        {showDetails && (
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {user.isActive ? 'オンライン' : 'オフライン'}
          </span>
        )}
      </div>

      {/* ユーザー基本情報 */}
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-white text-xs font-semibold">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>

        {showDetails && (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {user.name || user.email?.split('@')[0] || 'ゲストユーザー'}
            </div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        )}
      </div>

      {/* ロールバッジ */}
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text}`}>
        <Shield className="h-3 w-3 mr-1" />
        {roleConfig.label}
      </span>

      {/* 最終ログイン時間（詳細表示時のみ） */}
      {showDetails && user.lastLoginAt && (
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>
            {new Date(user.lastLoginAt).toLocaleString('ja-JP', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserStatusIndicator;