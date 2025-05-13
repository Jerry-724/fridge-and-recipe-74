
import React from 'react';
import { Item } from '../types/api';
import { useInventory } from '../context/InventoryContext';
import { Checkbox } from "@/components/ui/checkbox";

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
  
  const isExpiringSoon = (item.daysLeft !== undefined && item.daysLeft <= 3 && item.daysLeft > 0);
  const isExpired = (item.daysLeft !== undefined && item.daysLeft <= 0);
  
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
      className={`relative flex flex-col items-center p-3 
      ${isExpiringSoon ? 'border-2 border-destructive rounded-lg' : ''}`}
      onClick={handleClick}
    >
      {isSelectionMode && (
        <div className="absolute top-0 right-0 z-10 p-1">
          <Checkbox 
            checked={isSelected}
            className="border-2 h-5 w-5"
            onCheckedChange={(checked) => {
              if (checked) {
                selectItem(item.item_id);
              } else {
                deselectItem(item.item_id);
              }
            }}
          />
        </div>
      )}
      
      <div 
        className={`text-3xl mb-2 ${
          isExpiringSoon ? 'text-destructive' : ''
        } relative`}
      >
        {getFoodEmoji(item.item_name)}
        {isExpired && <div className="expired-overlay"></div>}
      </div>
      
      <div className="text-sm font-bold relative">
        {item.item_name}
        {isExpired && <div className="absolute inset-0 opacity-0"></div>}
      </div>
      
      <div className={`text-xs mt-1 relative ${
        isExpiringSoon || isExpired ? 'text-destructive' : 'text-gray-500'
      }`}>
        {item.daysLeft !== undefined
          ? item.daysLeft <= 0 
            ? '유통기한 지남'
            : `${item.daysLeft}일 남음`
          : '날짜 정보 없음'}
        {isExpired && <div className="absolute inset-0 opacity-0"></div>}
      </div>
      
      {/* Updated overlay for expired items that covers the entire component */}
      {isExpired && (
        <div className="absolute inset-0 bg-black/30 rounded-lg pointer-events-none"></div>
      )}
    </div>
  );
};

export default InventoryItem;
