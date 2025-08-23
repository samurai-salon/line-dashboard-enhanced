// src/pages/messages/MessageTemplates.jsx - LINE公式メッセージテンプレート管理
import React, { useState } from 'react';
import {
  MessageSquare, Plus, Edit2, Trash2, Copy, Save, Phone, MapPin,
  User, Calendar, Clock, Image, Video, FileText, ExternalLink,
  ChevronRight, Star, Search, Filter, Grid, List, Eye, Send
} from 'lucide-react';

const MessageTemplates = () => {
  const [activeTab, setActiveTab] = useState('quickReplies');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // クイック返信テンプレート
  const [quickReplies, setQuickReplies] = useState([
    {
      id: '1',
      title: '営業時間のお知らせ',
      text: '営業時間は平日9:00-18:00です。\nお気軽にお問い合わせください！',
      category: 'info',
      buttons: [
        { type: 'text', title: 'お問い合わせ', text: 'お問い合わせ' },
        { type: 'phone', title: '電話する', phoneNumber: '03-1234-5678' },
        { type: 'url', title: 'ホームページ', url: 'https://example.com' }
      ],
      usage: 234,
      lastUsed: '2024-01-15T10:30:00Z'
    },
    {
      id: '2', 
      title: 'アクセス案内',
      text: '📍 店舗へのアクセス\n\n東京都渋谷区...\n最寄り駅：JR渋谷駅より徒歩5分',
      category: 'location',
      buttons: [
        { type: 'location', title: '地図を見る', latitude: 35.658581, longitude: 139.701637 },
        { type: 'phone', title: '電話で確認', phoneNumber: '03-1234-5678' }
      ],
      usage: 156,
      lastUsed: '2024-01-14T15:20:00Z'
    },
    {
      id: '3',
      title: 'サービス紹介',
      text: '🎉 当店のサービスをご紹介します！\n\n✅ サービスA\n✅ サービスB\n✅ サービスC',
      category: 'promotion',
      buttons: [
        { type: 'url', title: '詳細を見る', url: 'https://example.com/services' },
        { type: 'text', title: '予約する', text: '予約希望' },
        { type: 'text', title: '資料請求', text: '資料請求' }
      ],
      usage: 89,
      lastUsed: '2024-01-12T09:15:00Z'
    }
  ]);

  // カルーセルテンプレート
  const [carousels, setCarousels] = useState([
    {
      id: '1',
      title: '商品カタログ',
      type: 'carousel',
      items: [
        {
          imageUrl: '/images/product1.jpg',
          title: '商品A',
          text: '高品質な商品A\n特別価格：¥9,800',
          actions: [
            { type: 'url', label: '詳細', uri: 'https://example.com/product1' },
            { type: 'postback', label: '購入', data: 'buy_product_1' }
          ]
        },
        {
          imageUrl: '/images/product2.jpg', 
          title: '商品B',
          text: '人気の商品B\n限定販売中：¥12,800',
          actions: [
            { type: 'url', label: '詳細', uri: 'https://example.com/product2' },
            { type: 'postback', label: '購入', data: 'buy_product_2' }
          ]
        }
      ],
      category: 'product',
      usage: 67,
      lastUsed: '2024-01-13T14:45:00Z'
    }
  ]);

  // フレックスメッセージテンプレート
  const [flexMessages, setFlexMessages] = useState([
    {
      id: '1',
      title: '予約確認書',
      type: 'flex',
      altText: '予約確認書',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '予約確認書',
              weight: 'bold',
              size: 'xl',
              color: '#ffffff'
            }
          ],
          backgroundColor: '#27ACB2'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'ご予約ありがとうございます',
              wrap: true
            },
            {
              type: 'separator',
              margin: 'md'
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'md',
              contents: [
                { type: 'text', text: '予約日時', size: 'sm', color: '#666666' },
                { type: 'text', text: '2024年1月20日 14:00', weight: 'bold' }
              ]
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
                type: 'phone',
                uri: 'tel:03-1234-5678'
              },
              style: 'primary',
              color: '#27ACB2',
              text: '店舗に電話'
            }
          ]
        }
      },
      category: 'business',
      usage: 45,
      lastUsed: '2024-01-11T16:30:00Z'
    }
  ]);

  // フィルタリング機能
  const filterTemplates = (templates) => {
    return templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.text?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // カテゴリオプション
  const categories = [
    { value: 'all', label: 'すべて', count: quickReplies.length + carousels.length + flexMessages.length },
    { value: 'info', label: '案内・情報', count: 5 },
    { value: 'promotion', label: 'プロモーション', count: 3 },
    { value: 'location', label: '場所・アクセス', count: 2 },
    { value: 'business', label: 'ビジネス', count: 4 },
    { value: 'product', label: '商品', count: 2 }
  ];

  // クイック返信テンプレート表示
  const renderQuickReply = (template) => (
    <div key={template.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">{template.title}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              template.category === 'info' ? 'bg-blue-100 text-blue-800' :
              template.category === 'promotion' ? 'bg-green-100 text-green-800' :
              template.category === 'location' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {categories.find(c => c.value === template.category)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-blue-600">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-green-600">
              <Copy className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-yellow-600">
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-sm text-gray-700 whitespace-pre-line">{template.text}</p>
        </div>

        {/* ボタンプレビュー */}
        <div className="space-y-2 mb-3">
          {template.buttons.map((button, index) => (
            <div key={index} className={`flex items-center justify-center py-2 px-3 rounded border text-sm font-medium ${
              button.type === 'phone' ? 'bg-green-50 border-green-200 text-green-700' :
              button.type === 'url' ? 'bg-blue-50 border-blue-200 text-blue-700' :
              button.type === 'location' ? 'bg-purple-50 border-purple-200 text-purple-700' :
              'bg-gray-50 border-gray-200 text-gray-700'
            }`}>
              {button.type === 'phone' && <Phone className="h-4 w-4 mr-2" />}
              {button.type === 'url' && <ExternalLink className="h-4 w-4 mr-2" />}
              {button.type === 'location' && <MapPin className="h-4 w-4 mr-2" />}
              {button.type === 'text' && <MessageSquare className="h-4 w-4 mr-2" />}
              {button.title}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>使用回数: {template.usage}</span>
          <span>最終使用: {new Date(template.lastUsed).toLocaleDateString('ja-JP')}</span>
        </div>
      </div>
    </div>
  );

  // カルーセル表示
  const renderCarousel = (template) => (
    <div key={template.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">{template.title}</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              カルーセル ({template.items.length}枚)
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-blue-600">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-green-600">
              <Copy className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-yellow-600">
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* カルーセルアイテムプレビュー */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-3">
          {template.items.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-40 bg-gray-50 rounded border">
              <div className="h-20 bg-gray-200 rounded-t flex items-center justify-center">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.actions.length}個のアクション</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>使用回数: {template.usage}</span>
          <span>最終使用: {new Date(template.lastUsed).toLocaleDateString('ja-JP')}</span>
        </div>
      </div>
    </div>
  );

  // Flexメッセージ表示
  const renderFlexMessage = (template) => (
    <div key={template.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">{template.title}</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Flexメッセージ
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-blue-600">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-green-600">
              <Copy className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-yellow-600">
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Flexメッセージプレビュー */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="bg-white rounded border shadow-sm">
            {/* ヘッダー部分 */}
            <div className="bg-teal-500 text-white p-3 rounded-t">
              <p className="font-bold text-center">{template.contents.header?.contents[0]?.text}</p>
            </div>
            {/* ボディ部分 */}
            <div className="p-3">
              <p className="text-sm text-gray-700">予約内容の詳細...</p>
            </div>
            {/* フッター部分 */}
            <div className="p-3 border-t">
              <button className="w-full bg-teal-500 text-white py-2 rounded text-sm font-medium flex items-center justify-center">
                <Phone className="h-4 w-4 mr-1" />
                店舗に電話
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>使用回数: {template.usage}</span>
          <span>最終使用: {new Date(template.lastUsed).toLocaleDateString('ja-JP')}</span>
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
            メッセージテンプレート
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            クイック返信、カルーセル、Flexメッセージのテンプレートを管理します
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Copy className="-ml-1 mr-2 h-4 w-4" />
            テンプレート複製
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            新規作成
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('quickReplies')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quickReplies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            クイック返信 ({quickReplies.length})
          </button>
          <button
            onClick={() => setActiveTab('carousels')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'carousels'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            カルーセル ({carousels.length})
          </button>
          <button
            onClick={() => setActiveTab('flexMessages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'flexMessages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Flexメッセージ ({flexMessages.length})
          </button>
        </nav>
      </div>

      {/* フィルターとビューオプション */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="テンプレートを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>
          
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border-l border-gray-300 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* テンプレート表示 */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {activeTab === 'quickReplies' && filterTemplates(quickReplies).map(renderQuickReply)}
        {activeTab === 'carousels' && filterTemplates(carousels).map(renderCarousel)}
        {activeTab === 'flexMessages' && filterTemplates(flexMessages).map(renderFlexMessage)}
      </div>

      {/* 空の状態 */}
      {((activeTab === 'quickReplies' && filterTemplates(quickReplies).length === 0) ||
        (activeTab === 'carousels' && filterTemplates(carousels).length === 0) ||
        (activeTab === 'flexMessages' && filterTemplates(flexMessages).length === 0)) && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">テンプレートが見つかりません</h3>
          <p className="text-gray-500 mb-6">検索条件を変更するか、新しいテンプレートを作成してください。</p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            テンプレートを作成
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageTemplates;