import React, { useEffect, useState } from 'react';
import { Item } from '../types/api';
import { useInventory } from '../context/InventoryContext';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';

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

const classifyWithLLM = async (itemName: string): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `음식 이름을 다음 중 하나로 분류해주세요: ${Object.keys(emojiMap).join(', ')}. 답변은 반드시 하나의 단어만 사용해주세요. 예: '바나나우유' → '우유'`
          },
          {
            role: 'user',
            content: `분류할 음식: ${itemName}`
          }
        ],
        temperature: 0.3,
        max_tokens: 10,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const category = response.data.choices[0].message.content.trim();
    return emojiMap[category] || DEFAULT_EMOJI;
  } catch (error) {
    console.error('LLM 분류 실패:', error);
    return '';
  }
};

const getEmoji = async (itemName: string): Promise<string> => {
  // 1. LLM 기반 분류 시도
  const llmEmoji = await classifyWithLLM(itemName);
  if (llmEmoji) return llmEmoji;

  // 2. 정규식 Fallback
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (new RegExp(key, 'i').test(itemName)) {
      return emoji;
    }
  }

  return DEFAULT_EMOJI;
};

const InventoryItem: React.FC<InventoryItemProps> = ({ item }) => {
  const { isSelectionMode, selectedItems, selectItem, deselectItem } = useInventory();
  const [emoji, setEmoji] = useState(DEFAULT_EMOJI);
  const hasExpiry = item.daysLeft != null;
  const isExpiringSoon = hasExpiry && item.daysLeft! > 0 && item.daysLeft! <= 3;
  const isExpired = hasExpiry && item.daysLeft! <= 0;
  const isSelected = selectedItems.includes(item.item_id);

  useEffect(() => {
    let isActive = true;

    const fetchEmoji = async () => {
      const result = await getEmoji(item.item_name);
      if (isActive) setEmoji(result);
    };

    fetchEmoji();
    return () => { isActive = false };
  }, [item.item_name]);

  return (
    <div
      className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer
        ${isExpiringSoon ? 'border-destructive' : 'border-primary'}
        ${isSelected ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
      onClick={() => isSelectionMode && (isSelected ? deselectItem(item.item_id) : selectItem(item.item_id))}
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

      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-sm font-bold text-center">{item.item_name}</div>
      <div className={`text-xs mt-1 ${isExpiringSoon || isExpired ? 'text-destructive' : 'text-gray-500'}`}>
        {hasExpiry ?
          (isExpired ? '유통기한 지남' : `${item.daysLeft}일 남음`) :
          '무기한'}
      </div>

      {isExpired && (
        <div className="absolute inset-0 bg-black/30 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};

export default InventoryItem;
