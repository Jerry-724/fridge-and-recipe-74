// src/components/InventoryItem.tsx
import React from 'react';
import { Item } from '../types/api';
import { useInventory } from '../context/InventoryContext';
import { Checkbox } from '@/components/ui/checkbox';

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
  
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (itemName.includes(key)) {
      return emoji;
    }
  }
  
  return '🍽️';
};

const InventoryItem: React.FC<InventoryItemProps> = ({ item }) => {
  const { isSelectionMode, selectedItems, selectItem, deselectItem } = useInventory();
  const hasExpiry = item.daysLeft != null;
  const isExpiringSoon = hasExpiry && item.daysLeft! > 0 && item.daysLeft! <= 3;
  const isExpired = hasExpiry && item.daysLeft! <= 0;
  const isSelected = selectedItems.includes(item.item_id);

  const handleClick = () => {
    if (isSelectionMode) {
      isSelected ? deselectItem(item.item_id) : selectItem(item.item_id);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center p-3 border-2 rounded-lg
        ${isExpiringSoon ? 'border-destructive' : 'border-primary'}`}
      onClick={handleClick}
    >
      {isSelectionMode && (
        <div className="absolute top-1 right-1 z-10">
          <Checkbox
            checked={isSelected}
            className="h-5 w-5"
            onCheckedChange={(checked) =>
              checked ? selectItem(item.item_id) : deselectItem(item.item_id)
            }
          />
        </div>
      )}

      <div className="text-3xl mb-2">{getFoodEmoji(item.item_name)}</div>
      <div className="text-sm font-bold">{item.item_name}</div>
      <div
        className={`text-xs mt-1 ${
          isExpiringSoon || isExpired ? 'text-destructive' : 'text-gray-500'
        }`}
      >
        {hasExpiry
          ? isExpired
            ? '유통기한 지남'
            : `${item.daysLeft}일 남음`
          : '무기한'}
      </div>

      {isExpired && (
        <div className="absolute inset-0 bg-black/30 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};

export default InventoryItem;
