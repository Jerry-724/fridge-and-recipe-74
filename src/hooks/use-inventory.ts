// src/hooks/use-inventory.ts
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';      // useAuth 훅으로 로그인 정보 가져오기
import type { Item } from '../types/api';

export function useInventory() {
  // apiClient 와 로그인된 user 정보(user_id) 를 꺼냅니다
  const { apiClient, user } = useAuth();

  // 재고 배열 상태
  const [inventory, setInventory] = useState<Item[]>([]);

  // 백엔드에서 /inventory/{user_id} 호출해서 재고를 불러옵니다
  async function refreshInventory() {
    if (!user) {
      throw new Error('로그인 정보가 없습니다.');
    }
    // user.user_id 를 경로에 삽입
    const res = await apiClient.get<Item[]>(`/users/${user.user_id}/item/items`);
    setInventory(res.data);
  }

  return { inventory, refreshInventory };
}
