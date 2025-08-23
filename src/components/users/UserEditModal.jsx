// src/components/users/UserEditModal.jsx - ユーザー編集モーダル
import React, { useState, useEffect } from 'react';
import { 
  X, Save, User, Mail, Phone, MapPin, Calendar, Shield,
  Upload, Tag, AlertTriangle, CheckCircle, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserEditModal = ({ user, isOpen, onClose, onUpdate }) => {
  const { hasPermission, PERMISSIONS, user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    lineId: '',
    role: 'viewer',
    isActive: true,
    location: '',
    age: '',
    gender: '',
    department: '',
    tags: [],
    avatar: '',
    notes: ''
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        lineId: user.lineId || '',
        role: user.role || 'viewer',
        isActive: user.isActive !== undefined ? user.isActive : true,
        location: user.location || '',
        age: user.age || '',
        gender: user.gender || '',
        department: user.department || '',
        tags: user.tags || [],
        avatar: user.avatar || '',
        notes: user.notes || ''
      });
      setErrors({});
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // フォーム検証
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (formData.lineId && !/^U[0-9a-f]{32}$/.test(formData.lineId)) {
      newErrors.lineId = 'LINE IDの形式が正しくありません（U + 32文字の英数字）';
    }

    if (formData.phone && !/^[\d-+().\s]+$/.test(formData.phone)) {
      newErrors.phone = '電話番号の形式が正しくありません';
    }

    if (formData.age && (isNaN(formData.age) || formData.age < 0 || formData.age > 150)) {
      newErrors.age = '有効な年齢を入力してください（0-150）';
    }

    if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    if (passwordData.newPassword && passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'パスワードは8文字以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 権限チェック
    if (!hasPermission(PERMISSIONS.USER_EDIT)) {
      alert('ユーザー編集権限がありません。');
      return;
    }

    // 自分以外のスーパーアドミンのロール変更を制限
    if (user.role === 'super_admin' && 
        currentUser?.id !== user.id && 
        currentUser?.role !== 'super_admin') {
      alert('スーパーアドミンのロールは変更できません。');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = {
        ...user,
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.id
      };

      // パスワード更新がある場合
      if (passwordData.newPassword) {
        updatedUser.passwordUpdatedAt = new Date().toISOString();
        // 実際の実装では、ここでパスワードハッシュ化処理を行う
      }

      // 模擬API呼び出し
      await new Promise(resolve => setTimeout(resolve, 1000));

      onUpdate(updatedUser);
      onClose();

      alert('ユーザー情報を更新しました。');

    } catch (error) {
      console.error('ユーザー更新エラー:', error);
      alert('更新に失敗しました: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 入力値変更処理
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // タグ追加
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // タグ削除
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // アバター画像アップロード
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 実際の実装では画像アップロード処理
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ロール選択肢
  const roleOptions = [
    { value: 'super_admin', label: 'スーパーアドミン', disabled: currentUser?.role !== 'super_admin' },
    { value: 'admin', label: '管理者', disabled: !['super_admin', 'admin'].includes(currentUser?.role) },
    { value: 'manager', label: 'マネージャー' },
    { value: 'operator', label: 'オペレーター' },
    { value: 'viewer', label: '閲覧者' }
  ];

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
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    ユーザー情報編集
                  </h3>
                  <p className="text-sm text-blue-100">
                    {user.name}さんの情報を編集します
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

          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左側 - 基本情報 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 基本情報セクション */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    基本情報
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 名前 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        名前 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="田中 太郎"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* メールアドレス */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        メールアドレス <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="tanaka@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* 電話番号 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電話番号
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="090-1234-5678"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* LINE ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LINE ID
                      </label>
                      <input
                        type="text"
                        value={formData.lineId}
                        onChange={(e) => handleInputChange('lineId', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.lineId ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="U1234567890abcdef1234567890abcdef"
                      />
                      {errors.lineId && (
                        <p className="text-red-500 text-xs mt-1">{errors.lineId}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 詳細情報セクション */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-500" />
                    詳細情報
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* 年齢 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        年齢
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.age ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="30"
                        min="0"
                        max="150"
                      />
                      {errors.age && (
                        <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                      )}
                    </div>

                    {/* 性別 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        性別
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">選択してください</option>
                        <option value="male">男性</option>
                        <option value="female">女性</option>
                        <option value="other">その他</option>
                      </select>
                    </div>

                    {/* 部署 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        部署
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="管理部"
                      />
                    </div>
                  </div>

                  {/* 所在地 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      所在地
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="東京都渋谷区"
                    />
                  </div>

                  {/* メモ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メモ
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ユーザーに関する追加情報..."
                    />
                  </div>
                </div>

                {/* パスワード変更セクション */}
                {hasPermission(PERMISSIONS.USER_EDIT) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-yellow-500" />
                      パスワード変更
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 新しいパスワード */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          新しいパスワード
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className={`w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.newPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="8文字以上で入力"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.newPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                        )}
                      </div>

                      {/* パスワード確認 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          パスワード確認
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="パスワードを再入力"
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <p className="text-xs text-yellow-800">
                          パスワードを変更すると、ユーザーは次回ログイン時に新しいパスワードでログインする必要があります。
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 右側 - アバター・ロール・タグ */}
              <div className="space-y-6">
                {/* アバター画像 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">アバター画像</h4>
                  
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                      {formData.avatar ? (
                        <img 
                          src={formData.avatar} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-medium text-gray-700">
                          {formData.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm">
                      <Upload className="h-4 w-4" />
                      <span>画像を選択</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* ロール・ステータス */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    権限設定
                  </h4>
                  
                  {/* ロール */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ロール
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {roleOptions.map(option => (
                        <option 
                          key={option.value} 
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* アクティブ状態 */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">アカウントを有効化</span>
                    </label>
                  </div>
                </div>

                {/* タグ管理 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    タグ
                  </h4>
                  
                  {/* タグ追加 */}
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="新しいタグ"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100"
                    >
                      追加
                    </button>
                  </div>

                  {/* タグ一覧 */}
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* フッター */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                最終更新: {user.updatedAt ? new Date(user.updatedAt).toLocaleString('ja-JP') : '未更新'}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  キャンセル
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      更新中...
                    </>
                  ) : (
                    <>
                      <Save className="-ml-1 mr-2 h-4 w-4" />
                      更新
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;