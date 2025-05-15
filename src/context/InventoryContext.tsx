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

  // useAuth에서 apiClient와 user 정보 가져오기
  const { apiClient, user, isAuthenticated } = useAuth();

  // 인증 상태가 바뀔 때마다 재고·카테고리 새로 불러오기
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      // 로그아웃 시 데이터 초기화
      setItems([]);
      setCategories([]);
    }
  }, [isAuthenticated]);

  //  카테고리 + 아이템을 한번에 불러오는 함수
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // --- ★ 여기만 /categories → /category 로 바꿔주세요 ★ ---
      const catRes = await apiClient.get<Category[]>('/category');
      setCategories(catRes.data);

      const itemRes = await apiClient.get<Item[]>('/users/' + user.user_id + '/item/items');
      const withDaysLeft = itemRes.data.map((it) => {
        const expiry = it.expiry_date ? new Date(it.expiry_date) : null;
        const today = new Date();
        const daysLeft = expiry
          ? Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          : null;
        return { ...it, daysLeft };
      });
      setItems(withDaysLeft);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('재고 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (newItem: Omit<Item, 'item_id' | 'user_id' | 'created_at'>) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<Item>('/users/' + user.user_id + '/item/items', {
        ...newItem,
        user_id: user.user_id,
      });
      const it = res.data;
      const expiry = it.expiry_date ? new Date(it.expiry_date) : null;
      const today = new Date();
      const daysLeft = expiry
        ? Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
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

  const updateItem = async (itemId: number, updatedFields: Partial<Item>) => {
    setIsLoading(true);
    try {
      const res = await apiClient.patch<Item>(
        `/users/${user.user_id}/item/items/${itemId}`,
        updatedFields
      );
      const it = res.data;
      const expiry = it.expiry_date ? new Date(it.expiry_date) : null;
      const today = new Date();
      const daysLeft = expiry
        ? Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
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

  const deleteItems = async (itemIds: number[]) => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/users/${user.user_id}/item/items`, { data: { item_ids: itemIds } });
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

  const selectItem = (itemId: number) => {
    setSelectedItems((prev) => [...prev, itemId]);
  };

  const deselectItem = (itemId: number) => {
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  const refreshInventory = fetchData;

  useEffect(() => {
    if (!isSelectionMode) clearSelectedItems();
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

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within InventoryProvider');
  return context;
};
