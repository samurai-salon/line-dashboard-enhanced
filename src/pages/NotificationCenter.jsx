// src/pages/NotificationCenter.jsx - 通知センター専用ページ
import React, { useState } from 'react';
import { 
  Bell, Check, Trash2, Archive, Filter, Search, 
  User, MessageSquare, Settings, AlertCircle, Info, CheckCircle,
  Clock, ChevronRight
} from 'lucide-react';

const NotificationCenter = () => {
  const [filter, setFilter] = useState('all'); // all, unread, system, messages
  const [searchQuery, setSearchQuery] = useState('');

  // デモ用の通知データ
  const [notifications] = useState([
    {
      id: 1,
      type: 'user',
      title: '新しいユーザーが登録されました',
      message: '田中太郎さんが友だち追加しました',
      time: '5分前',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      unread: true,
      priority: 'normal'
    },
    {
      id: 2,
      type: 'message',
      title: 'プッシュ通知の送信が完了しました',
      message: '「新商品キャンペーン」の配信が4,090人に正常に送信されました。開封率: 67.2%',
      time: '10分前',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      unread: true,
      priority: 'high'
    },
    {
      id: 3,
      type: 'system',
      title: 'システムメンテナンスのお知らせ',
      message: '明日午前2:00-4:00にシステムメンテナンスを実施します',
      time: '1時間前',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      unread: false,
      priority: 'high'
    },
    {
      id: 4,
      type: 'message',
      title: '絵文字の使用統計更新',
      message: '😊 スマイル絵文字が今日245回使用されました',
      time: '2時間前',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: false,
      priority: 'low'
    },
    {
      id: 5,
      type: 'user',
      title: 'ユーザーからのお問い合わせ',
      message: '佐藤花子さんからチャットでお問い合わせが届いています',
      time: '3時間前',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unread: false,
      priority: 'normal'
    },
    {
      id: 6,
      type: 'system',
      title: 'バックアップ完了',
      message: '定期バックアップが正常に完了しました',
      time: '6時間前',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      unread: false,
      priority: 'low'
    }
  ]);

  // フィルタリングされた通知
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && notification.unread) ||
                         (filter === 'system' && notification.type === 'system') ||
                         (filter === 'messages' && notification.type === 'message') ||
                         (filter === 'users' && notification.type === 'user');
    
    const matchesSearch = searchQuery === '' || 
                         notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // アイコン取得
  const getNotificationIcon = (type, priority) => {
    const iconClass = `w-6 h-6 ${
      priority === 'high' ? 'text-red-600' :
      priority === 'normal' ? 'text-blue-600' : 'text-gray-600'
    }`;

    switch (type) {
      case 'user':
        return <User className={iconClass} />;
      case 'message':
        return <MessageSquare className={iconClass} />;
      case 'system':
        return <Settings className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  // 未読数
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="w-7 h-7 mr-3 text-blue-600" />
              通知センター
            </h1>
            <p className="text-gray-600 mt-1">
              システム通知・メッセージ・ユーザー活動を一元管理
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              未読: <span className="font-semibold text-blue-600">{unreadCount}件</span>
            </span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>すべて既読</span>
            </button>
          </div>
        </div>
      </div>

      {/* フィルター・検索バー */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* 検索 */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="通知を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* フィルター */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'すべて', icon: Bell },
              { key: 'unread', label: '未読', icon: AlertCircle },
              { key: 'system', label: 'システム', icon: Settings },
              { key: 'messages', label: 'メッセージ', icon: MessageSquare },
              { key: 'users', label: 'ユーザー', icon: User }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center space-x-2 ${
                  filter === key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 通知リスト */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            通知一覧 ({filteredNotifications.length}件)
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                  notification.unread ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* アイコン */}
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    notification.priority === 'high' ? 'bg-red-100' :
                    notification.priority === 'normal' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>

                  {/* 通知内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-base font-semibold mb-1 ${
                          notification.unread ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                          {notification.unread && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.time}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                            notification.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {notification.priority === 'high' ? '重要' :
                             notification.priority === 'normal' ? '通常' : '参考'}
                          </span>
                        </div>
                      </div>
                      
                      {/* アクション */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Archive className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">通知がありません</h3>
              <p className="text-gray-600">
                {searchQuery ? '検索条件に一致する通知が見つかりません' : '現在表示する通知がありません'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
          <p className="text-sm text-gray-600">総通知数</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
          <p className="text-sm text-gray-600">未読通知</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {notifications.filter(n => n.priority === 'high').length}
          </p>
          <p className="text-sm text-gray-600">重要通知</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {notifications.filter(n => n.type === 'message').length}
          </p>
          <p className="text-sm text-gray-600">メッセージ通知</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;