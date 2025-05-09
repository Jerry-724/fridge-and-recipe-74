
import React from 'react';
import { Item } from '../types/api';
import { useInventory } from '../context/InventoryContext';

interface InventoryItemProps {
  item: Item;
}

// Mapping for food emoji based on item name
const getFoodEmoji = (itemName: string): string => {
  const emojiMap: Record<string, string> = {
    '소고기': '🥩', '돼지고기': '🥓', '닭고기': '🍗',
    '생선': '🐟', '새우': '🦐', '오징어': '🦑',
    '우유': '🥛', '치즈': '🧀', '버터': '🧈',
    '당근': '🥕', '감자': '🥔', '양파': '🧅',
    '토마토': '🍅', '오이': '🥒', '브로콜리': '🥦',
    '사과': '🍎', '바나나': '🍌', '딸기': '🍓',
    '포도': '🍇', '오렌지': '🍊', '복숭아': '🍑',
    '쌀': '🍚', '파스타': '🍝', '빵': '🍞',
    '계란': '🥚', '김치': '🥬', '소스': '🧂',
    '아이스크림': '🍦', '케이크': '🍰', '쿠키': '🍪',
    '초콜릿': '🍫', '커피': '☕', '주스': '🧃',
  };
  
  // Find the first matching key or use a default
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (itemName.includes(key)) {
      return emoji;
    }
  }
  
  return '🍽️'; // Default emoji if no match found
};

const InventoryItem: React.FC<InventoryItemProps> = ({ item }) => {
  const { isSelectionMode, selectedItems, selectItem, deselectItem } = useInventory();
  const isSelected = selectedItems.includes(item.item_id);
  const isExpiringSoon = (item.daysLeft !== undefined && item.daysLeft <= 3);
  
  const handleClick = () => {
    if (isSelectionMode) {
      if (isSelected) {
        deselectItem(item.item_id);
      } else {
        selectItem(item.item_id);
      }
    }
  };
  
  return (
    <div
      className={`relative flex flex-col items-center p-3 ${
        isExpiringSoon ? 'bg-destructive bg-opacity-10' : 'bg-white'
      } ${isSelected ? 'border-2 border-primary' : 'border border-gray-200'} 
      rounded-lg shadow-sm`}
      onClick={handleClick}
    >
      {isSelectionMode && (
        <div className={`absolute top-1 right-1 w-4 h-4 rounded-full border ${
          isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-400'
        }`}>
          {isSelected && <span className="text-white text-xs absolute top-0 left-0">✓</span>}
        </div>
      )}
      
      <div 
        className={`text-3xl mb-2 ${
          isExpiringSoon ? 'text-destructive' : ''
        }`}
      >
        {getFoodEmoji(item.item_name)}
      </div>
      
      <div className="text-sm font-medium">{item.item_name}</div>
      
      <div className={`text-xs mt-1 ${
        isExpiringSoon ? 'text-destructive' : 'text-gray-500'
      }`}>
        {item.daysLeft !== undefined
          ? `${item.daysLeft}일 남음`
          : '날짜 정보 없음'}
      </div>
    </div>
  );
};

export default InventoryItem;
