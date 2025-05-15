import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Item, Category } from "../types/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface InventoryContextType {
  items: (Item & { daysLeft: number | null })[];
  categories: Category[];
  isLoading: boolean;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  selectedItems: number[];
  selectItem: (id: number) => void;
  deselectItem: (id: number) => void;
  clearSelectedItems: () => void;
  isSelectionMode: boolean;
  setSelectionMode: (mode: boolean) => void;
  refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<(Item & { daysLeft: number | null })[]>(
    []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setSelectionMode] = useState<boolean>(false);

  // useAuth 훅에서 API 클라이언트와 user_id를 가져옵니다.
  const { apiClient, user, isAuthenticated } = useAuth();

  // ① 데이터 로드 함수: 카테고리 + 재고
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1-1) 카테고리 가져오기
      const catRes = await apiClient.get<Category[]>("/category/");
      setCategories(catRes.data);

      // 1-2) 재고 가져오기 → **백엔드의 GET /item/{user_id}** 엔드포인트 호출
      const itemRes = await apiClient.get<Item[]>(`/item/${user.user_id}`);
      // daysLeft 계산
      const withDaysLeft = itemRes.data.map((it) => {
        const expiry = it.expiry_date ? new Date(it.expiry_date) : null;
        const daysLeft = expiry
          ? Math.ceil(
              (expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )
          : null;
        return { ...it, daysLeft };
      });
      setItems(withDaysLeft);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      toast.error("재고 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // ② 인증 상태 변화에 따라 데이터(fetchData) 재실행
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setItems([]);
      setCategories([]);
    }
  }, [isAuthenticated]);

  // 선택 항목 관련 헬퍼
  const selectItem = (id: number) => setSelectedItems((prev) => [...prev, id]);
  const deselectItem = (id: number) =>
    setSelectedItems((prev) => prev.filter((x) => x !== id));
  const clearSelectedItems = () => setSelectedItems([]);

  // InventoryContext 에 제공할 값
  const value: InventoryContextType = {
    items,
    categories,
    isLoading,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedItems,
    selectItem,
    deselectItem,
    clearSelectedItems,
    isSelectionMode,
    setSelectionMode,
    refreshInventory: fetchData,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

// useInventory 훅
export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx)
    throw new Error("useInventory must be used within an InventoryProvider");
  return ctx;
};
