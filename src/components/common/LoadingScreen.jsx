
// src/components/common/LoadingScreen.jsx
import React from 'react';

/**
 * アプリケーション全体のローディング画面コンポーネント
 * @param {Object} props
 * @param {string} props.message - 表示するメッセージ
 * @param {string} props.size - スピナーのサイズ ('sm' | 'md' | 'lg')
 * @param {boolean} props.overlay - オーバーレイ表示かどうか
 */
const LoadingScreen = ({ 
  message = '読み込み中...', 
  size = 'lg',
  overlay = false 
}) => {
  // スピナーのサイズクラス
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  // オーバーレイモードの場合
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <LoadingSpinner size={size} message={message} />
        </div>
      </div>
    );
  }

  // フルスクリーンモード
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size={size} message={message} />
      </div>
    </div>
  );
};

/**
 * ローディングスピナーコンポーネント
 */
const LoadingSpinner = ({ size = 'lg', message = '読み込み中...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center">
      {/* LINEカラーのスピナー */}
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200`}>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-green-500 animate-spin"></div>
        </div>
        
        {/* LINE アイコン（中央） */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
        </div>
      </div>

      {/* メッセージ */}
      {message && (
        <p className="mt-4 text-gray-600 text-sm font-medium">
          {message}
        </p>
      )}

      {/* ドット アニメーション */}
      <div className="flex space-x-1 mt-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

/**
 * インラインローディングコンポーネント（ボタン内やカード内で使用）
 */
export const InlineLoading = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-green-500 ${sizeClasses[size]} ${className}`} />
  );
};

/**
 * スケルトンローディング（コンテンツの形状を模したプレースホルダー）
 */
export const SkeletonLoader = ({ className = '', rows = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        {[...Array(rows)].map((_, index) => (
          <div key={index} className="flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * カードスケルトン
 */
export const CardSkeleton = ({ count = 1, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingScreen;