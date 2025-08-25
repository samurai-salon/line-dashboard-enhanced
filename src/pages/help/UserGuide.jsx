// src/pages/help/UserGuide.jsx - LINE管理ダッシュボード機能説明・取扱説明書
import React, { useState } from 'react';
import {
  BookOpen, Menu, Users, MessageSquare, Settings, BarChart,
  Bell, Phone, Bot, Calendar, Upload, Download, Search, 
  ChevronRight, ChevronDown, ExternalLink, Play, Pause,
  UserPlus, MessageCircle, Zap, Shield, Clock, Target,
  AlertCircle, CheckCircle, Info, HelpCircle, Star,
  Smartphone, Monitor, Globe, Database, Key, Lock
} from 'lucide-react';

const UserGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedItems, setExpandedItems] = useState({});
  const [expandedSubItems, setExpandedSubItems] = useState({});

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleSubItem = (subItemId) => {
    setExpandedSubItems(prev => ({
      ...prev,
      [subItemId]: !prev[subItemId]
    }));
  };

  // 目次データ
  const sections = [
    {
      id: 'overview',
      title: 'システム概要',
      icon: BookOpen,
      items: [
        { id: 'about', title: 'LINE管理ダッシュボードとは' },
        { id: 'features', title: '主要機能' },
        { id: 'ui-design', title: 'モダンUIデザイン' },
        { id: 'mobile-support', title: 'モバイル対応' },
        { id: 'requirements', title: 'システム要件' }
      ]
    },
    {
      id: 'users',
      title: 'ユーザー管理',
      icon: Users,
      items: [
        { id: 'user-list', title: 'ユーザー一覧・検索' },
        { id: 'user-create', title: '新規ユーザー作成' },
        { id: 'user-groups', title: 'グループ管理' },
        { id: 'csv-import-export', title: 'CSV一括処理' }
      ]
    },
    {
      id: 'messages',
      title: 'メッセージ管理',
      icon: MessageSquare,
      items: [
        { id: 'broadcast', title: '一斉配信' },
        { id: 'templates', title: 'メッセージテンプレート' },
        { id: 'friend-growth', title: '友だち獲得' }
      ]
    },
    {
      id: 'chat',
      title: 'チャット機能',
      icon: MessageCircle,
      items: [
        { id: 'official-line-accounts', title: '公式LINEアカウント管理' },
        { id: 'chat-dashboard', title: 'チャット管理' },
        { id: 'api-integration', title: 'API連携' },
        { id: 'call-request', title: 'LINE電話発信要請' },
        { id: 'call-history', title: '通話履歴' }
      ]
    },
    {
      id: 'automation',
      title: '自動化機能',
      icon: Bot,
      items: [
        { id: 'auto-reply', title: '自動返信システム' },
        { id: 'triggers', title: 'トリガー設定' },
        { id: 'ab-testing', title: 'A/Bテスト' }
      ]
    },
    {
      id: 'analytics',
      title: '分析・統計',
      icon: BarChart,
      items: [
        { id: 'analytics-overview', title: '統計ダッシュボード' },
        { id: 'user-analytics', title: 'ユーザー分析' },
        { id: 'message-analytics', title: 'メッセージ分析' }
      ]
    },
    {
      id: 'notifications',
      title: '通知管理',
      icon: Bell,
      items: [
        { id: 'push-notifications', title: 'プッシュ通知' },
        { id: 'scheduled-messages', title: '予約配信' }
      ]
    },
    {
      id: 'settings',
      title: 'システム設定',
      icon: Settings,
      items: [
        { id: 'line-settings', title: 'LINE設定' },
        { id: 'webhook', title: 'Webhook設定' },
        { id: 'rich-menu', title: 'リッチメニュー' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'トラブルシューティング',
      icon: AlertCircle,
      items: [
        { id: 'common-issues', title: 'よくある問題' },
        { id: 'error-codes', title: 'エラーコード一覧' },
        { id: 'support', title: 'サポート情報' }
      ]
    }
  ];

  // コンテンツデータ
  const content = {
    // システム概要
    about: {
      title: 'LINE管理ダッシュボードとは',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINE管理ダッシュボードは、LINE公式アカウントの運用を効率化する包括的な管理システムです。
            友だちとのコミュニケーション、マーケティング活動、顧客管理を一元化して行うことができます。
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">主な特徴</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>直感的で使いやすいWeb界面</li>
              <li>リアルタイムでのメッセージ管理</li>
              <li>高度な自動化機能</li>
              <li>詳細な分析・統計機能</li>
              <li>セキュアなユーザー管理</li>
            </ul>
          </div>
        </div>
      )
    },
    'ui-design': {
      title: 'モダンUIデザイン',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINE管理ダッシュボードは最新のUIデザイントレンドを取り入れた、直感的で美しいインターフェースを提供します。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Monitor className="h-4 w-4 mr-2 text-blue-600" />
                デザイン特徴
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>グラデーション背景とガラスモーフィズム効果</li>
                <li>バックドロップブラーとシャドウ効果</li>
                <li>スムーズなアニメーションと遷移</li>
                <li>直感的なマイクロインタラクション</li>
                <li>レスポンシブ対応のカードレイアウト</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Smartphone className="h-4 w-4 mr-2 text-green-600" />
                UX改善点
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>ロールベースUIと権限表示</li>
                <li>統計情報のビジュアル化</li>
                <li>ワンクリックアクション</li>
                <li>高コントラストの視認性</li>
                <li>アクセシビリティ対応</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-start space-x-2">
              <Star className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">デザインシステム</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  統一されたコンポーネントライブラリにより、一貫性のある操作体験を提供します。
                  カード、ボタン、フォームなど全ての要素が統合されたデザイン言語で構築されています。
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'mobile-support': {
      title: 'モバイル対応',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            スマートフォンやタブレットからの操作も完全サポート。外出先でも効率的にLINE管理が可能です。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900 mb-2">スマートフォン</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>固定底部ナビゲーション</li>
                <li>タッチ操作最適化</li>
                <li>片手操作対応</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Monitor className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-green-900 mb-2">タブレット</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>大画面レイアウト</li>
                <li>2カラム表示</li>
                <li>マルチタッチ対応</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-purple-900 mb-2">PWA対応</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>アプリ風操作感</li>
                <li>オフライン対応</li>
                <li>プッシュ通知</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">モバイルファースト設計</h4>
                <p className="text-sm text-green-800 mt-1">
                  全ての機能がモバイル環境で快適に利用できるよう設計されており、
                  デスクトップと同等の機能性を提供します。
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    features: {
      title: '主要機能',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Users, title: 'ユーザー管理', desc: '友だちの情報管理、グループ分類、一括操作' },
            { icon: MessageSquare, title: 'メッセージ配信', desc: '一斉配信、テンプレート管理、予約送信' },
            { icon: Bot, title: '自動返信', desc: 'キーワード・時間・行動による自動応答' },
            { icon: BarChart, title: '分析機能', desc: '配信効果測定、ユーザー行動分析' },
            { icon: Phone, title: '電話連携', desc: '電話発信要請、通話履歴管理' },
            { icon: Shield, title: 'セキュリティ', desc: '権限管理、アクセス制御' }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className="h-6 w-6 text-blue-600" />
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      )
    },
    requirements: {
      title: 'システム要件',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">推奨ブラウザ</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Chrome', version: '90+' },
                { name: 'Firefox', version: '88+' },
                { name: 'Safari', version: '14+' },
                { name: 'Edge', version: '90+' }
              ].map((browser, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium">{browser.name}</p>
                  <p className="text-xs text-gray-500">{browser.version}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">デバイス対応</h4>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">デスクトップ</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">モバイル</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // ユーザー管理
    'user-list': {
      title: 'ユーザー一覧・検索',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINE公式アカウントの友だち一覧を表示し、効率的な管理を行うことができます。
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
              <Search className="h-4 w-4 mr-2" />
              検索・フィルター機能
            </h4>
            <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
              <li>名前・ID・電話番号での検索</li>
              <li>タグ・グループ・ステータスでのフィルタ</li>
              <li>登録日時・最終アクティブでの並び替え</li>
              <li>一括選択・一括操作</li>
            </ul>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600">
              <strong>ヒント:</strong> 大量のユーザーを効率的に管理するために、タグ機能を積極的に活用しましょう。
            </p>
          </div>
        </div>
      )
    },
    'user-create': {
      title: '新規ユーザー作成',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            手動でユーザー情報を登録し、カスタム属性を設定できます。
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">設定可能な項目</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
              <div>• 基本情報（名前、電話、メール）</div>
              <div>• プロフィール画像</div>
              <div>• カスタムタグ</div>
              <div>• グループ分類</div>
              <div>• 権限レベル</div>
              <div>• メモ・備考</div>
            </div>
          </div>
        </div>
      )
    },
    'user-groups': {
      title: 'グループ管理',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            ユーザーをグループ化して、効率的なメッセージ配信とターゲティングを行います。
          </p>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <h5 className="font-medium text-gray-900">動的グループ</h5>
              <p className="text-sm text-gray-600">条件に基づいて自動的にメンバーが更新される</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <h5 className="font-medium text-gray-900">静的グループ</h5>
              <p className="text-sm text-gray-600">手動で管理するメンバー固定のグループ</p>
            </div>
          </div>
        </div>
      )
    },
    'csv-import-export': {
      title: 'CSV一括処理',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            大量のユーザーデータを効率的にインポート・エクスポートできます。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                インポート機能
              </h4>
              <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                <li>CSVファイル形式対応</li>
                <li>データマッピング機能</li>
                <li>重複チェック</li>
                <li>エラー検証</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                エクスポート機能
              </h4>
              <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                <li>カスタム列選択</li>
                <li>フィルタ条件適用</li>
                <li>Excel互換形式</li>
                <li>履歴管理</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // メッセージ管理
    broadcast: {
      title: '一斉配信',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            大量のユーザーに対して効率的にメッセージを配信できます。
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">配信タイプ</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-purple-900">即時配信</h5>
                <p className="text-purple-700">すぐにメッセージを送信</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-purple-900">予約配信</h5>
                <p className="text-purple-700">指定日時に自動送信</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-purple-900">テスト配信</h5>
                <p className="text-purple-700">少数グループで事前テスト</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    templates: {
      title: 'メッセージテンプレート',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            よく使用するメッセージをテンプレート化して、配信作業を効率化できます。
          </p>
          <div className="space-y-3">
            {[
              { type: 'テキスト', desc: '基本的な文字メッセージ' },
              { type: 'クイック返信', desc: '返信ボタン付きメッセージ' },
              { type: 'カルーセル', desc: '複数の選択肢を横並び表示' },
              { type: 'Flex', desc: '自由度の高いレイアウト' }
            ].map((template, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="font-medium text-gray-900">{template.type}</span>
                  <p className="text-sm text-gray-600">{template.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'friend-growth': {
      title: '友だち獲得',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINE公式アカウントの友だち数を効率的に増やすための機能群です。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">QRコード生成</h4>
              <p className="text-sm text-orange-800">カスタムパラメータ付きQRコードを生成</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-medium text-pink-900 mb-2">友だち追加促進</h4>
              <p className="text-sm text-pink-800">追加ボタンのカスタマイズと配置</p>
            </div>
          </div>
        </div>
      )
    },

    // チャット機能
    'official-line-accounts': {
      title: '公式LINEアカウント管理',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            複数の公式LINEアカウントを一括管理し、各アカウントに登録されているユーザーとの効率的なコミュニケーションを実現します。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                アカウント情報
              </h4>
              <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                <li>アカウント名・表示名</li>
                <li>登録ユーザー数の表示</li>
                <li>アクティブ状態の確認</li>
                <li>24時間内のメッセージ数</li>
                <li>カテゴリタグ表示</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                操作手順
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                <li>公式LINEアカウントを選択</li>
                <li>ユーザー一覧が自動表示</li>
                <li>個別チャットを開始</li>
                <li>メッセージ送信・通話要請</li>
                <li>戻るボタンで一覧に復帰</li>
              </ol>
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-start space-x-2">
              <Key className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">API連携対応</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  各公式LINEアカウントの情報は、LINE Messaging APIを通じてリアルタイムで取得・更新されます。
                  複数店舗や部門での運用にも対応しています。
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'chat-dashboard': {
      title: 'チャット管理',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            選択した公式LINEアカウントのユーザーとの個別チャットを効率的に管理できます。
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">主な機能</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>リアルタイムメッセージ送受信</li>
              <li>未読メッセージの管理</li>
              <li>チャット履歴の検索・フィルタ</li>
              <li>定型文の挿入</li>
              <li>ファイル・画像の送受信</li>
              <li>LINE通話要請機能</li>
              <li>一括通話要請対応</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              新機能追加
            </h4>
            <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
              <li>選択中の公式LINEアカウント情報表示</li>
              <li>ユーザー統計情報の表示</li>
              <li>アカウント切り替え機能</li>
              <li>権限レベル別の操作制限</li>
            </ul>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600">
              <strong>ヒント:</strong> まず公式LINEアカウントを選択し、そのユーザー一覧から優先度の高い顧客を選んで対応しましょう。
            </p>
          </div>
        </div>
      )
    },
    'api-integration': {
      title: 'API連携',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINE Messaging APIとの完全連携により、リアルタイムでデータの同期と管理を行います。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                対応API
              </h4>
              <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                <li>LINE Messaging API</li>
                <li>LINE Login API</li>
                <li>LINE LIFF API</li>
                <li>Webhook受信処理</li>
                <li>プッシュメッセージ送信</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                データ連携
              </h4>
              <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
                <li>ユーザープロフィール情報</li>
                <li>メッセージ履歴同期</li>
                <li>友だち追加・ブロック状態</li>
                <li>リッチメニュー操作</li>
                <li>統計データ取得</li>
              </ul>
            </div>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex items-start space-x-2">
              <Lock className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">セキュリティ</h4>
                <p className="text-sm text-red-800 mt-1">
                  すべてのAPI通信はHTTPS暗号化により保護され、アクセストークンの適切な管理と
                  定期的な更新により高いセキュリティレベルを維持しています。
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'call-request': {
      title: 'LINE通話要請',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINE公式アカウントから顧客にLINE通話をしてもらうよう要請する機能です。
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">機能の流れ</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <div>
                  <p className="text-sm font-medium text-green-900">メッセージ作成</p>
                  <p className="text-xs text-green-700">「お時間になりましたらこちらより発信ください」のメッセージ作成</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <div>
                  <p className="text-sm font-medium text-green-900">対象ユーザー選択</p>
                  <p className="text-xs text-green-700">通話要請を送信するユーザーを選択</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <div>
                  <p className="text-sm font-medium text-green-900">要請送信</p>
                  <p className="text-xs text-green-700">「📞LINE通話をかける」ボタン付きメッセージを送信</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                <div>
                  <p className="text-sm font-medium text-green-900">顧客からのLINE通話</p>
                  <p className="text-xs text-green-700">顧客がボタンをタップしてLINE通話を開始</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💬 LINE通話の特徴</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>無料でのボイス・ビデオ通話が可能</li>
              <li>LINE公式アカウントとの直接通話</li>
              <li>通話履歴がLINEアプリ内で管理される</li>
              <li>スマートフォン・PC両方で利用可能</li>
            </ul>
          </div>
        </div>
      )
    },
    'call-history': {
      title: '通話履歴',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINE通話要請とその結果を一元管理できます。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">📊 統計機能</h4>
              <ul className="list-disc list-inside space-y-1 text-orange-800 text-sm">
                <li>要請送信数</li>
                <li>LINE通話受信率</li>
                <li>時間帯別分析</li>
                <li>通話応答率</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🔍 フィルタ機能</h4>
              <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
                <li>ステータス別表示</li>
                <li>日付範囲指定</li>
                <li>ユーザー別検索</li>
                <li>成功/失敗での絞り込み</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">📱 LINE通話履歴の特徴</h4>
            <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
              <li>通話時間・品質の記録</li>
              <li>音声・ビデオ通話の区別</li>
              <li>通話中断・再接続の履歴</li>
              <li>顧客満足度の記録機能</li>
            </ul>
          </div>
        </div>
      )
    },

    // 自動化機能
    'auto-reply': {
      title: '自動返信システム',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            キーワード、時間、ユーザー行動に基づいて自動的にメッセージを返信するシステムです。
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-900 mb-2">トリガータイプ</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: MessageCircle, title: 'キーワード', desc: 'メッセージ内の特定語句' },
                { icon: Clock, title: '時間', desc: '営業時間外など' },
                { icon: Target, title: '行動', desc: '友だち追加など' }
              ].map((trigger, index) => {
                const Icon = trigger.icon;
                return (
                  <div key={index} className="bg-white p-3 rounded border">
                    <Icon className="h-5 w-5 text-indigo-600 mb-1" />
                    <h5 className="font-medium text-indigo-900">{trigger.title}</h5>
                    <p className="text-sm text-indigo-700">{trigger.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )
    },
    'triggers': {
      title: 'トリガー設定',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            自動返信を発動させるトリガーの詳細設定について説明します。
          </p>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
                キーワードトリガー
              </h4>
              <p className="text-sm text-gray-600 mb-2">メッセージに含まれる特定の語句で自動返信を発動</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                <li><strong>部分一致</strong>: キーワードが含まれていれば発動</li>
                <li><strong>完全一致</strong>: メッセージ全体がキーワードと一致</li>
                <li><strong>正規表現</strong>: 高度なパターンマッチング</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Clock className="h-5 w-5 text-orange-600 mr-2" />
                時間トリガー
              </h4>
              <p className="text-sm text-gray-600 mb-2">特定の時間条件で自動返信を発動</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                <li><strong>営業時間外</strong>: 設定した営業時間外のメッセージに自動返信</li>
                <li><strong>特定日時</strong>: 指定した日時に自動メッセージ送信</li>
                <li><strong>定期実行</strong>: 毎日/毎週など定期的な送信</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Target className="h-5 w-5 text-green-600 mr-2" />
                行動トリガー
              </h4>
              <p className="text-sm text-gray-600 mb-2">ユーザーの特定の行動で自動返信を発動</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                <li><strong>友だち追加</strong>: 新規友だち追加時にウェルカムメッセージ</li>
                <li><strong>スタンプ送信</strong>: スタンプが送信された時</li>
                <li><strong>位置情報共有</strong>: 位置情報が送信された時</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'ab-testing': {
      title: 'A/Bテスト',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            異なる返信内容をテストして、より効果的なメッセージを見つけることができます。
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-900 mb-2">A/Bテストの流れ</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <div>
                  <p className="text-sm font-medium text-indigo-900">バリアント作成</p>
                  <p className="text-xs text-indigo-700">パターンAとパターンBの返信内容を作成</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <div>
                  <p className="text-sm font-medium text-indigo-900">配信比率設定</p>
                  <p className="text-xs text-indigo-700">各パターンの配信比率を設定（例：50:50）</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <div>
                  <p className="text-sm font-medium text-indigo-900">自動配信</p>
                  <p className="text-xs text-indigo-700">システムが自動的に振り分けて配信</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                <div>
                  <p className="text-sm font-medium text-indigo-900">結果分析</p>
                  <p className="text-xs text-indigo-700">開封率、クリック率等を比較分析</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ 注意点</h4>
            <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
              <li>十分なサンプル数を確保してから判断する</li>
              <li>テスト期間は最低でも1週間以上設ける</li>
              <li>1度に複数の要素を変更しない</li>
            </ul>
          </div>
        </div>
      )
    },

    // 分析・統計
    'analytics-overview': {
      title: '統計ダッシュボード',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINE公式アカウントの運用状況を包括的に把握できるダッシュボードです。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📊 主要指標</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                <li>総友だち数・増減率</li>
                <li>メッセージ配信数</li>
                <li>開封率・クリック率</li>
                <li>アクティブユーザー数</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">📈 期間比較</h4>
              <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                <li>日別・週別・月別比較</li>
                <li>前年同期比較</li>
                <li>トレンド分析</li>
                <li>季節性パターン</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'user-analytics': {
      title: 'ユーザー分析',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            友だちの行動パターンと属性を詳細に分析できます。
          </p>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">👥 デモグラフィック分析</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                <li>年齢層別分布</li>
                <li>性別比率</li>
                <li>地域別分布</li>
                <li>登録期間別分析</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📱 行動分析</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                <li>メッセージ反応率</li>
                <li>アクティブ時間帯</li>
                <li>コンテンツ別エンゲージメント</li>
                <li>離脱・ブロック分析</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'message-analytics': {
      title: 'メッセージ分析',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            送信したメッセージの効果を詳細に分析し、改善点を見つけることができます。
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">📈 配信効果指標</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-purple-900">到達率</p>
                <p className="text-purple-700">配信成功率</p>
              </div>
              <div>
                <p className="font-medium text-purple-900">開封率</p>
                <p className="text-purple-700">メッセージを見た割合</p>
              </div>
              <div>
                <p className="font-medium text-purple-900">クリック率</p>
                <p className="text-purple-700">リンク・ボタンクリック率</p>
              </div>
              <div>
                <p className="font-medium text-purple-900">コンバージョン率</p>
                <p className="text-purple-700">目標達成率</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // 通知管理
    'push-notifications': {
      title: 'プッシュ通知',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            重要な情報をタイムリーにユーザーに届けるプッシュ通知機能です。
          </p>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">🚨 通知タイプ</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-sm text-red-800"><strong>緊急通知</strong>: システム障害、重要なお知らせ</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-sm text-red-800"><strong>マーケティング</strong>: キャンペーン、セール情報</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-red-800"><strong>リマインダー</strong>: 予約確認、イベント通知</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'scheduled-messages': {
      title: '予約配信',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            指定した日時に自動的にメッセージを配信する機能です。
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">⏰ 予約配信の用途</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>営業時間外の自動挨拶</li>
              <li>定期的なニュースレター</li>
              <li>誕生日・記念日メッセージ</li>
              <li>イベント開催前のリマインダー</li>
              <li>季節のご挨拶メッセージ</li>
            </ul>
          </div>
        </div>
      )
    },

    // システム設定
    'line-settings': {
      title: 'LINE設定',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINE Developers Console と連携するための基本設定を行います。
          </p>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Key className="h-5 w-5 text-blue-600 mr-2" />
                API設定
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                <li>チャンネルアクセストークン</li>
                <li>チャンネルシークレット</li>
                <li>User ID (公式アカウント)</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Database className="h-5 w-5 text-green-600 mr-2" />
                基本情報
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                <li>アカウント名・説明文</li>
                <li>プロフィール画像</li>
                <li>業種・カテゴリ</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'webhook': {
      title: 'Webhook設定',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            LINEからのメッセージを受信するためのWebhook設定について説明します。
          </p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">⚙️ 設定手順</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <p className="text-sm text-orange-800">WebhookURLを取得・設定</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <p className="text-sm text-orange-800">SSL証明書の確認</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <p className="text-sm text-orange-800">接続テストの実行</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'rich-menu': {
      title: 'リッチメニュー',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            チャット画面下部に表示される便利なメニューを設定できます。
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">🎨 設計のポイント</h4>
            <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
              <li>よく使われる機能を配置</li>
              <li>直感的で分かりやすいデザイン</li>
              <li>適切なサイズ・解像度での画像作成</li>
              <li>タップ領域の明確な区分け</li>
            </ul>
          </div>
        </div>
      )
    },

    // トラブルシューティング
    'common-issues': {
      title: 'よくある問題',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              {
                q: 'メッセージが送信されない',
                a: 'LINE Webhook設定、アクセストークンの有効性を確認してください。'
              },
              {
                q: '自動返信が動作しない',
                a: 'ルールの有効性、キーワード設定、優先度を確認してください。'
              },
              {
                q: 'ユーザー情報が同期されない',
                a: 'Webhook URLの設定とSSL証明書を確認してください。'
              },
              {
                q: 'CSVインポートでエラーが発生',
                a: 'ファイル形式、文字コード（UTF-8）、必須項目を確認してください。'
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <button
                  onClick={() => toggleExpanded(`faq-${index}`)}
                  className="w-full text-left flex items-center justify-between"
                >
                  <h4 className="font-medium text-gray-900">{faq.q}</h4>
                  {expandedItems[`faq-${index}`] ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                {expandedItems[`faq-${index}`] && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    'error-codes': {
      title: 'エラーコード一覧',
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">コード</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">説明</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">対処法</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { code: '401', desc: '認証エラー', solution: 'アクセストークンを確認' },
                  { code: '403', desc: '権限不足', solution: 'ユーザー権限を確認' },
                  { code: '429', desc: 'レート制限', solution: '送信頻度を調整' },
                  { code: '500', desc: 'サーバーエラー', solution: 'しばらく待って再試行' }
                ].map((error, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{error.code}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{error.desc}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{error.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    support: {
      title: 'サポート情報',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">お問い合わせ前のチェック</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>よくある問題とエラーコード一覧を確認</li>
              <li>LINE Developers コンソールの設定を確認</li>
              <li>ブラウザのコンソールでエラーメッセージを確認</li>
              <li>システム要件を満たしているかを確認</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">技術サポート</h4>
              <p className="text-sm text-gray-600 mb-3">システムの技術的な問題について</p>
              <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                <ExternalLink className="h-4 w-4 mr-1" />
                サポートに問い合わせ
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">ドキュメント</h4>
              <p className="text-sm text-gray-600 mb-3">詳細な設定手順とAPI仕様</p>
              <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                <ExternalLink className="h-4 w-4 mr-1" />
                開発者ドキュメント
              </button>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          LINE管理ダッシュボード 取扱説明書
        </h1>
        <p className="text-gray-600">
          システムの機能と使い方について詳しく説明します
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左サイドバー - 目次 */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Menu className="h-5 w-5 mr-2" />
              目次
            </h2>
            
            <nav className="space-y-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <div key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{section.title}</span>
                    </button>
                    
                    {/* サブアイテム */}
                    {activeSection === section.id && (
                      <div className="ml-6 mt-2 space-y-1">
                        {section.items.map(item => (
                          <div key={item.id}>
                            <button
                              onClick={() => toggleSubItem(item.id)}
                              className="w-full text-left flex items-center justify-between px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <span>{item.title}</span>
                              {expandedSubItems[item.id] ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                            
                            {/* サブアイテムの詳細内容を直下に表示 */}
                            {expandedSubItems[item.id] && content[item.id] && (
                              <div className="ml-4 mt-2 p-3 bg-gray-50 border-l-2 border-blue-300 rounded">
                                <div className="text-xs text-gray-700">
                                  {content[item.id].content}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {/* セクションメインコンテンツのみ表示（サブアイテムは左サイドバーで表示） */}
            {content[activeSection] && sections.some(section => section.id === activeSection) ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {content[activeSection].title}
                </h2>
                {content[activeSection].content}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  詳細表示
                </h3>
                <p className="text-gray-500">
                  左側のメニューから項目を選択してください。<br />
                  詳細項目をクリックすると、その項目の直下に説明が表示されます。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="mt-12 text-center py-8 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <span>© 2024 LINE Management Dashboard</span>
          <span>•</span>
          <button className="hover:text-gray-700">プライバシーポリシー</button>
          <span>•</span>
          <button className="hover:text-gray-700">利用規約</button>
          <span>•</span>
          <button className="hover:text-gray-700">サポート</button>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;