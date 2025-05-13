
import React, { useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Beef, 
  Carrot, 
  Archive,
  Cookie,
  Utensils
} from 'lucide-react';

const CategoryBar: React.FC = () => {
  const { categories, selectedCategoryId, setSelectedCategoryId } = useInventory();
  
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
    '조미료·양념': Utensils,
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
      className="grid grid-cols-5 py-4 px-1 bg-[#FFFFF8] sticky top-0 z-10"
    >
      {majorCategories.map((categoryName, index) => {
        const isSelected = selectedCategoryId !== null && 
          categories.find(c => c.category_id === selectedCategoryId)?.category_major_name === categoryName;
        
        const IconComponent = categoryIcons[categoryName as keyof typeof categoryIcons];
        
        return (
          <div 
            key={index}
            className={`flex flex-col items-center justify-center relative`}
            onClick={() => handleCategoryClick(categoryName)}
          >
            <div className="mb-1 p-2">
              <IconComponent size={32} color="#70B873" />
            </div>
            <span className="text-xs text-center w-full truncate font-bold text-gray-700">
              {categoryName}
            </span>
            {isSelected && (
              <div className="absolute bottom-[-6px] left-0 w-full h-1 bg-[#70B873] rounded-full"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBar;
