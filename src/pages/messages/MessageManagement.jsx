// src/pages/messages/MessageManagement.jsx - 2パネル式メッセージ管理
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Send, 
  Reply, 
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Eye,
  EyeOff,
  Star,
  Trash2,
  Archive,
  Tag,
  Paperclip,
  FileText
} from 'lucide-react';

const MessageManagement = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [previousReplyText, setPreviousReplyText] = useState('');

  // 初期選択メッセージの設定
  useEffect(() => {
    if (messages.length > 0 && !selectedMessage) {
      setSelectedMessage(messages[0]);
    }
  }, []);

  // サンプルメッセージデータ
  const messages = [
    {
      id: 1,
      sender: {
        name: '田中太郎',
        avatar: null,
        userId: 'U1234567890',
        officialAccount: 'サムライアーク株式会社',
        isVip: false
      },
      content: '新商品について詳しく教えてください。価格と機能について知りたいです。',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'unread',
      priority: 'normal',
      tags: ['商品問い合わせ'],
      hasAttachment: false,
      threadCount: 1
    },
    {
      id: 2,
      sender: {
        name: '佐藤花子',
        avatar: null,
        userId: 'U0987654321',
        officialAccount: 'サムライアーク株式会社',
        isVip: true
      },
      content: '配送が遅れているようですが、いつ頃到着予定でしょうか？',
      timestamp: '2024-01-15T09:45:00Z',
      status: 'unread',
      priority: 'urgent',
      tags: ['配送問題'],
      hasAttachment: false,
      threadCount: 3
    },
    {
      id: 3,
      sender: {
        name: '鈴木次郎',
        avatar: null,
        userId: 'U1122334455',
        officialAccount: 'テスト企業アカウント',
        isVip: false
      },
      content: '返品したいのですが、手続きを教えてください。',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'read',
      priority: 'normal',
      tags: ['返品'],
      hasAttachment: false,
      threadCount: 2
    },
    {
      id: 4,
      sender: {
        name: '山田美咲',
        avatar: null,
        userId: 'U5566778899',
        officialAccount: 'サムライアーク株式会社',
        isVip: false
      },
      content: '商品の使い方について教えてください。',
      timestamp: '2024-01-15T08:30:00Z',
      status: 'replied',
      priority: 'low',
      tags: ['使い方'],
      hasAttachment: false,
      threadCount: 1
    }
  ];

  const quickReplies = [
    "ありがとうございます。確認いたします。",
    "申し訳ございません。詳しく調べて後ほどご連絡いたします。",
    "お忙しい中ありがとうございます。",
    "承知いたしました。対応させていただきます。",
    "恐れ入りますが、もう少しお待ちください。"
  ];


  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unread' && message.status === 'unread') ||
                         (filterStatus === 'urgent' && message.priority === 'urgent');
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return `${Math.floor((now - date) / (1000 * 60))}分前`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}時間前`;
    } else {
      return date.toLocaleDateString('ja-JP');
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log('Sending reply:', replyText);
      setReplyText('');
      // ここで実際の送信処理を行う
    }
  };

  const handleQuickReply = (reply) => {
    if (replyText !== reply) { // 同じ内容でない場合のみ
      setPreviousReplyText(replyText); // 現在のテキストを保存
      setReplyText(reply);
    }
  };

  const handleClearReply = () => {
    setReplyText('');
    setPreviousReplyText('');
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('File selected:', file.name);
        // ここで実際のファイルアップロード処理を追加
        alert(`ファイル "${file.name}" を選択しました`);
      }
    };
    input.click();
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">メッセージ管理</h1>
              <p className="text-xs text-gray-600">受信メッセージの確認と返信</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">
              {filteredMessages.filter(m => m.status === 'unread').length}件未読
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左パネル - メッセージリスト (モバイルでは非表示) */}
        <div className="w-1/2 md:flex hidden bg-white border-r border-gray-200 flex flex-col">
          {/* 検索・フィルター */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="メッセージを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべて</option>
                <option value="unread">未読</option>
                <option value="urgent">緊急</option>
              </select>
            </div>
          </div>

          {/* メッセージリスト */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {message.sender.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-medium text-gray-900 truncate">
                          {message.sender.name}
                        </h3>
                        {message.sender.isVip && (
                          <Star className="h-3 w-3 text-yellow-500" />
                        )}
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {message.status === 'unread' ? '未読' :
                           message.status === 'read' ? '既読' : '返信済み'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <AlertCircle className={`h-3 w-3 ${getPriorityColor(message.priority)}`} />
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                    <div className="mb-1">
                      <p className="text-xs text-gray-500 truncate">
                        ID: {message.sender.userId} | {message.sender.officialAccount}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {message.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      {message.threadCount > 1 && (
                        <span className="text-xs text-gray-500">
                          {message.threadCount}件のやりとり
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* モバイル用メッセージリスト */}
        <div className="md:hidden w-full bg-white flex flex-col">
          {/* メッセージ選択リスト - コンパクト */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-2 p-2 overflow-x-auto">
              {filteredMessages.slice(0, 3).map((message) => (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs transition-colors ${
                    selectedMessage?.id === message.id 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold truncate w-16">{message.sender.name}</div>
                    <div className="text-xs opacity-75">{message.status === 'unread' ? '未読' : '既読'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右パネル - メッセージ詳細&返信 (デスクトップは半分幅、モバイルは全幅) */}
        <div className="w-1/2 md:w-1/2 w-full flex flex-col h-full">
          {selectedMessage ? (
            <>
              {/* 1. 最上部 - 名前と未読/既読ステータス */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {selectedMessage.sender.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{selectedMessage.sender.name}</h3>
                      <p className="text-sm text-blue-600">{selectedMessage.sender.officialAccount}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedMessage.status === 'unread' ? 'bg-red-100 text-red-800' :
                      selectedMessage.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedMessage.status === 'unread' ? '未読' :
                       selectedMessage.status === 'read' ? '既読' : '返信済み'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">{formatTime(selectedMessage.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* 2. 中央部 - チャット内容表示エリア（大きく確保） */}
              <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <p className="text-base text-gray-900 leading-relaxed mb-3">
                    {selectedMessage.content}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-2">
                      {selectedMessage.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className={`text-xs ${
                      selectedMessage.priority === 'urgent' ? 'text-red-600' :
                      selectedMessage.priority === 'normal' ? 'text-blue-600' :
                      'text-gray-500'
                    }`}>
                      {selectedMessage.priority === 'urgent' ? '緊急' : 
                       selectedMessage.priority === 'normal' ? '通常' : '低'}
                    </span>
                  </div>
                </div>
                
                {/* 追加のメッセージ履歴があればここに表示 */}
                {selectedMessage.threadCount > 1 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    {selectedMessage.threadCount - 1}件の過去のやりとり
                  </div>
                )}
              </div>

              {/* 3. 返信入力フォーム */}
              <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
                <div className="flex space-x-3 items-end">
                  <div className="flex-1">
                    <textarea
                      value={replyText}
                      onChange={(e) => {
                        setReplyText(e.target.value);
                        // 自動リサイズ
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                      }}
                      placeholder="メッセージを入力してください..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      style={{ minHeight: '80px', maxHeight: '120px' }}
                      rows="1"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleFileUpload}
                      className="p-3 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                      title="ファイル添付"
                    >
                      <Paperclip className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {replyText.trim() && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleClearReply}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      クリア
                    </button>
                  </div>
                )}
              </div>

              {/* 4. 最下部 - クイックリプライ */}
              <div className="bg-gray-50 border-t border-gray-200 p-3 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="flex-shrink-0 px-4 py-2 text-sm bg-white hover:bg-gray-100 text-gray-700 rounded-full border border-gray-200 transition-colors whitespace-nowrap"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  メッセージを選択してください
                </h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  左側のリストからメッセージを選択すると、詳細と返信フォームが表示されます。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageManagement;