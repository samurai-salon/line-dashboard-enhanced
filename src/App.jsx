
// src/App.jsx - DashboardLayout統合版
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Netlify用のbase pathを設定（ルートパス）
const basename = '';
import DashboardLayout from './components/layout/DashboardLayout';
import './index.css'

// MessageComposerをインポート
import MessageComposer from './pages/messages/MessageComposer';
import MessageComposerSimple from './pages/messages/MessageComposerSimple';
import MessageBroadcast from './pages/messages/MessageBroadcast';
import MessageManagement from './pages/messages/MessageManagement';
import BroadcastHistory from './pages/messages/BroadcastHistory';
import EmojiTest from './pages/messages/EmojiTest';
import DashboardEnhanced from './pages/DashboardEnhanced';
import EmojiManagerPage from './pages/EmojiManagerPage';
import UserManagement from './pages/UserManagement';
import UserDetailPage from './pages/UserDetailPage';
import UserCreatePage from './pages/UserCreatePage';
import NotificationManagement from './pages/NotificationManagement';
import Analytics from './pages/Analytics';
import LineSettings from './pages/LineSettings';
import SystemSettings from './pages/SystemSettings';
import MessageTemplates from './pages/messages/MessageTemplates';
import FriendGrowth from './pages/messages/FriendGrowth';
import ChatDashboard from './pages/chat/ChatDashboard';
import CallRequest from './pages/chat/CallRequest';
import CallHistory from './pages/chat/CallHistory';
import AutoReply from './pages/automation/AutoReply';
import UserGuide from './pages/help/UserGuide';
import NotificationCenter from './pages/NotificationCenter';

// ダッシュボードページ（拡張版を使用）
const DashboardPage = () => <DashboardEnhanced />;

// 新しい2パネル式メッセージ管理を使用
const MessagesPage = () => <MessageManagement />;

// シンプル版テスト用ページ
const MessagesSimplePage = () => (
  <MessageComposerSimple />
);

// メッセージ作成ページ（従来のMessageComposer）
const MessageComposePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">
      ✏️ メッセージ作成
    </h1>
    <MessageComposer />
  </div>
);

// 一斉配信ページ
const MessagesBroadcastPage = () => (
  <MessageBroadcast />
);

const UsersPage = () => (
  <div className="p-6">
    <UserManagement />
  </div>
);

const NotificationsPage = () => (
  <div className="p-6">
    <NotificationManagement />
  </div>
);

const AnalyticsPage = () => (
  <div className="p-6">
    <Analytics />
  </div>
);

const LineSettingsPage = () => (
  <div className="p-6">
    <LineSettings />
  </div>
);

const SystemPage = () => <SystemSettings />;

// 新しいページコンポーネント
const TemplatesPage = () => (
  <div className="p-6">
    <MessageTemplates />
  </div>
);

const FriendGrowthPage = () => (
  <div className="p-6">
    <FriendGrowth />
  </div>
);

const ChatPage = () => (
  <div className="p-6">
    <ChatDashboard />
  </div>
);

const CallRequestPage = () => (
  <div className="p-6">
    <CallRequest />
  </div>
);

const CallHistoryPage = () => (
  <div className="p-6">
    <CallHistory />
  </div>
);

const AutoReplyPage = () => (
  <div className="p-6">
    <AutoReply />
  </div>
);

const UserGuidePage = () => (
  <div className="p-6">
    <UserGuide />
  </div>
);

const NotificationCenterPage = () => <NotificationCenter />;

function App() {
  return (
    <AuthProvider>
      <Router basename={basename}>
        <div className="App">
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="emoji-manager" element={<EmojiManagerPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/create" element={<UserCreatePage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="line-settings" element={<LineSettingsPage />} />
              <Route path="system" element={<SystemPage />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="friend-growth" element={<FriendGrowthPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="call-request" element={<CallRequestPage />} />
              <Route path="call-history" element={<CallHistoryPage />} />
              <Route path="automation/auto-reply" element={<AutoReplyPage />} />
              <Route path="user-guide" element={<UserGuidePage />} />
              <Route path="notification-center" element={<NotificationCenterPage />} />
            </Route>
            {/* テスト用の直接ルート */}
            <Route path="/test-simple" element={<MessagesSimplePage />} />
            <Route path="/test-broadcast" element={<MessagesBroadcastPage />} />
            <Route path="/message-compose" element={<MessageComposePage />} />
            <Route path="/broadcast-history" element={<BroadcastHistory />} />
            <Route path="/test-emoji" element={<EmojiTest />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;