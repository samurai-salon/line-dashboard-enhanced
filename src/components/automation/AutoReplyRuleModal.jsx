// src/components/automation/AutoReplyRuleModal.jsx - 自動返信ルール作成・編集モーダル
import React, { useState, useEffect } from 'react';
import {
  X, Plus, Trash2, MessageCircle, Clock, User, Settings,
  Tag, Hash, Calendar, Users, Activity, Zap, AlertCircle
} from 'lucide-react';

const AutoReplyRuleModal = ({ isOpen, onClose, onSave, rule = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'keyword', // keyword, time, behavior
    isActive: true,
    priority: 5,
    
    // キーワードトリガー
    keywords: [''],
    matchType: 'partial', // exact, partial, regex
    caseSensitive: false,
    
    // 時間トリガー
    scheduleType: 'specific', // specific, recurring, interval
    triggerTime: '',
    triggerDate: '',
    recurringDays: [],
    intervalMinutes: 60,
    
    // 行動トリガー
    behaviorType: 'friend_added', // friend_added, message_sent, sticker_sent, location_shared
    behaviorConditions: {},
    
    // 応答設定
    responseType: 'text', // text, template, carousel, flex
    responseContent: '',
    responses: [{ type: 'text', content: '' }],
    
    // 条件設定
    userConditions: {
      enabled: false,
      tags: [],
      groups: [],
      excludeTags: [],
      excludeGroups: []
    },
    
    // 制限設定
    limits: {
      enabled: false,
      maxPerUser: 1,
      maxPerDay: 100,
      cooldownMinutes: 30
    },
    
    // A/Bテスト
    abTest: {
      enabled: false,
      variants: [
        { name: 'A', weight: 50, content: '' },
        { name: 'B', weight: 50, content: '' }
      ]
    }
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});

  // 編集モード時の初期化
  useEffect(() => {
    if (isEdit && rule) {
      setFormData(rule);
    }
  }, [isEdit, rule]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'ルール名は必須です';
    }
    
    if (formData.triggerType === 'keyword') {
      const validKeywords = formData.keywords.filter(k => k.trim());
      if (validKeywords.length === 0) {
        newErrors.keywords = 'キーワードを少なくとも1つ入力してください';
      }
    }
    
    if (formData.triggerType === 'time') {
      if (formData.scheduleType === 'specific' && !formData.triggerTime) {
        newErrors.triggerTime = '時刻を指定してください';
      }
    }
    
    if (formData.responseType === 'text' && !formData.responseContent.trim()) {
      newErrors.responseContent = '返信内容を入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const ruleData = {
        ...formData,
        id: isEdit ? rule.id : Date.now().toString(),
        createdAt: isEdit ? rule.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statistics: isEdit ? rule.statistics : {
          triggered: 0,
          successful: 0,
          failed: 0,
          lastTriggered: null
        }
      };
      
      onSave(ruleData);
      onClose();
    }
  };

  const addKeyword = () => {
    setFormData(prev => ({
      ...prev,
      keywords: [...prev.keywords, '']
    }));
  };

  const updateKeyword = (index, value) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.map((keyword, i) => i === index ? value : keyword)
    }));
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addResponse = () => {
    setFormData(prev => ({
      ...prev,
      responses: [...prev.responses, { type: 'text', content: '' }]
    }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', name: '基本設定', icon: Settings },
    { id: 'trigger', name: 'トリガー', icon: Zap },
    { id: 'response', name: '応答内容', icon: MessageCircle },
    { id: 'conditions', name: '条件設定', icon: Users },
    { id: 'limits', name: '制限設定', icon: Clock },
    { id: 'advanced', name: '高度な設定', icon: Activity }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'ルール編集' : '新規ルール作成'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex">
          {/* タブナビゲーション */}
          <div className="w-48 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6">
              {/* 基本設定 */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ルール名 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="例: 営業時間外自動返信"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="このルールの目的や動作について説明してください"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        優先度
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1 (最高)</option>
                        <option value={2}>2 (高)</option>
                        <option value={3}>3 (中高)</option>
                        <option value={4}>4 (中)</option>
                        <option value={5}>5 (標準)</option>
                        <option value={6}>6 (中低)</option>
                        <option value={7}>7 (低)</option>
                        <option value={8}>8 (最低)</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 mt-8">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">ルールを有効にする</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* トリガー設定 */}
              {activeTab === 'trigger' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      トリガー種別
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'keyword', label: 'キーワード', icon: Hash, desc: 'メッセージ内のキーワードで発動' },
                        { value: 'time', label: '時間', icon: Clock, desc: '指定時刻や定期的に発動' },
                        { value: 'behavior', label: '行動', icon: User, desc: 'ユーザーの行動で発動' }
                      ].map(option => {
                        const Icon = option.icon;
                        return (
                          <label key={option.value} className={`cursor-pointer border-2 rounded-lg p-4 transition-colors ${
                            formData.triggerType === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <input
                              type="radio"
                              name="triggerType"
                              value={option.value}
                              checked={formData.triggerType === option.value}
                              onChange={(e) => setFormData(prev => ({ ...prev, triggerType: e.target.value }))}
                              className="sr-only"
                            />
                            <Icon className="h-8 w-8 text-blue-600 mb-2" />
                            <h3 className="font-medium text-gray-900">{option.label}</h3>
                            <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* キーワードトリガー設定 */}
                  {formData.triggerType === 'keyword' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          キーワード *
                        </label>
                        <div className="space-y-2">
                          {formData.keywords.map((keyword, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={keyword}
                                onChange={(e) => updateKeyword(index, e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="キーワードを入力"
                              />
                              {formData.keywords.length > 1 && (
                                <button
                                  onClick={() => removeKeyword(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={addKeyword}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Plus className="h-4 w-4" />
                            <span>キーワードを追加</span>
                          </button>
                        </div>
                        {errors.keywords && <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            マッチング方式
                          </label>
                          <select
                            value={formData.matchType}
                            onChange={(e) => setFormData(prev => ({ ...prev, matchType: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="partial">部分一致</option>
                            <option value="exact">完全一致</option>
                            <option value="regex">正規表現</option>
                          </select>
                        </div>

                        <div>
                          <label className="flex items-center space-x-2 mt-8">
                            <input
                              type="checkbox"
                              checked={formData.caseSensitive}
                              onChange={(e) => setFormData(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">大文字小文字を区別</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 時間トリガー設定 */}
                  {formData.triggerType === 'time' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          スケジュール種別
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'specific', label: '特定の日時' },
                            { value: 'recurring', label: '定期実行' },
                            { value: 'interval', label: '間隔実行' }
                          ].map(option => (
                            <label key={option.value} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="scheduleType"
                                value={option.value}
                                checked={formData.scheduleType === option.value}
                                onChange={(e) => setFormData(prev => ({ ...prev, scheduleType: e.target.value }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="text-sm text-gray-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {formData.scheduleType === 'specific' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              日付
                            </label>
                            <input
                              type="date"
                              value={formData.triggerDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, triggerDate: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              時刻 *
                            </label>
                            <input
                              type="time"
                              value={formData.triggerTime}
                              onChange={(e) => setFormData(prev => ({ ...prev, triggerTime: e.target.value }))}
                              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.triggerTime ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.triggerTime && <p className="text-red-500 text-sm mt-1">{errors.triggerTime}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 応答内容設定 */}
              {activeTab === 'response' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      応答タイプ
                    </label>
                    <select
                      value={formData.responseType}
                      onChange={(e) => setFormData(prev => ({ ...prev, responseType: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">テキストメッセージ</option>
                      <option value="template">テンプレートメッセージ</option>
                      <option value="carousel">カルーセルメッセージ</option>
                      <option value="flex">Flexメッセージ</option>
                    </select>
                  </div>

                  {formData.responseType === 'text' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        返信内容 *
                      </label>
                      <textarea
                        value={formData.responseContent}
                        onChange={(e) => setFormData(prev => ({ ...prev, responseContent: e.target.value }))}
                        rows={6}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.responseContent ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="自動返信するメッセージを入力してください"
                      />
                      {errors.responseContent && <p className="text-red-500 text-sm mt-1">{errors.responseContent}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        変数: {'{username}'}, {'{time}'}, {'{date}'}が使用できます
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
          >
            {isEdit ? '更新' : '作成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoReplyRuleModal;