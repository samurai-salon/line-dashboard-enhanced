// src/components/chat/ChatHistoryPanel.jsx - チャット履歴表示パネル
import React, { useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';

const ChatHistoryPanel = ({ user, messages, onSendReply, newMessage, setNewMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendReply(user.id);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/20 h-full flex flex-col">
      {/* チャットヘッダー */}
      <div className="p-4 border-b border-gray-200 bg-white/80 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500 flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              {user.isOnline ? 'オンライン' : user.lastActive}
            </p>
          </div>
        </div>
      </div>

      {/* メッセージ履歴 */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'official' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.sender === 'official'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{message.message}</p>
              <div className={`text-xs mt-1 ${
                message.sender === 'official' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp}
                {message.sender === 'official' && (
                  <span className="ml-2">{message.isRead ? '既読' : '未読'}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* メッセージ入力 */}
      <div className="p-4 border-t border-gray-200 bg-white/80 rounded-b-2xl">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
          <button
            onClick={() => onSendReply(user.id)}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryPanel;