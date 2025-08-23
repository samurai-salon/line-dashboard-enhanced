import React, { useState, useCallback } from 'react';
import {
  MessageSquare, Send, Plus, Trash2, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

const MessageComposerSimple = () => {
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

  // 最もシンプルな入力処理（フォーカス問題なし）
  const handleTextChange = useCallback((e) => {
    setMessageData(prev => ({ ...prev, content: e.target.value }));
  }, []);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">メッセージエディター（修正版）</h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

              {/* テキストエリア - 最もシンプルな実装 */}
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

            {/* 送信ボタン */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  console.log('Sending message:', messageData);
                  alert('メッセージが送信されました（デモ）');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>送信</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposerSimple;