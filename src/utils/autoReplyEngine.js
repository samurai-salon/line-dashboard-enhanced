// src/utils/autoReplyEngine.js - 自動返信メッセージ処理エンジン
export class AutoReplyEngine {
  constructor() {
    this.rules = [];
    this.statistics = {};
    this.messageQueue = [];
    this.isProcessing = false;
  }

  // ルールの読み込み
  loadRules() {
    try {
      const savedRules = localStorage.getItem('autoReplyRules');
      this.rules = savedRules ? JSON.parse(savedRules) : [];
      
      // 統計データの読み込み
      const savedStats = localStorage.getItem('autoReplyStats');
      this.statistics = savedStats ? JSON.parse(savedStats) : {};
      
      return this.rules;
    } catch (error) {
      console.error('ルール読み込みエラー:', error);
      return [];
    }
  }

  // ルールの保存
  saveRules() {
    try {
      localStorage.setItem('autoReplyRules', JSON.stringify(this.rules));
      localStorage.setItem('autoReplyStats', JSON.stringify(this.statistics));
    } catch (error) {
      console.error('ルール保存エラー:', error);
    }
  }

  // ルールの追加/更新
  addRule(rule) {
    const existingIndex = this.rules.findIndex(r => r.id === rule.id);
    if (existingIndex >= 0) {
      this.rules[existingIndex] = rule;
    } else {
      this.rules.push(rule);
    }
    
    // 優先度でソート
    this.rules.sort((a, b) => a.priority - b.priority);
    this.saveRules();
  }

  // ルールの削除
  removeRule(ruleId) {
    this.rules = this.rules.filter(r => r.id !== ruleId);
    delete this.statistics[ruleId];
    this.saveRules();
  }

  // ルールの有効/無効切り替え
  toggleRule(ruleId) {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.isActive = !rule.isActive;
      this.saveRules();
    }
  }

  // メッセージ処理のメインエントリーポイント
  async processMessage(message, user) {
    if (this.isProcessing) {
      this.messageQueue.push({ message, user });
      return;
    }

    this.isProcessing = true;
    
    try {
      const triggeredRules = await this.findMatchingRules(message, user);
      
      for (const rule of triggeredRules) {
        if (await this.canTriggerRule(rule, user, message)) {
          await this.executeRule(rule, user, message);
        }
      }
    } catch (error) {
      console.error('メッセージ処理エラー:', error);
    } finally {
      this.isProcessing = false;
      
      // キューに溜まったメッセージを処理
      if (this.messageQueue.length > 0) {
        const next = this.messageQueue.shift();
        setTimeout(() => this.processMessage(next.message, next.user), 100);
      }
    }
  }

  // マッチするルールを検索
  async findMatchingRules(message, user) {
    const matchingRules = [];
    
    for (const rule of this.rules) {
      if (!rule.isActive) continue;
      
      try {
        let isMatch = false;
        
        switch (rule.triggerType) {
          case 'keyword':
            isMatch = await this.matchKeyword(rule, message);
            break;
          case 'time':
            isMatch = await this.matchTime(rule);
            break;
          case 'behavior':
            isMatch = await this.matchBehavior(rule, message, user);
            break;
        }
        
        if (isMatch) {
          matchingRules.push(rule);
        }
      } catch (error) {
        console.error(`ルール ${rule.id} のマッチング処理でエラー:`, error);
        this.updateRuleStatistics(rule.id, 'failed');
      }
    }
    
    return matchingRules;
  }

  // キーワードマッチング
  async matchKeyword(rule, message) {
    if (!message.text) return false;
    
    const text = rule.caseSensitive ? message.text : message.text.toLowerCase();
    
    return rule.keywords.some(keyword => {
      if (!keyword.trim()) return false;
      
      const searchKeyword = rule.caseSensitive ? keyword : keyword.toLowerCase();
      
      switch (rule.matchType) {
        case 'exact':
          return text === searchKeyword;
        case 'partial':
          return text.includes(searchKeyword);
        case 'regex':
          try {
            const regex = new RegExp(searchKeyword, rule.caseSensitive ? 'g' : 'gi');
            return regex.test(text);
          } catch (error) {
            console.error('正規表現エラー:', error);
            return false;
          }
        default:
          return text.includes(searchKeyword);
      }
    });
  }

  // 時間マッチング
  async matchTime(rule) {
    const now = new Date();
    
    switch (rule.scheduleType) {
      case 'specific':
        if (rule.triggerDate) {
          const targetDate = new Date(rule.triggerDate + 'T' + rule.triggerTime);
          return Math.abs(now.getTime() - targetDate.getTime()) < 60000; // 1分以内
        } else {
          const nowTime = now.getHours() * 60 + now.getMinutes();
          const [hours, minutes] = rule.triggerTime.split(':').map(Number);
          const targetTime = hours * 60 + minutes;
          return Math.abs(nowTime - targetTime) < 1; // 1分以内
        }
        
      case 'recurring':
        const dayOfWeek = now.getDay();
        return rule.recurringDays.includes(dayOfWeek);
        
      case 'interval':
        const lastTriggered = rule.statistics?.lastTriggered;
        if (!lastTriggered) return true;
        
        const timeSinceLastTrigger = now.getTime() - new Date(lastTriggered).getTime();
        return timeSinceLastTrigger >= (rule.intervalMinutes * 60 * 1000);
        
      default:
        return false;
    }
  }

  // 行動マッチング
  async matchBehavior(rule, message, user) {
    switch (rule.behaviorType) {
      case 'friend_added':
        return message.type === 'follow';
        
      case 'message_sent':
        return message.type === 'message';
        
      case 'sticker_sent':
        return message.type === 'message' && message.message?.type === 'sticker';
        
      case 'location_shared':
        return message.type === 'message' && message.message?.type === 'location';
        
      default:
        return false;
    }
  }

  // ルール実行可能性チェック
  async canTriggerRule(rule, user, message) {
    // ユーザー条件チェック
    if (rule.userConditions?.enabled) {
      if (!this.checkUserConditions(rule.userConditions, user)) {
        return false;
      }
    }
    
    // 制限チェック
    if (rule.limits?.enabled) {
      if (!this.checkLimits(rule, user, message)) {
        return false;
      }
    }
    
    return true;
  }

  // ユーザー条件チェック
  checkUserConditions(conditions, user) {
    // タグ条件
    if (conditions.tags?.length > 0) {
      const userTags = user.tags || [];
      const hasRequiredTag = conditions.tags.some(tag => userTags.includes(tag));
      if (!hasRequiredTag) return false;
    }
    
    // 除外タグ条件
    if (conditions.excludeTags?.length > 0) {
      const userTags = user.tags || [];
      const hasExcludedTag = conditions.excludeTags.some(tag => userTags.includes(tag));
      if (hasExcludedTag) return false;
    }
    
    // グループ条件
    if (conditions.groups?.length > 0) {
      const userGroups = user.groups || [];
      const hasRequiredGroup = conditions.groups.some(group => userGroups.includes(group));
      if (!hasRequiredGroup) return false;
    }
    
    return true;
  }

  // 制限チェック
  checkLimits(rule, user, message) {
    const stats = this.getRuleStatistics(rule.id);
    const now = new Date();
    
    // 1日の制限チェック
    if (rule.limits.maxPerDay) {
      const today = now.toDateString();
      const todayCount = stats.dailyTriggers?.[today] || 0;
      if (todayCount >= rule.limits.maxPerDay) {
        return false;
      }
    }
    
    // ユーザーごとの制限チェック
    if (rule.limits.maxPerUser) {
      const userTriggerCount = stats.userTriggers?.[user.id] || 0;
      if (userTriggerCount >= rule.limits.maxPerUser) {
        return false;
      }
    }
    
    // クールダウンチェック
    if (rule.limits.cooldownMinutes && stats.lastTriggered) {
      const timeSinceLastTrigger = now.getTime() - new Date(stats.lastTriggered).getTime();
      const cooldownMs = rule.limits.cooldownMinutes * 60 * 1000;
      if (timeSinceLastTrigger < cooldownMs) {
        return false;
      }
    }
    
    return true;
  }

  // ルール実行
  async executeRule(rule, user, message) {
    try {
      // A/Bテスト処理
      const responseContent = this.selectResponse(rule, user);
      
      // 変数置換
      const processedContent = this.processVariables(responseContent, user, message);
      
      // メッセージ送信
      const success = await this.sendMessage(processedContent, rule, user);
      
      // 統計更新
      if (success) {
        this.updateRuleStatistics(rule.id, 'successful', user);
      } else {
        this.updateRuleStatistics(rule.id, 'failed', user);
      }
      
      // アクティビティログ
      this.logActivity(rule, user, message, success);
      
    } catch (error) {
      console.error(`ルール ${rule.id} の実行でエラー:`, error);
      this.updateRuleStatistics(rule.id, 'failed', user);
    }
  }

  // 応答内容選択（A/Bテスト対応）
  selectResponse(rule, user) {
    if (rule.abTest?.enabled && rule.abTest.variants?.length > 0) {
      // ユーザーIDをハッシュ化してA/Bテスト振り分け
      const hash = this.hashString(user.id);
      const totalWeight = rule.abTest.variants.reduce((sum, variant) => sum + variant.weight, 0);
      const threshold = (hash % 100) / 100 * totalWeight;
      
      let currentWeight = 0;
      for (const variant of rule.abTest.variants) {
        currentWeight += variant.weight;
        if (threshold <= currentWeight) {
          return variant.content;
        }
      }
    }
    
    return rule.responseContent;
  }

  // 変数置換処理
  processVariables(content, user, message) {
    const now = new Date();
    const variables = {
      '{username}': user.name || 'お客様',
      '{time}': now.toLocaleTimeString('ja-JP'),
      '{date}': now.toLocaleDateString('ja-JP'),
      '{datetime}': now.toLocaleString('ja-JP')
    };
    
    let processedContent = content;
    for (const [variable, value] of Object.entries(variables)) {
      processedContent = processedContent.replace(new RegExp(variable, 'g'), value);
    }
    
    return processedContent;
  }

  // メッセージ送信（実装は LINE Messaging API に依存）
  async sendMessage(content, rule, user) {
    try {
      // 実際の実装では LINE Messaging API を使用
      console.log('自動返信送信:', {
        userId: user.id,
        ruleId: rule.id,
        content: content,
        responseType: rule.responseType
      });
      
      // ここで実際の LINE API 呼び出し
      // await lineMessagingAPI.pushMessage(user.id, content);
      
      return true;
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      return false;
    }
  }

  // 統計更新
  updateRuleStatistics(ruleId, type, user = null) {
    if (!this.statistics[ruleId]) {
      this.statistics[ruleId] = {
        triggered: 0,
        successful: 0,
        failed: 0,
        lastTriggered: null,
        dailyTriggers: {},
        userTriggers: {}
      };
    }
    
    const stats = this.statistics[ruleId];
    const now = new Date();
    const today = now.toDateString();
    
    stats.triggered++;
    stats.lastTriggered = now.toISOString();
    
    if (!stats.dailyTriggers[today]) {
      stats.dailyTriggers[today] = 0;
    }
    stats.dailyTriggers[today]++;
    
    if (user) {
      if (!stats.userTriggers[user.id]) {
        stats.userTriggers[user.id] = 0;
      }
      stats.userTriggers[user.id]++;
    }
    
    if (type === 'successful') {
      stats.successful++;
    } else if (type === 'failed') {
      stats.failed++;
    }
    
    // ルール統計も更新
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.statistics = stats;
    }
    
    this.saveRules();
  }

  // アクティビティログ
  logActivity(rule, user, message, success) {
    try {
      const activity = {
        id: Date.now().toString(),
        ruleId: rule.id,
        ruleName: rule.name,
        userId: user.id,
        userName: user.name,
        messageText: message.text || message.type,
        success: success,
        timestamp: new Date().toISOString()
      };
      
      let activities = JSON.parse(localStorage.getItem('autoReplyActivities') || '[]');
      activities.unshift(activity);
      
      // 最新100件のみ保持
      if (activities.length > 100) {
        activities = activities.slice(0, 100);
      }
      
      localStorage.setItem('autoReplyActivities', JSON.stringify(activities));
    } catch (error) {
      console.error('アクティビティログエラー:', error);
    }
  }

  // ルール統計取得
  getRuleStatistics(ruleId) {
    return this.statistics[ruleId] || {
      triggered: 0,
      successful: 0,
      failed: 0,
      lastTriggered: null,
      dailyTriggers: {},
      userTriggers: {}
    };
  }

  // 全体統計取得
  getOverallStatistics() {
    const totalRules = this.rules.length;
    const activeRules = this.rules.filter(r => r.isActive).length;
    
    let totalTriggered = 0;
    let totalSuccessful = 0;
    let totalFailed = 0;
    
    for (const stats of Object.values(this.statistics)) {
      totalTriggered += stats.triggered || 0;
      totalSuccessful += stats.successful || 0;
      totalFailed += stats.failed || 0;
    }
    
    return {
      totalRules,
      activeRules,
      totalTriggered,
      totalSuccessful,
      totalFailed,
      successRate: totalTriggered > 0 ? ((totalSuccessful / totalTriggered) * 100).toFixed(1) : 0
    };
  }

  // 最新アクティビティ取得
  getRecentActivities(limit = 10) {
    try {
      const activities = JSON.parse(localStorage.getItem('autoReplyActivities') || '[]');
      return activities.slice(0, limit);
    } catch (error) {
      console.error('アクティビティ取得エラー:', error);
      return [];
    }
  }

  // ハッシュ関数（A/Bテスト用）
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    return Math.abs(hash);
  }

  // システム開始
  start() {
    this.loadRules();
    console.log('自動返信エンジンが開始されました');
  }

  // システム停止
  stop() {
    this.saveRules();
    console.log('自動返信エンジンが停止されました');
  }
}

// シングルトンインスタンス
export const autoReplyEngine = new AutoReplyEngine();