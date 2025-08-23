// src/pages/messages/FriendGrowth.jsx - 友だち追加促進機能
import React, { useState } from 'react';
import {
  UserPlus, Share2, QrCode, Link, Copy, MessageCircle, Mail,
  TrendingUp, Users, Target, Gift, ExternalLink, Download,
  BarChart3, Calendar, Globe, Smartphone, Eye, Heart,
  Star, Award, Zap, Megaphone, RefreshCw
} from 'lucide-react';

const FriendGrowth = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // 友だち追加統計データ
  const friendStats = {
    total: 12847,
    thisMonth: 1234,
    lastMonth: 987,
    growthRate: 25.0,
    sources: [
      { name: 'QRコード', count: 456, percentage: 37 },
      { name: 'Webサイト', count: 234, percentage: 19 },
      { name: '口コミ・紹介', count: 189, percentage: 15 },
      { name: 'SNS', count: 156, percentage: 13 },
      { name: 'キャンペーン', count: 123, percentage: 10 },
      { name: 'その他', count: 76, percentage: 6 }
    ]
  };

  // プロモーション素材
  const [promotionMaterials, setPromotionMaterials] = useState([
    {
      id: '1',
      type: 'qrcode',
      title: '基本QRコード',
      description: '店舗での友だち追加用',
      url: 'https://line.me/R/ti/p/@example',
      qrCodeUrl: '/images/qr-basic.png',
      downloads: 456,
      createdAt: '2024-01-10T09:00:00Z'
    },
    {
      id: '2',
      type: 'banner',
      title: 'Webバナー（大）',
      description: 'ホームページ掲載用',
      imageUrl: '/images/banner-large.png',
      size: '728x90',
      downloads: 234,
      createdAt: '2024-01-08T14:30:00Z'
    },
    {
      id: '3',
      type: 'banner',
      title: 'Webバナー（小）',
      description: 'サイドバー掲載用',
      imageUrl: '/images/banner-small.png',
      size: '300x250',
      downloads: 189,
      createdAt: '2024-01-05T11:15:00Z'
    }
  ]);

  // キャンペーン
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      title: '新春友だち追加キャンペーン',
      description: '友だち追加で500円クーポンプレゼント',
      type: 'coupon',
      status: 'active',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
      targetCount: 1000,
      currentCount: 456,
      reward: '500円割引クーポン',
      landingPage: 'https://example.com/campaign/2024newyear',
      qrCode: '/images/qr-campaign1.png'
    },
    {
      id: '2',
      title: 'レビュー投稿キャンペーン',
      description: '友だち追加＋レビュー投稿でポイントゲット',
      type: 'points',
      status: 'scheduled',
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-29T23:59:59Z',
      targetCount: 500,
      currentCount: 0,
      reward: '100ポイントプレゼント',
      landingPage: 'https://example.com/campaign/review2024',
      qrCode: '/images/qr-campaign2.png'
    }
  ]);

  // 友だち追加ボタン設定
  const [addButtonSettings, setAddButtonSettings] = useState({
    buttonText: '友だち追加',
    buttonColor: '#06C755',
    showIcon: true,
    buttonStyle: 'normal',
    redirectUrl: '',
    utm: {
      source: 'website',
      medium: 'button',
      campaign: 'friend_add'
    }
  });

  // 概要表示
  const renderOverview = () => (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">総友だち数</p>
              <p className="text-2xl font-bold text-gray-900">{friendStats.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">今月の追加</p>
              <p className="text-2xl font-bold text-gray-900">{friendStats.thisMonth.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">成長率</p>
              <p className="text-2xl font-bold text-gray-900">+{friendStats.growthRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">月間目標</p>
              <p className="text-2xl font-bold text-gray-900">1,500</p>
            </div>
          </div>
        </div>
      </div>

      {/* 流入元分析 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">友だち追加の流入元</h3>
        <div className="space-y-4">
          {friendStats.sources.map((source, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{source.name}</span>
                  <span className="text-sm text-gray-500">{source.count}人 ({source.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // プロモーション素材表示
  const renderPromotionMaterials = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">プロモーション素材</h3>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <QrCode className="-ml-1 mr-2 h-4 w-4" />
          新規作成
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotionMaterials.map((material) => (
          <div key={material.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              {material.type === 'qrcode' ? (
                <QrCode className="h-16 w-16 text-gray-400" />
              ) : (
                <div className="text-center">
                  <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-xs text-gray-500">{material.size}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{material.title}</h4>
              <p className="text-sm text-gray-500 mb-3">{material.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>DL: {material.downloads}回</span>
                <span>{new Date(material.createdAt).toLocaleDateString('ja-JP')}</span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Eye className="h-4 w-4 mr-1" />
                  プレビュー
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-1" />
                  ダウンロード
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // キャンペーン表示
  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">友だち追加キャンペーン</h3>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
          <Gift className="-ml-1 mr-2 h-4 w-4" />
          キャンペーン作成
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-1">{campaign.title}</h4>
                  <p className="text-sm text-gray-600">{campaign.description}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status === 'active' ? '実施中' :
                   campaign.status === 'scheduled' ? '予定' : '終了'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(campaign.startDate).toLocaleDateString('ja-JP')} - {new Date(campaign.endDate).toLocaleDateString('ja-JP')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Gift className="h-4 w-4 mr-2" />
                  {campaign.reward}
                </div>
              </div>

              {/* 進捗バー */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>進捗状況</span>
                  <span>{campaign.currentCount} / {campaign.targetCount}人</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(campaign.currentCount / campaign.targetCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  ランディングページ
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <QrCode className="h-4 w-4 mr-1" />
                  QRコード
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 友だち追加ボタン設定
  const renderButtonSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">友だち追加ボタン設定</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 設定項目 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ボタンテキスト</label>
              <input
                type="text"
                value={addButtonSettings.buttonText}
                onChange={(e) => setAddButtonSettings({...addButtonSettings, buttonText: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ボタンカラー</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={addButtonSettings.buttonColor}
                  onChange={(e) => setAddButtonSettings({...addButtonSettings, buttonColor: e.target.value})}
                  className="w-16 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={addButtonSettings.buttonColor}
                  onChange={(e) => setAddButtonSettings({...addButtonSettings, buttonColor: e.target.value})}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ボタンスタイル</label>
              <select
                value={addButtonSettings.buttonStyle}
                onChange={(e) => setAddButtonSettings({...addButtonSettings, buttonStyle: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">ノーマル</option>
                <option value="large">大きめ</option>
                <option value="small">小さめ</option>
              </select>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={addButtonSettings.showIcon}
                  onChange={(e) => setAddButtonSettings({...addButtonSettings, showIcon: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">LINEアイコンを表示</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">リダイレクトURL（オプション）</label>
              <input
                type="url"
                value={addButtonSettings.redirectUrl}
                onChange={(e) => setAddButtonSettings({...addButtonSettings, redirectUrl: e.target.value})}
                placeholder="https://example.com/thankyou"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* プレビュー */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">プレビュー</h4>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">Webサイトでの表示イメージ</p>
                
                <button
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all ${
                    addButtonSettings.buttonStyle === 'large' ? 'px-8 py-4 text-lg' :
                    addButtonSettings.buttonStyle === 'small' ? 'px-4 py-2 text-sm' :
                    'px-6 py-3'
                  }`}
                  style={{ backgroundColor: addButtonSettings.buttonColor }}
                >
                  {addButtonSettings.showIcon && (
                    <MessageCircle className="mr-2 h-5 w-5" />
                  )}
                  {addButtonSettings.buttonText}
                </button>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">HTMLコード</p>
                  <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono">
                    {`<a href="https://line.me/R/ti/p/@example${addButtonSettings.redirectUrl ? `?redirect=${encodeURIComponent(addButtonSettings.redirectUrl)}` : ''}" 
   style="background-color: ${addButtonSettings.buttonColor}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
  ${addButtonSettings.buttonText}
</a>`}
                  </div>
                  <button className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Copy className="h-3 w-3 mr-1" />
                    コピー
                  </button>
                </div>
              </div>
            </div>
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
            友だち増加促進
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            友だち追加を促進するための各種機能とキャンペーン管理
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Share2 className="-ml-1 mr-2 h-4 w-4" />
            シェア
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
            <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
            統計を更新
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: '概要', icon: BarChart3 },
            { id: 'materials', label: 'プロモーション素材', icon: QrCode },
            { id: 'campaigns', label: 'キャンペーン', icon: Gift },
            { id: 'settings', label: '友だち追加ボタン', icon: Link }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'materials' && renderPromotionMaterials()}
      {activeTab === 'campaigns' && renderCampaigns()}
      {activeTab === 'settings' && renderButtonSettings()}
    </div>
  );
};

export default FriendGrowth;