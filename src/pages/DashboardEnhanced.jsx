import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, MessageSquare, Send, TrendingUp, Eye, Clock, 
  Smile, Star, BarChart3, Calendar, ArrowUpRight, ArrowDownRight,
  Activity, Target, Bell, CheckCircle
} from 'lucide-react';

const DashboardEnhanced = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [recentActivity] = useState([
    {
      id: 1,
      type: 'broadcast',
      title: '新商品キャンペーン配信',
      time: '2時間前',
      status: 'completed',
      recipients: 4090,
      openRate: 67
    },
    {
      id: 2,
      type: 'emoji',
      title: '🎉 絵文字が230回使用されました',
      time: '3時間前',
      status: 'info'
    },
    {
      id: 3,
      type: 'user',
      title: '新規ユーザー: 田中様が友達追加',
      time: '5時間前',
      status: 'success'
    }
  ]);

  const [popularEmojis] = useState([
    { emoji: '😊', name: 'スマイル', count: 245 },
    { emoji: '👍', name: 'いいね', count: 198 },
    { emoji: '❤️', name: 'ハート', count: 187 },
    { emoji: '🎉', name: 'お祝い', count: 156 },
    { emoji: '🙏', name: 'お願い', count: 134 }
  ]);

  const statsData = {
    '7d': {
      followers: { current: 4090, change: +8.2, changeType: 'increase' },
      messages: { current: 456, change: +12.5, changeType: 'increase' },
      broadcasts: { current: 12, change: +3, changeType: 'increase' },
      engagement: { current: 73.2, change: -2.1, changeType: 'decrease' },
      emojiUsage: { current: 1234, change: +15.8, changeType: 'increase' },
      openRate: { current: 67.8, change: +4.3, changeType: 'increase' }
    }
  };

  const currentStats = statsData[timeRange];

  const StatCard = ({ title, value, change, changeType, icon: Icon, color, suffix = '' }) => (
    <div className="stats-card bg-white p-6 md:p-6 mobile-padding-lg rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="title text-sm md:text-sm mobile-text-base font-medium text-gray-600 mb-2">
            {title}
          </p>
          <p className="value text-3xl md:text-3xl mobile-text-2xl font-bold text-gray-900 mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center mobile-text-sm ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              <span className="subtitle text-sm font-medium">
                {Math.abs(change)}% vs 先週
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 mobile-touch-target`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-6 mobile-padding space-y-6 bg-gray-50 min-h-screen mobile-content">
      {/* ヘッダー */}
      <div className="mobile-header md:bg-transparent md:border-none md:shadow-none md:p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-3xl mobile-text-xl font-bold text-gray-900">📊 ダッシュボード</h1>
            <p className="text-gray-600 mt-1 mobile-text-sm">LINE管理システムの総合統計</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 mobile-touch-target border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mobile-text-base"
            >
              <option value="24h">過去24時間</option>
              <option value="7d">過去7日間</option>
              <option value="30d">過去30日間</option>
              <option value="90d">過去90日間</option>
            </select>
          </div>
        </div>
      </div>

      {/* クイックアクション - 上部に移動 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">クイックアクション</h3>
          <Target className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Link 
            to="/test-broadcast"
            className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mobile-touch-target"
          >
            <Send className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-xs font-medium text-blue-900 text-center">新規配信作成</span>
          </Link>
          
          <Link 
            to="/messages"
            className="flex flex-col items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors mobile-touch-target"
          >
            <MessageSquare className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-xs font-medium text-green-900 text-center">メッセージ管理</span>
          </Link>
          
          <Link 
            to="/chat"
            className="flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors mobile-touch-target"
          >
            <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-xs font-medium text-purple-900 text-center">チャット</span>
          </Link>
          
          <Link 
            to="/users"
            className="flex flex-col items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors mobile-touch-target"
          >
            <Users className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-xs font-medium text-orange-900 text-center">ユーザー管理</span>
          </Link>
          
          <Link 
            to="/analytics"
            className="flex flex-col items-center p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors mobile-touch-target"
          >
            <BarChart3 className="w-6 h-6 text-indigo-600 mb-2" />
            <span className="text-xs font-medium text-indigo-900 text-center">詳細分析</span>
          </Link>
          
          <Link 
            to="/emoji-manager"
            className="flex flex-col items-center p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors mobile-touch-target"
          >
            <Smile className="w-6 h-6 text-yellow-600 mb-2" />
            <span className="text-xs font-medium text-yellow-900 text-center">絵文字管理</span>
          </Link>
        </div>
      </div>

      {/* 主要統計カード */}
      <div className="mobile-grid mobile-grid-1 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        <StatCard
          title="総フォロワー"
          value={currentStats.followers.current}
          change={currentStats.followers.change}
          changeType={currentStats.followers.changeType}
          icon={Users}
          color="blue"
        />
        
        <StatCard
          title="メッセージ数"
          value={currentStats.messages.current}
          change={currentStats.messages.change}
          changeType={currentStats.messages.changeType}
          icon={MessageSquare}
          color="green"
        />
        
        <StatCard
          title="配信回数"
          value={currentStats.broadcasts.current}
          change={currentStats.broadcasts.change}
          changeType={currentStats.broadcasts.changeType}
          icon={Send}
          color="purple"
        />
        
        <StatCard
          title="エンゲージメント率"
          value={currentStats.engagement.current}
          change={currentStats.engagement.change}
          changeType={currentStats.engagement.changeType}
          icon={TrendingUp}
          color="orange"
          suffix="%"
        />
        
        <StatCard
          title="絵文字使用回数"
          value={currentStats.emojiUsage.current}
          change={currentStats.emojiUsage.change}
          changeType={currentStats.emojiUsage.changeType}
          icon={Smile}
          color="yellow"
        />
        
        <StatCard
          title="開封率"
          value={currentStats.openRate.current}
          change={currentStats.openRate.change}
          changeType={currentStats.openRate.changeType}
          icon={Eye}
          color="indigo"
          suffix="%"
        />
      </div>

      {/* 詳細統計エリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 最近のアクティビティ */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">最近のアクティビティ</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'completed' ? 'bg-green-400' :
                  activity.status === 'info' ? 'bg-blue-400' : 'bg-yellow-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  {activity.recipients && (
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.recipients.toLocaleString()}人に配信 • 開封率{activity.openRate}%
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 人気絵文字ランキング */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">人気絵文字ランキング</h3>
            <Star className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {popularEmojis.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-4">
                    #{index + 1}
                  </span>
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {item.count}回
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 追加の詳細メニュー */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">詳細メニュー</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link 
              to="/broadcast-history"
              className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">配信履歴</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-orange-600" />
            </Link>
            
            <Link 
              to="/notifications"
              className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">プッシュ通知</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-red-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* 配信パフォーマンスチャート風表示 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">配信パフォーマンス概要</h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600">総配信数</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">11</p>
            <p className="text-sm text-gray-600">成功配信</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">67.8%</p>
            <p className="text-sm text-gray-600">平均開封率</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">4,090</p>
            <p className="text-sm text-gray-600">総リーチ数</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEnhanced;