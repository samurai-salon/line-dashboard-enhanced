
// src/pages/dashboard/Analytics.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Eye, 
  MousePointer,
  Download,
  Calendar
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

  const StatCard = ({ icon: Icon, title, value, change, trend, suffix = '' }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="ml-1">{Math.abs(change)}%</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            分析・統計
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            ユーザーの行動分析とパフォーマンス統計
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="7days">過去7日間</option>
            <option value="30days">過去30日間</option>
            <option value="90days">過去90日間</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            エクスポート
          </button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="総ユーザー数"
          value={stats.totalUsers.value}
          change={stats.totalUsers.change}
          trend={stats.totalUsers.trend}
        />
        <StatCard
          icon={Users}
          title="アクティブユーザー"
          value={stats.activeUsers.value}
          change={stats.activeUsers.change}
          trend={stats.activeUsers.trend}
        />
        <StatCard
          icon={MessageSquare}
          title="送信通知数"
          value={stats.notifications.value}
          change={stats.notifications.change}
          trend={stats.notifications.trend}
        />
        <StatCard
          icon={TrendingUp}
          title="エンゲージメント率"
          value={stats.engagement.value}
          change={stats.engagement.change}
          trend={stats.engagement.trend}
          suffix="%"
        />
      </div>

      {/* チャートエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ユーザー成長チャート */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              ユーザー成長推移
            </h3>
            <div className="mt-4 h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">チャートコンポーネント</p>
                <p className="text-sm text-gray-400">（実装予定）</p>
              </div>
            </div>
          </div>
        </div>

        {/* 通知パフォーマンス */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              通知パフォーマンス
            </h3>
            <div className="mt-4 h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">パフォーマンスチャート</p>
                <p className="text-sm text-gray-400">（実装予定）</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* トップパフォーマンス通知 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            トップパフォーマンス通知
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    通知タイトル
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    送信数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    開封率
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    クリック率
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topNotifications.map((notification, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {notification.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.sent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{notification.openRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MousePointer className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{notification.clickRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 追加の分析情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              時間別送信分析
            </h3>
            <div className="mt-4">
              <p className="text-sm text-gray-500">最適な送信時間</p>
              <p className="text-2xl font-semibold text-gray-900">午後2時</p>
              <p className="text-xs text-gray-400">開封率が最も高い時間帯</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              デバイス別分析
            </h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">スマートフォン</span>
                <span className="text-sm font-medium">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">タブレット</span>
                <span className="text-sm font-medium">8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">PC</span>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              ユーザー行動
            </h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">平均セッション時間</span>
                <span className="text-sm font-medium">3分42秒</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">リピート率</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">離脱率</span>
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;