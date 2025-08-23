// src/utils/historyUtils.js - 履歴管理ユーティリティ
export const HISTORY_TYPES = {
  IMPORT: 'import',
  EXPORT: 'export'
};

export const HISTORY_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// 履歴データの保存
export const saveHistory = (historyData) => {
  try {
    const histories = getHistories();
    const newHistory = {
      id: generateHistoryId(),
      createdAt: new Date().toISOString(),
      ...historyData
    };
    
    histories.unshift(newHistory);
    
    // 最大100件まで保持（古いものから削除）
    const limitedHistories = histories.slice(0, 100);
    
    localStorage.setItem('importExportHistory', JSON.stringify(limitedHistories));
    return newHistory;
  } catch (error) {
    console.error('履歴保存エラー:', error);
    return null;
  }
};

// 履歴データの取得
export const getHistories = () => {
  try {
    const stored = localStorage.getItem('importExportHistory');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('履歴取得エラー:', error);
    return [];
  }
};

// 特定の履歴を更新
export const updateHistory = (historyId, updates) => {
  try {
    const histories = getHistories();
    const index = histories.findIndex(h => h.id === historyId);
    
    if (index !== -1) {
      histories[index] = { ...histories[index], ...updates };
      localStorage.setItem('importExportHistory', JSON.stringify(histories));
      return histories[index];
    }
    
    return null;
  } catch (error) {
    console.error('履歴更新エラー:', error);
    return null;
  }
};

// 履歴の削除
export const deleteHistory = (historyId) => {
  try {
    const histories = getHistories();
    const filteredHistories = histories.filter(h => h.id !== historyId);
    localStorage.setItem('importExportHistory', JSON.stringify(filteredHistories));
    return true;
  } catch (error) {
    console.error('履歴削除エラー:', error);
    return false;
  }
};

// 履歴のクリア（全削除）
export const clearHistory = () => {
  try {
    localStorage.removeItem('importExportHistory');
    return true;
  } catch (error) {
    console.error('履歴クリアエラー:', error);
    return false;
  }
};

// エクスポート履歴の作成
export const createExportHistory = (filename, users, selectedColumns, filters, createdBy) => {
  const fileSize = estimateFileSize(users, selectedColumns);
  
  return saveHistory({
    type: HISTORY_TYPES.EXPORT,
    filename,
    status: HISTORY_STATUS.PROCESSING,
    recordCount: users.length,
    successCount: 0,
    errorCount: 0,
    fileSize: `${fileSize}KB`,
    createdBy,
    columns: selectedColumns,
    filters,
    progress: 0
  });
};

// インポート履歴の作成
export const createImportHistory = (filename, recordCount, fileSize, createdBy) => {
  return saveHistory({
    type: HISTORY_TYPES.IMPORT,
    filename,
    status: HISTORY_STATUS.PROCESSING,
    recordCount,
    successCount: 0,
    errorCount: 0,
    fileSize: formatFileSize(fileSize),
    createdBy,
    progress: 0,
    errors: []
  });
};

// エクスポート完了の処理
export const completeExport = (historyId, duration) => {
  return updateHistory(historyId, {
    status: HISTORY_STATUS.COMPLETED,
    successCount: updateHistory.recordCount || 0,
    duration: `${duration}s`,
    progress: 100
  });
};

// インポート完了の処理
export const completeImport = (historyId, results, duration) => {
  return updateHistory(historyId, {
    status: results.errors > 0 && results.success === 0 ? HISTORY_STATUS.FAILED : HISTORY_STATUS.COMPLETED,
    successCount: results.success,
    errorCount: results.errors,
    duration: `${duration}s`,
    progress: 100,
    errors: results.errorDetails || []
  });
};

// エラーで失敗した場合の処理
export const failHistory = (historyId, error, duration = null) => {
  const updates = {
    status: HISTORY_STATUS.FAILED,
    error: typeof error === 'string' ? error : error.message,
    progress: 0
  };
  
  if (duration) {
    updates.duration = `${duration}s`;
  }
  
  return updateHistory(historyId, updates);
};

// 進捗更新
export const updateProgress = (historyId, progress, successCount = null, errorCount = null) => {
  const updates = { progress };
  
  if (successCount !== null) updates.successCount = successCount;
  if (errorCount !== null) updates.errorCount = errorCount;
  
  return updateHistory(historyId, updates);
};

// ユニークID生成
const generateHistoryId = () => {
  return `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ファイルサイズの推定（KB）
const estimateFileSize = (data, selectedColumns) => {
  if (!data || data.length === 0) return 0;
  
  const avgRowLength = selectedColumns.reduce((acc, col) => {
    const sampleValue = data[0][col];
    let estimatedLength = 10;
    
    if (typeof sampleValue === 'string') {
      estimatedLength = sampleValue.length + 2;
    } else if (Array.isArray(sampleValue)) {
      estimatedLength = sampleValue.join(', ').length + 2;
    }
    
    return acc + estimatedLength;
  }, 0);
  
  const totalSize = (avgRowLength + selectedColumns.length) * data.length;
  return Math.round(totalSize / 1024);
};

// ファイルサイズのフォーマット
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0KB';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + sizes[i];
};

// 履歴統計情報の取得
export const getHistoryStats = () => {
  const histories = getHistories();
  
  const stats = {
    total: histories.length,
    imports: histories.filter(h => h.type === HISTORY_TYPES.IMPORT).length,
    exports: histories.filter(h => h.type === HISTORY_TYPES.EXPORT).length,
    completed: histories.filter(h => h.status === HISTORY_STATUS.COMPLETED).length,
    failed: histories.filter(h => h.status === HISTORY_STATUS.FAILED).length,
    processing: histories.filter(h => h.status === HISTORY_STATUS.PROCESSING).length
  };
  
  return stats;
};

// 今日の履歴数を取得
export const getTodayHistoryCount = () => {
  const histories = getHistories();
  const today = new Date().toISOString().slice(0, 10);
  
  return histories.filter(h => {
    const historyDate = new Date(h.createdAt).toISOString().slice(0, 10);
    return historyDate === today;
  }).length;
};