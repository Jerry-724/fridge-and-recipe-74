
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import InventoryItem from './InventoryItem';

const InventoryList: React.FC = () => {
  const { items, categories, selectedCategoryId } = useInventory();

  // Filter items based on selected category if applicable
  let filteredItems = items;
  if (selectedCategoryId) {
    const selectedCategory = categories.find(c => c.category_id === selectedCategoryId);
    if (selectedCategory) {
      filteredItems = items.filter(item => {
        const itemCategory = categories.find(c => c.category_id === item.category_id);
        return itemCategory && itemCategory.category_major_name === selectedCategory.category_major_name;
      });
    }
  }

  // Group items by subcategory
  const groupedItems: Record<string, typeof filteredItems> = {};
  
  filteredItems.forEach(item => {
    const category = categories.find(c => c.category_id === item.category_id);
    const subCategory = category ? category.category_sub_name : '기타';
    
    if (!groupedItems[subCategory]) {
      groupedItems[subCategory] = [];
    }
    
    groupedItems[subCategory].push(item);
  });
  
  // Sort each group: expiring items first, then alphabetical
  Object.keys(groupedItems).forEach(subCategory => {
    groupedItems[subCategory].sort((a, b) => {
      // First sort by expiration (items expiring soon first)
      const aExpiring = a.daysLeft !== undefined && a.daysLeft <= 3;
      const bExpiring = b.daysLeft !== undefined && b.daysLeft <= 3;
      
      if (aExpiring && !bExpiring) return -1;
      if (!aExpiring && bExpiring) return 1;
      
      // Then sort alphabetically by name
      return a.item_name.localeCompare(b.item_name);
    });
  });
  
  return (
    <div className="pb-20">
      {Object.keys(groupedItems).length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>아직 등록된 식품이 없습니다.</p>
        </div>
      ) : (
        Object.entries(groupedItems).map(([subCategory, items]) => (
          <div key={subCategory} className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 px-4 my-2">{subCategory}</h3>
            <div className="grid grid-cols-3 gap-3 px-4">
              {items.map(item => (
                <InventoryItem key={item.item_id} item={item} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default InventoryList;
