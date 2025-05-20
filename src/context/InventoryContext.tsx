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

  // **대분류 선택 상태**
  selectedMajor: string | null;
  setSelectedMajor: (name: string | null) => void;

  // **소분류 선택 상태**
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;

  selectedItems: number[];
  selectItem: (id: number) => void;
  deselectItem: (id: number) => void;
  clearSelectedItems: () => void;

  isSelectionMode: boolean;
  setSelectionMode: (mode: boolean) => void;

  refreshInventory: () => Promise<void>;

  // 삭제
  deleteItems: (itemIds: number[]) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<(Item & { daysLeft: number | null })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setSelectionMode] = useState<boolean>(false);

  const { apiClient, user, isAuthenticated } = useAuth();

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const catRes = await apiClient.get<Category[]>("/category/");
      setCategories(catRes.data);

      const itemRes = await apiClient.get<Item[]>(
        `/item/${user?.user_id}/`
      );

      const withDaysLeft = itemRes.data.map((it) => {
        const expiry = it.expiry_date ? new Date(it.expiry_date) : null;
        const daysLeft = expiry
          ? Math.ceil(
              (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
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

  const deleteItems = async (itemIds: number[]) => {
    if (!user) return;

    // 1. 백업
    const prevItems = [...items];

    // 2. optimistic UI 업데이트
    setItems((prev) => prev.filter((item) => !itemIds.includes(item.item_id)));

  
    try {
      const res = await apiClient.delete(`/item/${user.user_id}/delete`, {
        data: { item_ids: itemIds },
        headers: {
          "ngrok-skip-browser-warning": "true"
        }// axios에서는 DELETE에 data 넣을 수 있음
      });
  
      toast.success("선택한 항목이 삭제되었습니다.");
      await fetchData(); // 삭제 후 목록 새로고침
      clearSelectedItems(); // 선택 항목 초기화
      setSelectionMode(false); // 선택 모드 종료
    } catch (error: any) {
      console.error("삭제 오류:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
      setItems(prevItems);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setItems([]);
      setCategories([]);
    }
  }, [isAuthenticated]);

  const selectItem = (id: number) => setSelectedItems((p) => [...p, id]);
  const deselectItem = (id: number) =>
    setSelectedItems((p) => p.filter((x) => x !== id));
  const clearSelectedItems = () => setSelectedItems([]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        categories,
        isLoading,

        selectedMajor,
        setSelectedMajor,

        selectedCategoryId,
        setSelectedCategoryId,

        selectedItems,
        selectItem,
        deselectItem,
        clearSelectedItems,

        isSelectionMode,
        setSelectionMode,

        refreshInventory: fetchData,

        deleteItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within a provider");
  return ctx;
};