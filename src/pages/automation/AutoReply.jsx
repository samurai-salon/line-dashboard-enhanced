// src/pages/automation/AutoReply.jsx - 自動返信システム管理
import React, { useState, useEffect } from 'react';
import {
  Bot, Plus, Edit2, Trash2, Power, PowerOff, Search, Filter,
  MessageCircle, Clock, Target, Zap, BarChart3, Settings,
  ChevronRight, ChevronDown, Eye, Copy, Save, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Calendar, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AutoReplyRuleModal from '../../components/automation/AutoReplyRuleModal.jsx';
import { autoReplyEngine } from '../../utils/autoReplyEngine.js';

const AutoReply = () => {
  const { hasPermission, PERMISSIONS } = useAuth();
  const [activeTab, setActiveTab] = useState('rules');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [overallStats, setOverallStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  
  // 自動返信ルール（エンジンから読み込み）
  const [autoReplyRules, setAutoReplyRules] = useState([]);
  
  // データの初期読み込み
  useEffect(() => {
    // 自動返信エンジン開始
    autoReplyEngine.start();
    
    // ルール読み込み
    const rules = autoReplyEngine.loadRules();
    if (rules.length === 0) {
      // デフォルトルール設定
      setAutoReplyRules([
    {
      id: '1',
      name: '営業時間案内',
      type: 'keyword',
      trigger: {
        keywords: ['営業時間', '営業', '時間', '何時', 'いつ'],
        exact: false
      },
      response: {
        type: 'text',
        content: '営業時間のご案内\n\n📅 平日：9:00 - 18:00\n📅 土曜：10:00 - 16:00\n📅 日祝：定休日\n\nお気軽にお問い合わせください！',
        buttons: [
          { type: 'phone', label: '📞 電話する', uri: 'tel:03-1234-5678' },
          { type: 'url', label: '🌐 詳細を見る', uri: 'https://example.com/hours' }
        ]
      },
      conditions: {
        timeRange: null,
        userSegment: 'all',
        maxUsagePerUser: null
      },
      isActive: true,
      priority: 1,
      stats: {
        triggered: 45,
        successful: 43,
        lastTriggered: '2024-01-15T14:30:00Z'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T15:20:00Z'
    },
    {
      id: '2',
      name: '営業時間外自動応答',
      type: 'time',
      trigger: {
        timeCondition: 'outside_hours',
        businessHours: {
          weekdays: { start: '09:00', end: '18:00' },
          saturday: { start: '10:00', end: '16:00' },
          sunday: 'closed'
        }
      },
      response: {
        type: 'text',
        content: 'お疲れ様です。\n現在、営業時間外です。\n\n⏰ 営業時間\n平日：9:00 - 18:00\n土曜：10:00 - 16:00\n日祝：定休日\n\n緊急のご用件は下記までお電話ください。',
        buttons: [
          { type: 'phone', label: '🚨 緊急連絡', uri: 'tel:090-1234-5678' },
          { type: 'message', label: '📝 メッセージを残す', text: 'メッセージを残したいです' }
        ]
      },
      conditions: {
        timeRange: 'outside_hours',
        userSegment: 'all',
        maxUsagePerUser: 1
      },
      isActive: true,
      priority: 5,
      stats: {
        triggered: 12,
        successful: 12,
        lastTriggered: '2024-01-15T19:30:00Z'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-05T10:15:00Z'
    },
    {
      id: '3',
      name: 'ウェルカムメッセージ',
      type: 'behavior',
      trigger: {
        event: 'friend_add',
        condition: 'first_time'
      },
      response: {
        type: 'template',
        content: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '友だち追加ありがとうございます！🎉',
                weight: 'bold',
                size: 'xl'
              },
              {
                type: 'text',
                text: 'お得な情報やサービスをお届けします。',
                wrap: true,
                margin: 'md'
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: {
                  type: 'message',
                  label: '🎁 特典クーポンを受け取る',
                  text: 'クーポンが欲しいです'
                },
                style: 'primary'
              }
            ]
          }
        }
      },
      conditions: {
        timeRange: null,
        userSegment: 'new_users',
        maxUsagePerUser: 1
      },
      isActive: true,
      priority: 10,
      stats: {
        triggered: 23,
        successful: 23,
        lastTriggered: '2024-01-15T11:45:00Z'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-08T14:30:00Z'
    },
    {
      id: '4',
      name: '料金・価格問い合わせ',
      type: 'keyword',
      trigger: {
        keywords: ['料金', '価格', '値段', '金額', 'いくら', '費用'],
        exact: false
      },
      response: {
        type: 'carousel',
        content: {
          type: 'carousel',
          contents: [
            {
              type: 'bubble',
              header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: 'ベーシックプラン',
                    weight: 'bold',
                    color: '#ffffff'
                  }
                ],
                backgroundColor: '#3b82f6'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: '¥5,000/月',
                    size: 'xl',
                    weight: 'bold'
                  },
                  {
                    type: 'text',
                    text: '基本機能をご利用いただけます',
                    wrap: true
                  }
                ]
              }
            },
            {
              type: 'bubble',
              header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: 'プレミアムプラン',
                    weight: 'bold',
                    color: '#ffffff'
                  }
                ],
                backgroundColor: '#f59e0b'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: '¥10,000/月',
                    size: 'xl',
                    weight: 'bold'
                  },
                  {
                    type: 'text',
                    text: 'すべての機能をご利用いただけます',
                    wrap: true
                  }
                ]
              }
            }
          ]
        }
      },
      conditions: {
        timeRange: null,
        userSegment: 'all',
        maxUsagePerUser: null
      },
      isActive: false,
      priority: 3,
      stats: {
        triggered: 18,
        successful: 16,
        lastTriggered: '2024-01-14T16:20:00Z'
      },
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-12T09:45:00Z'
    }
      ]);
    } else {
      setAutoReplyRules(rules);
    }
    
    // 統計データ読み込み
    loadStatistics();
    
    return () => {
      autoReplyEngine.stop();
    };
  }, []);
  
  // 統計データ読み込み
  const loadStatistics = () => {
    const stats = autoReplyEngine.getOverallStatistics();
    const activities = autoReplyEngine.getRecentActivities(10);
    setOverallStats(stats);
    setRecentActivities(activities);
  };

  // 統計データはoverallStatsとrecentActivitiesで管理

  // フィルタリング
  const filteredRules = autoReplyRules.filter(rule => {
    const matchesSearch = searchQuery === '' ||
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rule.trigger.keywords && rule.trigger.keywords.some(k => 
        k.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && rule.isActive) ||
      (filterStatus === 'inactive' && !rule.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // ルール切り替え
  const toggleRule = (ruleId) => {
    autoReplyEngine.toggleRule(ruleId);
    const updatedRules = autoReplyEngine.loadRules();
    setAutoReplyRules(updatedRules);
    loadStatistics();
  };

  // ルール削除
  const deleteRule = (ruleId) => {
    if (window.confirm('このルールを削除してもよろしいですか？')) {
      autoReplyEngine.removeRule(ruleId);
      const updatedRules = autoReplyEngine.loadRules();
      setAutoReplyRules(updatedRules);
      loadStatistics();
    }
  };

  // ルール編集
  const editRule = (rule) => {
    setSelectedRule(rule);
    setIsEditMode(true);
    setShowRuleModal(true);
  };

  // 新規ルール作成
  const createNewRule = () => {
    setSelectedRule(null);
    setIsEditMode(false);
    setShowRuleModal(true);
  };
  
  // ルール保存
  const handleSaveRule = (ruleData) => {
    autoReplyEngine.addRule(ruleData);
    const updatedRules = autoReplyEngine.loadRules();
    setAutoReplyRules(updatedRules);
    loadStatistics();
    setShowRuleModal(false);
    setSelectedRule(null);
    setIsEditMode(false);
  };
  
  // モーダル閉じる
  const handleCloseModal = () => {
    setShowRuleModal(false);
    setSelectedRule(null);
    setIsEditMode(false);
  };

  // ルールタイプアイコン
  const getRuleTypeIcon = (type) => {
    switch (type) {
      case 'keyword': return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'time': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'behavior': return <Target className="h-4 w-4 text-green-500" />;
      default: return <Bot className="h-4 w-4 text-gray-500" />;
    }
  };

  // ルールタイプラベル
  const getRuleTypeLabel = (type) => {
    const types = {
      keyword: 'キーワード',
      time: '時間条件',
      behavior: '行動トリガー'
    };
    return types[type] || 'その他';
  };

  // 統計表示
  const renderStats = () => (
    <div className="space-y-6">
      {/* 概要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Bot className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">総ルール数</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats?.totalRules || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">有効ルール</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats?.activeRules || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">総発動回数</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats?.totalTriggered || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">成功率</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats?.successRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      {overallStats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">システム統計</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalSuccessful}</p>
              <p className="text-sm text-gray-500">成功応答</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalFailed}</p>
              <p className="text-sm text-gray-500">失敗応答</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{overallStats.successRate}%</p>
              <p className="text-sm text-gray-500">成功率</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{overallStats.activeRules}/{overallStats.totalRules}</p>
              <p className="text-sm text-gray-500">有効ルール</p>
            </div>
          </div>
        </div>
      )}

      {/* 最近のアクティビティ */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">最近のアクティビティ</h3>
          <button 
            onClick={loadStatistics}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4 inline mr-1" />
            更新
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {activity.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.ruleName}</p>
                  <p className="text-sm text-gray-600">ユーザー: {activity.userName}</p>
                  <p className="text-sm text-gray-500">メッセージ: {activity.messageText}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString('ja-JP')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">アクティビティはまだありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ルール一覧表示
  const renderRules = () => (
    <div className="space-y-6">
      {/* 検索・フィルター */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="ルール名、キーワードで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            <option value="active">有効のみ</option>
            <option value="inactive">無効のみ</option>
          </select>
          
          {hasPermission(PERMISSIONS.MESSAGE_SEND) && (
            <button
              onClick={createNewRule}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              新規作成
            </button>
          )}
        </div>
      </div>

      {/* ルール一覧 */}
      <div className="space-y-4">
        {filteredRules.map(rule => (
          <div key={rule.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getRuleTypeIcon(rule.type)}
                    <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {getRuleTypeLabel(rule.type)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rule.isActive ? '有効' : '無効'}
                    </span>
                  </div>

                  {/* トリガー情報 */}
                  <div className="mb-3">
                    {rule.type === 'keyword' && rule.trigger.keywords && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-sm text-gray-600 mr-2">キーワード:</span>
                        {rule.trigger.keywords.slice(0, 3).map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {keyword}
                          </span>
                        ))}
                        {rule.trigger.keywords.length > 3 && (
                          <span className="text-xs text-gray-500">+{rule.trigger.keywords.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {rule.type === 'time' && (
                      <p className="text-sm text-gray-600">
                        条件: {rule.trigger.timeCondition === 'outside_hours' ? '営業時間外' : '時間指定'}
                      </p>
                    )}
                    
                    {rule.type === 'behavior' && (
                      <p className="text-sm text-gray-600">
                        イベント: {rule.trigger.event === 'friend_add' ? '友だち追加' : 'その他'}
                      </p>
                    )}
                  </div>

                  {/* 統計情報 */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>発動: {rule.stats.triggered}回</span>
                    <span>成功: {rule.stats.successful}回</span>
                    <span>優先度: {rule.priority}</span>
                    {rule.stats.lastTriggered && (
                      <span>最終: {new Date(rule.stats.lastTriggered).toLocaleDateString('ja-JP')}</span>
                    )}
                  </div>
                </div>

                {/* アクション */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`p-2 rounded-md ${
                      rule.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={rule.isActive ? '無効にする' : '有効にする'}
                  >
                    {rule.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={() => editRule(rule)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    title="編集"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(rule, null, 2))}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                    title="コピー"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    title="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">自動返信ルールが見つかりません</h3>
          <p className="text-gray-500 mb-6">検索条件を変更するか、新しいルールを作成してください。</p>
          {hasPermission(PERMISSIONS.MESSAGE_SEND) && (
            <button
              onClick={createNewRule}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              最初のルールを作成
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            自動返信システム
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            キーワード・時間・行動に基づく自動メッセージ返信を管理します
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Settings className="-ml-1 mr-2 h-4 w-4" />
            設定
          </button>
          <button 
            onClick={loadStatistics}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
            統計更新
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rules'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ルール管理 ({autoReplyRules.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            統計・分析
          </button>
        </nav>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'rules' && renderRules()}
      {activeTab === 'stats' && renderStats()}
      
      {/* ルール作成・編集モーダル */}
      <AutoReplyRuleModal
        isOpen={showRuleModal}
        onClose={handleCloseModal}
        onSave={handleSaveRule}
        rule={selectedRule}
        isEdit={isEditMode}
      />
    </div>
  );
};

export default AutoReply;