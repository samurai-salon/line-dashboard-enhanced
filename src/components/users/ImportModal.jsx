// src/components/users/ImportModal.jsx - CSVインポート機能モーダル
import React, { useState, useCallback } from 'react';
import { 
  X, Upload, FileText, AlertTriangle, CheckCircle, Info,
  Users, Eye, Download, RefreshCw, AlertCircle
} from 'lucide-react';
import { CSV_COLUMNS } from '../../utils/csvUtils';
import { createImportHistory, completeImport, failHistory, updateProgress } from '../../utils/historyUtils';
import { useAuth } from '../../context/AuthContext';

const ImportModal = ({ isOpen, onClose, onImportComplete, existingUsers }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: ファイル選択, 2: プレビュー, 3: 結果
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [importResults, setImportResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentHistory, setCurrentHistory] = useState(null);

  if (!isOpen) return null;

  // ファイル選択処理
  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      alert('CSVファイルを選択してください。');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB制限
      alert('ファイルサイズは10MB以下にしてください。');
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  }, []);

  // CSV解析処理
  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          alert('CSVファイルにデータが含まれていません。');
          return;
        }

        // ヘッダー行の解析
        const headerLine = lines[0];
        const parsedHeaders = parseCSVLine(headerLine);
        setHeaders(parsedHeaders);

        // データ行の解析
        const dataLines = lines.slice(1, 101); // 最初の100行まで
        const parsedData = dataLines.map((line, index) => {
          const values = parseCSVLine(line);
          const row = { _rowIndex: index + 2 }; // Excel行番号
          parsedHeaders.forEach((header, i) => {
            row[header] = values[i] || '';
          });
          return row;
        });

        setCsvData(parsedData);
        
        // 自動列マッピング
        const autoMapping = generateAutoMapping(parsedHeaders);
        setColumnMapping(autoMapping);
        
        setStep(2);
      } catch (error) {
        console.error('CSV解析エラー:', error);
        alert('CSVファイルの解析に失敗しました。');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // CSV行解析（カンマとクォート対応）
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // 次の文字をスキップ
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  // 自動列マッピング生成
  const generateAutoMapping = (csvHeaders) => {
    const mapping = {};
    
    csvHeaders.forEach(csvHeader => {
      const normalized = csvHeader.toLowerCase().replace(/[^\w]/g, '');
      
      // マッピングルール
      const mappingRules = {
        'id': 'id',
        'name': 'name',
        '名前': 'name',
        'email': 'email',
        'メール': 'email',
        'メールアドレス': 'email',
        'phone': 'phone',
        '電話': 'phone',
        '電話番号': 'phone',
        'lineid': 'lineId',
        'line': 'lineId',
        'role': 'role',
        'ロール': 'role',
        '権限': 'role',
        'status': 'isActive',
        'ステータス': 'isActive',
        '状態': 'isActive',
        'location': 'location',
        '所在地': 'location',
        '住所': 'location',
        'age': 'age',
        '年齢': 'age',
        'gender': 'gender',
        '性別': 'gender'
      };

      const systemColumn = mappingRules[normalized];
      if (systemColumn) {
        mapping[csvHeader] = systemColumn;
      }
    });

    return mapping;
  };

  // データ検証
  const validateData = () => {
    const errors = [];
    const requiredColumns = CSV_COLUMNS.filter(col => col.required);
    
    // 必須列のマッピング確認
    requiredColumns.forEach(col => {
      const isMapped = Object.values(columnMapping).includes(col.key);
      if (!isMapped) {
        errors.push({
          type: 'missing_column',
          message: `必須列「${col.label}」がマッピングされていません。`
        });
      }
    });

    // データ検証
    csvData.forEach((row, index) => {
      Object.entries(columnMapping).forEach(([csvCol, sysCol]) => {
        const value = row[csvCol];
        const column = CSV_COLUMNS.find(c => c.key === sysCol);
        
        if (column && column.required && (!value || value.trim() === '')) {
          errors.push({
            type: 'required_field',
            row: index + 2,
            column: column.label,
            message: `${index + 2}行目: 「${column.label}」は必須です。`
          });
        }

        // メールアドレス形式チェック
        if (sysCol === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({
              type: 'invalid_format',
              row: index + 2,
              column: 'メールアドレス',
              message: `${index + 2}行目: メールアドレスの形式が正しくありません。`
            });
          }
        }

        // LINE ID形式チェック
        if (sysCol === 'lineId' && value) {
          const lineIdRegex = /^U[0-9a-f]{32}$/;
          if (!lineIdRegex.test(value)) {
            errors.push({
              type: 'invalid_format',
              row: index + 2,
              column: 'LINE ID',
              message: `${index + 2}行目: LINE IDの形式が正しくありません。`
            });
          }
        }
      });
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // インポート実行
  const handleImport = async () => {
    setIsProcessing(true);
    const startTime = Date.now();
    
    // 履歴レコード作成
    const history = createImportHistory(
      file.name,
      csvData.length,
      file.size,
      {
        id: user?.id || 'unknown',
        name: user?.name || '不明なユーザー',
        email: user?.email || ''
      }
    );
    
    setCurrentHistory(history);
    
    try {
      // データ変換
      const transformedData = csvData.map(row => {
        const newUser = {};
        Object.entries(columnMapping).forEach(([csvCol, sysCol]) => {
          let value = row[csvCol];
          
          // データ型変換
          if (sysCol === 'isActive') {
            value = ['true', '1', 'はい', 'アクティブ', 'active'].includes(value.toLowerCase());
          } else if (sysCol === 'age' && value) {
            value = parseInt(value);
          }
          
          newUser[sysCol] = value;
        });
        
        // デフォルト値設定
        newUser.id = Date.now() + Math.random();
        newUser.createdAt = new Date().toISOString();
        newUser.lastLoginAt = null;
        
        return newUser;
      });

      // 進捗更新
      if (history) {
        updateProgress(history.id, 50);
      }

      // 模擬インポート処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 重複チェック
      const successfulImports = [];
      const errors = [];
      
      transformedData.forEach((userData, index) => {
        const duplicate = existingUsers.find(u => 
          u.email === userData.email || 
          (userData.lineId && u.lineId === userData.lineId)
        );
        
        if (duplicate) {
          errors.push({
            row: index + 2,
            field: duplicate.email === userData.email ? 'email' : 'lineId',
            message: '既に存在するユーザーです'
          });
        } else {
          successfulImports.push(userData);
        }
      });
      
      const results = {
        total: transformedData.length,
        success: successfulImports.length,
        errors: errors.length,
        skipped: 0,
        errorDetails: errors
      };
      
      // 完了時間計算
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // 履歴更新
      if (history) {
        completeImport(history.id, results, duration);
      }

      setImportResults(results);
      setStep(3);
      
      // 成功時は親コンポーネントに通知
      if (onImportComplete && successfulImports.length > 0) {
        onImportComplete(successfulImports, results);
      }
      
    } catch (error) {
      console.error('インポートエラー:', error);
      
      // エラー履歴更新
      if (history) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        failHistory(history.id, error, duration);
      }
      
      alert('インポートに失敗しました: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // リセット処理
  const handleReset = () => {
    setStep(1);
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setColumnMapping({});
    setValidationErrors([]);
    setImportResults(null);
    setIsProcessing(false);
    setCurrentHistory(null);
  };

  // ステップ1: ファイル選択
  const renderFileUpload = () => (
    <div className="text-center py-12">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">CSVファイルをアップロード</h3>
        <p className="text-sm text-gray-500">
          ユーザーデータを含むCSVファイルを選択してください
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold">クリックしてファイル選択</span> またはドラッグ&ドロップ
            </p>
            <p className="text-xs text-gray-500">CSV形式のみ (最大10MB)</p>
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-8 max-w-lg mx-auto">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">CSVファイルの要件:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>1行目にヘッダー（列名）が必要</li>
                <li>必須項目: 名前、メールアドレス、ロール</li>
                <li>文字エンコード: UTF-8推奨</li>
                <li>最大100行まで一度にインポート可能</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ステップ2: プレビューと設定
  const renderPreviewStep = () => (
    <div className="space-y-6">
      {/* ファイル情報 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file?.name}</p>
              <p className="text-xs text-gray-500">
                {csvData.length}行のデータ • {(file?.size / 1024).toFixed(1)}KB
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            別のファイルを選択
          </button>
        </div>
      </div>

      {/* 列マッピング */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">列マッピング設定</h4>
          <p className="text-sm text-gray-500">CSVの列をシステムの項目にマッピングしてください</p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {headers.map((header) => (
              <div key={header} className="flex items-center space-x-3">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">
                  {header}
                </div>
                <select
                  value={columnMapping[header] || ''}
                  onChange={(e) => setColumnMapping(prev => ({
                    ...prev,
                    [header]: e.target.value
                  }))}
                  className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="">マッピングしない</option>
                  {CSV_COLUMNS.map((col) => (
                    <option key={col.key} value={col.key}>
                      {col.label} {col.required && '*'}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* データプレビュー */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">データプレビュー</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {csvData.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header} className="px-4 py-2 text-sm text-gray-900 max-w-32 truncate">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {csvData.length > 5 && (
          <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200">
            ... 他 {csvData.length - 5} 行
          </div>
        )}
      </div>

      {/* バリデーションエラー */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">検証エラー</h4>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.slice(0, 10).map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                  {validationErrors.length > 10 && (
                    <li>... 他 {validationErrors.length - 10} 件のエラー</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ステップ3: インポート結果
  const renderResults = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">インポート完了</h3>
        <p className="text-sm text-gray-500">
          ユーザーデータのインポートが完了しました
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{importResults?.total}</div>
            <div className="text-sm text-gray-500">総数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{importResults?.success}</div>
            <div className="text-sm text-gray-500">成功</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{importResults?.failed}</div>
            <div className="text-sm text-gray-500">失敗</div>
          </div>
        </div>
      </div>
    </div>
  );

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
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    ユーザーデータをインポート
                  </h3>
                  <p className="text-sm text-purple-100">
                    ステップ {step}/3: {
                      step === 1 ? 'ファイル選択' :
                      step === 2 ? 'プレビューと設定' : '完了'
                    }
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

            {/* プログレスバー */}
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="px-6 py-6">
            {step === 1 && renderFileUpload()}
            {step === 2 && renderPreviewStep()}
            {step === 3 && renderResults()}
          </div>

          {/* フッター */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {step === 1 ? 'CSVファイルを選択してください' :
                 step === 2 ? `${csvData.length}件のデータを確認中` :
                 'インポート完了'}
              </span>
            </div>
            
            <div className="flex space-x-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  戻る
                </button>
              )}
              
              {step === 2 && (
                <button
                  onClick={() => {
                    if (validateData()) {
                      handleImport();
                    }
                  }}
                  disabled={isProcessing || Object.keys(columnMapping).length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      インポート中...
                    </>
                  ) : (
                    <>
                      <Upload className="-ml-1 mr-2 h-4 w-4" />
                      インポート実行
                    </>
                  )}
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  完了
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;