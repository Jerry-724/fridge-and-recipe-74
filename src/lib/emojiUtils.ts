// src/lib/emojiUtils.ts
import { Item } from '../types/api';

// 1. 이모지 매핑 함수
export const getFoodEmoji = (itemName: string): string => {
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

  for (const [key, emoji] of Object.entries(emojiMap)) {
    const regex = new RegExp(key, "i");
    if (regex.test(itemName)) {
      return emoji;
    }
  }

  return '🍽️';
};

// 2. LLM 호출 및 캐싱 함수
const EMOJI_CATEGORY_CACHE_KEY = 'emojiCategoryCache';

const getCachedCategory = (itemName: string): string | null => {
  if (typeof window === 'undefined') return null;
  const cache = JSON.parse(localStorage.getItem(EMOJI_CATEGORY_CACHE_KEY) || '{}');
  return cache[itemName] || null;
};

const setCachedCategory = (itemName: string, category: string) => {
  if (typeof window === 'undefined') return;
  const cache = JSON.parse(localStorage.getItem(EMOJI_CATEGORY_CACHE_KEY) || '{}');
  cache[itemName] = category;
  localStorage.setItem(EMOJI_CATEGORY_CACHE_KEY, JSON.stringify(cache));
};

export const extractMainCategory = async (itemName: string): Promise<string> => {
  // 1. 캐시 체크
  const cached = getCachedCategory(itemName);
  if (cached) return cached;

  // 2. 프롬프트 작성
  const prompt = `
다음 입력값에서 음식/식품의 주종류를 한 단어로 추출해줘. 예시:
입력: "바나나맛 우유" → 출력: "우유"
입력: "초코칩 쿠키" → 출력: "쿠키"
입력: "딸기맛 요구르트" → 출력: "요구르트"
입력: "${itemName}" → 출력:
  `.trim();

  // 3. LLM API 호출 (OpenAI 예시)
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0
      })
    });

    const data = await response.json();
    const category = data.choices?.[0]?.message?.content?.trim().replace(/["']/g, '') || itemName;

    // 4. 캐시에 저장
    setCachedCategory(itemName, category);

    return category;
  } catch (error) {
    console.error('LLM 호출 실패:', error);
    return itemName; // 실패 시 원본 반환
  }
};
