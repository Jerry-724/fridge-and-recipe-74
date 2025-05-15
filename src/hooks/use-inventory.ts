// src/hooks/use-inventory.ts
import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Item, Category } from '../types/api';

export function useInventory() {
  const { apiClient, user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // 마운트 되거나 로그인 상태 변경 시
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      // 1) 카테고리부터 무조건 먼저
      const catRes = await apiClient.get<Category[]>('/categories');
      setCategories(catRes.data);

      // 2) 재고
      const itemRes = await apiClient.get<Item[]>('/users/' + user.user_id + '/item/items');
      setItems(itemRes.data);
    })();
  }, [isAuthenticated]);

  return { items, categories };
}
