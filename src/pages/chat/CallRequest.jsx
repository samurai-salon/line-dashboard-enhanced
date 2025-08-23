// src/pages/chat/CallRequest.jsx - LINE公式アカウント電話発信要請機能
import React, { useState } from 'react';
import {
  Phone, MessageCircle, Send, Clock, CheckCircle, XCircle,
  User, AlertCircle, RefreshCw, Eye, Edit2, Copy, Trash2
} from 'lucide-react';

const CallRequest = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [callMessage, setCallMessage] = useState('お時間になりましたらこちらより発信ください');
  const [lineCallEnabled, setLineCallEnabled] = useState(true);
  const [useRecentChats, setUseRecentChats] = useState(false);
  
  // 電話発信要請履歴
  const [callRequests, setCallRequests] = useState([
    {
      id: '1',
      userId: 'user1',
      userName: '田中 太郎',
      phoneNumber: '090-1234-5678',
      requestedAt: '2024-01-15T14:20:00Z',
      status: 'called', // sent, delivered, read, called, expired
      callReceivedAt: '2024-01-15T14:25:00Z',
      message: 'お時間になりましたらこちらより発信ください'
    },
    {
      id: '2',
      userId: 'user2',
      userName: '佐藤 花子',
      phoneNumber: '090-2345-6789',
      requestedAt: '2024-01-15T13:45:00Z',
      status: 'read',
      callReceivedAt: null,
      message: 'お時間になりましたらこちらより発信ください'
    },
    {
      id: '3',
      userId: 'user3',
      userName: '鈴木 一郎',
      phoneNumber: '090-3456-7890',
      requestedAt: '2024-01-15T11:30:00Z',
      status: 'delivered',
      callReceivedAt: null,
      message: 'お時間になりましたらこちらより発信ください'
    }
  ]);

  // 利用可能なユーザー一覧
  const availableUsers = [
    {
      id: 'user1',
      name: '田中 太郎',
      phone: '090-1234-5678',
      lastActive: '2024-01-15T14:30:00Z',
      avatar: null,
      isOnline: true,
      lastChatTime: '2024-01-15T14:25:00Z'
    },
    {
      id: 'user2', 
      name: '佐藤 花子',
      phone: '090-2345-6789',
      lastActive: '2024-01-15T13:45:00Z',
      avatar: null,
      isOnline: false,
      lastChatTime: '2024-01-15T13:40:00Z'
    },
    {
      id: 'user3',
      name: '鈴木 一郎', 
      phone: '090-3456-7890',
      lastActive: '2024-01-15T11:20:00Z',
      avatar: null,
      isOnline: false,
      lastChatTime: '2024-01-15T11:15:00Z'
    },
    {
      id: 'user4',
      name: '山田 美咲',
      phone: '090-4567-8901',
      lastActive: '2024-01-15T10:30:00Z',
      avatar: null,
      isOnline: false,
      lastChatTime: '2024-01-15T10:25:00Z'
    },
    {
      id: 'user5',
      name: '伊藤 健太',
      phone: '090-5678-9012',
      lastActive: '2024-01-15T16:00:00Z',
      avatar: null,
      isOnline: true,
      lastChatTime: '2024-01-15T15:55:00Z'
    }
  ];

  // 最近チャットしたユーザー順にソート
  const recentChatUsers = [...availableUsers].sort((a, b) => 
    new Date(b.lastChatTime) - new Date(a.lastChatTime)
  );

  // LINE電話発信ボタンメッセージを送信
  const sendCallRequest = () => {
    if (selectedUsers.length === 0) {
      alert('発信要請を送る相手を選択してください。');
      return;
    }

    if (!callMessage.trim()) {
      alert('メッセージを入力してください。');
      return;
    }

    selectedUsers.forEach(userId => {
      const user = availableUsers.find(u => u.id === userId);
      if (user) {
        // LINE Message API でクイック返信ボタン付きメッセージを送信
        const lineMessage = {
          type: 'text',
          text: callMessage,
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: '📞 LINE通話をかける',
                  text: 'LINE通話を希望します'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: '後で連絡します',
                  text: '後で連絡します'
                }
              }
            ]
          }
        };

        // 実際の実装では LINE Messaging API を呼び出し
        console.log('LINE通話要請送信:', { userId, message: lineMessage });

        // 要請履歴に追加
        const newRequest = {
          id: Date.now() + Math.random(),
          userId: user.id,
          userName: user.name,
          phoneNumber: user.phone,
          requestedAt: new Date().toISOString(),
          status: 'sent',
          callReceivedAt: null,
          message: callMessage
        };

        setCallRequests(prev => [newRequest, ...prev]);
      }
    });

    // フォームをリセット
    setSelectedUsers([]);
    alert(`${selectedUsers.length}名にLINE通話要請を送信しました。`);
  };

  // ステータス表示
  const getStatusBadge = (status) => {
    const configs = {
      sent: { bg: 'bg-gray-100', text: 'text-gray-800', label: '送信済み' },
      delivered: { bg: 'bg-blue-100', text: 'text-blue-800', label: '配信済み' },
      read: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '既読' },
      called: { bg: 'bg-green-100', text: 'text-green-800', label: 'LINE通話受信' },
      expired: { bg: 'bg-red-100', text: 'text-red-800', label: '期限切れ' }
    };
    const config = configs[status] || configs.sent;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // ステータスアイコン
  const getStatusIcon = (status) => {
    switch (status) {
      case 'called':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'read':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            LINE通話要請
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            LINE公式アカウントから顧客にLINE通話をしてもらうよう要請します
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LINE通話要請フォーム */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">新規通話要請</h3>
            
            {/* LINE通話設定 */}
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={lineCallEnabled}
                  onChange={(e) => setLineCallEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">LINE通話機能を有効にする</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                顧客がボタンをタップしてLINE通話を開始できます
              </p>
            </div>

            {/* メッセージ編集 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                通話要請メッセージ
              </label>
              <textarea
                value={callMessage}
                onChange={(e) => setCallMessage(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="お時間になりましたらこちらより発信ください"
              />
            </div>

            {/* 送信対象選択 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  送信対象 ({selectedUsers.length}名選択中)
                </label>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={useRecentChats}
                      onChange={(e) => setUseRecentChats(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">最近のチャット順</span>
                  </label>
                </div>
              </div>
              
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {(useRecentChats ? recentChatUsers : availableUsers).map(user => (
                  <label key={user.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(prev => [...prev, user.id]);
                        } else {
                          setSelectedUsers(prev => prev.filter(id => id !== user.id));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center relative">
                        <User className="h-4 w-4 text-gray-600" />
                        {user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {useRecentChats && (
                            <div className="text-xs text-blue-600">
                              最終チャット: {new Date(user.lastChatTime).toLocaleString('ja-JP', {
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{user.phone}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* プレビュー */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">LINEメッセージプレビュー</h4>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                  <p className="text-sm text-gray-800 whitespace-pre-line mb-3">{callMessage}</p>
                  
                  {/* クイック返信ボタンプレビュー */}
                  <div className="space-y-2">
                    <button className="w-full bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center">
                      <Phone className="h-4 w-4 mr-1" />
                      📞 LINE通話をかける
                    </button>
                    <button className="w-full bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-sm">
                      後で連絡します
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ※「LINE通話をかける」をタップするとLINE通話が開始されます
                </p>
              </div>
            </div>

            {/* 送信ボタン */}
            <button
              onClick={sendCallRequest}
              disabled={selectedUsers.length === 0}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              {selectedUsers.length > 0 ? `${selectedUsers.length}名に通話要請を送信` : '送信対象を選択してください'}
            </button>
          </div>
        </div>

        {/* 通話要請履歴 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">通話要請履歴</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  <RefreshCw className="h-4 w-4 inline mr-1" />
                  更新
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {callRequests.map(request => (
                <div key={request.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">{request.userName}</h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{request.phoneNumber}</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{request.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      要請日時: {new Date(request.requestedAt).toLocaleString('ja-JP')}
                    </span>
                    {request.callReceivedAt && (
                      <span className="text-green-600">
                        通話受信: {new Date(request.callReceivedAt).toLocaleString('ja-JP')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {callRequests.length === 0 && (
              <div className="text-center py-12">
                <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">通話要請履歴はありません</h3>
                <p className="text-gray-500">左側のフォームからLINE通話要請を送信してください。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallRequest;