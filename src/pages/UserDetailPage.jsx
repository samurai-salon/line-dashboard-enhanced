// src/pages/UserDetailPage.jsx - ユーザー詳細ページ
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit3, Trash2, MoreHorizontal, Shield, UserX, 
  Mail, Phone, Calendar, MapPin, Activity, MessageSquare,
  Eye, Send, TrendingUp, Clock, CheckCircle, XCircle,
  Star, Heart, Smile, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // モックユーザーデータ
  const mockUsers = {
    '1': {
      id: '1',
      name: '田中 太郎',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
      status: 'active',
      lineId: 'Ub1234567890abcdef1234567890abcdef1',
      joinedAt: '2024-01-15T10:30:00Z',
      lastActiveAt: '2024-01-20T14:22:00Z',
      location: '東京都渋谷区',
      age: 28,
      gender: '男性',
      tags: ['VIP', '常連客', '推奨商品A'],
      messageCount: 145,
      totalSpent: 89000,
      averageResponse: '2分',
      satisfaction: 4.8
    },
    '2': {
      id: '2',
      name: '佐藤 花子',
      email: 'sato@example.com',
      phone: '080-9876-5432',
      status: 'inactive',
      lineId: 'Ub2345678901bcdef2345678901bcdef2',
      joinedAt: '2024-01-10T09:15:00Z',
      lastActiveAt: '2024-01-18T11:30:00Z',
      location: '大阪府大阪市',
      age: 34,
      gender: '女性',
      tags: ['新規客'],
      messageCount: 23,
      totalSpent: 15000,
      averageResponse: '5分',
      satisfaction: 4.2
    }
  };

  // 活動履歴データ
  const [activities] = useState([
    {
      id: 1,
      type: 'message_received',
      title: 'メッセージ受信',
      description: '「ありがとうございます！」',
      timestamp: '2024-01-20T14:22:00',
      icon: MessageSquare,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'purchase',
      title: '商品購入',
      description: '商品A × 2個 (¥5,000)',
      timestamp: '2024-01-20T13:45:00',
      icon: Star,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'follow',
      title: '友達追加',
      description: 'LINE友達に追加されました',
      timestamp: '2024-01-15T10:30:00',
      icon: Heart,
      color: 'text-pink-500'
    }
  ]);

  // メッセージ履歴データ
  const [messages] = useState([
    {
      id: 1,
      content: 'こんにちは！新商品のご案内です。',
      type: 'sent',
      timestamp: '2024-01-20T10:00:00',
      status: 'delivered'
    },
    {
      id: 2,
      content: 'ありがとうございます！詳細を教えてください。',
      type: 'received',
      timestamp: '2024-01-20T10:05:00'
    },
    {
      id: 3,
      content: '商品Aは現在キャンペーン中で20%オフです。',
      type: 'sent',
      timestamp: '2024-01-20T10:06:00',
      status: 'read'
    }
  ]);

  useEffect(() => {
    // ユーザーデータの取得（模擬）
    const fetchUser = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // 模擬遅延
      
      const userData = mockUsers[id];
      if (userData) {
        setUser(userData);
      }
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  const handleStatusChange = (newStatus) => {
    setUser(prev => ({ ...prev, status: newStatus }));
  };

  const handleDelete = () => {
    if (window.confirm('このユーザーを削除しますか？')) {
      navigate('/users');
    }
  };

  const tabs = [
    { id: 'overview', name: '概要', icon: Eye },
    { id: 'activity', name: '活動履歴', icon: Activity },
    { id: 'messages', name: 'メッセージ', icon: MessageSquare },
    { id: 'analytics', name: '分析', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">ユーザーが見つかりません</h3>
        <p className="text-gray-500 mb-4">指定されたユーザーは存在しないか、削除されています。</p>
        <Link
          to="/users"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ユーザー一覧に戻る
        </Link>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 基本情報 */}
      <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">メールアドレス</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">電話番号</p>
              <p className="text-sm font-medium text-gray-900">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">所在地</p>
              <p className="text-sm font-medium text-gray-900">{user.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">登録日</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(user.joinedAt).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
        </div>
        
        {/* タグ */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">タグ</h4>
          <div className="flex flex-wrap gap-2">
            {user.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">統計情報</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">メッセージ数</p>
              <p className="text-2xl font-bold text-gray-900">{user.messageCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">累計購入金額</p>
              <p className="text-2xl font-bold text-green-600">¥{user.totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">平均応答時間</p>
              <p className="text-2xl font-bold text-blue-600">{user.averageResponse}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">満足度</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-yellow-600">{user.satisfaction}</p>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(user.satisfaction) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">活動履歴</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <Icon className={`h-5 w-5 mt-1 ${activity.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">メッセージ履歴</h3>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="px-6 py-4">
            <div className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'sent' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${
                    message.type === 'sent' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('ja-JP')}
                  </span>
                  {message.type === 'sent' && message.status && (
                    <span className="text-xs text-green-100">
                      {message.status === 'read' ? '既読' : '配信済み'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">エンゲージメント</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">メッセージ開封率</span>
            <span className="text-sm font-medium">94%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">リンククリック率</span>
            <span className="text-sm font-medium">68%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">アクション実行率</span>
            <span className="text-sm font-medium">42%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">行動分析</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">最も活発な時間帯</span>
            <span className="text-sm font-medium">14:00-16:00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">よく使う機能</span>
            <span className="text-sm font-medium">商品検索</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">継続利用日数</span>
            <span className="text-sm font-medium">45日</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/users"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                ユーザー一覧に戻る
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleStatusChange(user.status === 'active' ? 'inactive' : 'active')}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                  user.status === 'active'
                    ? 'text-red-700 bg-red-100 hover:bg-red-200'
                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                }`}
              >
                {user.status === 'active' ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    無効化
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    有効化
                  </>
                )}
              </button>
              <button
                onClick={() => alert('編集機能は次のフェーズで実装予定です')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                編集
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                削除
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? '有効' : '無効'}
                  </span>
                  <span className="text-sm text-gray-500">
                    最終アクティブ: {new Date(user.lastActiveAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'activity' && renderActivity()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;