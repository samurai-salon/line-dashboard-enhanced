// src/components/users/UserGroupModal.jsx - ユーザーグループ管理モーダル
import React, { useState, useEffect } from 'react';
import { 
  X, Users, Plus, Edit2, Trash2, Save, Search, 
  UserPlus, UserMinus, Tag, Settings, Filter,
  ChevronDown, Check, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserGroupModal = ({ isOpen, onClose, users }) => {
  const { hasPermission, PERMISSIONS } = useAuth();
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create' | 'edit'
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    showEmpty: true,
    sortBy: 'name'
  });

  // グループフォーム状態
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    isActive: true,
    permissions: [],
    members: [],
    tags: []
  });

  if (!isOpen) return null;

  // デモグループデータ
  const demoGroups = [
    {
      id: '1',
      name: '管理者グループ',
      description: 'システム管理者用グループ',
      color: '#dc2626',
      isActive: true,
      memberCount: 3,
      members: ['1', '2'],
      permissions: ['USER_CREATE', 'USER_EDIT', 'USER_DELETE', 'SYSTEM_SETTINGS'],
      tags: ['管理', '重要'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'マーケティングチーム',
      description: 'マーケティング担当者グループ',
      color: '#059669',
      isActive: true,
      memberCount: 8,
      members: ['2', '3', '4'],
      permissions: ['ANALYTICS_VIEW', 'MESSAGE_SEND', 'USER_VIEW'],
      tags: ['マーケティング', '分析'],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-10T15:45:00Z'
    },
    {
      id: '3',
      name: 'カスタマーサポート',
      description: 'お客様サポート担当グループ',
      color: '#7c3aed',
      isActive: true,
      memberCount: 12,
      members: ['3', '5'],
      permissions: ['USER_VIEW', 'MESSAGE_SEND', 'TICKET_MANAGE'],
      tags: ['サポート', '対応'],
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-12T09:20:00Z'
    },
    {
      id: '4',
      name: '新人研修グループ',
      description: '新入社員向けの研修用グループ',
      color: '#f59e0b',
      isActive: false,
      memberCount: 0,
      members: [],
      permissions: ['USER_VIEW'],
      tags: ['研修', '新人'],
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-04T00:00:00Z'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setGroups(demoGroups);
    }
  }, [isOpen]);

  // フィルタリングされたグループ
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmpty = filters.showEmpty || group.memberCount > 0;
    
    return matchesSearch && matchesEmpty;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'members':
        return b.memberCount - a.memberCount;
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // グループ作成・編集
  const handleSaveGroup = () => {
    if (!groupForm.name.trim()) {
      alert('グループ名を入力してください。');
      return;
    }

    const newGroup = {
      id: selectedGroup?.id || `group_${Date.now()}`,
      ...groupForm,
      memberCount: groupForm.members.length,
      createdAt: selectedGroup?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (selectedGroup) {
      // 編集
      setGroups(prev => prev.map(g => g.id === selectedGroup.id ? newGroup : g));
    } else {
      // 新規作成
      setGroups(prev => [...prev, newGroup]);
    }

    resetForm();
    setActiveTab('list');
  };

  // グループ削除
  const handleDeleteGroup = (group) => {
    if (window.confirm(`「${group.name}」を削除してもよろしいですか？\n\nメンバーからグループは削除されますが、ユーザー自体は削除されません。`)) {
      setGroups(prev => prev.filter(g => g.id !== group.id));
    }
  };

  // フォームリセット
  const resetForm = () => {
    setGroupForm({
      name: '',
      description: '',
      color: '#3b82f6',
      isActive: true,
      permissions: [],
      members: [],
      tags: []
    });
    setSelectedGroup(null);
  };

  // 編集開始
  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setGroupForm({
      name: group.name,
      description: group.description,
      color: group.color,
      isActive: group.isActive,
      permissions: group.permissions || [],
      members: group.members || [],
      tags: group.tags || []
    });
    setActiveTab('edit');
  };

  // メンバー追加/削除
  const handleMemberToggle = (userId) => {
    setGroupForm(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  // 権限定義
  const availablePermissions = [
    { id: 'USER_VIEW', label: 'ユーザー表示', category: 'ユーザー管理' },
    { id: 'USER_CREATE', label: 'ユーザー作成', category: 'ユーザー管理' },
    { id: 'USER_EDIT', label: 'ユーザー編集', category: 'ユーザー管理' },
    { id: 'USER_DELETE', label: 'ユーザー削除', category: 'ユーザー管理' },
    { id: 'ANALYTICS_VIEW', label: '分析データ表示', category: '分析' },
    { id: 'ANALYTICS_EXPORT', label: 'データエクスポート', category: '分析' },
    { id: 'MESSAGE_SEND', label: 'メッセージ送信', category: 'メッセージ' },
    { id: 'MESSAGE_BROADCAST', label: '一斉送信', category: 'メッセージ' },
    { id: 'SYSTEM_SETTINGS', label: 'システム設定', category: 'システム' },
    { id: 'TICKET_MANAGE', label: 'チケット管理', category: 'サポート' }
  ];

  // グループカラーオプション
  const colorOptions = [
    { value: '#dc2626', label: '赤', class: 'bg-red-500' },
    { value: '#ea580c', label: 'オレンジ', class: 'bg-orange-500' },
    { value: '#f59e0b', label: '黄', class: 'bg-yellow-500' },
    { value: '#059669', label: '緑', class: 'bg-green-500' },
    { value: '#0891b2', label: 'シアン', class: 'bg-cyan-500' },
    { value: '#3b82f6', label: '青', class: 'bg-blue-500' },
    { value: '#7c3aed', label: '紫', class: 'bg-purple-500' },
    { value: '#be185d', label: 'ピンク', class: 'bg-pink-500' }
  ];

  // グループリスト表示
  const renderGroupList = () => (
    <div className="space-y-4">
      {/* 検索・フィルター */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="グループ名、説明で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">名前順</option>
            <option value="members">メンバー数順</option>
            <option value="created">作成日順</option>
          </select>
          
          <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
            <input
              type="checkbox"
              checked={filters.showEmpty}
              onChange={(e) => setFilters(prev => ({ ...prev, showEmpty: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">空のグループも表示</span>
          </label>
        </div>
      </div>

      {/* グループカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map(group => (
          <div key={group.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* カードヘッダー */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: group.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {group.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {group.memberCount}名のメンバー
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {!group.isActive && (
                    <div className="w-2 h-2 bg-gray-400 rounded-full" title="無効"></div>
                  )}
                  
                  {hasPermission(PERMISSIONS.USER_EDIT) && (
                    <>
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="編集"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteGroup(group)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* カード内容 */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {group.description || 'グループの説明はありません。'}
              </p>
              
              {/* タグ */}
              {group.tags && group.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {group.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {group.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{group.tags.length - 3}</span>
                  )}
                </div>
              )}
              
              {/* 権限数 */}
              <div className="text-xs text-gray-500">
                {group.permissions?.length || 0}個の権限
              </div>
            </div>

            {/* フッター */}
            <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500">
              更新: {new Date(group.updatedAt).toLocaleDateString('ja-JP')}
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">グループが見つかりません</h3>
          <p className="text-gray-500">検索条件を変更するか、新しいグループを作成してください。</p>
        </div>
      )}
    </div>
  );

  // グループ作成/編集フォーム
  const renderGroupForm = () => (
    <div className="space-y-6">
      {/* 基本情報 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-900 mb-4">基本情報</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              グループ名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={groupForm.name}
              onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="管理者グループ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カラー
            </label>
            <div className="flex space-x-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setGroupForm(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-full ${color.class} ${
                    groupForm.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            説明
          </label>
          <textarea
            value={groupForm.description}
            onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="グループの目的や役割を説明してください"
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={groupForm.isActive}
              onChange={(e) => setGroupForm(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">グループを有効化</span>
          </label>
        </div>
      </div>

      {/* 権限設定 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          権限設定
        </h4>
        
        <div className="space-y-4">
          {Object.entries(
            availablePermissions.reduce((acc, perm) => {
              if (!acc[perm.category]) acc[perm.category] = [];
              acc[perm.category].push(perm);
              return acc;
            }, {})
          ).map(([category, perms]) => (
            <div key={category}>
              <h5 className="font-medium text-gray-700 mb-2">{category}</h5>
              <div className="grid grid-cols-2 gap-2">
                {perms.map(perm => (
                  <label key={perm.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={groupForm.permissions.includes(perm.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGroupForm(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, perm.id]
                          }));
                        } else {
                          setGroupForm(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p !== perm.id)
                          }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* メンバー選択 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          メンバー選択 ({groupForm.members.length}名)
        </h4>
        
        <div className="max-h-64 overflow-y-auto space-y-2">
          {users.map(user => (
            <label key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={groupForm.members.includes(user.id)}
                onChange={() => handleMemberToggle(user.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <span className="text-sm font-medium text-gray-700">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* オーバーレイ */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* モーダル */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    ユーザーグループ管理
                  </h3>
                  <p className="text-sm text-purple-100">
                    グループを作成してユーザーの権限を管理します
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('list')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                グループ一覧 ({groups.length})
              </button>
              
              {hasPermission(PERMISSIONS.USER_CREATE) && (
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('create');
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'create'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  新規作成
                </button>
              )}
              
              {activeTab === 'edit' && (
                <button
                  className="py-4 px-1 border-b-2 border-purple-500 text-purple-600 font-medium text-sm"
                >
                  グループ編集
                </button>
              )}
            </nav>
          </div>

          {/* コンテンツ */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {activeTab === 'list' && renderGroupList()}
            {(activeTab === 'create' || activeTab === 'edit') && renderGroupForm()}
          </div>

          {/* フッター */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {activeTab === 'list' ? (
                `${filteredGroups.length}件のグループを表示中`
              ) : (
                `${activeTab === 'edit' ? 'グループを編集' : '新しいグループを作成'}`
              )}
            </div>
            
            <div className="flex space-x-3">
              {(activeTab === 'create' || activeTab === 'edit') && (
                <>
                  <button
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  
                  <button
                    onClick={handleSaveGroup}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                    {activeTab === 'edit' ? '更新' : '作成'}
                  </button>
                </>
              )}
              
              {activeTab === 'list' && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  閉じる
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGroupModal;