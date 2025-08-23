import React, { useState, useRef, useCallback } from 'react';
import { Smile, Paperclip, Send, Image, Mic, Camera } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

const MessageInputWithEmoji = ({ 
  value, 
  onChange, 
  onSend, 
  onFileSelect,
  placeholder = "メッセージを入力...",
  disabled = false,
  maxLength = 5000,
  showFileUpload = true,
  showVoice = true,
  className = ""
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleEmojiSelect = useCallback((emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.slice(0, start) + emoji + value.slice(end);
    
    onChange(newValue);
    
    // カーソル位置を更新
    setTimeout(() => {
      const newPosition = start + emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  }, [value, onChange]);

  const handleTextareaChange = (e) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // ファイル入力をリセット
    e.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSendClick = () => {
    if (value.trim() && !disabled) {
      onSend();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <div className="flex items-end p-3 space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onSelect={(e) => setCursorPosition(e.target.selectionStart)}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              rows={3}
              className="w-full resize-none border-0 outline-none placeholder-gray-400 text-sm leading-5"
              style={{ minHeight: '60px', maxHeight: '120px' }}
            />
            
            {/* 文字数カウンター */}
            <div className="absolute bottom-1 right-1 text-xs text-gray-400">
              {value.length}/{maxLength}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {/* ツールボタン */}
            <div className="flex space-x-1">
              {/* 絵文字ボタン */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                title="絵文字・スタンプ"
                disabled={disabled}
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* ファイル添付ボタン */}
              {showFileUpload && (
                <button
                  type="button"
                  onClick={triggerFileUpload}
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                  title="ファイル添付"
                  disabled={disabled}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              )}

              {/* 画像ボタン */}
              <button
                type="button"
                onClick={() => {
                  // 画像専用のファイル選択を実装する場合
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file && onFileSelect) {
                      onFileSelect(file);
                    }
                  };
                  input.click();
                }}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                title="画像"
                disabled={disabled}
              >
                <Image className="w-5 h-5" />
              </button>

              {/* 音声ボタン */}
              {showVoice && (
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                  title="音声メッセージ"
                  disabled={disabled}
                  onClick={() => {
                    // 音声録音機能を実装する場合
                    alert('音声録音機能は準備中です');
                  }}
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* 送信ボタン */}
            <button
              type="button"
              onClick={handleSendClick}
              disabled={!value.trim() || disabled}
              className={`p-2 rounded transition-colors ${
                value.trim() && !disabled
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="送信"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />

      {/* 絵文字ピッカー */}
      <EmojiPicker
        isVisible={showEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
        onClose={() => setShowEmojiPicker(false)}
      />

      {/* 絵文字ピッカーが開いている時のオーバーレイ */}
      {showEmojiPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default MessageInputWithEmoji;