
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Item, Category } from '../types/api';
import { useAuth } from './AuthContext';

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
}

// Mock categories matching the specification
const MOCK_CATEGORIES: Category[] = [
  { category_id: 1, category_major_name: '동물성 식재료', category_sub_name: '육류' },
  { category_id: 2, category_major_name: '동물성 식재료', category_sub_name: '해산물' },
  { category_id: 3, category_major_name: '동물성 식재료', category_sub_name: '유제품' },
  { category_id: 4, category_major_name: '식물성 식재료', category_sub_name: '채소' },
  { category_id: 5, category_major_name: '식물성 식재료', category_sub_name: '과일' },
  { category_id: 6, category_major_name: '식물성 식재료', category_sub_name: '콩류' },
  { category_id: 7, category_major_name: '가공식품, 저장식품, 반찬', category_sub_name: '간편식' },
  { category_id: 8, category_major_name: '가공식품, 저장식품, 반찬', category_sub_name: '반찬' },
  { category_id: 9, category_major_name: '양념, 조미료', category_sub_name: '양념장' },
  { category_id: 10, category_major_name: '양념, 조미료', category_sub_name: '소스' },
  { category_id: 11, category_major_name: '기타 (디저트 등)', category_sub_name: '디저트' },
  { category_id: 12, category_major_name: '기타 (디저트 등)', category_sub_name: '음료' },
];

// Mock food items
const MOCK_ITEMS: Item[] = [
  {
    item_id: 1,
    user_id: 1,
    category_id: 1,
    item_name: '소고기',
    expiry_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    created_at: new Date().toISOString(),
  },
  {
    item_id: 2,
    user_id: 1,
    category_id: 4,
    item_name: '당근',
    expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    created_at: new Date().toISOString(),
  },
  {
    item_id: 3,
    user_id: 1,
    category_id: 5,
    item_name: '사과',
    expiry_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    created_at: new Date().toISOString(),
  },
  {
    item_id: 4,
    user_id: 1,
    category_id: 3,
    item_name: '우유',
    expiry_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    created_at: new Date().toISOString(),
  },
];

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setSelectionMode] = useState<boolean>(false);
  
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Load items and categories when authenticated
    if (isAuthenticated) {
      fetchData();
    } else {
      // Clear data when not authenticated
      setItems([]);
      setCategories([]);
    }
  }, [isAuthenticated]);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real app, fetch from API
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCategories(MOCK_CATEGORIES);
      
      // Calculate days left for each item
      const itemsWithDaysLeft = MOCK_ITEMS.map(item => {
        const expiryDate = new Date(item.expiry_date);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          ...item,
          daysLeft: diffDays
        };
      });
      
      setItems(itemsWithDaysLeft);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addItem = async (newItem: Omit<Item, 'item_id' | 'user_id' | 'created_at'>) => {
    try {
      setIsLoading(true);
      
      // In a real app, send to API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create mock item
      const expiryDate = new Date(newItem.expiry_date);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const mockItem: Item = {
        ...newItem,
        item_id: Math.max(0, ...items.map(i => i.item_id)) + 1,
        user_id: 1,
        created_at: new Date().toISOString(),
        daysLeft: diffDays
      };
      
      setItems(prevItems => [...prevItems, mockItem]);
    } catch (error) {
      console.error('Error adding item:', error);
      throw new Error('아이템 추가에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateItem = async (itemId: number, updatedFields: Partial<Item>) => {
    try {
      setIsLoading(true);
      
      // In a real app, send to API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.item_id === itemId 
            ? { ...item, ...updatedFields } 
            : item
        )
      );
    } catch (error) {
      console.error('Error updating item:', error);
      throw new Error('아이템 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteItems = async (itemIds: number[]) => {
    try {
      setIsLoading(true);
      
      // In a real app, send to API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => 
        prevItems.filter(item => !itemIds.includes(item.item_id))
      );
      
      // Clear selection
      setSelectedItems([]);
      setSelectionMode(false);
    } catch (error) {
      console.error('Error deleting items:', error);
      throw new Error('아이템 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectItem = (itemId: number) => {
    setSelectedItems(prev => [...prev, itemId]);
  };
  
  const deselectItem = (itemId: number) => {
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };
  
  const clearSelectedItems = () => {
    setSelectedItems([]);
  };
  
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
        setSelectionMode
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
