import React, { useState } from 'react';
import { MessageCircle, Smartphone, Users } from 'lucide-react';
import MessageInputWithEmoji from '../../components/emoji/MessageInputWithEmoji';
import LINEEffects from '../../components/emoji/LINEEffects';

const EmojiTest = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'こんにちは！絵文字テストページへようこそ 😊',
      timestamp: new Date(),
      sender: 'system'
    },
    {
      id: 2,
      text: '下のメッセージ入力欄で絵文字やスタンプを試してみてください 🎉',
      timestamp: new Date(),
      sender: 'system'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [effectTrigger, setEffectTrigger] = useState(null);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: currentMessage,
        timestamp: new Date(),
        sender: 'user'
      };
      setMessages(prev => [...prev, newMessage]);
      
      // エフェクトトリガー
      if (currentMessage.includes('❤️') || currentMessage.includes('💕')) {
        setEffectTrigger('love');
      } else if (currentMessage.includes('🎉') || currentMessage.includes('🎊')) {
        setEffectTrigger('celebration');
      } else if (currentMessage.includes('✨') || currentMessage.includes('⭐')) {
        setEffectTrigger('sparkle');
      } else if (currentMessage.includes('🔥') || currentMessage.includes('💥')) {
        setEffectTrigger('fire');
      }
      
      setCurrentMessage('');
    }
  };

  const handleFileSelect = (file) => {
    const newMessage = {
      id: Date.now(),
      text: `[ファイル: ${file.name}]`,
      timestamp: new Date(),
      sender: 'user',
      file: file
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                絵文字・スタンプテスト
              </h1>
              <p className="text-gray-600">
                LINE風の絵文字・スタンプ機能をテストできます
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">絵文字機能</span>
              </div>
              <p className="text-sm text-blue-700">
                豊富な絵文字カテゴリから選択可能
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">スタンプ機能</span>
              </div>
              <p className="text-sm text-green-700">
                LINE風のかわいいスタンプ
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">ファイル添付</span>
              </div>
              <p className="text-sm text-purple-700">
                画像・動画・音声ファイル対応
              </p>
            </div>
          </div>
        </div>

        {/* チャット画面 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* チャットヘッダー */}
          <div className="bg-green-500 text-white p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">絵文字テストルーム</h3>
                <p className="text-green-100 text-sm">オンライン</p>
              </div>
            </div>
          </div>

          {/* メッセージ一覧 */}
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.file && (
                    <div className="mt-2 p-2 bg-black bg-opacity-20 rounded text-xs">
                      📎 {message.file.name}
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-green-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* メッセージ入力 */}
          <div className="border-t border-gray-200 p-4">
            <MessageInputWithEmoji
              value={currentMessage}
              onChange={setCurrentMessage}
              onSend={handleSendMessage}
              onFileSelect={handleFileSelect}
              placeholder="メッセージを入力... 絵文字ボタンを押してみてください！"
              className="w-full"
            />
          </div>
        </div>

        {/* 使い方ガイド */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 使い方ガイド
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">絵文字の使い方</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 😊 ボタンをクリックして絵文字ピッカーを開く</li>
                <li>• カテゴリタブで種類を選択</li>
                <li>• 絵文字をクリックして挿入</li>
                <li>• よく使う絵文字は「よく使う」に表示</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">スタンプの使い方</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 🎁 スタンプタブを選択</li>
                <li>• お気に入りのスタンプをクリック</li>
                <li>• LINE風のかわいいスタンプが挿入される</li>
                <li>• スタンプ名も一緒に表示される</li>
              </ul>
            </div>
          </div>
        </div>

        {/* デモ用ショートカット */}
        <div className="bg-gray-100 rounded-lg p-4 mt-6">
          <h4 className="font-medium text-gray-900 mb-3">💡 クイックテスト</h4>
          <div className="flex flex-wrap gap-2">
            {[
              '😊 こんにちは！',
              '🎉 おめでとう！',
              '❤️ ありがとう',
              '👍 いいね！',
              '🍕 ランチは何にする？',
              '[スタンプ:コニー] よろしく！'
            ].map((text, index) => (
              <button
                key={index}
                onClick={() => setCurrentMessage(text)}
                className="px-3 py-1 bg-white text-sm rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LINEエフェクト */}
      <LINEEffects 
        trigger={effectTrigger} 
        onComplete={() => setEffectTrigger(null)}
      />
    </div>
  );
};

export default EmojiTest;