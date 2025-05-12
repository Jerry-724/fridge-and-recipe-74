
import React, { useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Beef, 
  Carrot, 
  Archive, 
  Salt, 
  Cookie 
} from 'lucide-react';

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
  
  // Map categories to vector icons
  const categoryIcons = {
    '동물성': Beef,
    '식물성': Carrot,
    '가공식품': Archive,
    '조미료·양념': Salt,
    '기타': Cookie,
  };
  
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
      className="flex overflow-x-auto py-4 px-2 bg-white sticky top-0 z-10 scrollbar-none"
    >
      {majorCategories.map((categoryName, index) => {
        const isSelected = selectedCategoryId !== null && 
          categories.find(c => c.category_id === selectedCategoryId)?.category_major_name === categoryName;
        
        const IconComponent = categoryIcons[categoryName as keyof typeof categoryIcons];
        
        return (
          <div 
            key={index}
            className={`flex flex-col items-center min-w-[80px] mx-2 ${
              isSelected ? 'text-[#70B873]' : 'text-gray-700'
            }`}
            onClick={() => handleCategoryClick(categoryName)}
          >
            <div className="mb-1">
              <IconComponent size={32} color={isSelected ? "#70B873" : "#666666"} />
            </div>
            <span className="text-xs text-center w-full truncate font-bold">
              {categoryName}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBar;
