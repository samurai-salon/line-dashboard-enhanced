// src/pages/Dashboard.jsx - ダッシュボードページ（ユーザー情報表示付き）
import React from 'react';
import { 
  Users, MessageSquare, BarChart3, Settings,
  TrendingUp, Clock, Bell, Shield, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserStatusIndicator from '../components/ui/UserStatusIndicator.jsx';

const Dashboard = () => {
  const { user, hasPermission, PERMISSIONS } = useAuth();

  // 統計データ（デモ）
  const stats = [
    {
      title: '総ユーザー数',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'メッセージ送信数',
      value: '8,567',
      change: '+23%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-green-500'
    },
    {
      title: '開封率',
      value: '84.2%',
      change: '+5%',
      changeType: 'increase',
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'アクティブ率',
      value: '92.1%',
      change: '-2%',
      changeType: 'decrease',
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

  // 最近の活動（デモ）
  const recentActivities = [
    {
      id: 1,
      action: '新規ユーザー登録',
      user: '田中 太郎',
      time: '5分前',
      type: 'user'
    },
    {
      id: 2,
      action: 'プッシュ通知送信',
      user: '佐藤 花子',
      time: '10分前',
      type: 'message'
    },
    {
      id: 3,
      action: 'システム設定変更',
      user: '鈴木 一郎',
      time: '30分前',
      type: 'system'
    }
  ];

  return (
    <div className="space-y-6">
      {/* ウェルカムヘッダー */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-blue-500 rounded-2xl shadow-xl shadow-green-500/20 p-8 text-white relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/50 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              おかえりなさい、{user?.name || user?.email?.split('@')[0] || 'ユーザー'}さん！
            </h1>
            <p className="text-white/90 mt-2 text-lg">
              LINE ダッシュボードへようこそ。今日も素晴らしい一日をお過ごしください。
            </p>
          </div>
          <div className="hidden md:block">
            <UserStatusIndicator showDetails={true} />
          </div>
        </div>
        
        {/* ログイン情報 */}
        <div className="mt-6 pt-6 border-t border-white/20 relative z-10">
          <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>
                最終ログイン: {user?.lastLoginAt 
                  ? new Date(user.lastLoginAt).toLocaleString('ja-JP')
                  : '初回ログイン'
                }
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>権限レベル: {
                user?.role === 'super_admin' ? 'スーパー管理者' :
                user?.role === 'admin' ? '管理者' :
                user?.role === 'manager' ? 'マネージャー' :
                user?.role === 'operator' ? 'オペレーター' : '閲覧者'
              }</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>状態: {user?.isActive ? 'アクティブ' : '無効'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/20 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:scale-105 transition-transform">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-6 flex items-center">
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                stat.changeType === 'increase' 
                  ? 'text-emerald-700 bg-emerald-50' 
                  : 'text-red-700 bg-red-50'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">前月比</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近の活動 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/20">
          <div className="p-6 border-b border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                <Bell className="h-4 w-4 text-white" />
              </div>
              最近の活動
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50/50 transition-colors group">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                    activity.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                    activity.type === 'message' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                    'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  }`}>
                    {activity.type === 'user' ? <Users className="h-5 w-5" /> :
                     activity.type === 'message' ? <MessageSquare className="h-5 w-5" /> :
                     <Settings className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">{activity.action}</p>
                    <p className="text-xs text-gray-500">実行者: {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/20">
          <div className="p-6 border-b border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              クイックアクション
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {hasPermission(PERMISSIONS.USER_CREATE) && (
                <button className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 rounded-2xl hover:from-blue-100 hover:to-blue-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">ユーザー追加</span>
                </button>
              )}
              
              {hasPermission(PERMISSIONS.MESSAGE_SEND) && (
                <button className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200/50 rounded-2xl hover:from-green-100 hover:to-emerald-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">メッセージ送信</span>
                </button>
              )}
              
              <button className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50 rounded-2xl hover:from-purple-100 hover:to-purple-200 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">分析レポート</span>
              </button>
              
              {hasPermission(PERMISSIONS.SETTINGS_MANAGE) && (
                <button className="flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200/50 rounded-2xl hover:from-orange-100 hover:to-orange-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">システム設定</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;