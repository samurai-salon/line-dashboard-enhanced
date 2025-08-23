
// src/context/AuthContext.js - 修正版
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 権限定義
const PERMISSIONS = {
  USER_VIEW: 'user:view',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_CREATE: 'user:create',
  MESSAGE_SEND: 'message:send',
  SETTINGS_MANAGE: 'settings:manage'
};

// ロール別権限マッピング
const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.SETTINGS_MANAGE
  ],
  manager: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.MESSAGE_SEND
  ],
  operator: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.MESSAGE_SEND
  ],
  viewer: [
    PERMISSIONS.USER_VIEW
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: "山田太郎",
    email: "yamada@example.com",
    role: "admin",
    avatar: null
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = async (credentials) => {
    console.log('Login:', credentials);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logout');
    setUser(null);
    setIsAuthenticated(false);
  };

  // 権限チェック関数
  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
    PERMISSIONS,
    hasPermission
  };

  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
};