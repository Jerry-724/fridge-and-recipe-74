
import React, { useRef } from 'react';
import { useInventory } from '../context/InventoryContext';

// Mock images for categories - in a real app these would be imported actual images
const categoryImages = {
  '동물성 식재료': '🥩',
  '식물성 식재료': '🥬',
  '가공식품, 저장식품, 반찬': '🥫',
  '양념, 조미료': '🧂',
  '기타 (디저트 등)': '🧁',
};

const CategoryBar: React.FC = () => {
  const { categories, selectedCategoryId, setSelectedCategoryId } = useInventory();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get unique major categories
  const majorCategories = Array.from(
    new Set(categories.map(category => category.category_major_name))
  );
  
  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    // Find the first category with this major name
    const category = categories.find(c => c.category_major_name === categoryName);
    
    if (!category) return;
    
    // Toggle selection
    if (selectedCategoryId && 
        categories.find(c => c.category_id === selectedCategoryId)?.category_major_name === categoryName) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(category.category_id);
    }
  };
  
  return (
    <div 
      ref={scrollRef}
      className="category-scroll flex overflow-x-auto py-4 px-2 bg-white sticky top-0 z-10"
    >
      {majorCategories.map((categoryName, index) => {
        const isSelected = selectedCategoryId !== null && 
          categories.find(c => c.category_id === selectedCategoryId)?.category_major_name === categoryName;
        
        return (
          <div 
            key={index}
            className={`flex flex-col items-center min-w-[80px] mx-2 ${
              isSelected ? 'text-primary' : 'text-gray-700'
            }`}
            onClick={() => handleCategoryClick(categoryName)}
          >
            <div 
              className={`text-3xl mb-2 p-3 rounded-full ${
                isSelected ? 'bg-primary bg-opacity-20' : 'bg-gray-100'
              }`}
            >
              {categoryImages[categoryName as keyof typeof categoryImages] || '📦'}
            </div>
            <span className="text-xs text-center w-full truncate">
              {categoryName}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBar;
