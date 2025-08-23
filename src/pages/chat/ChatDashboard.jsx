// src/pages/chat/ChatDashboard.jsx - LINEチャット管理ダッシュボード
import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Phone, PhoneCall, Users, Search, Filter,
  Send, Paperclip, Smile, MoreHorizontal, Clock, Check,
  CheckCheck, AlertCircle, Star, Archive, Trash2, Info,
  User, Image, Video, FileText, MapPin, Calendar, Eye,
  VolumeX, Volume2, Bell, BellOff, Settings, RefreshCw,
  Pin, PinOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BulkCallRequestModal from '../../components/chat/BulkCallRequestModal.jsx';
import FriendGrowthModal from '../../components/friends/FriendGrowthModal.jsx';
import AutoResponseManager from '../../components/messages/AutoResponseManager.jsx';
import QuickReplies from '../../components/chat/QuickReplies.jsx';

const ChatDashboard = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedOfficialLine, setSelectedOfficialLine] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, unread, important
  const [showCallRequestModal, setShowCallRequestModal] = useState(false);
  const [selectedUsersForCall, setSelectedUsersForCall] = useState([]);
  const [showFriendGrowthModal, setShowFriendGrowthModal] = useState(false);
  const [showAutoResponseModal, setShowAutoResponseModal] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [viewMode, setViewMode] = useState('lines'); // 'lines' or 'chats'
  const chatEndRef = useRef(null);

  // 公式LINE一覧データ（API連携予定）
  const [officialLines, setOfficialLines] = useState([
    {
      id: 'line_1',
      name: '本店公式アカウント',
      displayName: '@honten-official',
      avatar: null,
      description: '本店メインアカウント',
      userCount: 1250,
      unreadCount: 15,
      isActive: true,
      lastActivity: '2024-01-15T14:30:00Z',
      tags: ['メイン', '本店'],
      stats: {
        totalUsers: 1250,
        activeUsers: 890,
        messages24h: 45
      }
    },
    {
      id: 'line_2', 
      name: '支店公式アカウント',
      displayName: '@shiten-official',
      avatar: null,
      description: '支店サービスアカウント',
      userCount: 678,
      unreadCount: 8,
      isActive: true,
      lastActivity: '2024-01-15T13:45:00Z',
      tags: ['支店', 'サービス'],
      stats: {
        totalUsers: 678,
        activeUsers: 456,
        messages24h: 22
      }
    },
    {
      id: 'line_3',
      name: 'ECサイト連動',
      displayName: '@ec-support',
      avatar: null,
      description: 'ECサイト顧客サポート',
      userCount: 2100,
      unreadCount: 32,
      isActive: true,
      lastActivity: '2024-01-15T14:15:00Z',
      tags: ['EC', 'サポート'],
      stats: {
        totalUsers: 2100,
        activeUsers: 1340,
        messages24h: 78
      }
    },
    {
      id: 'line_4',
      name: 'イベント告知専用',
      displayName: '@event-info',
      avatar: null,
      description: 'イベント・キャンペーン情報配信',
      userCount: 890,
      unreadCount: 3,
      isActive: false,
      lastActivity: '2024-01-14T16:20:00Z',
      tags: ['イベント', '告知'],
      stats: {
        totalUsers: 890,
        activeUsers: 234,
        messages24h: 5
      }
    }
  ]);

  // チャット一覧データ（選択された公式LINEのユーザー）
  const [chats, setChats] = useState([
    {
      id: '1',
      type: 'individual',
      user: {
        id: 'user1',
        name: '田中 太郎',
        avatar: null,
        phone: '090-1234-5678',
        isOnline: true,
        lastSeen: '2024-01-15T14:30:00Z'
      },
      lastMessage: {
        text: 'ありがとうございました！',
        timestamp: '2024-01-15T14:30:00Z',
        senderId: 'user1',
        type: 'text',
        status: 'read'
      },
      unreadCount: 0,
      isImportant: false,
      isMuted: false,
      tags: ['VIP顧客'],
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: '2', 
      type: 'individual',
      user: {
        id: 'user2',
        name: '佐藤 花子',
        avatar: null,
        phone: '090-2345-6789',
        isOnline: false,
        lastSeen: '2024-01-15T12:15:00Z'
      },
      lastMessage: {
        text: '予約の件でご連絡しました',
        timestamp: '2024-01-15T13:45:00Z',
        senderId: 'user2',
        type: 'text',
        status: 'delivered'
      },
      unreadCount: 2,
      isImportant: true,
      isMuted: false,
      tags: ['予約'],
      updatedAt: '2024-01-15T13:45:00Z'
    },
    {
      id: '3',
      type: 'individual', 
      user: {
        id: 'user3',
        name: '鈴木 一郎',
        avatar: null,
        phone: '090-3456-7890',
        isOnline: false,
        lastSeen: '2024-01-15T09:30:00Z'
      },
      lastMessage: {
        text: '商品について質問があります',
        timestamp: '2024-01-15T11:20:00Z',
        senderId: 'user3',
        type: 'text',
        status: 'sent'
      },
      unreadCount: 1,
      isImportant: false,
      isMuted: false,
      tags: ['商品問い合わせ'],
      updatedAt: '2024-01-15T11:20:00Z'
    },
    {
      id: '4',
      type: 'group',
      group: {
        id: 'group1',
        name: 'VIP顧客グループ',
        memberCount: 12,
        avatar: null
      },
      lastMessage: {
        text: '新商品の案内です',
        timestamp: '2024-01-15T10:00:00Z',
        senderId: 'admin',
        senderName: '管理者',
        type: 'text',
        status: 'read'
      },
      unreadCount: 0,
      isImportant: false,
      isMuted: true,
      tags: ['グループ配信'],
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ]);

  // メッセージ履歴
  const [messages, setMessages] = useState({
    '1': [
      {
        id: 'm1',
        senderId: 'user1',
        senderName: '田中 太郎',
        text: 'お疲れ様です。商品の件でお聞きしたいことがあります。',
        timestamp: '2024-01-15T14:00:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: 'm2',
        senderId: 'admin',
        senderName: '管理者',
        text: 'いつもお世話になっております。どのようなご質問でしょうか？',
        timestamp: '2024-01-15T14:05:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: 'm3',
        senderId: 'user1',
        senderName: '田中 太郎',
        text: '配送日程について確認したいのですが、お電話でお話しできますでしょうか？',
        timestamp: '2024-01-15T14:10:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: 'm4',
        senderId: 'admin',
        senderName: '管理者',
        text: 'もちろんです。今すぐお電話いたします。',
        timestamp: '2024-01-15T14:25:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: 'm5',
        senderId: 'user1',
        senderName: '田中 太郎',
        text: 'ありがとうございました！',
        timestamp: '2024-01-15T14:30:00Z',
        type: 'text',
        status: 'read'
      }
    ],
    '2': [
      {
        id: 'm6',
        senderId: 'user2',
        senderName: '佐藤 花子',
        text: 'お世話になっております。来週の予約の件でご連絡しました。',
        timestamp: '2024-01-15T13:40:00Z',
        type: 'text',
        status: 'delivered'
      },
      {
        id: 'm7',
        senderId: 'user2',
        senderName: '佐藤 花子',
        text: '時間変更は可能でしょうか？',
        timestamp: '2024-01-15T13:45:00Z',
        type: 'text',
        status: 'delivered'
      }
    ]
  });

  // 最新の送信履歴（全チャット共通）
  const [recentMessages, setRecentMessages] = useState([
    {
      id: 'recent1',
      chatId: '1',
      chatName: '田中 太郎',
      message: 'もちろんです。今すぐお電話いたします。',
      timestamp: '2024-01-15T14:25:00Z',
      type: 'text',
      status: 'read'
    },
    {
      id: 'recent2',
      chatId: '4',
      chatName: 'VIP顧客グループ',
      message: '新商品の案内です',
      timestamp: '2024-01-15T10:00:00Z',
      type: 'text',
      status: 'read'
    },
    {
      id: 'recent3',
      chatId: '2',
      chatName: '佐藤 花子',
      message: '承知いたしました。確認してご連絡します。',
      timestamp: '2024-01-15T09:30:00Z',
      type: 'text',
      status: 'delivered'
    }
  ]);

  // LINE電話発信要請機能
  const requestPhoneCall = (phoneNumber, userName) => {
    if (!phoneNumber) {
      alert('電話番号が設定されていません。');
      return;
    }

    // LINE公式アカウントから電話発信要請メッセージを送信
    const confirmed = window.confirm(
      `${userName}さんにLINE経由で電話発信要請を送信しますか？\n\n` +
      `相手には「電話をかける」ボタンが表示され、タップすると弊社番号に発信されます。`
    );
    
    if (confirmed) {
      // LINE Messaging API でクイック返信付きメッセージを送信
      const callRequestMessage = {
        type: 'text',
        text: `${userName}様\n\nお忙しい中恐れ入ります。\nお電話でご相談をお受けしたく、下記ボタンから弊社までお電話をお願いいたします。`,
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'uri',
                label: '📞 電話をかける',
                uri: 'tel:03-1234-5678' // 実際の受付電話番号
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
      console.log('LINE電話発信要請送信:', { userName, message: callRequestMessage });
      
      // 発信要請ログを記録
      recordCallRequest(phoneNumber, userName);
      
      alert(`${userName}さんに電話発信要請を送信しました。\n相手がボタンをタップすると弊社に電話がかかってきます。`);
    }
  };

  // 通話ログ記録
  const recordCallLog = (phoneNumber, userName) => {
    const callLog = {
      id: Date.now(),
      phoneNumber,
      userName,
      timestamp: new Date().toISOString(),
      initiatedBy: user?.name || '管理者'
    };
    
    // 実際の実装では、APIに送信
    console.log('通話ログ記録:', callLog);
    
    // ローカルストレージに保存（デモ用）
    const existingLogs = JSON.parse(localStorage.getItem('callLogs') || '[]');
    existingLogs.unshift(callLog);
    localStorage.setItem('callLogs', JSON.stringify(existingLogs.slice(0, 50))); // 最新50件まで保存
  };

  // フィルタリング
  const filteredChats = chats
    .filter(chat => {
      const matchesSearch = searchQuery === '' ||
        (chat.user?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (chat.group?.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filterStatus === 'all' ||
        (filterStatus === 'unread' && chat.unreadCount > 0) ||
        (filterStatus === 'important' && chat.isImportant) ||
        (filterStatus === 'pinned' && chat.isPinned);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // ピン留めチャットを上位に表示
      if (a.isPinned !== b.isPinned) {
        return b.isPinned - a.isPinned;
      }
      // その後は更新時間順
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  // メッセージ送信
  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: 'admin',
      senderName: user?.name || '管理者',
      text: message,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    // メッセージ履歴に追加
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    // チャット一覧の最新メッセージを更新
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: newMessage, updatedAt: newMessage.timestamp, unreadCount: 0 }
        : chat
    ));

    // 最新送信履歴に追加
    setRecentMessages(prev => [
      {
        id: `recent${Date.now()}`,
        chatId: selectedChat.id,
        chatName: selectedChat.user?.name || selectedChat.group?.name,
        message: message,
        timestamp: newMessage.timestamp,
        type: 'text',
        status: 'sent'
      },
      ...prev.slice(0, 9) // 最新10件まで
    ]);

    setMessage('');
  };

  // LINE通話要請
  const requestLineCall = (chatUser) => {
    const callMessage = {
      id: `m${Date.now()}`,
      senderId: 'admin',
      senderName: user?.name || '管理者',
      text: 'お時間になりましたらこちらより発信ください',
      timestamp: new Date().toISOString(),
      type: 'call_request',
      status: 'sent',
      callData: {
        type: 'line_call',
        buttons: [
          { label: '📞 LINE通話をかける', action: 'call' },
          { label: '後で連絡します', action: 'later' }
        ]
      }
    };

    // メッセージ履歴に追加
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), callMessage]
    }));

    // チャット一覧の最新メッセージを更新
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: { text: 'LINE通話要請を送信しました', timestamp: callMessage.timestamp, type: 'system' }, updatedAt: callMessage.timestamp }
        : chat
    ));

    // 最新送信履歴に追加
    setRecentMessages(prev => [
      {
        id: `recent${Date.now()}`,
        chatId: selectedChat.id,
        chatName: chatUser.name,
        message: 'LINE通話要請を送信',
        timestamp: callMessage.timestamp,
        type: 'call_request',
        status: 'sent'
      },
      ...prev.slice(0, 9)
    ]);

    alert(`${chatUser.name}さんにLINE通話要請を送信しました。`);
  };

  // 複数選択でのLINE通話要請
  const sendBulkCallRequest = () => {
    setSelectedUsersForCall(filteredChats.map(chat => ({
      id: chat.user.id,
      name: chat.user.name,
      chatId: chat.id
    })));
    setShowCallRequestModal(true);
  };

  // バルク通話要請送信
  const handleBulkCallRequest = (selectedUsers, callMessage) => {
    selectedUsers.forEach(selectedUser => {
      const callMsg = {
        id: `m${Date.now()}_${selectedUser.id}`,
        senderId: 'admin',
        senderName: user?.name || '管理者',
        text: callMessage,
        timestamp: new Date().toISOString(),
        type: 'call_request',
        status: 'sent',
        callData: {
          type: 'line_call',
          buttons: [
            { label: '📞 LINE通話をかける', action: 'call' },
            { label: '後で連絡します', action: 'later' }
          ]
        }
      };

      // メッセージ履歴に追加
      setMessages(prev => ({
        ...prev,
        [selectedUser.chatId]: [...(prev[selectedUser.chatId] || []), callMsg]
      }));

      // チャット一覧更新
      setChats(prev => prev.map(chat => 
        chat.id === selectedUser.chatId 
          ? { ...chat, lastMessage: { text: 'LINE通話要請を送信しました', timestamp: callMsg.timestamp, type: 'system' }, updatedAt: callMsg.timestamp }
          : chat
      ));
    });

    alert(`${selectedUsers.length}名にLINE通話要請を送信しました。`);
    setShowCallRequestModal(false);
  };

  // 公式LINE選択（ユーザー一覧表示）
  const selectOfficialLine = async (line) => {
    setSelectedOfficialLine(line);
    setSelectedChat(null);
    setViewMode('chats');
    
    // API呼び出しでユーザー一覧を取得（実際の実装時）
    try {
      // const response = await fetch(`/api/line/${line.id}/users`);
      // const users = await response.json();
      
      // デモ用のユーザーデータを生成
      const demoUsers = generateDemoUsersForLine(line.id);
      setChats(demoUsers);
      
      // 未読数をリセット
      setOfficialLines(prev => prev.map(l => 
        l.id === line.id ? { ...l, unreadCount: 0 } : l
      ));
    } catch (error) {
      console.error('ユーザー一覧取得エラー:', error);
      alert('ユーザー一覧の取得に失敗しました。');
    }
  };

  // デモ用ユーザーデータ生成
  const generateDemoUsersForLine = (lineId) => {
    const baseUsers = [
      { name: '田中 太郎', phone: '090-1234-5678', tags: ['VIP顧客'] },
      { name: '佐藤 花子', phone: '090-2345-6789', tags: ['予約'] },
      { name: '鈴木 一郎', phone: '090-3456-7890', tags: ['商品問い合わせ'] },
      { name: '高橋 美咲', phone: '090-4567-8901', tags: ['サポート'] },
      { name: '伊藤 健太', phone: '090-5678-9012', tags: ['定期購入'] }
    ];
    
    return baseUsers.map((userData, index) => ({
      id: `${lineId}_user_${index + 1}`,
      type: 'individual',
      lineId: lineId,
      user: {
        id: `user${index + 1}_${lineId}`,
        name: userData.name,
        avatar: null,
        phone: userData.phone,
        isOnline: Math.random() > 0.5,
        lastSeen: new Date(Date.now() - Math.random() * 86400000).toISOString()
      },
      lastMessage: {
        text: `${userData.name}さんからのメッセージ`,
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        senderId: `user${index + 1}_${lineId}`,
        type: 'text',
        status: ['sent', 'delivered', 'read'][Math.floor(Math.random() * 3)]
      },
      unreadCount: Math.floor(Math.random() * 3),
      isImportant: Math.random() > 0.7,
      isMuted: false,
      isPinned: Math.random() > 0.8,
      tags: userData.tags,
      updatedAt: new Date(Date.now() - Math.random() * 3600000).toISOString()
    }));
  };

  // チャット選択
  const selectChat = (chat) => {
    setSelectedChat(chat);
    
    // 未読を既読に変更
    if (chat.unreadCount > 0) {
      setChats(prev => prev.map(c => 
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      ));
    }
  };

  // 公式LINE一覧に戻る
  const backToLines = () => {
    setViewMode('lines');
    setSelectedOfficialLine(null);
    setSelectedChat(null);
    setChats([]);
  };

  // ピン留め切り替え
  const togglePinChat = (chatId, event) => {
    event.stopPropagation();
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isPinned: !chat.isPinned }
        : chat
    ));
  };

  // 自動スクロール
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* サイドバー - 公式LINE一覧 / チャット一覧 */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* ヘッダー */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {viewMode === 'lines' ? '公式LINEアカウント' : 'チャット'}
            </h2>
            {viewMode === 'chats' && selectedOfficialLine && (
              <button
                onClick={backToLines}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                ← 戻る
              </button>
            )}
          </div>
          
          {viewMode === 'chats' && selectedOfficialLine && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedOfficialLine.name}</p>
                  <p className="text-xs text-gray-600">{selectedOfficialLine.displayName}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                <span>👥 {selectedOfficialLine.userCount}名</span>
                <span>💬 {selectedOfficialLine.stats.messages24h}通</span>
                <span className={`px-2 py-0.5 rounded-full ${selectedOfficialLine.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {selectedOfficialLine.isActive ? 'アクティブ' : '非アクティブ'}
                </span>
              </div>
            </div>
          )}
          
          {/* 検索バー */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="チャットを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* フィルター */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  filterStatus === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setFilterStatus('unread')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  filterStatus === 'unread' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                未読 ({chats.filter(c => c.unreadCount > 0).length})
              </button>
              <button
                onClick={() => setFilterStatus('important')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  filterStatus === 'important' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                重要
              </button>
              <button
                onClick={() => setFilterStatus('pinned')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  filterStatus === 'pinned' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📌 ピン留め ({chats.filter(c => c.isPinned).length})
              </button>
            </div>
            
            {/* バルクLINE通話要請ボタン */}
            <button
              onClick={sendBulkCallRequest}
              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
              title={`${filteredChats.length}名にLINE通話要請`}
            >
              <PhoneCall className="h-3 w-3" />
              <span>一括通話要請</span>
            </button>
          </div>
        </div>

        {/* 公式LINE一覧 または チャット一覧 */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'lines' ? (
            /* 公式LINE一覧表示 */
            <>
              {officialLines.map((line) => (
                <div
                  key={line.id}
                  onClick={() => selectOfficialLine(line)}
                  className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {/* 公式LINEアイコン */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-bold">L</span>
                      </div>
                      
                      {/* アクティブ状態 */}
                      {line.isActive && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                      
                      {/* 未読バッジ */}
                      {line.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {line.unreadCount > 9 ? '9+' : line.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* LINE情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {line.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(line.lastActivity).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {line.displayName} • {line.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>👥 {line.userCount.toLocaleString()}名</span>
                          <span>💬 {line.stats.messages24h}通</span>
                          <span>🟢 {line.stats.activeUsers}名</span>
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          line.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {line.isActive ? 'アクティブ' : '停止中'}
                        </span>
                      </div>
                      
                      {/* タグ */}
                      {line.tags && line.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {line.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* アクションボタン */}
                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOfficialLine(line);
                            setShowFriendGrowthModal(true);
                          }}
                          className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"
                        >
                          👥 友達獲得
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOfficialLine(line);
                            setShowAutoResponseModal(true);
                          }}
                          className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                        >
                          💬 挨拶設定
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* チャット一覧表示（従来通り） */
            <>
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
            >
              <div className="flex items-start space-x-3">
                {/* アバター */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    {chat.type === 'group' ? (
                      <Users className="h-6 w-6 text-gray-600" />
                    ) : chat.user?.avatar ? (
                      <img src={chat.user.avatar} alt="" className="w-12 h-12 rounded-full" />
                    ) : (
                      <span className="text-sm font-medium text-gray-700">
                        {(chat.user?.name || chat.group?.name)?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {/* オンライン状態 */}
                  {chat.type === 'individual' && chat.user?.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                  
                  {/* 未読バッジ */}
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                    </div>
                  )}
                </div>

                {/* チャット情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {chat.user?.name || chat.group?.name}
                      {chat.type === 'group' && (
                        <span className="ml-1 text-xs text-gray-500">({chat.group?.memberCount}名)</span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {chat.isPinned && <Pin className="h-3 w-3 text-purple-500" />}
                      {chat.isImportant && <Star className="h-3 w-3 text-yellow-500" />}
                      {chat.isMuted && <VolumeX className="h-3 w-3 text-gray-400" />}
                      <button
                        onClick={(e) => togglePinChat(chat.id, e)}
                        className={`p-1 transition-colors ${
                          chat.isPinned 
                            ? 'text-purple-600 hover:text-purple-800' 
                            : 'text-gray-400 hover:text-purple-600'
                        }`}
                        title={chat.isPinned ? 'ピン留め解除' : 'ピン留め'}
                      >
                        {chat.isPinned ? <Pin className="h-3 w-3" /> : <PinOff className="h-3 w-3" />}
                      </button>
                      {chat.type === 'individual' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedChat(chat);
                            requestLineCall(chat.user);
                          }}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="LINE通話要請"
                        >
                          <PhoneCall className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {chat.lastMessage?.senderId !== 'admin' ? '' : '自分: '}
                    {chat.lastMessage?.text}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(chat.lastMessage?.timestamp).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    
                    {/* メッセージステータス */}
                    {chat.lastMessage?.senderId === 'admin' && (
                      <div className="text-gray-400">
                        {chat.lastMessage?.status === 'sent' && <Check className="h-3 w-3" />}
                        {chat.lastMessage?.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                        {chat.lastMessage?.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                      </div>
                    )}
                  </div>
                  
                  {/* タグ */}
                  {chat.tags && chat.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {chat.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* 最新送信履歴 */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">最新送信履歴</h3>
            <RefreshCw className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            {recentMessages.slice(0, 3).map((msg) => (
              <div key={msg.id} className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Send className="h-3 w-3 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{msg.chatName}</p>
                  <p className="text-xs text-gray-600 truncate">{msg.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* メインチャット画面 */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* チャットヘッダー */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {selectedChat.type === 'group' ? (
                      <Users className="h-5 w-5 text-gray-600" />
                    ) : selectedChat.user?.avatar ? (
                      <img src={selectedChat.user.avatar} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-sm font-medium text-gray-700">
                        {(selectedChat.user?.name || selectedChat.group?.name)?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedChat.user?.name || selectedChat.group?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedOfficialLine && (
                        <span className="inline-flex items-center space-x-1 mr-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{selectedOfficialLine.name}</span>
                          <span>•</span>
                        </span>
                      )}
                      {selectedChat.type === 'group' 
                        ? `${selectedChat.group?.memberCount}名のメンバー`
                        : selectedChat.user?.isOnline 
                          ? 'オンライン' 
                          : `最終接続: ${new Date(selectedChat.user?.lastSeen).toLocaleString('ja-JP')}`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedChat.type === 'individual' && (
                    <button
                      onClick={() => requestLineCall(selectedChat.user)}
                      className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      <PhoneCall className="h-4 w-4 mr-1" />
                      LINE通話要請
                    </button>
                  )}
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                    <Info className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* メッセージ一覧 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(messages[selectedChat.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.senderId === 'admin'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}>
                    {msg.senderId !== 'admin' && (
                      <p className="text-xs text-gray-500 mb-1">{msg.senderName}</p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    
                    {/* LINE通話要請ボタン表示 */}
                    {msg.type === 'call_request' && msg.callData && (
                      <div className="mt-2 space-y-2">
                        {msg.callData.buttons.map((button, index) => (
                          <button
                            key={index}
                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              button.action === 'call' 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                            onClick={() => {
                              if (button.action === 'call') {
                                alert('LINE通話を開始します');
                              } else {
                                alert('後で連絡する旨を記録しました');
                              }
                            }}
                          >
                            {button.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className={`flex items-center justify-between mt-1 ${
                      msg.senderId === 'admin' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">
                        {new Date(msg.timestamp).toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {msg.senderId === 'admin' && (
                        <div className="ml-2">
                          {msg.status === 'sent' && <Check className="h-3 w-3" />}
                          {msg.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                          {msg.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-300" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* メッセージ入力 */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="メッセージを入力..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button 
                  onClick={() => setShowQuickReplies(!showQuickReplies)}
                  className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                    showQuickReplies ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="定型文"
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              {/* 定型文表示 */}
              {showQuickReplies && (
                <div className="mt-3 relative">
                  <QuickReplies onSendMessage={(text) => {
                    setMessage(text);
                    setShowQuickReplies(false);
                  }} />
                </div>
              )}
            </div>
          </>
        ) : (
          /* チャット未選択時 */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {viewMode === 'lines' ? '公式LINEアカウントを選択してください' : 'チャットを選択してください'}
              </h3>
              <p className="text-gray-500">
                {viewMode === 'lines' 
                  ? '左側の公式LINE一覧からアカウントを選択すると、ユーザー一覧が表示されます'
                  : '左側のチャット一覧からチャットを選択すると、メッセージが表示されます'
                }
              </p>
              {selectedOfficialLine && viewMode === 'chats' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block">
                  <p className="text-sm font-medium text-blue-900">
                    現在選択中: {selectedOfficialLine.name}
                  </p>
                  <p className="text-xs text-blue-700">
                    {selectedOfficialLine.displayName}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* バルクLINE通話要請モーダル */}
      <BulkCallRequestModal
        isOpen={showCallRequestModal}
        onClose={() => setShowCallRequestModal(false)}
        availableUsers={selectedUsersForCall}
        onSend={handleBulkCallRequest}
      />

      {/* 友達獲得モーダル */}
      <FriendGrowthModal
        isOpen={showFriendGrowthModal}
        onClose={() => setShowFriendGrowthModal(false)}
        officialLine={selectedOfficialLine}
      />

      {/* 挨拶・応答メッセージ管理モーダル */}
      <AutoResponseManager
        isOpen={showAutoResponseModal}
        onClose={() => setShowAutoResponseModal(false)}
        officialLine={selectedOfficialLine}
      />
    </div>
  );
};

export default ChatDashboard;