// src/context/InventoryContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { Item, Category } from '../types/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface InventoryContextType {
  items: Item[];
  categories: Category[];
  isLoading: boolean;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  addItem: (item: Omit<Item, 'item_id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateItem: (itemId: number, item: Partial<Item>) => Promise<void>;
  deleteItems: (itemIds: number[]) => Promise<void>;
  selectedItems: number[];
  selectItem: (itemId: number) => void;
  deselectItem: (itemId: number) => void;
  clearSelectedItems: () => void;
  isSelectionMode: boolean;
  setSelectionMode: (mode: boolean) => void;
  refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setSelectionMode] = useState<boolean>(false);

  // useAuth() 훅에서 apiClient, user, 인증 상태 가져오기
  const { apiClient, user, isAuthenticated } = useAuth();

  // (1) 로그인/로그아웃 시점에 재고·카테고리 로드 혹은 초기화
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setItems([]);
      setCategories([]);
    }
  }, [isAuthenticated]);

  // (2) 실제 불러오는 함수: 카테고리 + 내 재고
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, invRes] = await Promise.all([
        apiClient.get<Category[]>('/categories'),
        apiClient.get<Item[]>(`/inventory/${user.user_id}`),
      ]);
      // 2-1) 카테고리 세팅
      setCategories(catRes.data);

      // 2-2) 재고 세팅 (daysLeft 계산)
      const today = new Date();
      const withDays = invRes.data.map((it) => {
        const expiry = it.expiry_date ? new Date(it.expiry_date) : null;
        const daysLeft = expiry
          ? Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          : null;
        return { ...it, daysLeft };
      });
      setItems(withDays);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('재고 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // (3) 외부에서 호출할 refreshInventory 별칭
  const refreshInventory = fetchData;

  // (4) 추가: POST /items
  const addItem = async (newItem: Omit<Item, 'item_id' | 'user_id' | 'created_at'>) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<Item>('/items', {
        ...newItem,
        user_id: user.user_id,
      });
      const it = res.data;
      // daysLeft 계산
      const expiry = it.expiry_date ? new Date(it.expiry_date) : null;
      const daysLeft = expiry
        ? Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
      setItems((prev) => [...prev, { ...it, daysLeft }]);
      toast.success('식품이 추가되었습니다.');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('아이템 추가에 실패했습니다.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // (5) 수정: PATCH /items/{item_id}
  const updateItem = async (itemId: number, updatedFields: Partial<Item>) => {
    setIsLoading(true);
    try {
      const res = await apiClient.patch<Item>(`/items/${itemId}`, updatedFields);
      const it = res.data;
      const expiry = it.expiry_date ? new Date(it.expiry_date) : null;
      const daysLeft = expiry
        ? Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
      setItems((prev) =>
        prev.map((item) => (item.item_id === itemId ? { ...it, daysLeft } : item))
      );
      toast.success('변경되었습니다.');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('아이템 업데이트에 실패했습니다.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // (6) 삭제: DELETE /items { item_ids: [...] }
  const deleteItems = async (itemIds: number[]) => {
    setIsLoading(true);
    try {
      await apiClient.delete('/items', { data: { item_ids: itemIds } });
      setItems((prev) => prev.filter((item) => !itemIds.includes(item.item_id)));
      setSelectedItems([]);
      setSelectionMode(false);
      toast.success(`${itemIds.length}개 항목이 삭제되었습니다.`);
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('아이템 삭제에 실패했습니다.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // (7) 선택 모드 관련
  const selectItem = (itemId: number) => {
    setSelectedItems((prev) => [...prev, itemId]);
  };
  const deselectItem = (itemId: number) => {
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };
  const clearSelectedItems = () => {
    setSelectedItems([]);
  };
  useEffect(() => {
    if (!isSelectionMode) {
      clearSelectedItems();
    }
  }, [isSelectionMode]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        categories,
        isLoading,
        selectedCategoryId,
        setSelectedCategoryId,
        addItem,
        updateItem,
        deleteItems,
        selectedItems,
        selectItem,
        deselectItem,
        clearSelectedItems,
        isSelectionMode,
        setSelectionMode,
        refreshInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

// 사용 훅
export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
