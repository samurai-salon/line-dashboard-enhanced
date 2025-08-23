// src/components/friends/FriendGrowthModal.jsx - 友達獲得機能モーダル
import React, { useState } from 'react';
import { X, QrCode, Link, Copy, Download, Share, Users } from 'lucide-react';

const FriendGrowthModal = ({ isOpen, onClose, officialLine }) => {
  const [activeTab, setActiveTab] = useState('qr');
  const [copySuccess, setCopySuccess] = useState('');

  if (!isOpen || !officialLine) return null;

  // 友だち追加リンクの生成（実際のアプリではAPIから取得）
  const friendAddLink = `https://line.me/R/ti/p/@${officialLine.displayName.replace('@', '')}`;
  const qrCodeUrl = `https://qr-server.com/api/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(friendAddLink)}`;

  // リンクのコピー機能
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type}をコピーしました！`);
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
      setCopySuccess('コピーに失敗しました');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  // QRコードのダウンロード
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${officialLine.name}_友達追加QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ソーシャルシェア機能
  const shareToSocial = (platform) => {
    const text = `${officialLine.name}の公式LINEアカウントに友だち追加してね！`;
    const url = friendAddLink;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'line':
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">友だち獲得</h2>
              <p className="text-sm text-gray-600">{officialLine.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'qr'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <QrCode className="h-4 w-4 inline mr-2" />
            QRコード
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'link'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link className="h-4 w-4 inline mr-2" />
            リンク共有
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          {activeTab === 'qr' && (
            <div className="space-y-6">
              {/* QRコード表示 */}
              <div className="text-center">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-sm">
                  <img
                    src={qrCodeUrl}
                    alt="友だち追加QRコード"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  上記のQRコードをスマートフォンで読み取ると友だち追加できます
                </p>
              </div>

              {/* アクションボタン */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  QRコードをダウンロード
                </button>
                <button
                  onClick={() => copyToClipboard(friendAddLink, 'リンク')}
                  className="flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  リンクをコピー
                </button>
              </div>
            </div>
          )}

          {activeTab === 'link' && (
            <div className="space-y-6">
              {/* リンク表示 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  友だち追加リンク
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={friendAddLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-xl bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(friendAddLink, 'リンク')}
                    className="px-4 py-2 bg-green-600 text-white rounded-r-xl hover:bg-green-700 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* ソーシャルシェア */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">ソーシャルメディアで共有</h4>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => shareToSocial('line')}
                    className="flex flex-col items-center p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-sm">L</span>
                    </div>
                    <span className="text-xs font-medium">LINE</span>
                  </button>
                  <button
                    onClick={() => shareToSocial('twitter')}
                    className="flex flex-col items-center p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <span className="text-xs font-medium">Twitter</span>
                  </button>
                  <button
                    onClick={() => shareToSocial('facebook')}
                    className="flex flex-col items-center p-4 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-sm">F</span>
                    </div>
                    <span className="text-xs font-medium">Facebook</span>
                  </button>
                </div>
              </div>

              {/* 使用例 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">💡 活用例</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• ウェブサイトやブログに埋め込み</li>
                  <li>• メールマーケティングに活用</li>
                  <li>• SNSでのプロモーション</li>
                  <li>• 印刷物（チラシ、ポスター）に掲載</li>
                </ul>
              </div>
            </div>
          )}

          {/* 成功メッセージ */}
          {copySuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700 text-center">{copySuccess}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendGrowthModal;