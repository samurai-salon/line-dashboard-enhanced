// src/components/chat/BulkCallRequestModal.jsx - 一括LINE通話要請モーダル
import React, { useState } from 'react';
import { X, PhoneCall, Send, Users, CheckSquare, Square } from 'lucide-react';

const BulkCallRequestModal = ({ 
  isOpen, 
  onClose, 
  availableUsers = [], 
  onSend 
}) => {
  const [selectedUsers, setSelectedUsers] = useState(availableUsers.map(user => user.id));
  const [callMessage, setCallMessage] = useState('お時間になりましたらこちらより発信ください');

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAll = () => {
    if (selectedUsers.length === availableUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(availableUsers.map(user => user.id));
    }
  };

  const handleSend = () => {
    if (selectedUsers.length === 0) {
      alert('送信対象を選択してください。');
      return;
    }
    
    if (!callMessage.trim()) {
      alert('メッセージを入力してください。');
      return;
    }

    const selectedUserData = availableUsers.filter(user => selectedUsers.includes(user.id));
    onSend(selectedUserData, callMessage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <PhoneCall className="h-5 w-5 mr-2" />
            一括LINE通話要請
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* メッセージ編集 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              通話要請メッセージ
            </label>
            <textarea
              value={callMessage}
              onChange={(e) => setCallMessage(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="お時間になりましたらこちらより発信ください"
            />
          </div>

          {/* 送信対象選択 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                送信対象 ({selectedUsers.length}名選択中)
              </label>
              <button
                onClick={toggleAll}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedUsers.length === availableUsers.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span>{selectedUsers.length === availableUsers.length ? '全て解除' : '全て選択'}</span>
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {availableUsers.map(user => (
                <label key={user.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">最終活動: 今日 14:30</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* プレビュー */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">LINEメッセージプレビュー</h4>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                <p className="text-sm text-gray-800 whitespace-pre-line mb-3">{callMessage}</p>
                
                {/* クイック返信ボタンプレビュー */}
                <div className="space-y-2">
                  <button className="w-full bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center">
                    <PhoneCall className="h-4 w-4 mr-1" />
                    📞 LINE通話をかける
                  </button>
                  <button className="w-full bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-sm">
                    後で連絡します
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ※「LINE通話をかける」をタップするとLINE通話が開始されます
              </p>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <Users className="h-4 w-4 inline mr-1" />
            {selectedUsers.length}名に送信
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSend}
              disabled={selectedUsers.length === 0}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              <span>通話要請を送信</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkCallRequestModal;