import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, MessageSquare, Send, TrendingUp, Eye, Clock, 
  BarChart3, Calendar, ArrowUpRight, ArrowDownRight,
  Activity, Target, Bell, CheckCircle, Mail, MailOpen
} from 'lucide-react';

const DashboardEnhanced = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMessageCategory, setSelectedMessageCategory] = useState(null);
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
      type: 'message',
      title: '新しいメッセージが15件届いています',
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

  const statsData = {
    '7d': {
      followers: { current: 4090, change: +8.2, changeType: 'increase' },
      messages: { current: 456, change: +12.5, changeType: 'increase' },
      broadcasts: { current: 12, change: +3, changeType: 'increase' },
      engagement: { current: 73.2, change: -2.1, changeType: 'decrease' },
      openRate: { current: 67.8, change: +4.3, changeType: 'increase' },
      unreadMessages: { current: 23, change: +7, changeType: 'increase' }
    }
  };

  const currentStats = statsData[timeRange];

  // 未読メッセージのサンプルデータ
  const unreadMessages = {
    urgent: [
      { id: 1, sender: '田中太郎', preview: '商品に不具合があり返品したいのですが...', time: '30分前' },
      { id: 2, sender: '佐藤花子', preview: '配送が遅れているようですが、いつ頃...', time: '1時間前' },
      { id: 3, sender: '鈴木次郎', preview: '請求書の内容に間違いがあります。確認...', time: '2時間前' }
    ],
    normal: [
      { id: 4, sender: '山田美咲', preview: '商品の使い方について教えてください', time: '3時間前' },
      { id: 5, sender: '高橋健', preview: 'キャンペーンの詳細を知りたいです', time: '4時間前' },
      { id: 6, sender: '中村綾', preview: '次回入荷予定はいつ頃でしょうか？', time: '5時間前' }
    ],
    info: [
      { id: 7, sender: '小林正', preview: '営業時間を教えてください', time: '6時間前' },
      { id: 8, sender: '吉田麻衣', preview: '店舗の場所を確認したいです', time: '7時間前' }
    ]
  };

  const handleCategoryClick = (category) => {
    setSelectedMessageCategory(selectedMessageCategory === category ? null : category);
  };

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
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
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
            to="/notification-center"
            className="flex flex-col items-center p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors mobile-touch-target"
          >
            <Bell className="w-6 h-6 text-red-600 mb-2" />
            <span className="text-xs font-medium text-red-900 text-center">通知確認</span>
          </Link>
          
          <Link 
            to="/broadcast-history"
            className="flex flex-col items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors mobile-touch-target"
          >
            <Clock className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-xs font-medium text-orange-900 text-center">配信履歴</span>
          </Link>
          
          <Link 
            to="/notifications"
            className="flex flex-col items-center p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors mobile-touch-target"
          >
            <Bell className="w-6 h-6 text-pink-600 mb-2" />
            <span className="text-xs font-medium text-pink-900 text-center">プッシュ通知</span>
          </Link>
        </div>
      </div>

      {/* 未読メッセージ状況 - クイックアクションの下に移動 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">未読メッセージ状況</h3>
          <Mail className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          <div 
            className="flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
            onClick={() => handleCategoryClick('urgent')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">緊急対応必要</p>
                <p className="text-xs text-gray-600">クレーム・重要な問い合わせ</p>
              </div>
            </div>
            <span className="text-lg font-bold text-red-600">3件</span>
          </div>
          
          {selectedMessageCategory === 'urgent' && (
            <div className="ml-4 space-y-2 border-l-2 border-red-200 pl-4">
              {unreadMessages.urgent.map(message => (
                <div key={message.id} className="p-3 bg-white border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                      <p className="text-sm text-gray-600 mt-1">{message.preview}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{message.time}</span>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                      返信
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                      詳細
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div 
            className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg cursor-pointer transition-colors"
            onClick={() => handleCategoryClick('normal')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">通常対応</p>
                <p className="text-xs text-gray-600">一般的な問い合わせ</p>
              </div>
            </div>
            <span className="text-lg font-bold text-yellow-600">15件</span>
          </div>
          
          {selectedMessageCategory === 'normal' && (
            <div className="ml-4 space-y-2 border-l-2 border-yellow-200 pl-4">
              {unreadMessages.normal.slice(0, 3).map(message => (
                <div key={message.id} className="p-3 bg-white border border-yellow-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                      <p className="text-sm text-gray-600 mt-1">{message.preview}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{message.time}</span>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700">
                      返信
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                      詳細
                    </button>
                  </div>
                </div>
              ))}
              {unreadMessages.normal.length > 3 && (
                <div className="text-center py-2">
                  <Link 
                    to="/messages?filter=normal"
                    className="text-sm text-yellow-600 hover:text-yellow-700 underline"
                  >
                    残り{unreadMessages.normal.length - 3}件を表示
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <div 
            className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
            onClick={() => handleCategoryClick('info')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">情報提供</p>
                <p className="text-xs text-gray-600">サービス利用案内など</p>
              </div>
            </div>
            <span className="text-lg font-bold text-blue-600">5件</span>
          </div>
          
          {selectedMessageCategory === 'info' && (
            <div className="ml-4 space-y-2 border-l-2 border-blue-200 pl-4">
              {unreadMessages.info.map(message => (
                <div key={message.id} className="p-3 bg-white border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                      <p className="text-sm text-gray-600 mt-1">{message.preview}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{message.time}</span>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                      返信
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                      詳細
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <Link 
              to="/messages"
              className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MailOpen className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">すべてのメッセージを確認</span>
            </Link>
          </div>
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
          title="開封率"
          value={currentStats.openRate.current}
          change={currentStats.openRate.change}
          changeType={currentStats.openRate.changeType}
          icon={Eye}
          color="indigo"
          suffix="%"
        />
        
        <StatCard
          title="未読メッセージ"
          value={currentStats.unreadMessages.current}
          change={currentStats.unreadMessages.change}
          changeType={currentStats.unreadMessages.changeType}
          icon={Mail}
          color="red"
        />
      </div>

      {/* 詳細統計エリア */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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