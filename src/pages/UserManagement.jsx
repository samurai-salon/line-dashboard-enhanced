
// src/pages/users/UserManagement.jsx - ユーザー管理メイン画面
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Search, Filter, Plus, Download, Upload, MoreHorizontal,
  Edit2, Trash2, Mail, Shield, Eye, UserCheck, UserX, Settings,
  ChevronDown, Calendar, MapPin, Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserDetailModal from '../components/users/UserDetailModal';
import UserEditModal from '../components/users/UserEditModal';
import UserGroupModal from '../components/users/UserGroupModal';
import ExportModal from '../components/users/ExportModal';
import ImportModal from '../components/users/ImportModal';
import ImportExportHistory from '../components/users/ImportExportHistory';

// ユーザーリストコンポーネント
const UserList = ({ users, onEditUser, onDeleteUser, onToggleStatus, onViewUser, loading }) => {
  const { hasPermission, PERMISSIONS } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // ソート処理
  const sortedUsers = useMemo(() => {
    const sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // 日付の場合
        if (sortConfig.key.includes('At')) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // ソート切り替え
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // チェックボックス処理
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // ロールバッジコンポーネント
  const RoleBadge = ({ role }) => {
    const roleConfig = {
      super_admin: { color: 'bg-purple-100 text-purple-800', label: 'スーパー管理者' },
      admin: { color: 'bg-red-100 text-red-800', label: '管理者' },
      manager: { color: 'bg-blue-100 text-blue-800', label: 'マネージャー' },
      operator: { color: 'bg-green-100 text-green-800', label: 'オペレーター' },
      viewer: { color: 'bg-gray-100 text-gray-800', label: '閲覧者' }
    };

    const config = roleConfig[role] || roleConfig.viewer;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // ステータスバッジコンポーネント
  const StatusBadge = ({ isActive }) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'アクティブ' : '無効'}
    </span>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">ユーザー情報を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* テーブルヘッダー */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length && users.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedUsers.length > 0 ? `${selectedUsers.length}件選択中` : 'すべて選択'}
            </span>
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {/* 一括編集 */}}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              >
                一括編集
              </button>
              <button
                onClick={() => {/* 一括削除 */}}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
              >
                一括削除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3"></th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>ユーザー</span>
                  {sortConfig.key === 'name' && (
                    <ChevronDown className={`h-4 w-4 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center space-x-1">
                  <span>ロール</span>
                  {sortConfig.key === 'role' && (
                    <ChevronDown className={`h-4 w-4 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('lastLoginAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>最終ログイン</span>
                  {sortConfig.key === 'lastLoginAt' && (
                    <ChevronDown className={`h-4 w-4 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                        ) : (
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link 
                        to={`/users/${user.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-green-600"
                      >
                        {user.name}
                      </Link>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.lastLoginAt ? (
                    <div>
                      <div>{new Date(user.lastLoginAt).toLocaleDateString('ja-JP')}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(user.lastLoginAt).toLocaleTimeString('ja-JP')}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">未ログイン</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge isActive={user.isActive} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {hasPermission(PERMISSIONS.USER_VIEW) && (
                      <Link
                        to={`/users/${user.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="詳細表示"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    
                    {hasPermission(PERMISSIONS.USER_EDIT) && (
                      <button
                        onClick={() => onEditUser(user)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="編集"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}

                    {hasPermission(PERMISSIONS.USER_EDIT) && (
                      <button
                        onClick={() => onToggleStatus(user)}
                        className={`p-1 ${user.isActive 
                          ? 'text-orange-600 hover:text-orange-900' 
                          : 'text-green-600 hover:text-green-900'
                        }`}
                        title={user.isActive ? '無効化' : '有効化'}
                      >
                        {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    )}

                    {hasPermission(PERMISSIONS.USER_DELETE) && (
                      <button
                        onClick={() => onDeleteUser(user)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ユーザーが見つかりません</h3>
          <p className="text-gray-500">検索条件を変更するか、新しいユーザーを追加してください。</p>
        </div>
      )}
    </div>
  );
};

// フィルター・検索コンポーネント
const UserFilters = ({ filters, onFiltersChange, onExport, onImport }) => {
  const { hasPermission, PERMISSIONS } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* 検索 */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="名前、メール、電話番号で検索..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ロールフィルター */}
        <div>
          <select
            value={filters.role}
            onChange={(e) => onFiltersChange({ ...filters, role: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">すべてのロール</option>
            <option value="super_admin">スーパー管理者</option>
            <option value="admin">管理者</option>
            <option value="manager">マネージャー</option>
            <option value="operator">オペレーター</option>
            <option value="viewer">閲覧者</option>
          </select>
        </div>

        {/* ステータスフィルター */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">すべてのステータス</option>
            <option value="active">アクティブ</option>
            <option value="inactive">無効</option>
          </select>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-wrap items-center gap-3">
        {hasPermission(PERMISSIONS.USER_CREATE) && (
          <Link 
            to="/users/create"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>ユーザー追加</span>
          </Link>
        )}

        {hasPermission(PERMISSIONS.ANALYTICS_EXPORT) && (
          <button 
            onClick={onExport}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>CSVエクスポート</span>
          </button>
        )}

        {hasPermission(PERMISSIONS.USER_CREATE) && (
          <button 
            onClick={onImport}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>CSVインポート</span>
          </button>
        )}

        {hasPermission(PERMISSIONS.USER_CREATE) && (
          <button 
            onClick={() => setShowGroupModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>グループ管理</span>
          </button>
        )}
        
        <button 
          onClick={() => setShowHistoryModal(true)}
          className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>インポート/エクスポート履歴</span>
        </button>
      </div>
    </div>
  );
};

// メインのユーザー管理コンポーネント
const UserManagement = () => {
  const { hasPermission, PERMISSIONS } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // デモユーザーデータ
  const demoUsers = [
    {
      id: '1',
      name: '田中 太郎',
      email: 'tanaka@example.com',
      role: 'admin',
      isActive: true,
      lastLoginAt: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      avatar: null,
      phone: '090-1234-5678',
      department: '管理部'
    },
    {
      id: '2',
      name: '佐藤 花子',
      email: 'sato@example.com',
      role: 'manager',
      isActive: true,
      lastLoginAt: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-02T00:00:00Z',
      avatar: null,
      phone: '090-2345-6789',
      department: 'マーケティング部'
    },
    {
      id: '3',
      name: '鈴木 一郎',
      email: 'suzuki@example.com',
      role: 'operator',
      isActive: true,
      lastLoginAt: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z',
      avatar: null,
      phone: '090-3456-7890',
      department: 'カスタマーサポート'
    },
    {
      id: '4',
      name: '高橋 美咲',
      email: 'takahashi@example.com',
      role: 'viewer',
      isActive: false,
      lastLoginAt: '2024-01-10T14:20:00Z',
      createdAt: '2024-01-04T00:00:00Z',
      avatar: null,
      phone: '090-4567-8901',
      department: '営業部'
    },
    {
      id: '5',
      name: '山田 次郎',
      email: 'yamada@example.com',
      role: 'operator',
      isActive: true,
      lastLoginAt: null,
      createdAt: '2024-01-05T00:00:00Z',
      avatar: null,
      phone: '090-5678-9012',
      department: 'カスタマーサポート'
    }
  ];

  // 初期データ読み込み
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      // 実際のAPIコールをシミュレート
      setTimeout(() => {
        setUsers(demoUsers);
        setLoading(false);
      }, 1000);
    };

    loadUsers();
  }, []);

  // フィルタリング処理
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = filters.search === '' || 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone?.includes(filters.search);

      const matchesRole = filters.role === '' || user.role === filters.role;

      const matchesStatus = filters.status === '' || 
        (filters.status === 'active' && user.isActive) ||
        (filters.status === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  // ユーザー詳細表示
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // ユーザー編集
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // ユーザー更新
  const handleUpdateUser = (updatedUser) => {
    setUsers(prev => prev.map(u => 
      u.id === updatedUser.id ? { ...u, ...updatedUser } : u
    ));
    setShowUserModal(false);
  };

  // ユーザー削除
  const handleDeleteUser = (user) => {
    if (window.confirm(`${user.name}さんを削除してもよろしいですか？`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  // ステータス切り替え
  const handleToggleStatus = (user) => {
    const action = user.isActive ? '無効化' : '有効化';
    if (window.confirm(`${user.name}さんを${action}してもよろしいですか？`)) {
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      ));
    }
  };

  // CSVエクスポート
  const handleExport = () => {
    setShowExportModal(true);
  };

  // CSVインポート
  const handleImport = () => {
    setShowImportModal(true);
  };

  // インポート完了処理
  const handleImportComplete = (importedUsers, results) => {
    if (results.success > 0) {
      // 新規ユーザーを既存ユーザーリストに追加
      setUsers(prev => [...prev, ...importedUsers]);
      
      // 成功通知
      alert(`${results.success}件のユーザーを正常にインポートしました。\n失敗: ${results.errors}件\nスキップ: ${results.skipped}件`);
    }
    
    setShowImportModal(false);
  };

  if (!hasPermission(PERMISSIONS.USER_VIEW)) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">アクセス権限がありません</h3>
        <p className="text-gray-500">ユーザー管理機能を利用する権限がありません。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="text-gray-600 mt-1">
            システムユーザーの管理と権限設定を行います
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          総数: {users.length}名 | 表示: {filteredUsers.length}名
        </div>
      </div>

      {/* フィルター・検索 */}
      <UserFilters 
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* ユーザーリスト */}
      <UserList 
        users={filteredUsers}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        onViewUser={handleViewUser}
        loading={loading}
      />

      {/* ユーザー詳細モーダル */}
      <UserDetailModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUpdateUser}
      />

      {/* エクスポートモーダル */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        users={filteredUsers}
        currentFilters={filters}
      />

      {/* インポートモーダル */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
        existingUsers={users}
      />

      {/* ユーザー編集モーダル */}
      <UserEditModal
        user={selectedUser}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUpdateUser}
      />

      {/* ユーザーグループ管理モーダル */}
      <UserGroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        users={users}
      />

      {/* インポート/エクスポート履歴モーダル */}
      <ImportExportHistory
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </div>
  );
};

export default UserManagement;