import React, { useState, useCallback } from 'react';
import {
  MessageSquare, Send, Plus, Trash2, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, Layout, Sparkles, Users, 
  User, UserCheck, CheckSquare, Square, Eye, Calendar
} from 'lucide-react';

const MessageComposer = () => {
  const [messageData, setMessageData] = useState({
    type: 'text',
    content: '',
    quickReply: [],
    actions: []
  });

  const [textFormat, setTextFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
    color: '#000000'
  });

  // 受信者選択関連の状態
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedOfficialLine, setSelectedOfficialLine] = useState(null);
  const [recipientType, setRecipientType] = useState('individual'); // individual, group, broadcast
  const [showRecipientSelector, setShowRecipientSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // デモ用の公式LINEアカウント
  const [officialLines] = useState([
    { id: 1, name: 'カフェ山田', displayName: '@cafe_yamada', followers: 1250 },
    { id: 2, name: '美容室サクラ', displayName: '@sakura_beauty', followers: 890 },
    { id: 3, name: 'フィットネスジム', displayName: '@fitness_gym', followers: 2100 }
  ]);

  // デモ用ユーザーデータ
  const [users] = useState([
    { id: 1, name: '田中太郎', displayName: 'Taro', avatar: '', lastActive: '2時間前', isOnline: true },
    { id: 2, name: '佐藤花子', displayName: 'Hanako', avatar: '', lastActive: '1日前', isOnline: false },
    { id: 3, name: '山田次郎', displayName: 'Jiro', avatar: '', lastActive: '3時間前', isOnline: true },
    { id: 4, name: '鈴木美咲', displayName: 'Misaki', avatar: '', lastActive: '30分前', isOnline: true },
    { id: 5, name: '高橋健一', displayName: 'Kenichi', avatar: '', lastActive: '2日前', isOnline: false }
  ]);

  // フィルタリングされたユーザー
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // シンプルなテキスト変更処理（フォーカス問題解決版）
  const handleTextChange = useCallback((e) => {
    setMessageData(prev => ({ ...prev, content: e.target.value }));
  }, []);

  // 受信者選択関連の関数
  const toggleRecipient = (user) => {
    setSelectedRecipients(prev => {
      const isSelected = prev.find(r => r.id === user.id);
      if (isSelected) {
        return prev.filter(r => r.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const selectAllUsers = () => {
    if (selectedRecipients.length === filteredUsers.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(filteredUsers);
    }
  };

  const sendMessage = () => {
    if (!messageData.content.trim()) {
      alert('メッセージ内容を入力してください');
      return;
    }
    
    if (!selectedOfficialLine) {
      alert('送信元の公式LINEアカウントを選択してください');
      return;
    }

    if (recipientType === 'individual' && selectedRecipients.length === 0) {
      alert('送信先のユーザーを選択してください');
      return;
    }

    const messageInfo = {
      from: selectedOfficialLine,
      to: recipientType === 'broadcast' ? '全ユーザー' : selectedRecipients,
      type: recipientType,
      content: messageData.content,
      quickReply: messageData.quickReply,
      timestamp: new Date()
    };

    console.log('Sending message:', messageInfo);
    alert(`メッセージを送信しました！\n送信先: ${recipientType === 'broadcast' ? '全ユーザー' : selectedRecipients.length + '人'}`);
    
    // リセット
    setMessageData({ type: 'text', content: '', quickReply: [], actions: [] });
    setSelectedRecipients([]);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">メッセージエディター</h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/20 p-8">
            
            {/* 送信元選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送信元公式LINEアカウント
              </label>
              <select
                value={selectedOfficialLine?.id || ''}
                onChange={(e) => {
                  const line = officialLines.find(l => l.id === parseInt(e.target.value));
                  setSelectedOfficialLine(line || null);
                }}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">送信元を選択してください</option>
                {officialLines.map(line => (
                  <option key={line.id} value={line.id}>
                    {line.name} ({line.displayName})
                  </option>
                ))}
              </select>
            </div>

            {/* 送信タイプ選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送信方法
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recipientType"
                    value="individual"
                    checked={recipientType === 'individual'}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="mr-2"
                  />
                  <User className="h-4 w-4 mr-1" />
                  個別送信
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recipientType"
                    value="broadcast"
                    checked={recipientType === 'broadcast'}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="mr-2"
                  />
                  <Users className="h-4 w-4 mr-1" />
                  一斉送信
                </label>
              </div>
            </div>

            {/* 送信先選択 */}
            {recipientType === 'individual' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    送信先ユーザー ({selectedRecipients.length}人選択中)
                  </label>
                  <button
                    onClick={() => setShowRecipientSelector(!showRecipientSelector)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showRecipientSelector ? '閉じる' : 'ユーザー選択'}
                  </button>
                </div>
                
                {/* 選択済みユーザー表示 */}
                {selectedRecipients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedRecipients.map(user => (
                      <span
                        key={user.id}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {user.name}
                        <button
                          onClick={() => toggleRecipient(user)}
                          className="ml-2 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* ユーザー選択パネル */}
                {showRecipientSelector && (
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        placeholder="ユーザーを検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm mr-3"
                      />
                      <button
                        onClick={selectAllUsers}
                        className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        {selectedRecipients.length === filteredUsers.length ? '全解除' : '全選択'}
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {filteredUsers.map(user => {
                        const isSelected = selectedRecipients.find(r => r.id === user.id);
                        return (
                          <div
                            key={user.id}
                            onClick={() => toggleRecipient(user)}
                            className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-100 text-blue-900' : 'hover:bg-white'
                            }`}
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 mr-3 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4 mr-3 text-gray-400" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-gray-500">
                                {user.displayName} • {user.lastActive}
                                {user.isOnline && (
                                  <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {recipientType === 'broadcast' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">
                    すべてのユーザー（{selectedOfficialLine?.followers || 0}人）に一斉送信されます
                  </span>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メッセージ内容
              </label>

              {/* フォーマットツールバー */}
              <div className="mb-2 flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <button
                  type="button"
                  onClick={() => setTextFormat(prev => ({ ...prev, bold: !prev.bold }))}
                  className={`p-2 rounded transition-colors ${textFormat.bold ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextFormat(prev => ({ ...prev, italic: !prev.italic }))}
                  className={`p-2 rounded transition-colors ${textFormat.italic ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextFormat(prev => ({ ...prev, underline: !prev.underline }))}
                  className={`p-2 rounded transition-colors ${textFormat.underline ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                >
                  <Underline className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  type="button"
                  onClick={() => setTextFormat(prev => ({ ...prev, align: 'left' }))}
                  className={`p-2 rounded transition-colors ${textFormat.align === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextFormat(prev => ({ ...prev, align: 'center' }))}
                  className={`p-2 rounded transition-colors ${textFormat.align === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextFormat(prev => ({ ...prev, align: 'right' }))}
                  className={`p-2 rounded transition-colors ${textFormat.align === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                >
                  <AlignRight className="h-4 w-4" />
                </button>
              </div>

              {/* テキストエリア - フォーカス問題解決版 */}
              <textarea
                value={messageData.content}
                onChange={handleTextChange}
                placeholder="メッセージを入力してください..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{
                  fontWeight: textFormat.bold ? 'bold' : 'normal',
                  fontStyle: textFormat.italic ? 'italic' : 'normal',
                  textDecoration: textFormat.underline ? 'underline' : 'none',
                  textAlign: textFormat.align,
                  color: textFormat.color
                }}
              />
            </div>

            {/* クイックリプライ設定 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                クイックリプライ
              </label>
              <div className="space-y-2">
                {messageData.quickReply.map((reply, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={reply.label || ''}
                      onChange={(e) => {
                        const newQuickReply = [...messageData.quickReply];
                        newQuickReply[index] = { ...reply, label: e.target.value };
                        setMessageData(prev => ({ ...prev, quickReply: newQuickReply }));
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      placeholder="クイックリプライのテキスト"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newQuickReply = messageData.quickReply.filter((_, i) => i !== index);
                        setMessageData(prev => ({ ...prev, quickReply: newQuickReply }));
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newQuickReply = [...messageData.quickReply, { label: '', value: '', type: 'text' }];
                    setMessageData(prev => ({ ...prev, quickReply: newQuickReply }));
                  }}
                  className="w-full p-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">クイックリプライを追加</span>
                </button>
              </div>
            </div>

            {/* 送信プレビューと送信ボタン */}
            <div className="space-y-4">
              {/* 送信プレビュー */}
              {(selectedOfficialLine || selectedRecipients.length > 0 || recipientType === 'broadcast') && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">送信プレビュー</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium">送信元:</span>{' '}
                      {selectedOfficialLine ? selectedOfficialLine.name : '未選択'}
                    </div>
                    <div>
                      <span className="font-medium">送信先:</span>{' '}
                      {recipientType === 'broadcast' 
                        ? `全ユーザー（${selectedOfficialLine?.followers || 0}人）`
                        : `個別送信（${selectedRecipients.length}人選択中）`
                      }
                    </div>
                    {selectedRecipients.length > 0 && recipientType === 'individual' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedRecipients.map(r => r.name).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 送信ボタン */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowRecipientSelector(!showRecipientSelector)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>プレビュー</span>
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={!messageData.content.trim() || !selectedOfficialLine || (recipientType === 'individual' && selectedRecipients.length === 0)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>送信</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;