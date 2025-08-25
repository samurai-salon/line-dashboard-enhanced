
// src/pages/Analytics.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Eye, 
  MousePointer,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Globe
} from 'lucide-react';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7days');

  // 模擬統計データ
  const stats = {
    totalUsers: { value: 1247, change: 12.5, trend: 'up' },
    activeUsers: { value: 808, change: 8.2, trend: 'up' },
    notifications: { value: 156, change: -3.1, trend: 'down' },
    engagement: { value: 64.8, change: 5.4, trend: 'up' }
  };

  const topNotifications = [
    { title: '新商品のお知らせ', openRate: 92.5, clickRate: 38.2, sent: 1247 },
    { title: 'セール開始', openRate: 89.1, clickRate: 45.6, sent: 1150 },
    { title: 'イベント案内', openRate: 85.7, clickRate: 32.8, sent: 1200 },
    { title: 'アップデート情報', openRate: 78.3, clickRate: 25.4, sent: 980 }
  ];

  const StatCard = ({ icon: Icon, title, value, change, trend, suffix = '', color = 'blue' }) => (
    <div className="group relative bg-white overflow-hidden shadow-sm hover:shadow-lg border border-gray-200 rounded-xl transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-r opacity-5 ${
        color === 'blue' ? 'from-blue-400 to-blue-600' :
        color === 'green' ? 'from-green-400 to-green-600' :
        color === 'purple' ? 'from-purple-400 to-purple-600' :
        color === 'orange' ? 'from-orange-400 to-orange-600' :
        'from-gray-400 to-gray-600'
      }`}></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl bg-gradient-to-br shadow-lg ${
            color === 'blue' ? 'from-blue-500 to-blue-600' :
            color === 'green' ? 'from-green-500 to-green-600' :
            color === 'purple' ? 'from-purple-500 to-purple-600' :
            color === 'orange' ? 'from-orange-500 to-orange-600' :
            'from-gray-500 to-gray-600'
          }`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className={`flex items-center text-sm font-semibold ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          <p className="text-xs text-gray-500 mt-1">vs 先週</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-6">
      {/* ページヘッダー - グラデーション背景 */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold">分析・統計</h1>
            </div>
            <p className="text-blue-100">
              ユーザーの行動分析とパフォーマンス統計を確認できます
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/20 backdrop-blur border border-white/30 rounded-xl px-4 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="7days" className="text-gray-900">過去7日間</option>
              <option value="30days" className="text-gray-900">過去30日間</option>
              <option value="90days" className="text-gray-900">過去90日間</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-sm font-medium text-white hover:bg-white/30 transition-all duration-200">
              <Download className="mr-2 h-4 w-4" />
              エクスポート
            </button>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="総ユーザー数"
          value={stats.totalUsers.value}
          change={stats.totalUsers.change}
          trend={stats.totalUsers.trend}
          color="blue"
        />
        <StatCard
          icon={Activity}
          title="アクティブユーザー"
          value={stats.activeUsers.value}
          change={stats.activeUsers.change}
          trend={stats.activeUsers.trend}
          color="green"
        />
        <StatCard
          icon={MessageSquare}
          title="送信通知数"
          value={stats.notifications.value}
          change={stats.notifications.change}
          trend={stats.notifications.trend}
          color="purple"
        />
        <StatCard
          icon={Target}
          title="エンゲージメント率"
          value={stats.engagement.value}
          change={stats.engagement.change}
          trend={stats.engagement.trend}
          suffix="%"
          color="orange"
        />
      </div>

      {/* ビジュアルチャートエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ユーザー成長チャート */}
        <div className="bg-white shadow-sm hover:shadow-lg border border-gray-200 rounded-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">ユーザー成長推移</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            {/* シンプルなビジュアル成長グラフ */}
            <div className="relative h-48 bg-gradient-to-t from-blue-50 to-transparent rounded-lg p-4">
              <div className="flex items-end justify-between h-full">
                {[65, 78, 85, 92, 88, 95, 100].map((height, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 hover:from-blue-600 hover:to-blue-500"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {index === 0 ? '月' : index === 1 ? '火' : index === 2 ? '水' : 
                       index === 3 ? '木' : index === 4 ? '金' : index === 5 ? '土' : '日'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-4">
                <p className="text-sm text-gray-600">今週の成長率</p>
                <p className="text-2xl font-bold text-blue-600">+12.5%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 通知パフォーマンス */}
        <div className="bg-white shadow-sm hover:shadow-lg border border-gray-200 rounded-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">通知パフォーマンス</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            
            {/* シンプルな円グラフ風表示 */}
            <div className="relative h-48 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">64.8%</p>
                    <p className="text-xs text-gray-500">開封率</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">開封済み</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-600">未開封</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* トップパフォーマンス通知 - カード式デザイン */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">トップパフォーマンス通知</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
          </div>
          
          <div className="grid gap-4">
            {topNotifications.map((notification, index) => (
              <div key={index} className="relative p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-1.5 rounded-lg ${
                        index === 0 ? 'bg-yellow-100' : 
                        index === 1 ? 'bg-green-100' : 
                        index === 2 ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-green-500' : 
                          index === 2 ? 'bg-blue-500' : 'bg-purple-500'
                        }`}></div>
                      </div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {notification.title}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{notification.sent.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">送信数</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Eye className="h-3 w-3 text-blue-600" />
                          <p className="text-lg font-bold text-blue-600">{notification.openRate}%</p>
                        </div>
                        <p className="text-xs text-gray-500">開封率</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <MousePointer className="h-3 w-3 text-green-600" />
                          <p className="text-lg font-bold text-green-600">{notification.clickRate}%</p>
                        </div>
                        <p className="text-xs text-gray-500">クリック率</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                      index === 1 ? 'bg-green-100 text-green-800' : 
                      index === 2 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 詳細分析カード */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 時間別送信分析 */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-orange-600 font-medium">PEAK TIME</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">時間別送信分析</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">最適な送信時間</p>
              <p className="text-3xl font-bold text-orange-600">午後2時</p>
              <p className="text-xs text-gray-500">開封率が最も高い時間帯</p>
            </div>
            <div className="pt-3 border-t border-orange-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">今日の最高値</span>
                <span className="font-semibold text-gray-900">14:23</span>
              </div>
            </div>
          </div>
        </div>

        {/* デバイス別分析 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-600 font-medium">DEVICES</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">デバイス別分析</h3>
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">スマートフォン</span>
                </div>
                <span className="text-sm font-bold text-gray-900">87%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Tablet className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">タブレット</span>
                </div>
                <span className="text-sm font-bold text-gray-900">8%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">PC</span>
                </div>
                <span className="text-sm font-bold text-gray-900">5%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-300 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ユーザー行動 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600 font-medium">BEHAVIOR</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ユーザー行動</h3>
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">平均セッション時間</span>
                <span className="text-lg font-bold text-green-600">3分42秒</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">リピート率</span>
                <span className="text-lg font-bold text-green-600">68%</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">離脱率</span>
                <span className="text-lg font-bold text-red-500">12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;