// src/components/chat/QuickReplies.jsx - 定型文・クイック返信機能
import React, { useState } from 'react';
import { MessageSquare, Plus, Edit, Trash2, Send, Clock, Star } from 'lucide-react';

const QuickReplies = ({ onSendMessage }) => {
  // よく使う定型文データ
  const [quickReplies] = useState([
    {
      id: 1,
      category: '挨拶',
      title: 'お疲れ様でした',
      message: 'お疲れ様でした。\n本日もありがとうございました。',
      useCount: 45,
      isFavorite: true
    },
    {
      id: 2,
      category: '確認',
      title: '内容確認',
      message: 'ご連絡ありがとうございます。\n内容を確認いたします。\n少々お待ちください。',
      useCount: 32,
      isFavorite: true
    },
    {
      id: 3,
      category: '予約',
      title: '予約確認',
      message: 'ご予約の件、承知いたしました。\n\n以下の内容で間違いございませんでしょうか？\n\n日時：\n人数：\n\nご確認をお願いいたします。',
      useCount: 28,
      isFavorite: false
    },
    {
      id: 4,
      category: '案内',
      title: '営業時間案内',
      message: '営業時間のご案内\n\n平日：9:00-18:00\n土日：10:00-17:00\n定休日：水曜日\n\nお気軽にお越しください。',
      useCount: 15,
      isFavorite: false
    },
    {
      id: 5,
      category: '謝罪',
      title: 'お詫び',
      message: 'この度は、ご不便をおかけして申し訳ございません。\n\n改善に努めさせていただきます。\n今後ともよろしくお願いいたします。',
      useCount: 8,
      isFavorite: false
    },
    {
      id: 6,
      category: '感謝',
      title: 'お礼',
      message: 'いつもご利用いただき、誠にありがとうございます。\n\n今後ともどうぞよろしくお願いいたします。',
      useCount: 22,
      isFavorite: true
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // カテゴリ一覧
  const categories = ['all', ...new Set(quickReplies.map(reply => reply.category))];
  const categoryLabels = {
    all: 'すべて',
    挨拶: '挨拶',
    確認: '確認',
    予約: '予約',
    案内: '案内',
    謝罪: '謝罪',
    感謝: '感謝'
  };

  // フィルタリング
  const filteredReplies = quickReplies.filter(reply => {
    const matchesCategory = selectedCategory === 'all' || reply.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      reply.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reply.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    // お気に入りを上位表示
    if (a.isFavorite !== b.isFavorite) {
      return b.isFavorite - a.isFavorite;
    }
    // 使用回数でソート
    return b.useCount - a.useCount;
  });

  // メッセージ送信
  const handleSendQuickReply = (reply) => {
    if (onSendMessage) {
      onSendMessage(reply.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 max-h-96 overflow-hidden flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />
          定型文
        </h3>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <Plus className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* 検索とカテゴリフィルタ */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="定型文を検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      {/* 定型文リスト */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredReplies.map(reply => (
          <div
            key={reply.id}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            onClick={() => handleSendQuickReply(reply)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {reply.title}
                  </h4>
                  {reply.isFavorite && (
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  )}
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {reply.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {reply.message}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {reply.useCount}回使用
                  </span>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded-lg transition-all">
                <Send className="h-3 w-3 text-blue-600" />
              </button>
            </div>
          </div>
        ))}
        
        {filteredReplies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">該当する定型文が見つかりません</p>
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
          定型文を管理
        </button>
      </div>
    </div>
  );
};

export default QuickReplies;