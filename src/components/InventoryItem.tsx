// src/components/InventoryItem.tsx
import React, { useEffect, useState } from 'react';
import { Item } from '../types/api';
import { useInventory } from '../context/InventoryContext';
import { Checkbox } from '@/components/ui/checkbox';
import { getFoodEmoji, extractMainCategory } from '@/lib/emojiUtils';

interface InventoryItemProps {
  item: Item;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ item }) => {
  const { isSelectionMode, selectedItems, selectItem, deselectItem } = useInventory();
  const [displayName, setDisplayName] = useState(item.item_name);
  const hasExpiry = item.daysLeft != null;
  const isExpiringSoon = hasExpiry && item.daysLeft! > 0 && item.daysLeft! <= 3;
  const isExpired = hasExpiry && item.daysLeft! <= 0;
  const isSelected = selectedItems.includes(item.item_id);

  // LLM 기반 카테고리 추출 로직
  useEffect(() => {
    let isMounted = true;

    const fetchCategory = async () => {
      try {
        const category = await extractMainCategory(item.item_name);
        if (isMounted) {
          setDisplayName(category);
        }
      } catch (error) {
        console.error('카테고리 추출 실패:', error);
        if (isMounted) {
          setDisplayName(item.item_name); // 실패 시 원본 이름 유지
        }
      }
    };

    fetchCategory();

    return () => {
      isMounted = false;
    };
  }, [item.item_name]);

  const handleClick = () => {
    if (isSelectionMode) {
      isSelected ? deselectItem(item.item_id) : selectItem(item.item_id);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-colors
        ${isExpiringSoon ? 'border-destructive' : 'border-primary'}
        ${isSelected ? 'bg-accent/50' : 'bg-background'}`}
      onClick={handleClick}
    >
      {isSelectionMode && (
        <div className="absolute top-1 right-1 z-10">
          <Checkbox
            checked={isSelected}
            className="h-5 w-5 bg-background"
            onCheckedChange={(checked) =>
              checked ? selectItem(item.item_id) : deselectItem(item.item_id)
            }
          />
        </div>
      )}

      <div className="text-3xl mb-2">{getFoodEmoji(displayName)}</div>
      <div className="text-sm font-bold text-center">{item.item_name}</div>
      <div
        className={`text-xs mt-1 ${
          isExpiringSoon || isExpired ? 'text-destructive' : 'text-muted-foreground'
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
