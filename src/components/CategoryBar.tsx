
import React, { useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Refrigerator } from 'lucide-react'; // Import Refrigerator icon

// Mapping of major categories to vector icons or emoji icons
const categoryImages = {
  '식물성': '🌱',
  '동물성': '🥩',
  '가공식품': '🥫',
  '조미료·양념': '🧂',
  '기타': '🧁',
};

const CategoryBar: React.FC = () => {
  const { categories, selectedCategoryId, setSelectedCategoryId } = useInventory();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get unique major categories
  const majorCategories = [
    '식물성',
    '동물성',
    '가공식품',
    '조미료·양념',
    '기타'
  ];
  
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
      className="category-scroll flex overflow-x-auto py-3 px-2 bg-white sticky top-0 z-10"
    >
      {majorCategories.map((categoryName, index) => {
        const isSelected = selectedCategoryId !== null && 
          categories.find(c => c.category_id === selectedCategoryId)?.category_major_name === categoryName;
        
        return (
          <div 
            key={index}
            className={`flex flex-col items-center min-w-[70px] mx-1 ${
              isSelected ? 'text-primary' : 'text-gray-700'
            }`}
            onClick={() => handleCategoryClick(categoryName)}
          >
            <div 
              className={`text-4xl mb-1 p-2 rounded-lg ${
                isSelected ? 'bg-primary bg-opacity-20' : 'bg-gray-100'
              }`}
            >
              {categoryName === '조미료·양념' ? <Refrigerator size={32} /> : 
                categoryImages[categoryName as keyof typeof categoryImages]}
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
