import React, { useState, useCallback } from 'react';
import { Smile, Heart, Star, Coffee, Music, Camera, Gift, Flag } from 'lucide-react';

const EmojiPicker = ({ onEmojiSelect, isVisible, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('frequently-used');

  const emojiCategories = {
    'frequently-used': {
      name: 'よく使う',
      icon: Star,
      emojis: ['😊', '👍', '❤️', '😂', '🎉', '👏', '💕', '😍', '🙏', '✨', '💖', '🔥', '👌', '😘', '💪']
    },
    'people': {
      name: '顔・人物',
      icon: Smile,
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', 
        '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
        '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷',
        '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👱‍♀️', '👱', '👱‍♂️', '🧔', '👵', '🧓', '👴', '👲'
      ]
    },
    'heart': {
      name: 'ハート',
      icon: Heart,
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗',
        '💖', '💘', '💝', '💟', '💌', '💋', '😍', '🥰', '😘', '💑', '💏', '👨‍❤️‍👨', '👩‍❤️‍👩', '💒', '💐'
      ]
    },
    'animals': {
      name: '動物',
      icon: Gift,
      emojis: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵',
        '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺',
        '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🐢', '🐍', '🦎'
      ]
    },
    'food': {
      name: '食べ物',
      icon: Coffee,
      emojis: [
        '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥',
        '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔',
        '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗'
      ]
    },
    'activities': {
      name: 'アクティビティ',
      icon: Music,
      emojis: [
        '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑',
        '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️',
        '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️'
      ]
    },
    'travel': {
      name: '旅行・場所',
      icon: Camera,
      emojis: [
        '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️',
        '🛵', '🚲', '🛴', '🛹', '🛼', '🚁', '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛰️',
        '🚢', '⛵', '🚤', '🛥️', '🛶', '⚓', '⛽', '🚧', '🚦', '🚥', '🗺️', '🗿', '🗽', '🗼', '🏰'
      ]
    },
    'symbols': {
      name: '記号',
      icon: Flag,
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗',
        '💖', '💘', '💝', '⭐', '🌟', '✨', '💫', '⚡', '💥', '💢', '💨', '💦', '💤', '💭', '🗯️',
        '💬', '💋', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏'
      ]
    }
  };

  const lineStickers = [
    { id: 1, name: 'コニー', image: '🐰', category: 'line-friends' },
    { id: 2, name: 'ブラウン', image: '🐻', category: 'line-friends' },
    { id: 3, name: 'サリー', image: '🐥', category: 'line-friends' },
    { id: 4, name: 'レナード', image: '🐸', category: 'line-friends' },
    { id: 5, name: 'ムーン', image: '🌙', category: 'line-friends' },
    { id: 6, name: 'ジェシカ', image: '🦊', category: 'line-friends' },
    { id: 7, name: 'おめでとう', image: '🎉', category: 'celebration' },
    { id: 8, name: 'ありがとう', image: '🙏', category: 'thanks' },
    { id: 9, name: 'おつかれさま', image: '😊', category: 'greeting' },
    { id: 10, name: 'がんばって', image: '💪', category: 'support' }
  ];

  const handleEmojiClick = useCallback((emoji) => {
    onEmojiSelect(emoji);
    onClose();
  }, [onEmojiSelect, onClose]);

  const handleStickerClick = useCallback((sticker) => {
    onEmojiSelect(`[スタンプ:${sticker.name}]`);
    onClose();
  }, [onEmojiSelect, onClose]);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-12 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="flex border-b border-gray-200">
        {Object.entries(emojiCategories).map(([key, category]) => {
          const IconComponent = category.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-1 p-2 text-center hover:bg-gray-50 ${
                activeCategory === key ? 'bg-blue-50 border-b-2 border-blue-500' : ''
              }`}
              title={category.name}
            >
              <IconComponent className="w-4 h-4 mx-auto" />
            </button>
          );
        })}
        <button
          onClick={() => setActiveCategory('stickers')}
          className={`flex-1 p-2 text-center hover:bg-gray-50 ${
            activeCategory === 'stickers' ? 'bg-blue-50 border-b-2 border-blue-500' : ''
          }`}
          title="スタンプ"
        >
          <Gift className="w-4 h-4 mx-auto" />
        </button>
      </div>

      <div className="h-48 overflow-y-auto p-2">
        {activeCategory === 'stickers' ? (
          <div className="grid grid-cols-5 gap-1">
            {lineStickers.map((sticker) => (
              <button
                key={sticker.id}
                onClick={() => handleStickerClick(sticker)}
                className="p-2 hover:bg-gray-100 rounded text-center"
                title={sticker.name}
              >
                <div className="text-2xl">{sticker.image}</div>
                <div className="text-xs text-gray-600 mt-1 truncate">{sticker.name}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1">
            {emojiCategories[activeCategory]?.emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="p-2 hover:bg-gray-100 rounded text-center text-xl"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-2 text-xs text-gray-500 text-center">
        {activeCategory === 'stickers' ? 'スタンプ' : emojiCategories[activeCategory]?.name}
      </div>
    </div>
  );
};

export default EmojiPicker;