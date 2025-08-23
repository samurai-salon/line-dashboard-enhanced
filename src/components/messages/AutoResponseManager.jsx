// src/components/messages/AutoResponseManager.jsx - 挨拶・応答メッセージ管理
import React, { useState } from 'react';
import { 
  MessageSquare, Plus, Edit, Trash2, Save, X, Clock, 
  UserPlus, MessageCircle, Settings, ToggleLeft, ToggleRight,
  Wand2, Copy, Eye
} from 'lucide-react';

const AutoResponseManager = ({ officialLine, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('greeting');
  
  // 挨拶メッセージ設定
  const [greetingSettings, setGreetingSettings] = useState({
    enabled: true,
    message: `${officialLine?.name || 'LINE公式アカウント'}へようこそ！\n\n友だち追加していただき、ありがとうございます。\nご質問やお問い合わせがございましたら、お気軽にメッセージをお送りください。\n\n営業時間: 平日 9:00-18:00\n※営業時間外は翌営業日にお返事いたします。`,
    includeRichMenu: true,
    sendDelay: 0
  });

  // 応答メッセージ設定
  const [autoResponses, setAutoResponses] = useState([
    {
      id: 1,
      name: '営業時間外の自動返信',
      trigger: 'outside_hours',
      enabled: true,
      message: 'お問い合わせありがとうございます。\n\n現在は営業時間外のため、翌営業日にお返事いたします。\n営業時間: 平日 9:00-18:00',
      conditions: {
        timeRange: { start: '18:00', end: '09:00' },
        weekends: true
      }
    },
    {
      id: 2,
      name: '予約関連キーワード',
      trigger: 'keyword',
      enabled: true,
      message: 'ご予約のお問い合わせありがとうございます。\n\n以下の情報をお聞かせください：\n• ご希望日時\n• 人数\n• お名前\n• 連絡先\n\n担当者より確認のご連絡をいたします。',
      conditions: {
        keywords: ['予約', '空き', '取りたい', '予約したい', 'よやく']
      }
    },
    {
      id: 3,
      name: 'よくある質問',
      trigger: 'keyword',
      enabled: true,
      message: 'よくあるご質問はこちらをご確認ください。\n\n• 営業時間・定休日\n• アクセス・駐車場\n• 料金・支払方法\n• キャンセルポリシー\n\n詳細はリッチメニューの「よくある質問」からご覧いただけます。',
      conditions: {
        keywords: ['質問', '聞きたい', 'FAQ', '教えて', '知りたい']
      }
    }
  ]);

  const [editingResponse, setEditingResponse] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen || !officialLine) return null;

  // 挨拶メッセージの更新
  const updateGreetingMessage = (field, value) => {
    setGreetingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 応答メッセージの追加
  const addAutoResponse = () => {
    const newResponse = {
      id: Date.now(),
      name: '新しい自動応答',
      trigger: 'keyword',
      enabled: true,
      message: '',
      conditions: {
        keywords: []
      }
    };
    setAutoResponses(prev => [...prev, newResponse]);
    setEditingResponse(newResponse.id);
  };

  // 応答メッセージの更新
  const updateAutoResponse = (id, updates) => {
    setAutoResponses(prev => prev.map(response => 
      response.id === id ? { ...response, ...updates } : response
    ));
  };

  // 応答メッセージの削除
  const deleteAutoResponse = (id) => {
    if (window.confirm('この自動応答を削除しますか？')) {
      setAutoResponses(prev => prev.filter(response => response.id !== id));
    }
  };

  // 設定の保存
  const saveSettings = async () => {
    try {
      // 実際のAPIコール
      // await saveAutoResponseSettings(officialLine.id, { greetingSettings, autoResponses });
      alert('設定を保存しました！');
      onClose();
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">挨拶・応答メッセージ設定</h2>
              <p className="text-sm text-gray-600">{officialLine.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>保存</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* タブ */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('greeting')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'greeting'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserPlus className="h-4 w-4 inline mr-2" />
            挨拶メッセージ
          </button>
          <button
            onClick={() => setActiveTab('auto-response')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'auto-response'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle className="h-4 w-4 inline mr-2" />
            自動応答設定
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          {activeTab === 'greeting' && (
            <div className="space-y-6">
              {/* 有効/無効切り替え */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-900">挨拶メッセージ</h3>
                  <p className="text-sm text-blue-700">友だち追加時に自動で送信されるメッセージです</p>
                </div>
                <button
                  onClick={() => updateGreetingMessage('enabled', !greetingSettings.enabled)}
                  className="flex items-center space-x-2"
                >
                  {greetingSettings.enabled ? (
                    <ToggleRight className="h-8 w-8 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-gray-400" />
                  )}
                </button>
              </div>

              {greetingSettings.enabled && (
                <>
                  {/* メッセージ編集 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      挨拶メッセージ内容
                    </label>
                    <textarea
                      value={greetingSettings.message}
                      onChange={(e) => updateGreetingMessage('message', e.target.value)}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="友だち追加時の挨拶メッセージを入力してください..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {greetingSettings.message.length}/1000文字
                    </p>
                  </div>

                  {/* 追加オプション */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={greetingSettings.includeRichMenu}
                          onChange={(e) => updateGreetingMessage('includeRichMenu', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">リッチメニューを同時表示</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        送信遅延時間
                      </label>
                      <select
                        value={greetingSettings.sendDelay}
                        onChange={(e) => updateGreetingMessage('sendDelay', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={0}>即座に送信</option>
                        <option value={5}>5秒後</option>
                        <option value={10}>10秒後</option>
                        <option value={30}>30秒後</option>
                      </select>
                    </div>
                  </div>

                  {/* プレビューボタン */}
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>プレビュー表示</span>
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === 'auto-response' && (
            <div className="space-y-6">
              {/* ヘッダーとボタン */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">自動応答設定</h3>
                  <p className="text-sm text-gray-600">キーワードや条件に基づいて自動でメッセージを送信します</p>
                </div>
                <button
                  onClick={addAutoResponse}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>新規追加</span>
                </button>
              </div>

              {/* 自動応答リスト */}
              <div className="space-y-4">
                {autoResponses.map(response => (
                  <div
                    key={response.id}
                    className={`border rounded-xl p-4 transition-colors ${
                      response.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{response.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            response.enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {response.enabled ? '有効' : '無効'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {response.message.substring(0, 100)}
                          {response.message.length > 100 ? '...' : ''}
                        </p>
                        {response.conditions.keywords && (
                          <div className="flex flex-wrap gap-2">
                            {response.conditions.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => updateAutoResponse(response.id, { enabled: !response.enabled })}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={response.enabled ? '無効にする' : '有効にする'}
                        >
                          {response.enabled ? (
                            <ToggleRight className="h-5 w-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingResponse(response.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteAutoResponse(response.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="削除"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoResponseManager;