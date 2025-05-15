
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Item, Category } from '../types/api';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

import axios from 'axios';

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

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setSelectionMode] = useState<boolean>(false);

  const { user } = useAuth();
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
      await new Promise(resolve => setTimeout(resolve, 500));
      const [categoriesRes, itemsRes] = await Promise.all([
          axios.get<Category[]>('http://localhost:8000/category'),
          axios.get<Item[]>(`http://localhost:8000/item/${user.user_id}`)
      ])
      
      // Calculate days left for each item
      const itemsWithDaysLeft = itemsRes.data.map(item => {
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
      setCategories(categoriesRes.data)

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
      
      // Show notification
      toast("식품이 추가되었습니다.");
    } catch (error) {
      console.error('Error adding item:', error);
      toast("아이템 추가에 실패했습니다.", {
        description: "다시 시도해주세요.",
      });
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
      
      // Show notification
      toast("변경되었습니다.");
    } catch (error) {
      console.error('Error updating item:', error);
      toast("아이템 업데이트에 실패했습니다.", {
        description: "다시 시도해주세요.",
      });
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
      
      // Show notification
      toast(`${itemIds.length}개 항목이 삭제되었습니다.`);
    } catch (error) {
      console.error('Error deleting items:', error);
      toast("아이템 삭제에 실패했습니다.", {
        description: "다시 시도해주세요.",
      });
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
  
  // When selection mode is turned off, clear selected items
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
