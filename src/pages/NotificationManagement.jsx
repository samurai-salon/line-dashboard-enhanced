
// src/pages/notifications/NotificationManagement.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotificationManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockNotifications = [
    {
      id: 1,
      title: '新商品のお知らせ',
      message: '新しい商品が入荷しました！今すぐチェックしてください。',
      status: 'sent',
      recipients: 1247,
      openRate: 87.2,
      clickRate: 34.5,
      createdAt: '2024-01-15T10:30:00Z',
      sentAt: '2024-01-15T11:00:00Z',
      createdBy: 'admin@demo.com'
    },
    {
      id: 2,
      title: 'セール開始のお知らせ',
      message: '期間限定セール開始！最大50%オフでご提供中です。',
      status: 'scheduled',
      recipients: 1150,
      scheduledAt: '2024-01-20T09:00:00Z',
      createdAt: '2024-01-14T15:20:00Z',
      createdBy: 'manager@demo.com'
    },
    {
      id: 3,
      title: 'メンテナンスのお知らせ',
      message: 'システムメンテナンスを実施します。ご不便をおかけします。',
      status: 'draft',
      recipients: 0,
      createdAt: '2024-01-14T09:15:00Z',
      createdBy: 'operator@demo.com'
    },
    {
      id: 4,
      title: 'イベント開催のお知らせ',
      message: '特別イベントを開催します！参加お待ちしています。',
      status: 'failed',
      recipients: 1200,
      createdAt: '2024-01-13T14:30:00Z',
      createdBy: 'admin@demo.com',
      failureReason: 'API接続エラー'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { label: '送信済み', color: 'bg-green-100 text-green-800' },
      scheduled: { label: '予約済み', color: 'bg-blue-100 text-blue-800' },
      draft: { label: '下書き', color: 'bg-gray-100 text-gray-800' },
      failed: { label: '送信失敗', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Edit className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const canCreate = ['admin', 'manager', 'operator'].includes(user?.role);
  const canEdit = ['admin', 'manager'].includes(user?.role);
  const canDelete = ['admin'].includes(user?.role);

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            プッシュ通知管理
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            LINE友達への通知を作成・管理します
          </p>
        </div>
        {canCreate && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/notifications/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              新しい通知を作成
            </Link>
          </div>
        )}
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="通知を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3 sm:mt-0">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">すべてのステータス</option>
                <option value="sent">送信済み</option>
                <option value="scheduled">予約済み</option>
                <option value="draft">下書き</option>
                <option value="failed">送信失敗</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 通知リスト */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <li key={notification.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(notification.status)}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/notifications/${notification.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-green-600"
                      >
                        {notification.title}
                      </Link>
                      <p className="text-sm text-gray-500 truncate">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(notification.status)}
                    <div className="text-right">
                      <p className="text-sm text-gray-900">
                        {notification.recipients.toLocaleString()} 人
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </div>
                
                {notification.status === 'sent' && (
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex sm:space-x-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        開封率: {notification.openRate}%
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Send className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        クリック率: {notification.clickRate}%
                      </div>
                    </div>
                  </div>
                )}

                {notification.status === 'failed' && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">
                      エラー: {notification.failureReason}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">通知が見つかりません</h3>
          <p className="mt-1 text-sm text-gray-500">
            検索条件を変更するか、新しい通知を作成してください。
          </p>
          {canCreate && (
            <div className="mt-6">
              <Link
                to="/notifications/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                新しい通知を作成
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;