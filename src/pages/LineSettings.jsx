// src/pages/line/LineSettings.jsx
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Settings, 
  Key, 
  Globe, 
  Menu,
  Bot,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  TestTube,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Link,
  MessageCircle,
  ArrowRight,
  UserX,
  Clock,
  Shield
} from 'lucide-react';

const LineSettings = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [settings, setSettings] = useState({
    channelAccessToken: '',
    channelSecret: '',
    webhookUrl: '',
    isConnected: false,
    lastConnectionTest: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const tabs = [
    { id: 'basic', name: '基本設定', icon: Settings },
    { id: 'webhook', name: 'Webhook設定', icon: Globe },
    { id: 'richmenu', name: 'リッチメニュー', icon: Menu },
    { id: 'bot', name: 'ボット設定', icon: Bot }
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConnectionTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    // 模擬接続テスト
    setTimeout(() => {
      const success = settings.channelAccessToken && settings.channelSecret;
      setTestResult({
        success,
        message: success ? 'LINE APIとの接続に成功しました' : 'アクセストークンまたはチャンネルシークレットが不正です'
      });
      setSettings(prev => ({
        ...prev,
        isConnected: success,
        lastConnectionTest: new Date().toISOString()
      }));
      setIsLoading(false);
    }, 2000);
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('設定を保存しました');
    }, 1000);
  };

  const renderBasicSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          チャンネルアクセストークン
        </label>
        <input
          type="password"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          value={settings.channelAccessToken}
          onChange={(e) => handleInputChange('channelAccessToken', e.target.value)}
          placeholder="チャンネルアクセストークンを入力"
        />
        <p className="mt-1 text-xs text-gray-500">
          LINE Developersコンソールから取得したアクセストークン
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          チャンネルシークレット
        </label>
        <input
          type="password"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          value={settings.channelSecret}
          onChange={(e) => handleInputChange('channelSecret', e.target.value)}
          placeholder="チャンネルシークレットを入力"
        />
        <p className="mt-1 text-xs text-gray-500">
          LINE Developersコンソールから取得したチャンネルシークレット
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-3">接続テスト</h4>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleConnectionTest}
            disabled={isLoading || !settings.channelAccessToken || !settings.channelSecret}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <TestTube className="mr-2 h-4 w-4" />
            )}
            接続テスト
          </button>
          
          {testResult && (
            <div className={`flex items-center space-x-2 ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResult.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="text-sm">{testResult.message}</span>
            </div>
          )}
        </div>
        
        {settings.lastConnectionTest && (
          <p className="text-xs text-gray-500 mt-2">
            最終テスト: {new Date(settings.lastConnectionTest).toLocaleString('ja-JP')}
          </p>
        )}
      </div>
    </div>
  );

  const renderWebhookSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Webhook URL
        </label>
        <input
          type="url"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          value={settings.webhookUrl}
          onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
          placeholder="https://your-domain.com/webhook"
        />
        <p className="mt-1 text-xs text-gray-500">
          LINE Platformからのイベントを受信するURL
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-3">イベント購読設定</h4>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'message', label: 'メッセージイベント', enabled: true },
            { id: 'follow', label: 'フォローイベント', enabled: true },
            { id: 'unfollow', label: 'アンフォローイベント', enabled: false },
            { id: 'join', label: '参加イベント', enabled: true },
            { id: 'leave', label: '退出イベント', enabled: false },
            { id: 'postback', label: 'ポストバックイベント', enabled: true }
          ].map((event) => (
            <label key={event.id} className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={event.enabled}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{event.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Webhook検証</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">SSL証明書</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">有効</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">URL到達性</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">OK</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">署名検証</span>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">未設定</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md">
        <div className="px-4 py-3 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">最近のWebhookログ</h4>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {[
            { time: '2024-01-15 14:30:25', event: 'message', status: 'success', user: 'user123' },
            { time: '2024-01-15 14:29:15', event: 'follow', status: 'success', user: 'user456' },
            { time: '2024-01-15 14:28:10', event: 'message', status: 'error', user: 'user789' },
            { time: '2024-01-15 14:27:05', event: 'postback', status: 'success', user: 'user123' }
          ].map((log, index) => (
            <div key={index} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-sm font-medium text-gray-900">{log.event}</span>
                  <span className="text-xs text-gray-500">{log.user}</span>
                </div>
                <span className="text-xs text-gray-500">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRichMenuSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">リッチメニュー一覧</h3>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          新しいメニューを作成
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            id: 1,
            name: 'メインメニュー',
            status: 'active',
            areas: 6,
            createdAt: '2024-01-10',
            preview: '/api/placeholder/300/200'
          },
          {
            id: 2,
            name: 'キャンペーンメニュー',
            status: 'draft',
            areas: 4,
            createdAt: '2024-01-12',
            preview: '/api/placeholder/300/200'
          }
        ].map((menu) => (
          <div key={menu.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-w-3 aspect-h-2 bg-gray-100">
              <div className="flex items-center justify-center">
                <Menu className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium text-gray-900">{menu.name}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  menu.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {menu.status === 'active' ? '有効' : '下書き'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                エリア数: {menu.areas} / 作成日: {menu.createdAt}
              </p>
              <div className="flex space-x-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Eye className="mr-2 h-4 w-4" />
                  プレビュー
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Edit3 className="mr-2 h-4 w-4" />
                  編集
                </button>
                <button className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-3">リッチメニューエディター機能</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Link className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-900">URIアクション</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-900">ポストバックアクション</span>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowRight className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-900">メッセージアクション</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-900">リアルタイムプレビュー</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBotSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">挨拶メッセージ設定</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              友達追加時の挨拶メッセージ
            </label>
            <textarea
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="友達追加ありがとうございます！&#10;何かご質問がございましたら、お気軽にお声がけください。"
              defaultValue="友達追加ありがとうございます！
何かご質問がございましたら、お気軽にお声がけください。"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">挨拶メッセージを有効にする</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">自動応答ルール</h4>
        <div className="space-y-4">
          {[
            { keyword: 'こんにちは', response: 'こんにちは！お疲れ様です。', enabled: true },
            { keyword: '営業時間', response: '営業時間は平日9:00-18:00です。', enabled: true },
            { keyword: 'お問い合わせ', response: 'お問い合わせありがとうございます。担当者が確認いたします。', enabled: false }
          ].map((rule, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    defaultChecked={rule.enabled}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">キーワード: {rule.keyword}</p>
                    <p className="text-sm text-gray-500">応答: {rule.response}</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-sm text-blue-600 hover:text-blue-800">編集</button>
                <button className="text-sm text-red-600 hover:text-red-800">削除</button>
              </div>
            </div>
          ))}
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600">
            <Plus className="mx-auto h-5 w-5 mb-2" />
            新しいルールを追加
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">ユーザー管理</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center space-x-3">
              <UserX className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">ブロック済みユーザー</p>
                <p className="text-lg font-bold text-red-600">3</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">制限中ユーザー</p>
                <p className="text-lg font-bold text-yellow-600">1</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">アクティブユーザー</p>
                <p className="text-lg font-bold text-green-600">1,247</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <UserX className="mr-2 h-4 w-4" />
            ブロック済みユーザーを管理
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">セキュリティ設定</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">スパム検出</p>
              <p className="text-sm text-gray-500">自動的にスパムメッセージを検出してブロックします</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">不適切なコンテンツフィルタ</p>
              <p className="text-sm text-gray-500">不適切な画像や動画をフィルタリングします</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">レート制限</p>
              <p className="text-sm text-gray-500">1分間に送信できるメッセージ数を制限します</p>
            </div>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
              <option>10メッセージ/分</option>
              <option>20メッセージ/分</option>
              <option>50メッセージ/分</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            LINE設定
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            LINE APIの設定と管理を行います
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            設定を保存
          </button>
        </div>
      </div>

      {/* 接続状態インジケーター */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              接続状態
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${settings.isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-900">
                {settings.isConnected ? 'LINE API接続中' : 'LINE API未接続'}
              </span>
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
        <div className="px-6 py-6">
          {activeTab === 'basic' && renderBasicSettings()}
          {activeTab === 'webhook' && renderWebhookSettings()}
          {activeTab === 'richmenu' && renderRichMenuSettings()}
          {activeTab === 'bot' && renderBotSettings()}
        </div>
      </div>
    </div>
  );
};

export default LineSettings;