
// src/components/ui/LoadingScreen.jsx - ローディング画面
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ 
  message = "読み込み中...", 
  subMessage = "",
  showLogo = true,
  fullScreen = true 
}) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-white flex items-center justify-center z-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* ロゴ */}
        {showLogo && (
          <div className="mx-auto h-16 w-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
        )}

        {/* スピナー */}
        <div className="mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
        </div>

        {/* メッセージ */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {message}
        </h2>
        
        {subMessage && (
          <p className="text-sm text-gray-600">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;