import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, Phone, Calendar, MapPin, Tag, Activity,
  MessageSquare, Eye, Send, TrendingUp, Edit3, Save,
  Clock, CheckCircle, XCircle, Star, Heart, Smile
} from 'lucide-react';

const UserDetailModal = ({ user, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});

  // モック活動データ
  const [activities] = useState([
    {
      id: 1,
      type: 'message_received',
      title: 'メッセージ受信',
      description: '「ありがとうございます！」',
      timestamp: '2024-01-20T10:30:00',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      id: 2,
      type: 'broadcast_opened',
      title: '配信メッセージ開封',
      description: '新商品キャンペーンのお知らせ',
      timestamp: '2024-01-20T09:15:00',
      icon: Eye,
      color: 'green'
    },
    {
      id: 3,
      type: 'emoji_used',
      title: '絵文字使用',
      description: '😊 スマイル絵文字を使用',
      timestamp: '2024-01-19T16:45:00',
      icon: Smile,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'segment_changed',
      title: 'セグメント変更',
      description: 'スタンダード → プレミアム',
      timestamp: '2024-01-19T14:20:00',
      icon: Star,
      color: 'purple'
    }
  ]);

  const [messageHistory] = useState([
    {
      id: 1,
      type: 'received',
      content: 'ありがとうございます！新商品の情報が参考になりました。',
      timestamp: '2024-01-20T10:30:00',
      status: 'delivered'
    },
    {
      id: 2,
      type: 'sent',
      content: '新商品のお知らせです。詳細はこちらをご確認ください。',
      timestamp: '2024-01-20T09:00:00',
      status: 'read',
      openedAt: '2024-01-20T09:15:00'
    },
    {
      id: 3,
      type: 'received',
      content: 'こんにちは！質問があります。',
      timestamp: '2024-01-19T16:45:00',
      status: 'delivered'
    }
  ]);

  const [stats] = useState({
    totalMessages: 45,
    receivedMessages: 28,
    sentMessages: 17,
    averageResponseTime: '2時間15分',
    openRate: 89.5,
    clickRate: 34.2,
    lastActive: '2024-01-20T10:30:00',
    joinDate: '2024-01-15T00:00:00',
    totalSessions: 156,
    favoriteEmojis: ['😊', '👍', '❤️', '🎉']
  });

  useEffect(() => {
    setEditedUser(user || {});
  }, [user]);

  if (!isOpen || !user) return null;

  const tabs = [
    { id: 'profile', name: 'プロフィール', icon: User },
    { id: 'activity', name: 'アクティビティ', icon: Activity },
    { id: 'messages', name: 'メッセージ履歴', icon: MessageSquare },
    { id: 'analytics', name: '統計', icon: TrendingUp }
  ];

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('ja-JP');
  };

  const getActivityIcon = (activity) => {
    const IconComponent = activity.icon;
    const colorMap = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      purple: 'text-purple-600 bg-purple-100',
      red: 'text-red-600 bg-red-100'
    };
    
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap[activity.color]}`}>
        <IconComponent className="w-4 h-4" />
      </div>
    );
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* 基本情報 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">基本情報</h3>
          <button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>キャンセル</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>編集</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name || ''}
                onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.displayName || ''}
                onChange={(e) => setEditedUser(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{user.displayName || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            {isEditing ? (
              <input
                type="email"
                value={editedUser.email || ''}
                onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser.phone || ''}
                onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{user.phone || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LINE ID</label>
            <p className="text-gray-900">@{user.lineId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.location || ''}
                onChange={(e) => setEditedUser(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{user.location || '-'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-4 flex items-center space-x-3">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>保存</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              <X className="w-4 h-4" />
              <span>キャンセル</span>
            </button>
          </div>
        )}
      </div>

      {/* タグ・セグメント */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">タグ・セグメント</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">タグ</label>
            <div className="flex flex-wrap gap-2">
              {user.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              <button className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full hover:bg-gray-300">
                + タグ追加
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">セグメント</label>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {user.segmentId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">最近のアクティビティ</h3>
        <span className="text-sm text-gray-500">{activities.length}件のアクティビティ</span>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            {getActivityIcon(activity)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">メッセージ履歴</h3>
        <span className="text-sm text-gray-500">{messageHistory.length}件のメッセージ</span>
      </div>

      <div className="space-y-3">
        {messageHistory.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'sent'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-75">
                  {formatDate(message.timestamp)}
                </span>
                {message.type === 'sent' && (
                  <div className="flex items-center space-x-1">
                    {message.status === 'read' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.status === 'read' ? '既読' : '未読'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">総メッセージ数</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.totalMessages}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">開封率</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.openRate}%</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Send className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">クリック率</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{stats.clickRate}%</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">平均応答時間</span>
          </div>
          <p className="text-lg font-bold text-orange-900">{stats.averageResponseTime}</p>
        </div>
      </div>

      {/* 詳細統計 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細統計</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">受信メッセージ</span>
              <span className="text-sm font-medium">{stats.receivedMessages}件</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">送信メッセージ</span>
              <span className="text-sm font-medium">{stats.sentMessages}件</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">総セッション数</span>
              <span className="text-sm font-medium">{stats.totalSessions}回</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">友達追加日</span>
              <span className="text-sm font-medium">{formatDate(stats.joinDate)}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">よく使う絵文字</h4>
            <div className="flex space-x-2">
              {stats.favoriteEmojis.map((emoji, index) => (
                <span key={index} className="text-2xl">{emoji}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-700">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">@{user.lineId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'activity' && renderActivityTab()}
          {activeTab === 'messages' && renderMessagesTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;