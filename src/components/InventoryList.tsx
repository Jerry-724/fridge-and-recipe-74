
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import InventoryItem from './InventoryItem';

// Subcategory definitions by major category
const subcategories = {
  '식물성': [
    '곡류·서류',
    '두류·견과',
    '채소류',
    '버섯류',
    '과일류',
    '해조류'
  ],
  '동물성': [
    '육류', 
    '알류',
    '유제품',
    '해산물'  // Changed from '어패류·해산물' to '해산물'
  ],
  '가공식품': [
    '가공식품',
    '저장식품/반찬'
  ],
  '조미료·양념': [
    '기본 조미료',
    '한식 양념'
  ],
  '기타': [
    '스낵/과자'
  ]
};

const InventoryList: React.FC = () => {
  const { items, categories, selectedCategoryId } = useInventory();

  // Filter items based on selected category if applicable
  let filteredItems = items;
  let selectedMajorCategory = null;
  
  if (selectedCategoryId) {
    const selectedCategory = categories.find(c => c.category_id === selectedCategoryId);
    if (selectedCategory) {
      selectedMajorCategory = selectedCategory.category_major_name;
      filteredItems = items.filter(item => {
        const itemCategory = categories.find(c => c.category_id === item.category_id);
        return itemCategory && itemCategory.category_major_name === selectedCategory.category_major_name;
      });
    }
  }

  // First separate expiring items (3 days or less)
  const expiringItems = filteredItems.filter(item => 
    item.daysLeft !== undefined && item.daysLeft <= 3
  );
  
  const nonExpiringItems = filteredItems.filter(item => 
    item.daysLeft === undefined || item.daysLeft > 3
  );

  // If no category selected, show all items with expiring at top then alphabetical
  if (!selectedMajorCategory) {
    // Sort expiring items by days left
    expiringItems.sort((a, b) => {
      return (a.daysLeft || 0) - (b.daysLeft || 0);
    });
    
    // Sort non-expiring items alphabetically
    nonExpiringItems.sort((a, b) => {
      return a.item_name.localeCompare(b.item_name);
    });
    
    const allItems = [...expiringItems, ...nonExpiringItems];
    
    // Just render all items without sub-grouping
    return (
      <div className="pb-20">
        {allItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>아직 등록된 식품이 없습니다.</p>
          </div>
        ) : (
          <div className="mt-2">
            <div className="grid grid-cols-3 gap-3 px-4">
              {allItems.map(item => (
                <InventoryItem key={item.item_id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // For selected category view, group by subcategory
  if (selectedMajorCategory) {
    const relevantSubcategories = subcategories[selectedMajorCategory as keyof typeof subcategories] || [];
    
    // Group items by subcategory
    const groupedItems: Record<string, typeof filteredItems> = {};
    
    // Initialize groups with all subcategories (even empty ones)
    relevantSubcategories.forEach(subCategory => {
      groupedItems[subCategory] = [];
    });
    
    // Add items to their subcategories
    filteredItems.forEach(item => {
      const category = categories.find(c => c.category_id === item.category_id);
      const subCategory = category?.category_sub_name || '기타';
      
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
        
        // If both are expiring or both are not, sort by days left or alphabetically
        if (aExpiring && bExpiring) {
          return (a.daysLeft || 0) - (b.daysLeft || 0);
        }
        
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
          relevantSubcategories.map((subCategory) => {
            const subCategoryItems = groupedItems[subCategory] || [];
            if (subCategoryItems.length === 0) return null;
            
            return (
              <div key={subCategory} className="mb-4">
                <div className="border-b border-gray-200 py-1 px-4">
                  <h3 className="text-sm font-medium text-gray-600">{subCategory}</h3>
                </div>
                <div className="grid grid-cols-3 gap-3 px-4 mt-2">
                  {subCategoryItems.map(item => (
                    <InventoryItem key={item.item_id} item={item} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }
  
  return null;
};

export default InventoryList;
