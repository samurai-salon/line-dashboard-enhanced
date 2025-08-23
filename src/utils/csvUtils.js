// src/utils/csvUtils.js - CSV処理ユーティリティ
export const exportToCsv = (data, filename = 'export.csv', selectedColumns = null) => {
  if (!data || data.length === 0) {
    throw new Error('エクスポートするデータがありません');
  }

  // 列の選択処理
  const columns = selectedColumns || Object.keys(data[0]);
  
  // CSVヘッダーの作成
  const headers = columns.map(col => {
    // 日本語ヘッダーマッピング
    const headerMap = {
      id: 'ID',
      name: '名前',
      email: 'メールアドレス',
      phone: '電話番号',
      role: 'ロール',
      isActive: 'ステータス',
      lastLoginAt: '最終ログイン',
      createdAt: '作成日時',
      lineId: 'LINE ID',
      location: '所在地',
      age: '年齢',
      gender: '性別',
      tags: 'タグ'
    };
    return headerMap[col] || col;
  });

  // データの変換処理
  const csvData = data.map(row => {
    return columns.map(col => {
      let value = row[col];
      
      // データ型別の変換処理
      if (value === null || value === undefined) {
        return '';
      }
      
      // 配列の場合（タグなど）
      if (Array.isArray(value)) {
        return `"${value.join(', ')}"`;
      }
      
      // 日付の場合
      if (col.includes('At') && value) {
        return new Date(value).toLocaleString('ja-JP');
      }
      
      // ブール値の場合
      if (typeof value === 'boolean') {
        return value ? 'はい' : 'いいえ';
      }
      
      // ロールの日本語変換
      if (col === 'role') {
        const roleMap = {
          admin: '管理者',
          manager: 'マネージャー',
          operator: 'オペレーター',
          viewer: '閲覧者'
        };
        return roleMap[value] || value;
      }
      
      // ステータスの日本語変換
      if (col === 'isActive') {
        return value ? 'アクティブ' : '無効';
      }
      
      // 文字列の場合はエスケープ処理
      if (typeof value === 'string') {
        // カンマ、改行、ダブルクォートを含む場合はダブルクォートで囲む
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
      }
      
      return value;
    });
  });

  // CSV文字列の生成
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  // BOM付きUTF-8でエンコード（Excel対応）
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });

  // ダウンロード処理
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// CSV列定義
export const CSV_COLUMNS = [
  { key: 'id', label: 'ID', required: true },
  { key: 'name', label: '名前', required: true },
  { key: 'email', label: 'メールアドレス', required: true },
  { key: 'phone', label: '電話番号', required: false },
  { key: 'lineId', label: 'LINE ID', required: false },
  { key: 'role', label: 'ロール', required: true },
  { key: 'isActive', label: 'ステータス', required: true },
  { key: 'location', label: '所在地', required: false },
  { key: 'age', label: '年齢', required: false },
  { key: 'gender', label: '性別', required: false },
  { key: 'tags', label: 'タグ', required: false },
  { key: 'lastLoginAt', label: '最終ログイン', required: false },
  { key: 'createdAt', label: '作成日時', required: false }
];

// エクスポート統計の生成
export const generateExportStats = (data, selectedColumns) => {
  return {
    totalRecords: data.length,
    selectedColumns: selectedColumns.length,
    totalColumns: CSV_COLUMNS.length,
    exportDate: new Date().toISOString(),
    fileSize: estimateFileSize(data, selectedColumns)
  };
};

// ファイルサイズの推定
const estimateFileSize = (data, selectedColumns) => {
  if (!data || data.length === 0) return 0;
  
  // 1行あたりの平均文字数を推定
  const avgRowLength = selectedColumns.reduce((acc, col) => {
    const sampleValue = data[0][col];
    let estimatedLength = 10; // デフォルト長
    
    if (typeof sampleValue === 'string') {
      estimatedLength = sampleValue.length + 2; // クォート分
    } else if (Array.isArray(sampleValue)) {
      estimatedLength = sampleValue.join(', ').length + 2;
    }
    
    return acc + estimatedLength;
  }, 0);
  
  const totalSize = (avgRowLength + selectedColumns.length) * data.length;
  return Math.round(totalSize / 1024); // KB単位
};