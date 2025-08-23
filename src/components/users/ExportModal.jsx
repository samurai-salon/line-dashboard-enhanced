// src/components/users/ExportModal.jsx - CSVエクスポート設定モーダル
import React, { useState } from 'react';
import { 
  X, Download, FileText, CheckCircle, Settings, 
  Users, Calendar, Filter, Info
} from 'lucide-react';
import { exportToCsv, CSV_COLUMNS, generateExportStats } from '../../utils/csvUtils';
import { createExportHistory, completeExport, failHistory } from '../../utils/historyUtils';
import { useAuth } from '../../context/AuthContext';

const ExportModal = ({ isOpen, onClose, users, currentFilters }) => {
  const { user } = useAuth();
  const [selectedColumns, setSelectedColumns] = useState(
    CSV_COLUMNS.filter(col => col.required).map(col => col.key)
  );
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeFiltered, setIncludeFiltered] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  // エクスポート対象データの準備
  const exportData = includeFiltered ? users : users; // 実際にはフィルタリング適用
  const stats = generateExportStats(exportData, selectedColumns);

  const handleColumnToggle = (columnKey) => {
    const column = CSV_COLUMNS.find(col => col.key === columnKey);
    
    // 必須列は除外不可
    if (column.required && selectedColumns.includes(columnKey)) {
      return;
    }

    setSelectedColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(CSV_COLUMNS.map(col => col.key));
  };

  const handleSelectRequired = () => {
    setSelectedColumns(CSV_COLUMNS.filter(col => col.required).map(col => col.key));
  };

  const handleExport = async () => {
    setIsExporting(true);
    const startTime = Date.now();
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `users_export_${timestamp}.csv`;
    
    // 履歴レコード作成
    const history = createExportHistory(
      filename,
      exportData,
      selectedColumns,
      currentFilters,
      {
        id: user?.id || 'unknown',
        name: user?.name || '不明なユーザー',
        email: user?.email || ''
      }
    );
    
    try {
      await exportToCsv(exportData, filename, selectedColumns);
      
      // 完了時間計算
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // 履歴更新
      if (history) {
        completeExport(history.id, duration);
      }
      
      // エクスポート成功の通知
      setTimeout(() => {
        setIsExporting(false);
        onClose();
        alert(`${exportData.length}件のデータを正常にエクスポートしました。`);
      }, 1000);
      
    } catch (error) {
      console.error('エクスポートエラー:', error);
      
      // エラー履歴更新
      if (history) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        failHistory(history.id, error, duration);
      }
      
      setIsExporting(false);
      alert('エクスポートに失敗しました: ' + error.message);
    }
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    ユーザーデータをエクスポート
                  </h3>
                  <p className="text-sm text-green-100">
                    CSV形式でユーザー情報をダウンロードします
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左側 - 設定 */}
              <div className="lg:col-span-2 space-y-6">
                {/* エクスポート対象 */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Filter className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-medium text-gray-900">エクスポート対象</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={includeFiltered}
                        onChange={() => setIncludeFiltered(true)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        現在のフィルター結果 ({exportData.length}件)
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!includeFiltered}
                        onChange={() => setIncludeFiltered(false)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        全ユーザー ({users.length}件)
                      </span>
                    </label>
                  </div>
                </div>

                {/* 列選択 */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <h4 className="text-lg font-medium text-gray-900">エクスポート列の選択</h4>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSelectRequired}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          必須のみ
                        </button>
                        <button
                          onClick={handleSelectAll}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          すべて選択
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {CSV_COLUMNS.map((column) => (
                        <label key={column.key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedColumns.includes(column.key)}
                            onChange={() => handleColumnToggle(column.key)}
                            disabled={column.required && selectedColumns.includes(column.key)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className={`text-sm ${
                            column.required ? 'font-medium text-gray-900' : 'text-gray-700'
                          }`}>
                            {column.label}
                            {column.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <p className="text-xs text-yellow-800">
                          <span className="text-red-500">*</span> 
                          必須項目は選択を解除できません
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側 - プレビュー */}
              <div className="space-y-6">
                {/* 統計情報 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    エクスポート統計
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">対象レコード数</span>
                      <span className="text-sm font-medium">{stats.totalRecords.toLocaleString()}件</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">選択列数</span>
                      <span className="text-sm font-medium">{stats.selectedColumns}/{stats.totalColumns}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">推定ファイルサイズ</span>
                      <span className="text-sm font-medium">{stats.fileSize}KB</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">フォーマット</span>
                      <span className="text-sm font-medium">CSV (UTF-8)</span>
                    </div>
                  </div>
                </div>

                {/* プレビュー */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">データプレビュー</h4>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto">
                      <div className="whitespace-nowrap">
                        {/* ヘッダー行 */}
                        <div className="font-medium text-gray-700 mb-1">
                          {selectedColumns.map(col => {
                            const column = CSV_COLUMNS.find(c => c.key === col);
                            return column?.label;
                          }).join(', ')}
                        </div>
                        
                        {/* サンプルデータ行 */}
                        {exportData.slice(0, 2).map((user, index) => (
                          <div key={index} className="text-gray-600">
                            {selectedColumns.map(col => {
                              let value = user[col];
                              if (Array.isArray(value)) value = value.join('; ');
                              if (typeof value === 'boolean') value = value ? 'はい' : 'いいえ';
                              if (col.includes('At') && value) value = new Date(value).toLocaleDateString('ja-JP');
                              return String(value || '');
                            }).join(', ')}
                          </div>
                        ))}
                        
                        {exportData.length > 2 && (
                          <div className="text-gray-400 italic">
                            ... 他 {exportData.length - 2} 件
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{stats.totalRecords}件のユーザーデータをエクスポート</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              
              <button
                onClick={handleExport}
                disabled={isExporting || selectedColumns.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    エクスポート中...
                  </>
                ) : (
                  <>
                    <Download className="-ml-1 mr-2 h-4 w-4" />
                    CSVダウンロード
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;