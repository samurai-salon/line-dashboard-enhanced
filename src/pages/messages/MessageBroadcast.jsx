import React, { useState, useCallback, useEffect } from 'react';
import {
  Send, Users, Target, Clock, Eye, Edit3, Trash2, Plus, Search,
  CheckCircle, XCircle,
  MessageSquare, User, FileText, Image, Video, Mic,
  Save, Copy, BookOpen
} from 'lucide-react';
import MessageInputWithEmoji from '../../components/emoji/MessageInputWithEmoji';

const MessageBroadcast = () => {
  // State管理
  const [broadcasts, setBroadcasts] = useState([
    {
      id: 1,
      title: '新商品告知キャンペーン',
      type: 'mass',
      messageType: 'text',
      status: 'completed',
      targets: { type: 'all', count: 5420 },
      content: { text: '🎉 新商品のお知らせ\n\n待望の新商品が登場しました！' },
      createdAt: '2024-01-15T10:00:00Z',
      sentAt: '2024-01-15T14:00:00Z',
      deliveredCount: 5420,
      openedCount: 3247
    },
    {
      id: 2,
      title: 'セール告知',
      type: 'segment',
      messageType: 'image',
      status: 'completed',
      targets: { type: 'segments', segments: ['VIP顧客'], count: 1232 },
      content: { text: '🛍️ 期間限定セール開催中！', image: '/images/sale.jpg' },
      createdAt: '2024-01-14T09:00:00Z',
      scheduledAt: '2024-01-16T12:00:00Z',
      sentAt: '2024-01-16T12:00:15Z',
      deliveredCount: 1232,
      openedCount: 987
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userSearchQuery, setUserSearchQuery] = useState(''); // ユーザー検索用

  // テンプレート管理State
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: '新商品告知',
      content: '🎉 新商品のお知らせ\n\n待望の新商品が登場しました！期間限定の特別価格でご提供中です。\n\n詳細はこちら👇',
      messageType: 'text',
      category: 'marketing',
      createdAt: '2024-01-01T09:00:00Z'
    },
    {
      id: 2,
      name: 'セール告知',
      content: '🛍️ 期間限定セール開催中！\n\n最大50%OFFの特別価格でご提供しています。この機会をお見逃しなく！',
      messageType: 'text',
      category: 'sales',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: 3,
      name: 'イベント案内',
      content: '📅 イベント開催のお知らせ\n\n来週開催のイベントにぜひご参加ください。楽しい企画をご用意しています！',
      messageType: 'text',
      category: 'event',
      createdAt: '2024-01-01T11:00:00Z'
    }
  ]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    messageType: 'text',
    category: 'general'
  });

  // 新規配信作成用State
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    type: 'mass',
    messageType: 'text',
    content: { text: '', image: '', video: '', audio: '', alt_text: '' },
    targets: { 
      type: 'all', 
      count: 5420, // デフォルト対象者数
      segments: [],
      users: [],
      selectedSegments: [],
      selectedUsers: []
    },
    schedule: { type: 'immediate', scheduledAt: '' }
  });

  // セグメント・ユーザー選択用のデータ
  const [availableSegments] = useState([
    { id: 1, name: 'VIP顧客', count: 234, description: '月間購入額10万円以上' },
    { id: 2, name: 'リピーター', count: 567, description: '3回以上購入履歴あり' },
    { id: 3, name: '新規顧客', count: 890, description: '初回購入から30日以内' },
    { id: 4, name: 'アクティブユーザー', count: 1200, description: '7日以内にアクセス' },
    { id: 5, name: '休眠顧客', count: 345, description: '30日以上非アクティブ' }
  ]);

  const [availableUsers] = useState([
    { id: 1, name: '田中太郎', email: 'tanaka@example.com', segment: 'VIP顧客' },
    { id: 2, name: '佐藤花子', email: 'sato@example.com', segment: 'リピーター' },
    { id: 3, name: '山田次郎', email: 'yamada@example.com', segment: '新規顧客' },
    { id: 4, name: '鈴木美咲', email: 'suzuki@example.com', segment: 'VIP顧客' },
    { id: 5, name: '高橋健一', email: 'takahashi@example.com', segment: 'アクティブユーザー' },
    { id: 6, name: '伊藤さくら', email: 'ito@example.com', segment: 'リピーター' },
    { id: 7, name: '渡辺大介', email: 'watanabe@example.com', segment: '新規顧客' },
    { id: 8, name: '小林麻衣', email: 'kobayashi@example.com', segment: 'VIP顧客' },
    { id: 9, name: '加藤慎一', email: 'kato@example.com', segment: 'アクティブユーザー' },
    { id: 10, name: '吉田美穂', email: 'yoshida@example.com', segment: '休眠顧客' },
    { id: 11, name: '松本裕子', email: 'matsumoto@example.com', segment: 'リピーター' },
    { id: 12, name: '中村健太', email: 'nakamura@example.com', segment: '新規顧客' },
    { id: 13, name: '林愛子', email: 'hayashi@example.com', segment: 'VIP顧客' },
    { id: 14, name: '清水一郎', email: 'shimizu@example.com', segment: 'アクティブユーザー' },
    { id: 15, name: '森田陽子', email: 'morita@example.com', segment: '休眠顧客' }
  ]);

  // ユーザー検索フィルタリング
  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.segment.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // スケジュール送信の自動実行（重複実行防止版）
  useEffect(() => {
    const processedBroadcasts = new Set(); // 処理済み配信のIDを記録
    
    const checkScheduledBroadcasts = () => {
      const now = new Date();
      
      setBroadcasts(prev => prev.map(broadcast => {
        // 既に処理済みの配信はスキップ
        if (processedBroadcasts.has(broadcast.id)) {
          return broadcast;
        }
        
        if (broadcast.status === 'scheduled' && broadcast.scheduledAt) {
          const scheduledTime = new Date(broadcast.scheduledAt);
          
          if (now >= scheduledTime) {
            console.log('📤 配信実行開始:', broadcast.title, 'at', now.toLocaleTimeString());
            
            // 処理済みとしてマーク
            processedBroadcasts.add(broadcast.id);
            
            // 送信開始状態に変更
            const updatedBroadcast = { ...broadcast, status: 'sending' };
            
            // 2秒後に完了状態に変更
            setTimeout(() => {
              setBroadcasts(prevBroadcasts => prevBroadcasts.map(b => 
                b.id === broadcast.id 
                  ? { 
                      ...b, 
                      status: 'completed', 
                      deliveredCount: broadcast.targets.count,
                      openedCount: Math.floor(broadcast.targets.count * 0.6),
                      sentAt: new Date().toISOString()
                    }
                  : b
              ));
              
              console.log('✅ 配信完了:', broadcast.title);
              
              // 開封率の段階的更新
              const updateOpenRate = (broadcastId, targetCount) => {
                let currentOpened = Math.floor(targetCount * 0.6);
                let updateCount = 0;
                
                const interval = setInterval(() => {
                  updateCount++;
                  const randomIncrease = Math.floor(Math.random() * Math.floor(targetCount * 0.03));
                  const newOpened = Math.min(currentOpened + randomIncrease, Math.floor(targetCount * 0.8));
                  
                  setBroadcasts(prev => prev.map(b => 
                    b.id === broadcastId 
                      ? { ...b, openedCount: newOpened }
                      : b
                  ));
                  
                  currentOpened = newOpened;
                  
                  // 最大80%に達するか、5回更新したら停止
                  if (newOpened >= Math.floor(targetCount * 0.8) || updateCount >= 5) {
                    clearInterval(interval);
                    console.log('📊 開封率更新完了:', Math.round((newOpened / targetCount) * 100) + '%');
                  }
                }, 4000); // 4秒ごとに更新
              };
              
              updateOpenRate(broadcast.id, broadcast.targets.count);
            }, 2000);
            
            return updatedBroadcast;
          }
        }
        return broadcast;
      }));
    };

    // 初回実行
    checkScheduledBroadcasts();
    
    // 15秒ごとにチェック
    const interval = setInterval(checkScheduledBroadcasts, 15000);
    
    return () => {
      clearInterval(interval);
      processedBroadcasts.clear();
    };
  }, []);

  // 配信タイプ定義
  const broadcastTypes = [
    {
      value: 'mass',
      label: '一斉配信',
      icon: Users,
      color: 'blue',
      description: 'すべての友だちに一括配信'
    },
    {
      value: 'segment',
      label: 'セグメント配信',
      icon: Target,
      color: 'green',
      description: '特定のセグメントに配信'
    },
    {
      value: 'individual',
      label: '個別配信',
      icon: User,
      color: 'purple',
      description: '個別ユーザーに配信'
    }
  ];

  // メッセージタイプ定義
  const messageTypes = [
    { value: 'text', label: 'テキスト', icon: FileText, color: 'gray' },
    { value: 'image', label: '画像', icon: Image, color: 'blue' },
    { value: 'video', label: '動画', icon: Video, color: 'red' },
    { value: 'audio', label: '音声', icon: Mic, color: 'green' }
  ];

  // ステータス定義
  const statusTypes = [
    { value: 'draft', label: '下書き', color: 'gray', icon: Edit3 },
    { value: 'scheduled', label: '送信予約', color: 'yellow', icon: Clock },
    { value: 'sending', label: '送信中', color: 'blue', icon: Send },
    { value: 'completed', label: '送信完了', color: 'green', icon: CheckCircle },
    { value: 'failed', label: '送信失敗', color: 'red', icon: XCircle }
  ];

  // フィルタリング
  const filteredBroadcasts = broadcasts.filter(broadcast => {
    const matchesSearch = broadcast.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || broadcast.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 対象者数計算
  const calculateTargetCount = useCallback((broadcastType, selectedSegments, selectedUsers) => {
    switch (broadcastType) {
      case 'mass':
        return 5420; // 全ユーザー数
      case 'segment':
        return selectedSegments.reduce((total, segmentId) => {
          const segment = availableSegments.find(s => s.id === segmentId);
          return total + (segment ? segment.count : 0);
        }, 0);
      case 'individual':
        return selectedUsers.length;
      default:
        return 0;
    }
  }, [availableSegments]);

  // 配信タイプ変更時の対象者数更新
  useEffect(() => {
    const count = calculateTargetCount(
      newBroadcast.type, 
      newBroadcast.targets.selectedSegments, 
      newBroadcast.targets.selectedUsers
    );
    
    setNewBroadcast(prev => ({
      ...prev,
      targets: { ...prev.targets, count }
    }));
  }, [newBroadcast.type, newBroadcast.targets.selectedSegments, newBroadcast.targets.selectedUsers, calculateTargetCount]);

  // ファイルアップロード処理（修正版）
  const handleFileUpload = useCallback((fileType, file) => {
    if (!file) return;

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      alert('ファイルサイズは10MB以下にしてください。');
      return;
    }

    // ファイルタイプチェック
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/mov', 'video/avi'],
      audio: ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg']
    };

    if (!allowedTypes[fileType]?.includes(file.type)) {
      alert(`${fileType}ファイルの形式が正しくありません。`);
      return;
    }

    // ファイルをBase64に変換
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setNewBroadcast(prev => ({
          ...prev,
          content: {
            ...prev.content,
            [fileType]: e.target.result,
            alt_text: file.name
          }
        }));
      } catch (error) {
        console.error('ファイル読み込みエラー:', error);
        alert('ファイルの読み込みに失敗しました。');
      }
    };
    reader.onerror = () => {
      alert('ファイルの読み込みに失敗しました。');
    };
    reader.readAsDataURL(file);
  }, []);

  // テンプレート保存処理
  const handleSaveTemplate = useCallback(() => {
    if (!newTemplate.name || !newTemplate.content) {
      alert('テンプレート名と内容を入力してください。');
      return;
    }

    if (templates.length >= 20) {
      alert('テンプレートは最大20件まで保存できます。');
      return;
    }

    const template = {
      id: editingTemplate ? editingTemplate.id : Date.now(),
      ...newTemplate,
      createdAt: editingTemplate ? editingTemplate.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? template : t));
    } else {
      setTemplates(prev => [template, ...prev]);
    }

    setNewTemplate({ name: '', content: '', messageType: 'text', category: 'general' });
    setEditingTemplate(null);
    setShowTemplateModal(false);
  }, [newTemplate, editingTemplate, templates]);

  // テンプレート適用処理
  const handleApplyTemplate = useCallback((template) => {
    setNewBroadcast(prev => ({
      ...prev,
      content: { ...prev.content, text: template.content },
      messageType: template.messageType
    }));
    setShowTemplateModal(false);
  }, []);

  // 配信実行処理（名称変更）
  const handleExecuteBroadcast = useCallback(() => {
    // バリデーション
    if (!newBroadcast.title.trim()) {
      alert('配信名を入力してください。');
      return;
    }
    
    if (!newBroadcast.content.text.trim() && !newBroadcast.content.image && !newBroadcast.content.video && !newBroadcast.content.audio) {
      alert('メッセージ内容を入力してください。');
      return;
    }

    if (newBroadcast.type === 'segment' && newBroadcast.targets.selectedSegments.length === 0) {
      alert('配信対象のセグメントを選択してください。');
      return;
    }

    if (newBroadcast.type === 'individual' && newBroadcast.targets.selectedUsers.length === 0) {
      alert('配信対象のユーザーを選択してください。');
      return;
    }

    const broadcast = {
      id: Date.now(),
      ...newBroadcast,
      status: newBroadcast.schedule.type === 'immediate' ? 'sending' : 'scheduled',
      createdAt: new Date().toISOString(),
      deliveredCount: 0,
      openedCount: 0
    };

    setBroadcasts(prev => [broadcast, ...prev]);
    
    // フォームリセット
    setNewBroadcast({
      title: '',
      type: 'mass',
      messageType: 'text',
      content: { text: '', image: '', video: '', audio: '', alt_text: '' },
      targets: { 
        type: 'all', 
        count: 5420,
        segments: [],
        users: [],
        selectedSegments: [],
        selectedUsers: []
      },
      schedule: { type: 'immediate', scheduledAt: '' }
    });
    setShowCreateModal(false);
    
    // デモ用：送信・開封シミュレーション
    if (newBroadcast.schedule.type === 'immediate') {
      // 送信完了
      setTimeout(() => {
        setBroadcasts(prev => prev.map(b => 
          b.id === broadcast.id 
            ? { 
                ...b, 
                status: 'completed', 
                deliveredCount: broadcast.targets.count,
                openedCount: Math.floor(broadcast.targets.count * 0.6), // 60%の開封率
                sentAt: new Date().toISOString() 
              }
            : b
        ));
        
        // 開封率の段階的更新（リアルタイム感を演出）
        const updateOpenRate = (broadcastId, targetCount) => {
          let currentOpened = Math.floor(targetCount * 0.6);
          const interval = setInterval(() => {
            const randomIncrease = Math.floor(Math.random() * Math.floor(targetCount * 0.1));
            const newOpened = Math.min(currentOpened + randomIncrease, Math.floor(targetCount * 0.8));
            
            setBroadcasts(prev => prev.map(b => 
              b.id === broadcastId 
                ? { ...b, openedCount: newOpened }
                : b
            ));
            
            currentOpened = newOpened;
            if (newOpened >= Math.floor(targetCount * 0.8)) {
              clearInterval(interval);
            }
          }, 5000); // 5秒ごとに更新
          
          // 30秒後に停止
          setTimeout(() => clearInterval(interval), 30000);
        };
        
        updateOpenRate(broadcast.id, broadcast.targets.count);
      }, 2000);
    }
  }, [newBroadcast]);

  // ステータス表示用のスタイル
  const getStatusStyle = (status) => {
    const statusType = statusTypes.find(s => s.value === status);
    if (!statusType) return 'bg-gray-100 text-gray-800';
    
    const colorMap = {
      gray: 'bg-gray-100 text-gray-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800'
    };
    
    return colorMap[statusType.color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">メッセージ一斉配信</h1>
            <p className="text-gray-600 mt-1">友だちにメッセージを一括送信できます</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>テンプレート管理</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>新規配信作成</span>
            </button>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="flex items-center space-x-4 mt-6">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="配信名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべてのステータス</option>
            {statusTypes.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 配信一覧 */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          {filteredBroadcasts.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">配信が見つかりません</h3>
              <p className="text-gray-600">新しい配信を作成するか、検索条件を変更してください。</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      配信名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイプ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      対象者数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      配信結果
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作成日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBroadcasts.map((broadcast) => {
                    const broadcastType = broadcastTypes.find(t => t.value === broadcast.type);
                    const messageType = messageTypes.find(t => t.value === broadcast.messageType);
                    
                    return (
                      <tr key={broadcast.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <messageType.icon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {broadcast.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {broadcast.content.text}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <broadcastType.icon className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-900">{broadcastType.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(broadcast.status)}`}>
                            {statusTypes.find(s => s.value === broadcast.status)?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {broadcast.targets.count.toLocaleString()}名
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            配信: {broadcast.deliveredCount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            開封: {broadcast.openedCount.toLocaleString()}
                            {broadcast.deliveredCount > 0 && (
                              <span className="ml-1">
                                ({Math.round((broadcast.openedCount / broadcast.deliveredCount) * 100)}%)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(broadcast.createdAt).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedBroadcast(broadcast)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="text-red-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 新規配信作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">メッセージ配信実行</h2>
              <p className="text-gray-600 mt-1">配信内容を設定して実行してください</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 配信名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  配信名
                </label>
                <input
                  type="text"
                  value={newBroadcast.title}
                  onChange={(e) => setNewBroadcast(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="配信名を入力してください"
                />
              </div>

              {/* 配信タイプ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  配信タイプ
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {broadcastTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setNewBroadcast(prev => ({ 
                        ...prev, 
                        type: type.value,
                        targets: {
                          ...prev.targets,
                          selectedSegments: [],
                          selectedUsers: []
                        }
                      }))}
                      className={`p-3 border rounded-lg text-left ${
                        newBroadcast.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <type.icon className="h-5 w-5 mb-2" />
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 配信対象選択（セグメント配信） */}
              {newBroadcast.type === 'segment' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    配信対象セグメント
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                    {availableSegments.map(segment => (
                      <label key={segment.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={newBroadcast.targets.selectedSegments.includes(segment.id)}
                          onChange={(e) => {
                            const selectedSegments = e.target.checked
                              ? [...newBroadcast.targets.selectedSegments, segment.id]
                              : newBroadcast.targets.selectedSegments.filter(id => id !== segment.id);
                            
                            setNewBroadcast(prev => ({
                              ...prev,
                              targets: { ...prev.targets, selectedSegments }
                            }));
                          }}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{segment.name}</div>
                          <div className="text-xs text-gray-500">{segment.description}</div>
                        </div>
                        <div className="text-sm text-gray-600">{segment.count}名</div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* 配信対象選択（個別配信） */}
              {newBroadcast.type === 'individual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    配信対象ユーザー
                  </label>
                  
                  {/* ユーザー検索 */}
                  <div className="mb-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="ユーザー名、メール、セグメントで検索..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    {userSearchQuery && (
                      <p className="text-xs text-gray-500 mt-1">
                        {filteredUsers.length}件のユーザーが見つかりました
                      </p>
                    )}
                  </div>
                  
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">ユーザーが見つかりません</p>
                      </div>
                    ) : (
                      filteredUsers.map(user => (
                        <label key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={newBroadcast.targets.selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              const selectedUsers = e.target.checked
                                ? [...newBroadcast.targets.selectedUsers, user.id]
                                : newBroadcast.targets.selectedUsers.filter(id => id !== user.id);
                              
                              setNewBroadcast(prev => ({
                                ...prev,
                                targets: { ...prev.targets, selectedUsers }
                              }));
                            }}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                          <div className="text-xs text-gray-400">{user.segment}</div>
                        </label>
                      ))
                    )}
                  </div>
                  
                  {/* 選択済みユーザーの簡易表示 */}
                  {newBroadcast.targets.selectedUsers.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs text-blue-700 font-medium mb-1">
                        選択済みユーザー ({newBroadcast.targets.selectedUsers.length}名)
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {newBroadcast.targets.selectedUsers.slice(0, 5).map(userId => {
                          const user = availableUsers.find(u => u.id === userId);
                          return (
                            <span key={userId} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {user?.name}
                            </span>
                          );
                        })}
                        {newBroadcast.targets.selectedUsers.length > 5 && (
                          <span className="text-xs text-blue-600">
                            他{newBroadcast.targets.selectedUsers.length - 5}名
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 対象者数表示 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">配信対象者数</span>
                  <span className="text-lg font-bold text-blue-600">
                    {newBroadcast.targets.count.toLocaleString()}名
                  </span>
                </div>
                {newBroadcast.type === 'segment' && newBroadcast.targets.selectedSegments.length > 0 && (
                  <div className="mt-2 text-xs text-blue-700">
                    選択中: {newBroadcast.targets.selectedSegments.map(id => 
                      availableSegments.find(s => s.id === id)?.name
                    ).join(', ')}
                  </div>
                )}
                {newBroadcast.type === 'individual' && newBroadcast.targets.selectedUsers.length > 0 && (
                  <div className="mt-2 text-xs text-blue-700">
                    選択中: {newBroadcast.targets.selectedUsers.map(id => 
                      availableUsers.find(u => u.id === id)?.name
                    ).join(', ')}
                  </div>
                )}
              </div>

              {/* メッセージタイプ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メッセージタイプ
                </label>
                <select
                  value={newBroadcast.messageType}
                  onChange={(e) => setNewBroadcast(prev => ({ ...prev, messageType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {messageTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* テンプレート選択 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    テンプレート
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTemplate(null);
                      setNewTemplate({ name: '', content: newBroadcast.content.text, messageType: newBroadcast.messageType, category: 'general' });
                      setShowTemplateModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>テンプレートとして保存</span>
                  </button>
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      const template = templates.find(t => t.id === parseInt(e.target.value));
                      if (template) handleApplyTemplate(template);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">テンプレートを選択...</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* メッセージ内容 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メッセージ内容
                </label>
                <MessageInputWithEmoji
                  value={newBroadcast.content.text}
                  onChange={(value) => setNewBroadcast(prev => ({
                    ...prev,
                    content: { ...prev.content, text: value }
                  }))}
                  onSend={() => {}} // 空の関数（このコンテキストでは送信は別のボタンで行う）
                  onFileSelect={handleFileUpload}
                  placeholder="メッセージ内容を入力してください（絵文字・スタンプも使えます）"
                  className="w-full"
                  showVoice={false} // 配信作成では音声録音は不要
                />
              </div>

              {/* ファイルアップロード */}
              {newBroadcast.messageType !== 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ファイル選択
                  </label>
                  <div className="space-y-3">
                    {newBroadcast.messageType === 'image' && (
                      <div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          onChange={(e) => handleFileUpload('image', e.target.files[0])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">JPEG, PNG, GIF形式（最大10MB）</p>
                        {newBroadcast.content.image && (
                          <div className="mt-2">
                            <img
                              src={newBroadcast.content.image}
                              alt="プレビュー"
                              className="w-32 h-32 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {newBroadcast.messageType === 'video' && (
                      <div>
                        <input
                          type="file"
                          accept="video/mp4,video/mov"
                          onChange={(e) => handleFileUpload('video', e.target.files[0])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">MP4, MOV形式（最大10MB）</p>
                        {newBroadcast.content.video && (
                          <div className="mt-2">
                            <video
                              src={newBroadcast.content.video}
                              controls
                              className="w-64 h-36 rounded border"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {newBroadcast.messageType === 'audio' && (
                      <div>
                        <input
                          type="file"
                          accept="audio/mp3,audio/wav,audio/aac"
                          onChange={(e) => handleFileUpload('audio', e.target.files[0])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">MP3, WAV, AAC形式（最大10MB）</p>
                        {newBroadcast.content.audio && (
                          <div className="mt-2">
                            <audio
                              src={newBroadcast.content.audio}
                              controls
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 配信スケジュール */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  配信スケジュール
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="immediate"
                      checked={newBroadcast.schedule.type === 'immediate'}
                      onChange={(e) => setNewBroadcast(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, type: e.target.value }
                      }))}
                      className="mr-2"
                    />
                    即座に送信
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="scheduled"
                      checked={newBroadcast.schedule.type === 'scheduled'}
                      onChange={(e) => setNewBroadcast(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, type: e.target.value }
                      }))}
                      className="mr-2"
                    />
                    スケジュール送信
                  </label>
                  {newBroadcast.schedule.type === 'scheduled' && (
                    <div>
                      <input
                        type="datetime-local"
                        step="1"
                        value={newBroadcast.schedule.scheduledAt}
                        onChange={(e) => setNewBroadcast(prev => ({
                          ...prev,
                          schedule: { ...prev.schedule, scheduledAt: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        秒単位まで指定可能です。15秒ごとに配信チェックを行います。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleExecuteBroadcast}
                disabled={!newBroadcast.title || (!newBroadcast.content.text && !newBroadcast.content.image && !newBroadcast.content.video && !newBroadcast.content.audio)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>配信実行</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 配信詳細モーダル */}
      {selectedBroadcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">配信詳細</h2>
                <button
                  onClick={() => setSelectedBroadcast(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* メッセージ内容 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">{selectedBroadcast.title}</h3>
                
                {/* テキスト内容 */}
                {selectedBroadcast.content.text && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">テキスト内容</h4>
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedBroadcast.content.text}</p>
                    </div>
                  </div>
                )}

                {/* 画像表示 */}
                {selectedBroadcast.content.image && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">添付画像</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={selectedBroadcast.content.image}
                        alt={selectedBroadcast.content.alt_text || "配信画像"}
                        className="w-full max-w-md h-auto"
                      />
                    </div>
                    {selectedBroadcast.content.alt_text && (
                      <p className="text-xs text-gray-500 mt-1">
                        ファイル名: {selectedBroadcast.content.alt_text}
                      </p>
                    )}
                  </div>
                )}

                {/* 動画表示 */}
                {selectedBroadcast.content.video && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">添付動画</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <video
                        src={selectedBroadcast.content.video}
                        controls
                        className="w-full max-w-md h-auto"
                      >
                        お使いのブラウザは動画再生に対応していません。
                      </video>
                    </div>
                    {selectedBroadcast.content.alt_text && (
                      <p className="text-xs text-gray-500 mt-1">
                        ファイル名: {selectedBroadcast.content.alt_text}
                      </p>
                    )}
                  </div>
                )}

                {/* 音声表示 */}
                {selectedBroadcast.content.audio && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">添付音声</h4>
                    <div className="border rounded-lg p-3">
                      <audio
                        src={selectedBroadcast.content.audio}
                        controls
                        className="w-full"
                      >
                        お使いのブラウザは音声再生に対応していません。
                      </audio>
                    </div>
                    {selectedBroadcast.content.alt_text && (
                      <p className="text-xs text-gray-500 mt-1">
                        ファイル名: {selectedBroadcast.content.alt_text}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 配信情報 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">配信情報</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">配信タイプ:</span>
                    <span className="ml-2 font-medium">
                      {broadcastTypes.find(t => t.value === selectedBroadcast.type)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">メッセージタイプ:</span>
                    <span className="ml-2 font-medium">
                      {messageTypes.find(t => t.value === selectedBroadcast.messageType)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">対象者数:</span>
                    <span className="ml-2 font-medium">{selectedBroadcast.targets.count.toLocaleString()}名</span>
                  </div>
                  <div>
                    <span className="text-gray-500">配信数:</span>
                    <span className="ml-2 font-medium">{selectedBroadcast.deliveredCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">開封数:</span>
                    <span className="ml-2 font-medium">{selectedBroadcast.openedCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">開封率:</span>
                    <span className="ml-2 font-medium">
                      {selectedBroadcast.deliveredCount > 0 
                        ? Math.round((selectedBroadcast.openedCount / selectedBroadcast.deliveredCount) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">作成日時:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedBroadcast.createdAt).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  {selectedBroadcast.sentAt && (
                    <div>
                      <span className="text-gray-500">送信日時:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedBroadcast.sentAt).toLocaleString('ja-JP')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* テンプレート管理モーダル */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">テンプレート管理</h2>
              <p className="text-gray-600 mt-1">メッセージテンプレートを作成・編集できます（最大20件）</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* テンプレート作成・編集 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingTemplate ? 'テンプレート編集' : '新規テンプレート作成'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        テンプレート名
                      </label>
                      <input
                        type="text"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="テンプレート名を入力"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        カテゴリ
                      </label>
                      <select
                        value={newTemplate.category}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">一般</option>
                        <option value="marketing">マーケティング</option>
                        <option value="sales">セール</option>
                        <option value="event">イベント</option>
                        <option value="notification">お知らせ</option>
                        <option value="support">サポート</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        メッセージタイプ
                      </label>
                      <select
                        value={newTemplate.messageType}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, messageType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        {messageTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        メッセージ内容
                      </label>
                      <MessageInputWithEmoji
                        value={newTemplate.content}
                        onChange={(value) => setNewTemplate(prev => ({ ...prev, content: value }))}
                        onSend={() => {}} // 空の関数
                        onFileSelect={() => {}} // テンプレートではファイルアップロードは無効
                        placeholder="テンプレート内容を入力してください（絵文字・スタンプも使えます）"
                        className="w-full"
                        showFileUpload={false} // テンプレートではファイルアップロードを無効
                        showVoice={false}
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleSaveTemplate}
                        disabled={!newTemplate.name || !newTemplate.content}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>{editingTemplate ? '更新' : '保存'}</span>
                      </button>
                      {editingTemplate && (
                        <button
                          onClick={() => {
                            setEditingTemplate(null);
                            setNewTemplate({ name: '', content: '', messageType: 'text', category: 'general' });
                          }}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          キャンセル
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* テンプレート一覧 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    保存済みテンプレート ({templates.length}/20)
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {templates.map(template => (
                      <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {template.category}
                            </span>
                            <button
                              onClick={() => handleApplyTemplate(template)}
                              className="text-blue-600 hover:text-blue-800"
                              title="適用"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingTemplate(template);
                                setNewTemplate({
                                  name: template.name,
                                  content: template.content,
                                  messageType: template.messageType,
                                  category: template.category
                                });
                              }}
                              className="text-gray-600 hover:text-gray-800"
                              title="編集"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('このテンプレートを削除しますか？')) {
                                  setTemplates(prev => prev.filter(t => t.id !== template.id));
                                }
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="削除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {template.content}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>{messageTypes.find(t => t.value === template.messageType)?.label}</span>
                          <span>{new Date(template.createdAt).toLocaleDateString('ja-JP')}</span>
                        </div>
                      </div>
                    ))}
                    
                    {templates.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>まだテンプレートがありません</p>
                        <p className="text-sm">左側のフォームから作成してください</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setEditingTemplate(null);
                  setNewTemplate({ name: '', content: '', messageType: 'text', category: 'general' });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBroadcast;