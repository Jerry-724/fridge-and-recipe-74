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
