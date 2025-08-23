import React, { useState, useCallback } from 'react';
import {
  BarChart3, Calendar, Users, Eye, Send, CheckCircle, XCircle,
  AlertTriangle, Download, Filter, Search, RefreshCw,
  Target, MessageSquare, Image, Video, Mic, MapPin,
  Activity, TrendingUp, Clock, ArrowUp, ArrowDown
} from 'lucide-react';

const BroadcastHistory = () => {
  // State管理
  const [broadcasts] = useState([
    {
      id: 1,
      title: '新商品告知キャンペーン',
      type: 'mass',
      messageType: 'text',
      status: 'completed',
      targets: { type: 'all', count: 5420 },
      content: { text: '🎉 新商品のお知らせ\n\n待望の新商品が登場しました！' },
      createdAt: '2024-01-15T10:00:00Z',
      sentAt: '2024-01-15T14:00:00Z',
      deliveredCount: 5420,
      openedCount: 3247,
      clickedCount: 1823,
      repliedCount: 432,
      deliveryRate: 100,
      openRate: 59.9,
      clickRate: 33.6,
      replyRate: 8.0
    },
    {
      id: 2,
      title: 'セール告知',
      type: 'segment',
      messageType: 'image',
      status: 'completed',
      targets: { type: 'segments', segments: ['VIP顧客'], count: 1232 },
      content: { text: '🛍️ 期間限定セール開催中！', image: '/images/sale.jpg' },
      createdAt: '2024-01-14T09:00:00Z',
      sentAt: '2024-01-14T12:00:00Z',
      deliveredCount: 1232,
      openedCount: 987,
      clickedCount: 654,
      repliedCount: 123,
      deliveryRate: 100,
      openRate: 80.1,
      clickRate: 53.1,
      replyRate: 10.0
    },
    {
      id: 3,
      title: 'イベント案内',
      type: 'individual',
      messageType: 'video',
      status: 'completed',
      targets: { type: 'individual', count: 156 },
      content: { text: '📅 特別イベントのご案内', video: '/videos/event.mp4' },
      createdAt: '2024-01-13T15:00:00Z',
      sentAt: '2024-01-13T18:00:00Z',
      deliveredCount: 156,
      openedCount: 142,
      clickedCount: 98,
      repliedCount: 34,
      deliveryRate: 100,
      openRate: 91.0,
      clickRate: 62.8,
      replyRate: 21.8
    },
    {
      id: 4,
      title: '定期メンテナンス通知',
      type: 'mass',
      messageType: 'text',
      status: 'failed',
      targets: { type: 'all', count: 5420 },
      content: { text: '🔧 システムメンテナンスのお知らせ' },
      createdAt: '2024-01-12T08:00:00Z',
      sentAt: '2024-01-12T09:00:00Z',
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      repliedCount: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      replyRate: 0
    },
    {
      id: 5,
      title: 'アップデート情報',
      type: 'segment',
      messageType: 'text',
      status: 'completed',
      targets: { type: 'segments', segments: ['アクティブユーザー'], count: 2340 },
      content: { text: '📱 アプリが新しくなりました！' },
      createdAt: '2024-01-11T16:00:00Z',
      sentAt: '2024-01-11T17:00:00Z',
      deliveredCount: 2340,
      openedCount: 1755,
      clickedCount: 936,
      repliedCount: 187,
      deliveryRate: 100,
      openRate: 75.0,
      clickRate: 40.0,
      replyRate: 8.0
    }
  ]);

  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('sentAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // 配信ステータス定義
  const broadcastStatuses = [
    { value: 'completed', label: '送信完了', color: 'green', icon: CheckCircle },
    { value: 'failed', label: '送信失敗', color: 'red', icon: XCircle },
    { value: 'cancelled', label: 'キャンセル', color: 'gray', icon: AlertTriangle },
    { value: 'sending', label: '送信中', color: 'blue', icon: Send }
  ];

  // 配信タイプ定義
  const broadcastTypes = [
    { value: 'mass', label: '一斉配信', color: 'blue', icon: Users },
    { value: 'segment', label: 'セグメント配信', color: 'green', icon: Target },
    { value: 'individual', label: '個別配信', color: 'purple', icon: MessageSquare }
  ];

  // メッセージタイプ定義
  const messageTypes = [
    { value: 'text', label: 'テキスト', icon: MessageSquare },
    { value: 'image', label: '画像', icon: Image },
    { value: 'video', label: '動画', icon: Video },
    { value: 'audio', label: '音声', icon: Mic }
  ];

  // フィルタリング・ソート
  const filteredBroadcasts = broadcasts
    .filter(broadcast => {
      const matchesSearch = broadcast.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || broadcast.status === statusFilter;
      const matchesType = typeFilter === 'all' || broadcast.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const comparison = sortOrder === 'asc' ? 
        (aValue > bValue ? 1 : -1) : 
        (aValue < bValue ? 1 : -1);
      return comparison;
    });

  // 統計計算
  const stats = {
    total: broadcasts.length,
    completed: broadcasts.filter(b => b.status === 'completed').length,
    failed: broadcasts.filter(b => b.status === 'failed').length,
    totalDelivered: broadcasts.reduce((sum, b) => sum + b.deliveredCount, 0),
    totalOpened: broadcasts.reduce((sum, b) => sum + b.openedCount, 0),
    avgOpenRate: broadcasts.length > 0 ? 
      broadcasts.reduce((sum, b) => sum + b.openRate, 0) / broadcasts.length : 0,
    avgClickRate: broadcasts.length > 0 ? 
      broadcasts.reduce((sum, b) => sum + b.clickRate, 0) / broadcasts.length : 0
  };

  // ステータス表示用のスタイル
  const getStatusStyle = (status) => {
    const statusType = broadcastStatuses.find(s => s.value === status);
    if (!statusType) return 'bg-gray-100 text-gray-800';
    
    const colorMap = {
      gray: 'bg-gray-100 text-gray-800',
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      red: 'bg-red-100 text-red-800'
    };
    
    return colorMap[statusType.color] || 'bg-gray-100 text-gray-800';
  };

  // CSVエクスポート機能
  const exportToCSV = useCallback(() => {
    const headers = [
      '配信名', '配信タイプ', 'メッセージタイプ', 'ステータス', 
      '対象者数', '配信数', '開封数', 'クリック数', '返信数',
      '配信成功率', '開封率', 'クリック率', '返信率', '作成日時', '送信日時'
    ];
    
    const csvData = filteredBroadcasts.map(broadcast => [
      broadcast.title,
      broadcastTypes.find(t => t.value === broadcast.type)?.label || broadcast.type,
      messageTypes.find(t => t.value === broadcast.messageType)?.label || broadcast.messageType,
      broadcastStatuses.find(s => s.value === broadcast.status)?.label || broadcast.status,
      broadcast.targets.count,
      broadcast.deliveredCount,
      broadcast.openedCount,
      broadcast.clickedCount,
      broadcast.repliedCount,
      broadcast.deliveryRate + '%',
      broadcast.openRate + '%',
      broadcast.clickRate + '%',
      broadcast.replyRate + '%',
      new Date(broadcast.createdAt).toLocaleString('ja-JP'),
      broadcast.sentAt ? new Date(broadcast.sentAt).toLocaleString('ja-JP') : ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `broadcast_history_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [filteredBroadcasts, broadcastTypes, messageTypes, broadcastStatuses]);

  return (
    <div className="h-full bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">配信履歴</h1>
            <p className="text-gray-600 mt-1">過去の配信結果を確認・分析できます</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>CSV出力</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>更新</span>
            </button>
          </div>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">総配信数</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">成功配信</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">平均開封率</p>
                <p className="text-2xl font-bold text-purple-900">{stats.avgOpenRate.toFixed(1)}%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">平均クリック率</p>
                <p className="text-2xl font-bold text-orange-900">{stats.avgClickRate.toFixed(1)}%</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="flex items-center space-x-4 mt-6">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="配信名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべてのステータス</option>
            {broadcastStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべてのタイプ</option>
            {broadcastTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="sentAt-desc">送信日時（新しい順）</option>
            <option value="sentAt-asc">送信日時（古い順）</option>
            <option value="openRate-desc">開封率（高い順）</option>
            <option value="openRate-asc">開封率（低い順）</option>
            <option value="deliveredCount-desc">配信数（多い順）</option>
            <option value="deliveredCount-asc">配信数（少ない順）</option>
          </select>
        </div>
      </div>

      {/* 配信履歴一覧 */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          {filteredBroadcasts.length === 0 ? (
            <div className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">配信履歴が見つかりません</h3>
              <p className="text-gray-600">検索条件を変更するか、新しい配信を実行してください。</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      配信名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイプ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      配信結果
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      開封率
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      クリック率
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      送信日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBroadcasts.map((broadcast) => {
                    const broadcastType = broadcastTypes.find(t => t.value === broadcast.type);
                    const messageType = messageTypes.find(t => t.value === broadcast.messageType);
                    
                    return (
                      <tr key={broadcast.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <messageType.icon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {broadcast.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {messageType.label}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <broadcastType.icon className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-900">{broadcastType.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(broadcast.status)}`}>
                            {broadcastStatuses.find(s => s.value === broadcast.status)?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            配信: {broadcast.deliveredCount.toLocaleString()} / {broadcast.targets.count.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            開封: {broadcast.openedCount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-900">{broadcast.openRate.toFixed(1)}%</span>
                                {broadcast.openRate >= 60 ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <TrendingUp className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${Math.min(broadcast.openRate, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-900">{broadcast.clickRate.toFixed(1)}%</span>
                                {broadcast.clickRate >= 30 ? (
                                  <TrendingUp className="h-4 w-4 text-purple-500" />
                                ) : (
                                  <TrendingUp className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full" 
                                  style={{ width: `${Math.min(broadcast.clickRate, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {broadcast.sentAt ? 
                            new Date(broadcast.sentAt).toLocaleString('ja-JP') : 
                            '未送信'
                          }
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedBroadcast(broadcast)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 配信詳細モーダル */}
      {selectedBroadcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">配信詳細分析</h2>
                <button
                  onClick={() => setSelectedBroadcast(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 基本情報 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">配信名:</span>
                      <span className="ml-2 font-medium">{selectedBroadcast.title}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">配信タイプ:</span>
                      <span className="ml-2 font-medium">
                        {broadcastTypes.find(t => t.value === selectedBroadcast.type)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">メッセージタイプ:</span>
                      <span className="ml-2 font-medium">
                        {messageTypes.find(t => t.value === selectedBroadcast.messageType)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">作成日時:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedBroadcast.createdAt).toLocaleString('ja-JP')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">送信日時:</span>
                      <span className="ml-2 font-medium">
                        {selectedBroadcast.sentAt ? 
                          new Date(selectedBroadcast.sentAt).toLocaleString('ja-JP') : 
                          '未送信'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* パフォーマンス指標 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">パフォーマンス指標</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">配信成功率</span>
                        <span className="font-medium">{selectedBroadcast.deliveryRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${selectedBroadcast.deliveryRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">開封率</span>
                        <span className="font-medium">{selectedBroadcast.openRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(selectedBroadcast.openRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">クリック率</span>
                        <span className="font-medium">{selectedBroadcast.clickRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(selectedBroadcast.clickRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">返信率</span>
                        <span className="font-medium">{selectedBroadcast.replyRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(selectedBroadcast.replyRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 配信数詳細 */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">配信数詳細</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 font-medium">対象者数</p>
                      <p className="text-xl font-bold text-blue-900">
                        {selectedBroadcast.targets.count.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <Send className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-600 font-medium">配信成功</p>
                      <p className="text-xl font-bold text-green-900">
                        {selectedBroadcast.deliveredCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-purple-600 font-medium">開封数</p>
                      <p className="text-xl font-bold text-purple-900">
                        {selectedBroadcast.openedCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-orange-600 font-medium">クリック数</p>
                      <p className="text-xl font-bold text-orange-900">
                        {selectedBroadcast.clickedCount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* メッセージ内容プレビュー */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">メッセージ内容</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedBroadcast.content.text}</p>
                    {selectedBroadcast.content.image && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">添付画像:</p>
                        <div className="w-32 h-32 bg-gray-200 rounded border flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                    )}
                    {selectedBroadcast.content.video && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">添付動画:</p>
                        <div className="w-32 h-20 bg-gray-200 rounded border flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastHistory;