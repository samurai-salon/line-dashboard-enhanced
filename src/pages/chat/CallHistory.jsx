// src/pages/chat/CallHistory.jsx - 通話履歴管理
import React, { useState, useEffect } from 'react';
import {
  Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed,
  Clock, User, Search, Filter, Calendar, Download, Trash2,
  RefreshCw, MoreHorizontal, Play, Pause, Volume2, VolumeX
} from 'lucide-react';

const CallHistory = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [callType, setCallType] = useState('all');
  const [selectedCalls, setSelectedCalls] = useState([]);

  // デモ通話履歴データ
  const demoCallLogs = [
    {
      id: '1',
      phoneNumber: '090-1234-5678',
      userName: '田中 太郎',
      userId: 'user1',
      type: 'outgoing', // outgoing, incoming, missed
      duration: 324, // 秒
      timestamp: '2024-01-15T14:25:00Z',
      initiatedBy: '管理者',
      status: 'completed',
      recordingUrl: null,
      notes: '商品配送について相談'
    },
    {
      id: '2',
      phoneNumber: '090-2345-6789', 
      userName: '佐藤 花子',
      userId: 'user2',
      type: 'incoming',
      duration: 256,
      timestamp: '2024-01-15T13:10:00Z',
      initiatedBy: null,
      status: 'completed',
      recordingUrl: null,
      notes: '予約変更の依頼'
    },
    {
      id: '3',
      phoneNumber: '090-3456-7890',
      userName: '鈴木 一郎',
      userId: 'user3',
      type: 'missed',
      duration: 0,
      timestamp: '2024-01-15T11:45:00Z',
      initiatedBy: null,
      status: 'missed',
      recordingUrl: null,
      notes: null
    },
    {
      id: '4',
      phoneNumber: '090-4567-8901',
      userName: '高橋 美咲',
      userId: 'user4',
      type: 'outgoing',
      duration: 189,
      timestamp: '2024-01-15T09:30:00Z',
      initiatedBy: '管理者',
      status: 'completed',
      recordingUrl: '/recordings/call-4.mp3',
      notes: 'サービス説明'
    },
    {
      id: '5',
      phoneNumber: '090-5678-9012',
      userName: '山田 次郎',
      userId: 'user5',
      type: 'outgoing',
      duration: 0,
      timestamp: '2024-01-14T16:20:00Z',
      initiatedBy: '管理者',
      status: 'no_answer',
      recordingUrl: null,
      notes: 'フォローアップコール（応答なし）'
    }
  ];

  useEffect(() => {
    // ローカルストレージから履歴を読み込み
    const storedLogs = JSON.parse(localStorage.getItem('callLogs') || '[]');
    setCallLogs([...storedLogs, ...demoCallLogs]);
  }, []);

  // フィルタリング
  const filteredCalls = callLogs.filter(call => {
    const matchesSearch = searchQuery === '' ||
      call.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.phoneNumber.includes(searchQuery) ||
      call.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = callType === 'all' || call.type === callType;

    const callDate = new Date(call.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    let matchesDate = true;
    if (dateRange === 'today') {
      matchesDate = callDate.toDateString() === today.toDateString();
    } else if (dateRange === 'yesterday') {
      matchesDate = callDate.toDateString() === yesterday.toDateString();
    } else if (dateRange === 'week') {
      matchesDate = callDate >= weekAgo;
    }

    return matchesSearch && matchesType && matchesDate;
  });

  // 通話時間のフォーマット
  const formatDuration = (seconds) => {
    if (seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 通話タイプアイコン
  const getCallIcon = (type, status) => {
    if (type === 'missed' || status === 'missed') {
      return <PhoneMissed className="h-4 w-4 text-red-500" />;
    } else if (type === 'incoming') {
      return <PhoneIncoming className="h-4 w-4 text-blue-500" />;
    } else {
      return <PhoneOutgoing className="h-4 w-4 text-green-500" />;
    }
  };

  // 通話タイプラベル
  const getCallTypeLabel = (type, status) => {
    if (type === 'missed' || status === 'missed') return '不在着信';
    if (type === 'incoming') return '着信';
    if (status === 'no_answer') return '発信（応答なし）';
    return '発信';
  };

  // 電話をかけ直す
  const makeCall = (phoneNumber, userName) => {
    const confirmed = window.confirm(`${userName}さん（${phoneNumber}）に電話をかけますか？`);
    if (confirmed) {
      window.location.href = `tel:${phoneNumber}`;
      
      // 新しい通話ログを追加
      const newLog = {
        id: Date.now().toString(),
        phoneNumber,
        userName,
        userId: `user${Date.now()}`,
        type: 'outgoing',
        duration: 0,
        timestamp: new Date().toISOString(),
        initiatedBy: '管理者',
        status: 'dialing',
        recordingUrl: null,
        notes: 'かけ直し'
      };
      
      setCallLogs(prev => [newLog, ...prev]);
    }
  };

  // 通話統計
  const callStats = {
    total: filteredCalls.length,
    outgoing: filteredCalls.filter(c => c.type === 'outgoing').length,
    incoming: filteredCalls.filter(c => c.type === 'incoming').length,
    missed: filteredCalls.filter(c => c.type === 'missed' || c.status === 'missed').length,
    totalDuration: filteredCalls.reduce((sum, c) => sum + c.duration, 0),
    avgDuration: filteredCalls.length > 0 
      ? Math.round(filteredCalls.reduce((sum, c) => sum + c.duration, 0) / filteredCalls.length)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            通話履歴
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            顧客との通話記録を管理します
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="-ml-1 mr-2 h-4 w-4" />
            エクスポート
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
            更新
          </button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Phone className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">総通話数</p>
              <p className="text-2xl font-bold text-gray-900">{callStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <PhoneOutgoing className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">発信</p>
              <p className="text-2xl font-bold text-gray-900">{callStats.outgoing}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <PhoneIncoming className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">着信</p>
              <p className="text-2xl font-bold text-gray-900">{callStats.incoming}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <PhoneMissed className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">不在着信</p>
              <p className="text-2xl font-bold text-gray-900">{callStats.missed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">平均通話時間</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(callStats.avgDuration)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* フィルターセクション */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="名前、電話番号、メモで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">今日</option>
            <option value="yesterday">昨日</option>
            <option value="week">1週間</option>
            <option value="month">1ヶ月</option>
            <option value="all">すべて</option>
          </select>

          <select
            value={callType}
            onChange={(e) => setCallType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべての通話</option>
            <option value="outgoing">発信のみ</option>
            <option value="incoming">着信のみ</option>
            <option value="missed">不在着信のみ</option>
          </select>

          <div className="flex space-x-2">
            <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-1" />
              詳細フィルター
            </button>
          </div>
        </div>
      </div>

      {/* 通話履歴テーブル */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  通話情報
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイプ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  通話時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メモ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCalls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{call.userName}</div>
                        <div className="text-sm text-gray-500">{call.phoneNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCallIcon(call.type, call.status)}
                      <span className="ml-2 text-sm text-gray-900">
                        {getCallTypeLabel(call.type, call.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{new Date(call.timestamp).toLocaleDateString('ja-JP')}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(call.timestamp).toLocaleTimeString('ja-JP')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      call.duration > 0 ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {formatDuration(call.duration)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {call.notes || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {call.recordingUrl && (
                        <button className="text-blue-600 hover:text-blue-900 p-1" title="録音を再生">
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => makeCall(call.phoneNumber, call.userName)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="かけ直し"
                      >
                        <PhoneCall className="h-4 w-4" />
                      </button>
                      
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCalls.length === 0 && (
          <div className="text-center py-12">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">通話履歴が見つかりません</h3>
            <p className="text-gray-500">フィルター条件を変更してください。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistory;