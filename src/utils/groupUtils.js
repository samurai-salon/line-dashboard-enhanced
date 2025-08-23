// src/utils/groupUtils.js - グループ管理ユーティリティ
export const GROUP_PERMISSIONS = {
  // ユーザー管理
  USER_VIEW: 'USER_VIEW',
  USER_CREATE: 'USER_CREATE',
  USER_EDIT: 'USER_EDIT',
  USER_DELETE: 'USER_DELETE',
  
  // 分析
  ANALYTICS_VIEW: 'ANALYTICS_VIEW',
  ANALYTICS_EXPORT: 'ANALYTICS_EXPORT',
  
  // メッセージ
  MESSAGE_SEND: 'MESSAGE_SEND',
  MESSAGE_BROADCAST: 'MESSAGE_BROADCAST',
  MESSAGE_TEMPLATE: 'MESSAGE_TEMPLATE',
  
  // システム
  SYSTEM_SETTINGS: 'SYSTEM_SETTINGS',
  SYSTEM_BACKUP: 'SYSTEM_BACKUP',
  
  // サポート
  TICKET_MANAGE: 'TICKET_MANAGE',
  TICKET_ASSIGN: 'TICKET_ASSIGN',
  
  // 権限管理
  PERMISSION_MANAGE: 'PERMISSION_MANAGE',
  GROUP_MANAGE: 'GROUP_MANAGE'
};

// 権限の詳細情報
export const PERMISSION_DETAILS = {
  [GROUP_PERMISSIONS.USER_VIEW]: {
    label: 'ユーザー表示',
    description: 'ユーザー情報の閲覧',
    category: 'ユーザー管理',
    level: 1
  },
  [GROUP_PERMISSIONS.USER_CREATE]: {
    label: 'ユーザー作成',
    description: '新規ユーザーの作成',
    category: 'ユーザー管理',
    level: 2
  },
  [GROUP_PERMISSIONS.USER_EDIT]: {
    label: 'ユーザー編集',
    description: 'ユーザー情報の編集',
    category: 'ユーザー管理',
    level: 2
  },
  [GROUP_PERMISSIONS.USER_DELETE]: {
    label: 'ユーザー削除',
    description: 'ユーザーの削除',
    category: 'ユーザー管理',
    level: 3
  },
  [GROUP_PERMISSIONS.ANALYTICS_VIEW]: {
    label: '分析データ表示',
    description: 'アナリティクスデータの閲覧',
    category: '分析',
    level: 1
  },
  [GROUP_PERMISSIONS.ANALYTICS_EXPORT]: {
    label: 'データエクスポート',
    description: 'データの書き出し',
    category: '分析',
    level: 2
  },
  [GROUP_PERMISSIONS.MESSAGE_SEND]: {
    label: 'メッセージ送信',
    description: '個別メッセージの送信',
    category: 'メッセージ',
    level: 1
  },
  [GROUP_PERMISSIONS.MESSAGE_BROADCAST]: {
    label: '一斉送信',
    description: '複数ユーザーへの一斉送信',
    category: 'メッセージ',
    level: 2
  },
  [GROUP_PERMISSIONS.MESSAGE_TEMPLATE]: {
    label: 'テンプレート管理',
    description: 'メッセージテンプレートの管理',
    category: 'メッセージ',
    level: 2
  },
  [GROUP_PERMISSIONS.SYSTEM_SETTINGS]: {
    label: 'システム設定',
    description: 'システム設定の変更',
    category: 'システム',
    level: 3
  },
  [GROUP_PERMISSIONS.SYSTEM_BACKUP]: {
    label: 'バックアップ管理',
    description: 'データバックアップの管理',
    category: 'システム',
    level: 3
  },
  [GROUP_PERMISSIONS.TICKET_MANAGE]: {
    label: 'チケット管理',
    description: 'サポートチケットの管理',
    category: 'サポート',
    level: 2
  },
  [GROUP_PERMISSIONS.TICKET_ASSIGN]: {
    label: 'チケット割り当て',
    description: 'チケットの担当者割り当て',
    category: 'サポート',
    level: 2
  },
  [GROUP_PERMISSIONS.PERMISSION_MANAGE]: {
    label: '権限管理',
    description: 'ユーザー権限の管理',
    category: '権限管理',
    level: 3
  },
  [GROUP_PERMISSIONS.GROUP_MANAGE]: {
    label: 'グループ管理',
    description: 'ユーザーグループの管理',
    category: '権限管理',
    level: 3
  }
};

// デフォルトロールとその権限
export const DEFAULT_ROLE_PERMISSIONS = {
  super_admin: Object.values(GROUP_PERMISSIONS), // 全権限
  admin: [
    GROUP_PERMISSIONS.USER_VIEW,
    GROUP_PERMISSIONS.USER_CREATE,
    GROUP_PERMISSIONS.USER_EDIT,
    GROUP_PERMISSIONS.USER_DELETE,
    GROUP_PERMISSIONS.ANALYTICS_VIEW,
    GROUP_PERMISSIONS.ANALYTICS_EXPORT,
    GROUP_PERMISSIONS.MESSAGE_SEND,
    GROUP_PERMISSIONS.MESSAGE_BROADCAST,
    GROUP_PERMISSIONS.MESSAGE_TEMPLATE,
    GROUP_PERMISSIONS.TICKET_MANAGE,
    GROUP_PERMISSIONS.TICKET_ASSIGN,
    GROUP_PERMISSIONS.GROUP_MANAGE
  ],
  manager: [
    GROUP_PERMISSIONS.USER_VIEW,
    GROUP_PERMISSIONS.USER_CREATE,
    GROUP_PERMISSIONS.USER_EDIT,
    GROUP_PERMISSIONS.ANALYTICS_VIEW,
    GROUP_PERMISSIONS.ANALYTICS_EXPORT,
    GROUP_PERMISSIONS.MESSAGE_SEND,
    GROUP_PERMISSIONS.MESSAGE_BROADCAST,
    GROUP_PERMISSIONS.TICKET_MANAGE
  ],
  operator: [
    GROUP_PERMISSIONS.USER_VIEW,
    GROUP_PERMISSIONS.ANALYTICS_VIEW,
    GROUP_PERMISSIONS.MESSAGE_SEND,
    GROUP_PERMISSIONS.TICKET_MANAGE
  ],
  viewer: [
    GROUP_PERMISSIONS.USER_VIEW,
    GROUP_PERMISSIONS.ANALYTICS_VIEW
  ]
};

// グループデータの保存
export const saveGroups = (groups) => {
  try {
    localStorage.setItem('userGroups', JSON.stringify(groups));
    return true;
  } catch (error) {
    console.error('グループ保存エラー:', error);
    return false;
  }
};

// グループデータの取得
export const getGroups = () => {
  try {
    const stored = localStorage.getItem('userGroups');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('グループ取得エラー:', error);
    return [];
  }
};

// 特定グループの取得
export const getGroupById = (groupId) => {
  const groups = getGroups();
  return groups.find(group => group.id === groupId);
};

// ユーザーが所属するグループの取得
export const getUserGroups = (userId) => {
  const groups = getGroups();
  return groups.filter(group => 
    group.isActive && group.members && group.members.includes(userId)
  );
};

// ユーザーの実効権限を取得（ロール権限 + グループ権限）
export const getUserEffectivePermissions = (user) => {
  const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
  const userGroups = getUserGroups(user.id);
  
  const groupPermissions = userGroups.reduce((acc, group) => {
    return [...acc, ...(group.permissions || [])];
  }, []);
  
  // 重複を除去
  return [...new Set([...rolePermissions, ...groupPermissions])];
};

// 権限チェック関数
export const hasGroupPermission = (user, permission) => {
  const effectivePermissions = getUserEffectivePermissions(user);
  return effectivePermissions.includes(permission);
};

// グループの作成
export const createGroup = (groupData) => {
  const groups = getGroups();
  const newGroup = {
    id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 0,
    ...groupData
  };
  
  groups.push(newGroup);
  saveGroups(groups);
  return newGroup;
};

// グループの更新
export const updateGroup = (groupId, updates) => {
  const groups = getGroups();
  const index = groups.findIndex(group => group.id === groupId);
  
  if (index !== -1) {
    groups[index] = {
      ...groups[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveGroups(groups);
    return groups[index];
  }
  
  return null;
};

// グループの削除
export const deleteGroup = (groupId) => {
  const groups = getGroups();
  const filteredGroups = groups.filter(group => group.id !== groupId);
  saveGroups(filteredGroups);
  return true;
};

// グループにユーザーを追加
export const addUserToGroup = (groupId, userId) => {
  const group = getGroupById(groupId);
  if (group && !group.members.includes(userId)) {
    const updatedMembers = [...group.members, userId];
    return updateGroup(groupId, { 
      members: updatedMembers,
      memberCount: updatedMembers.length 
    });
  }
  return null;
};

// グループからユーザーを削除
export const removeUserFromGroup = (groupId, userId) => {
  const group = getGroupById(groupId);
  if (group && group.members.includes(userId)) {
    const updatedMembers = group.members.filter(id => id !== userId);
    return updateGroup(groupId, { 
      members: updatedMembers,
      memberCount: updatedMembers.length 
    });
  }
  return null;
};

// 権限カテゴリ別にグループ化
export const getPermissionsByCategory = () => {
  return Object.entries(PERMISSION_DETAILS).reduce((acc, [permission, details]) => {
    if (!acc[details.category]) {
      acc[details.category] = [];
    }
    acc[details.category].push({
      id: permission,
      ...details
    });
    return acc;
  }, {});
};

// グループ統計情報の取得
export const getGroupStats = () => {
  const groups = getGroups();
  
  return {
    total: groups.length,
    active: groups.filter(g => g.isActive).length,
    inactive: groups.filter(g => !g.isActive).length,
    totalMembers: groups.reduce((sum, g) => sum + (g.memberCount || 0), 0),
    averageMembers: groups.length > 0 
      ? Math.round(groups.reduce((sum, g) => sum + (g.memberCount || 0), 0) / groups.length) 
      : 0,
    mostPopularGroup: groups.reduce((max, group) => 
      (group.memberCount || 0) > (max.memberCount || 0) ? group : max, 
      groups[0] || null
    )
  };
};

// グループの検索
export const searchGroups = (query, options = {}) => {
  const groups = getGroups();
  const {
    includeInactive = true,
    sortBy = 'name',
    sortOrder = 'asc'
  } = options;
  
  let filtered = groups.filter(group => {
    const matchesQuery = !query || 
      group.name.toLowerCase().includes(query.toLowerCase()) ||
      group.description.toLowerCase().includes(query.toLowerCase());
    
    const matchesActive = includeInactive || group.isActive;
    
    return matchesQuery && matchesActive;
  });
  
  // ソート
  filtered.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'memberCount') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return filtered;
};

// グループのバリデーション
export const validateGroup = (groupData) => {
  const errors = {};
  
  if (!groupData.name || groupData.name.trim().length === 0) {
    errors.name = 'グループ名は必須です';
  }
  
  if (groupData.name && groupData.name.length > 50) {
    errors.name = 'グループ名は50文字以内で入力してください';
  }
  
  if (groupData.description && groupData.description.length > 200) {
    errors.description = '説明は200文字以内で入力してください';
  }
  
  if (groupData.members && groupData.members.length > 1000) {
    errors.members = 'メンバー数は1000名以下にしてください';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};