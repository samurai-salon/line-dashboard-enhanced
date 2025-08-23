
// src/pages/messages/MessageComposer.jsx - 予測変換フォーカス問題完全解決版
// フォーカス維持、IME対応、予測変換対策を含む完全版
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, Image, Video, Mic, MapPin, Calendar,
  Link, FileText, Code, Palette, Layout, Grid3x3,
  Plus, Minus, Copy, Trash2, RotateCcw, RotateCw,
  Upload, Download, Save, Send, Eye, Settings,
  Type, AlignLeft, AlignCenter, AlignRight, Bold,
  Italic, Underline, List, ListOrdered, Quote,
  Hash, AtSign, Phone, Mail, Globe, ShoppingCart,
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  Star, Heart, ThumbsUp, Share2, Clock, User,
  Tag, Target, Zap, Sparkles, Gift, Award,
  TrendingUp, BarChart3, PieChart, Activity,
  Smartphone, Monitor, Tablet, Camera, Headphones
} from 'lucide-react';

// デバウンス関数（修正版）
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const MessageComposer = () => {
  // メイン状態管理
  const [activeTab, setActiveTab] = useState('text');
  const [messageData, setMessageData] = useState({
    type: 'text',
    content: '',
    altText: '',
    quickReply: [],
    actions: [],
    flex: null,
    carousel: null
  });

  // 分離されたテキスト状態（フォーカス問題解決用）
  const [localTextContent, setLocalTextContent] = useState('');

  // エディター状態
  const [previewMode, setPreviewMode] = useState(false);
  const [devicePreview, setDevicePreview] = useState('mobile');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  // テキストエディター状態
  const [textFormat, setTextFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
    size: 'normal',
    color: '#000000'
  });

  // メッセージタイプ定義
  const messageTypes = [
    {
      id: 'text',
      label: 'テキスト',
      icon: MessageSquare,
      description: 'シンプルなテキストメッセージ',
      category: 'basic'
    },
    {
      id: 'flex',
      label: 'Flex Message',
      icon: Layout,
      description: '自由度の高いレイアウト',
      category: 'advanced'
    },
    {
      id: 'carousel',
      label: 'カルーセル',
      icon: Grid3x3,
      description: 'スワイプ可能な複数コンテンツ',
      category: 'advanced'
    },
    {
      id: 'rich',
      label: 'リッチメッセージ',
      icon: Sparkles,
      description: 'メディア付きメッセージ',
      category: 'media'
    }
  ];

  // アクションタイプ定義
  const actionTypes = [
    { id: 'uri', label: 'URL', icon: Link },
    { id: 'postback', label: 'ポストバック', icon: Send },
    { id: 'message', label: 'メッセージ', icon: MessageSquare },
    { id: 'tel', label: '電話', icon: Phone },
    { id: 'mailto', label: 'メール', icon: Mail },
    { id: 'camera', label: 'カメラ', icon: Camera },
    { id: 'location', label: '位置情報', icon: MapPin }
  ];

  // デバウンス済み更新関数（修正版）
  const debouncedUpdateContent = useCallback(
    debounce((content) => {
      setMessageData(prev => ({ ...prev, content }));
    }, 150),
    []
  );

  // localTextContentの初期化と同期
  useEffect(() => {
    setLocalTextContent(messageData.content);
  }, [messageData.content]);

  // 履歴管理
  const saveToHistory = useCallback((data) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(data)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevState = history[historyIndex - 1];
      setMessageData(prevState);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      setMessageData(nextState);
    }
  }, [history, historyIndex]);

  // メッセージの保存
  const saveMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Saving message:', messageData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('メッセージが保存されました');
    } catch (error) {
      console.error('Save error:', error);
      alert('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [messageData]);

  // メッセージの送信
  const sendMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Sending message:', messageData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('メッセージが送信されました');
    } catch (error) {
      console.error('Send error:', error);
      alert('送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [messageData]);

  // JSONエクスポート
  const exportJson = useCallback(() => {
    const dataStr = JSON.stringify(messageData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `message_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [messageData]);

  // 初期化
  useEffect(() => {
    saveToHistory(messageData);
  }, []);

  // TextMessageEditor コンポーネントの完全修正版
// 予測変換とフォーカス問題を根本解決
const TextMessageEditor = () => {
  const textareaRef = useRef(null);
  const isComposingRef = useRef(false);
  const lastValueRef = useRef('');
  const skipNextFocusRef = useRef(false);
  const inputSequenceRef = useRef(0);

  // シンプルなテキスト変更ハンドラー（フォーカス問題解決版）
  const handleTextChange = useCallback((e) => {
    const newValue = e.target.value;
    
    // 即座にローカル状態を更新（フォーカス維持）
    setLocalTextContent(newValue);
    
    // IME入力中でない場合のみグローバル状態を更新
    if (!isComposingRef.current) {
      debouncedUpdateContent(newValue);
    }
  }, [debouncedUpdateContent]);

  // IME入力開始
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  // IME入力終了
  const handleCompositionEnd = useCallback((e) => {
    isComposingRef.current = false;
    const newValue = e.target.value;
    setLocalTextContent(newValue);
    debouncedUpdateContent(newValue);
  }, [debouncedUpdateContent]);

  // キーボードイベントハンドラー（予測変換制御用）
  const handleKeyDown = useCallback((e) => {
    // 特定のキー（Tab, Escape等）で予測変換を無効化
    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      if (textareaRef.current) {
        textareaRef.current.blur();
        setTimeout(() => {
          textareaRef.current.focus();
        }, 10);
      }
    }
  }, []);

  // フォーカス維持のシンプル実装
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // フォーカスアウト時の自動復帰（予測変換対策）
    const handleBlur = () => {
      if (!isComposingRef.current && document.activeElement !== textarea) {
        // 短時間後にフォーカスを戻す（予測変換による意図しないblur対応）
        setTimeout(() => {
          if (document.contains(textarea) && !isComposingRef.current) {
            textarea.focus();
          }
        }, 10);
      }
    };

    textarea.addEventListener('blur', handleBlur);
    
    return () => {
      textarea.removeEventListener('blur', handleBlur);
    };
  }, []);

  // ツールバーボタン処理（フォーカス維持版）
  const handleToolbarClick = useCallback((action) => {
    return (e) => {
      e.preventDefault();
      action();
      
      // フォーカスを確実に戻す
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メッセージ内容
        </label>

        {/* フォーマットツールバー（完全制御版） */}
        <div className="mb-2 flex items-center space-x-2 p-2 bg-gray-50 rounded">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleToolbarClick(() => setTextFormat(prev => ({ ...prev, bold: !prev.bold })))}
            className={`p-2 rounded transition-colors ${textFormat.bold ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleToolbarClick(() => setTextFormat(prev => ({ ...prev, italic: !prev.italic })))}
            className={`p-2 rounded transition-colors ${textFormat.italic ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleToolbarClick(() => setTextFormat(prev => ({ ...prev, underline: !prev.underline })))}
            className={`p-2 rounded transition-colors ${textFormat.underline ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <Underline className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleToolbarClick(() => setTextFormat(prev => ({ ...prev, align: 'left' })))}
            className={`p-2 rounded transition-colors ${textFormat.align === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleToolbarClick(() => setTextFormat(prev => ({ ...prev, align: 'center' })))}
            className={`p-2 rounded transition-colors ${textFormat.align === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleToolbarClick(() => setTextFormat(prev => ({ ...prev, align: 'right' })))}
            className={`p-2 rounded transition-colors ${textFormat.align === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <AlignRight className="h-4 w-4" />
          </button>
        </div>

        {/* テキストエリア（完全制御版） */}
        <textarea
          ref={textareaRef}
          value={localTextContent}
          onChange={handleTextChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力してください..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          
          // フォーカス問題解決のため最低限の属性のみ
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          
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
                autoComplete="off"
              />
              <select
                value={reply.type || 'text'}
                onChange={(e) => {
                  const newQuickReply = [...messageData.quickReply];
                  newQuickReply[index] = { ...reply, type: e.target.value };
                  setMessageData(prev => ({ ...prev, quickReply: newQuickReply }));
                }}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="text">テキスト</option>
                <option value="location">位置情報</option>
                <option value="camera">カメラ</option>
                <option value="cameraRoll">カメラロール</option>
              </select>
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

      {/* アクション設定 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          アクション
        </label>
        <div className="space-y-2">
          {messageData.actions.map((action, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <select
                  value={action.type || 'uri'}
                  onChange={(e) => {
                    const newActions = [...messageData.actions];
                    newActions[index] = { ...action, type: e.target.value };
                    setMessageData(prev => ({ ...prev, actions: newActions }));
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  {actionTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const newActions = messageData.actions.filter((_, i) => i !== index);
                    setMessageData(prev => ({ ...prev, actions: newActions }));
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                value={action.label || ''}
                onChange={(e) => {
                  const newActions = [...messageData.actions];
                  newActions[index] = { ...action, label: e.target.value };
                  setMessageData(prev => ({ ...prev, actions: newActions }));
                }}
                placeholder="ラベル"
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
                autoComplete="off"
              />
              <input
                type="text"
                value={action.data || ''}
                onChange={(e) => {
                  const newActions = [...messageData.actions];
                  newActions[index] = { ...action, data: e.target.value };
                  setMessageData(prev => ({ ...prev, actions: newActions }));
                }}
                placeholder={action.type === 'uri' ? 'URL' : 'データ'}
                className="w-full p-2 border border-gray-300 rounded-md"
                autoComplete="off"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newActions = [...messageData.actions, { type: 'uri', label: '', data: '' }];
              setMessageData(prev => ({ ...prev, actions: newActions }));
            }}
            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">アクションを追加</span>
          </button>
        </div>
      </div>
    </div>
  );
};

  // メッセージプレビューコンポーネント（最適化版）
  const MessagePreview = React.memo(() => {
    return (
      <div className="p-4">
        <div className="mb-4 text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2"></div>
          <div className="text-sm text-gray-600">Bot</div>
        </div>

        {activeTab === 'text' && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="whitespace-pre-wrap">
              {messageData.content || 'メッセージを入力してください...'}
            </div>

            {messageData.quickReply.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {messageData.quickReply.map((reply, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm border"
                  >
                    {reply.label || `リプライ ${index + 1}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab !== 'text' && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-center text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-2" />
              <p>{messageTypes.find(t => t.id === activeTab)?.label} プレビュー</p>
              <p className="text-sm">この機能は開発中です</p>
            </div>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">メッセージエディター</h1>

            {/* メッセージタイプタブ */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {messageTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === type.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <type.icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* 履歴操作 */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                title="元に戻す"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                title="やり直し"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>

            {/* プレビュー切り替え */}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                previewMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>プレビュー</span>
            </button>

            {/* ファイル操作 */}
            <button
              onClick={exportJson}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>出力</span>
            </button>

            {/* 保存・送信 */}
            <button
              onClick={saveMessage}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>保存</span>
            </button>
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>送信</span>
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex overflow-hidden">
        {/* テキストメッセージエディター */}
        {activeTab === 'text' && !previewMode && (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <TextMessageEditor />
            </div>
          </div>
        )}

        {/* その他のタブは簡易実装 */}
        {activeTab !== 'text' && !previewMode && (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Layout className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {messageTypes.find(t => t.id === activeTab)?.label} エディター
                  </h3>
                  <p className="text-gray-600">
                    {messageTypes.find(t => t.id === activeTab)?.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    この機能は開発中です
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* プレビューモード */}
        {previewMode && (
          <div className="flex-1 p-6">
            <div className="max-w-md mx-auto">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">プレビュー</h3>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setDevicePreview('mobile')}
                    className={`p-2 rounded ${devicePreview === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDevicePreview('tablet')}
                    className={`p-2 rounded ${devicePreview === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  >
                    <Tablet className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDevicePreview('desktop')}
                    className={`p-2 rounded ${devicePreview === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* デバイスフレーム */}
              <div className={`mx-auto bg-gray-900 rounded-xl p-2 ${
                devicePreview === 'mobile' ? 'w-80' :
                devicePreview === 'tablet' ? 'w-96' : 'w-full max-w-2xl'
              }`}>
                <div className="bg-white rounded-lg overflow-hidden" style={{ minHeight: '500px' }}>
                  <MessagePreview />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComposer;