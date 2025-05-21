export const extractMainEmoji = async (itemName: string): Promise<string> => {
  // 캐시 체크
  const cacheKey = 'emojiMainCache';
  const getCached = (name: string) => {
    if (typeof window === 'undefined') return null;
    const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    return cache[name] || null;
  };
  const setCached = (name: string, emoji: string) => {
    if (typeof window === 'undefined') return;
    const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    cache[name] = emoji;
    localStorage.setItem(cacheKey, JSON.stringify(cache));
  };

  const cached = getCached(itemName);
  if (cached) return cached;

  const prompt = `
다음 음식/식품 이름에 가장 어울리는 이모지 하나만 골라줘. (이모지 하나만, 설명 없이)
입력: 차돌박이
출력: 🥩
입력: 바나나맛 우유
출력: 🥛
입력: 초코칩 쿠키
출력: 🍪
입력: 샤인머스캣
출력: 🍇
입력: ${itemName}
출력:
  `.trim();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 5,
        temperature: 0
      })
    });

    const data = await response.json();
    // 이모지 한 글자만 추출
    const emoji = data.choices?.[0]?.message?.content?.trim().match(/\p{Emoji}/u)?.[0] ?? '🍽️';
    setCached(itemName, emoji);
    return emoji;
  } catch (error) {
    console.error('LLM 이모지 추출 실패:', error);
    return '🍽️';
  }
};
