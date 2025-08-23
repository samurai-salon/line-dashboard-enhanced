// src/components/users/ImportExportHistory.jsx - インポート/エクスポート履歴管理
import React, { useState, useEffect } from 'react';
import { 
  History, Download, Upload, FileText, Calendar, User, 
  CheckCircle, XCircle, AlertTriangle, Eye, Trash2,
  Clock, Filter, Search, MoreHorizontal
} from 'lucide-react';

const ImportExportHistory = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  if (!isOpen) return null;

  // デモ履歴データ
  const demoHistories = [
    {
      id: '1',
      type: 'export',
      filename: 'users_export_2025-08-23.csv',
      status: 'completed',
      recordCount: 150,
      successCount: 150,
      errorCount: 0,
      fileSize: '12KB',
      createdAt: '2025-08-23T10:30:00Z',
      createdBy: {
        id: '1',
        name: '田中 太郎',
        email: 'tanaka@example.com'
      },
      duration: '2.3s',
      columns: ['id', 'name', 'email', 'role', 'isActive'],
      filters: { role: '', status: 'active' }
    },
    {
      id: '2',
      type: 'import',
      filename: 'new_users_batch1.csv',
      status: 'completed',
      recordCount: 45,
      successCount: 42,
      errorCount: 3,
      fileSize: '8KB',
      createdAt: '2025-08-23T09:15:00Z',
      createdBy: {
        id: '2',
        name: '佐藤 花子',
        email: 'sato@example.com'
      },
      duration: '5.7s',
      errors: [
        { row: 5, field: 'email', message: '無効なメール形式' },
        { row: 12, field: 'role', message: '不正なロール値' },
        { row: 23, field: 'name', message: '必須項目が未入力' }
      ]
    },
    {
      id: '3',
      type: 'export',
      filename: 'filtered_users_2025-08-22.csv',
      status: 'failed',
      recordCount: 0,
      successCount: 0,
      errorCount: 1,
      fileSize: '0KB',
      createdAt: '2025-08-22T16:45:00Z',
      createdBy: {
        id: '1',
        name: '田中 太郎',
        email: 'tanaka@example.com'
      },
      duration: '0.1s',
      error: 'エクスポート対象データが見つかりません'
    },
    {
      id: '4',
      type: 'import',
      filename: 'user_update_batch.csv',
      status: 'processing',
      recordCount: 200,
      successCount: 120,
      errorCount: 5,
      fileSize: '25KB',
      createdAt: '2025-08-23T10:45:00Z',
      createdBy: {
        id: '3',
        name: '鈴木 一郎',
        email: 'suzuki@example.com'
      },
      progress: 65
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setHistories(demoHistories);
      setLoading(false);
    }, 1000);
  }, []);

  // フィルタリング処理
  const filteredHistories = histories.filter(history => {
    const matchesSearch = filters.search === '' || 
      history.filename.toLowerCase().includes(filters.search.toLowerCase()) ||
      history.createdBy.name.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = filters.type === '' || history.type === filters.type;
    const matchesStatus = filters.status === '' || history.status === filters.status;
    
    const historyDate = new Date(history.createdAt).toISOString().slice(0, 10);
    const matchesDateFrom = filters.dateFrom === '' || historyDate >= filters.dateFrom;
    const matchesDateTo = filters.dateTo === '' || historyDate <= filters.dateTo;
    
    return matchesSearch && matchesType && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  // ステータスアイコン
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  // ステータスバッジ
  const getStatusBadge = (status) => {
    const configs = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: '完了' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: '失敗' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: '処理中' }
    };
    const config = configs[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: '不明' };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // 履歴削除
  const handleDeleteHistory = (historyId) => {
    if (window.confirm('この履歴を削除してもよろしいですか？')) {
      setHistories(prev => prev.filter(h => h.id !== historyId));
    }
  };

  // 詳細表示
  const handleViewDetails = (history) => {
    // 詳細モーダルを開く処理
    console.log('View details:', history);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* オーバーレイ */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* モーダル */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <History className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    インポート/エクスポート履歴
                  </h3>
                  <p className="text-sm text-indigo-100">
                    データの処理履歴を管理します
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* フィルター */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* 検索 */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="ファイル名、実行者で検索..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* タイプフィルター */}
                <div>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">すべてのタイプ</option>
                    <option value="import">インポート</option>
                    <option value="export">エクスポート</option>
                  </select>
                </div>

                {/* ステータスフィルター */}
                <div>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">すべてのステータス</option>
                    <option value="completed">完了</option>
                    <option value="failed">失敗</option>
                    <option value="processing">処理中</option>
                  </select>
                </div>

                {/* 日付フィルター */}
                <div>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* 履歴リスト */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">履歴を読み込み中...</p>
                </div>
              ) : filteredHistories.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">履歴が見つかりません</h3>
                  <p className="text-gray-500">検索条件を変更してください。</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredHistories.map((history) => (
                    <div key={history.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* タイプアイコン */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            history.type === 'import' 
                              ? 'bg-purple-100 text-purple-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {history.type === 'import' ? (
                              <Upload className="h-5 w-5" />
                            ) : (
                              <Download className="h-5 w-5" />
                            )}
                          </div>

                          {/* 基本情報 */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="text-sm font-medium text-gray-900">{history.filename}</h4>
                              {getStatusBadge(history.status)}
                              {getStatusIcon(history.status)}
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{history.createdBy.name}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(history.createdAt).toLocaleString('ja-JP')}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <FileText className="h-4 w-4" />
                                <span>{history.fileSize}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 統計情報 */}
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {history.recordCount.toLocaleString()}件
                          </div>
                          
                          {history.status === 'processing' ? (
                            <div className="text-xs text-gray-500">
                              処理中: {history.progress}%
                              <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                                  style={{ width: `${history.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">
                              {history.successCount > 0 && (
                                <span className="text-green-600">成功: {history.successCount}</span>
                              )}
                              {history.errorCount > 0 && (
                                <span className="text-red-600 ml-2">エラー: {history.errorCount}</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* アクション */}
                        <div className="flex items-center space-x-2 ml-6">
                          <button
                            onClick={() => handleViewDetails(history)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="詳細表示"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteHistory(history.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="削除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* エラー詳細（インポートエラーがある場合） */}
                      {history.errors && history.errors.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 rounded-md">
                          <h5 className="text-sm font-medium text-red-800 mb-2">エラー詳細</h5>
                          <div className="space-y-1">
                            {history.errors.slice(0, 3).map((error, index) => (
                              <div key={index} className="text-xs text-red-700">
                                行{error.row}: {error.field} - {error.message}
                              </div>
                            ))}
                            {history.errors.length > 3 && (
                              <div className="text-xs text-red-600 italic">
                                他 {history.errors.length - 3} 件のエラー
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 失敗エラー */}
                      {history.error && (
                        <div className="mt-4 p-3 bg-red-50 rounded-md">
                          <h5 className="text-sm font-medium text-red-800 mb-1">エラー</h5>
                          <div className="text-xs text-red-700">{history.error}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* フッター */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredHistories.length}件の履歴を表示中
            </div>
            
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportHistory;