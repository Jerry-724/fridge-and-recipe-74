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
      // 과일류
  '포도': '🍇',
  '멜론': '🍈',
  '수박': '🍉',
  '귤': '🍊',
  '오렌지': '🍊',
  '레몬': '🍋',
  '바나나': '🍌',
  '파인애플': '🍍',
  '망고': '🥭',
  '사과': '🍎',
  '초록 사과': '🍏',
  '배': '🍐',
  '복숭아': '🍑',
  '체리': '🍒',
  '딸기': '🍓',
  '블루베리': '🫐',
  '키위': '🥝',
  '코코넛': '🥥',
  '올리브': '🫒',

  // 채소·견과류
  '토마토': '🍅',
  '가지': '🍆',
  '아보카도': '🥑',
  '브로콜리': '🥦',
  '고추': '🌶️',
  '오이고추': '🌶️',
  '피망': '🫑',
  '옥수수': '🌽',
  '당근': '🥕',
  '감자': '🥔',
  '오이': '🥒',
  '잎채소': '🥬',
  '배추': '🥬',
  '버섯': '🍄',
  '마늘': '🧄',
  '양파': '🧅',
  '밤': '🌰',
  '땅콩': '🥜',
  '콩': '🫘',
  '고구마': '🍠',

  // 곡물·밥류
  '밥': '🍚',
  '쌀': '🍚',
  '주먹밥': '🍙',
  '쌀과자': '🍘',
  '카레': '🍛',

  // 국·수프·면류
  '라멘': '🍜',
  '라면': '🍜',
  '파스타': '🍝',
  '스튜': '🍲',
  '수프': '🥣',
  '스프': '🥣',
  '파에야': '🥘',

  // 빵·베이커리·패스트푸드
  '빵': '🍞',
  '크루아상': '🥐',
  '바게트': '🥖',
  '프레첼': '🥨',
  '베이글': '🥯',
  '팬케이크': '🥞',
  '와플': '🧇',
  '햄버거': '🍔',
  '감자튀김': '🍟',
  '피자': '🍕',
  '핫도그': '🌭',
  '샌드위치': '🥪',
  '타코': '🌮',
  '부리토': '🌯',
  '타말레': '🫔',
  '팔라펠': '🧆',

  // 고기·계란류
  '뼈': '🦴',
  '닭': '🍗',
  '닭고기': '🍗',
  '닭다리': '🍗',
  '소고기': '🥩',
  '비프': '🥩',
  '스테이크': '🥩',
  '돼지': '🥓',
  '돼지고기': '🥓',
  '포크': '🥓',
  '베이컨': '🥓',
  '삼겹살': '🥓',
  '계란': '🥚',
  '달걀': '🥚',
  '에그': '🥚',

  // 해산물류
  '초밥': '🍣',
  '도시락': '🍱',
  '튀긴 새우': '🍤',
  '굴': '🦪',
  '바닷가재': '🦞',
  '꽃게': '🦀',
  '새우': '🦐',
  '오징어': '🦑',
  '물고기': '🐟',
  '생선': '🐟',
  '고등어': '🐟',
  '갈치': '🐟',
  '열대어': '🐠',
  '복어': '🐡',
  '상어': '🦈',
  '어묵': '🍥',
  '오뎅': '🍢',

  // 간식·디저트류
  '팝콘': '🍿',
  '쿠키': '🍪',
  '도넛': '🍩',
  '컵케이크': '🧁',
  '생일케이크': '🎂',
  '케이크': '🍰',
  '파이': '🥧',
  '아이스크림': '🍦',
  '빙수': '🍧',
  '롤리팝': '🍭',
  '사탕': '🍬',
  '초콜릿': '🍫',
  '푸딩': '🍮',
  '꿀': '🍯',

  // 유제품·양념류
  '치즈': '🧀',
  '버터': '🧈',
  '우유': '🥛',
  '젖병': '🍼',
  '소금': '🧂',
  '설탕': '🧂',

  // 음료류
  '커피': '☕',
  '차': '🍵',
  '음료컵(스트로우)': '🥤',
  '주스': '🧃',
  '버블티': '🧋',
  '사케': '🍶',
  '샴페인': '🍾',
  '와인': '🍷',
  '칵테일': '🍸',
  '맥주': '🍺',
  '위스키': '🥃',
  '얼음': '🧊',
  '생수': '💧',

  // 특수·세계 음식류
  '만두': '🥟',
  '포춘 쿠키': '🥠',
  '당고': '🍡',
  '월병': '🥮',
  '테이크아웃 박스': '🥡',
  '샐러드': '🥗',
  '죽': '🥣',
  };

  // 정규식 기반 자동 매핑
  for (const [key, emoji] of Object.entries(emojiMap)) {
    const regex = new RegExp(key, "i");
    if (regex.test(itemName)) {
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
