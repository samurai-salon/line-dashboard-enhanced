import React, { useState, useCallback } from 'react';
import { 
  Plus, Trash2, Edit3, Download, Upload, Star, Heart, 
  Smile, Gift, Settings, Search, Filter, Grid, List 
} from 'lucide-react';

const EmojiManager = () => {
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [customEmojis, setCustomEmojis] = useState([
    {
      id: 1,
      name: 'company-logo',
      emoji: '🏢',
      category: 'custom',
      usage: 245,
      createdAt: '2024-01-10',
      isCustom: true
    },
    {
      id: 2,
      name: 'sale',
      emoji: '🏷️',
      category: 'business',
      usage: 189,
      createdAt: '2024-01-12',
      isCustom: true
    }
  ]);

  const [customStickers, setCustomStickers] = useState([
    {
      id: 1,
      name: 'ありがとうございます',
      image: '🙏',
      category: 'thanks',
      usage: 567,
      createdAt: '2024-01-08',
      isCustom: true
    },
    {
      id: 2,
      name: 'お疲れ様でした',
      image: '😊',
      category: 'greeting',
      usage: 423,
      createdAt: '2024-01-09',
      isCustom: true
    }
  ]);

  const categories = [
    { id: 'all', name: 'すべて', count: customEmojis.length + customStickers.length },
    { id: 'emoji', name: '絵文字', count: customEmojis.length },
    { id: 'sticker', name: 'スタンプ', count: customStickers.length },
    { id: 'custom', name: 'カスタム', count: customEmojis.filter(e => e.isCustom).length },
    { id: 'business', name: 'ビジネス', count: customEmojis.filter(e => e.category === 'business').length }
  ];

  const filteredItems = () => {
    let items = [];
    
    if (activeCategory === 'all' || activeCategory === 'emoji') {
      items = [...items, ...customEmojis.map(e => ({ ...e, type: 'emoji' }))];
    }
    
    if (activeCategory === 'all' || activeCategory === 'sticker') {
      items = [...items, ...customStickers.map(s => ({ ...s, type: 'sticker' }))];
    }
    
    if (activeCategory !== 'all' && activeCategory !== 'emoji' && activeCategory !== 'sticker') {
      items = items.filter(item => item.category === activeCategory);
    }
    
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return items.sort((a, b) => b.usage - a.usage);
  };

  const handleDeleteItem = (id, type) => {
    if (type === 'emoji') {
      setCustomEmojis(prev => prev.filter(e => e.id !== id));
    } else {
      setCustomStickers(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleExportData = () => {
    const data = {
      emojis: customEmojis,
      stickers: customStickers,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emoji-sticker-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">絵文字・スタンプ管理</h2>
            <p className="text-gray-600">カスタム絵文字とスタンプの管理・分析</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>追加</span>
            </button>
            
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>エクスポート</span>
            </button>
          </div>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Smile className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">総絵文字数</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">{customEmojis.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">総スタンプ数</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{customStickers.length}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">総使用回数</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {customEmojis.reduce((sum, e) => sum + e.usage, 0) + 
               customStickers.reduce((sum, s) => sum + s.usage, 0)}
            </p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">人気アイテム</span>
            </div>
            <p className="text-lg font-bold text-orange-900 mt-1">
              {[...customEmojis, ...customStickers]
                .sort((a, b) => b.usage - a.usage)[0]?.name || 'なし'}
            </p>
          </div>
        </div>
      </div>

      {/* フィルターとコントロール */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* 検索 */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="絵文字・スタンプを検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* カテゴリフィルター */}
          <div className="flex items-center space-x-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* 表示切り替え */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* アイテムリスト */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {view === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredItems().map(item => (
              <div key={`${item.type}-${item.id}`} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group">
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {item.type === 'emoji' ? item.emoji : item.image}
                  </div>
                  <p className="text-xs font-medium text-gray-900 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.usage}回使用
                  </p>
                  
                  <div className="flex items-center justify-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id, item.type)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems().map(item => (
              <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {item.type === 'emoji' ? item.emoji : item.image}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.category} • {item.usage}回使用 • {item.createdAt}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id, item.type)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredItems().length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Smile className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>絵文字・スタンプが見つかりません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiManager;