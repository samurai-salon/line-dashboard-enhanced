// src/components/ui/UnreadMessagePreview.jsx - 未読メッセージプレビュー
import React, { useState, useRef, useEffect } from 'react';
import { Bell, MessageCircle, Clock, User } from 'lucide-react';

const UnreadMessagePreview = () => {
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);

  // デモ用の未読メッセージデータ
  const unreadMessages = [
    {
      id: 1,
      officialLineName: 'サムライアーク公式',
      userName: '田中太郎',
      message: 'お疲れさまです！本日のイベントについて確認したいことがあります',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5分前
      avatar: null
    },
    {
      id: 2,
      officialLineName: 'カスタマーサポート',
      userName: '佐藤花子',
      message: '製品の使い方について質問があります。操作方法を教えてください',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15分前
      avatar: null
    },
    {
      id: 3,
      officialLineName: 'サムライアーク公式',
      userName: '山田次郎',
      message: 'ありがとうございました！',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30分前
      avatar: null
    }
  ];

  // クリック外でプレビューを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewRef.current && !previewRef.current.contains(event.target)) {
        setShowPreview(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 時間フォーマット
  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60)); // 分単位
    
    if (diff < 1) return 'たった今';
    if (diff < 60) return `${diff}分前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
    return date.toLocaleDateString('ja-JP');
  };

  // メッセージを短縮
  const truncateMessage = (message, maxLength = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className="relative" ref={previewRef}>
      {/* 通知ベルボタン */}
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="relative p-3 rounded-xl bg-gray-50/50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
      >
        <span className="sr-only">未読メッセージを確認</span>
        <Bell className="h-6 w-6" />
        {unreadMessages.length > 0 && (
          <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm flex items-center justify-center font-bold shadow-lg">
            {unreadMessages.length}
          </span>
        )}
      </button>

      {/* 未読メッセージプレビューパネル */}
      {showPreview && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* ヘッダー */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">未読メッセージ</h3>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadMessages.length}
                </span>
              </div>
              <a
                href="/notification-center"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                すべて見る
              </a>
            </div>
          </div>

          {/* メッセージリスト */}
          <div className="max-h-96 overflow-y-auto">
            {unreadMessages.length > 0 ? (
              unreadMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => {
                    // チャット画面へのリンクやモーダル表示の処理
                    console.log('メッセージをクリック:', message);
                  }}
                >
                  <div className="flex items-start space-x-3">
                    {/* アバター */}
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        {message.avatar ? (
                          <img 
                            src={message.avatar} 
                            alt={message.userName} 
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-white text-sm font-semibold">
                            {message.userName.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* メッセージ内容 */}
                    <div className="flex-1 min-w-0">
                      {/* 公式LINE名とユーザー名 */}
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {message.officialLineName}
                        </span>
                        <span className="text-xs text-gray-600">{message.userName}</span>
                      </div>

                      {/* メッセージテキスト */}
                      <p className="text-sm text-gray-900 mb-1">
                        {truncateMessage(message.message)}
                      </p>

                      {/* タイムスタンプ */}
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">未読メッセージはありません</p>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <a
              href="/messages"
              className="w-full block text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-white rounded-lg transition-colors duration-150"
            >
              メッセージ管理に移動
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnreadMessagePreview;