
import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Beef, 
  Carrot,
  Archive,
  Cookie,
  Utensils
} from 'lucide-react';

const CategoryBar: React.FC = () => {
  const { categories, selectedCategoryId, setSelectedCategoryId, items } = useInventory();
  const [selectedMajorCategory, setSelectedMajorCategory] = useState<string | null>(null)
  
  // Get unique major categories
  const normalizeCategoryName = (name: string) => {
    if (name.includes("동물성")) return "동물성";
    if (name.includes("식물성") || name.includes("곡물") || name.includes("채소") || name.includes("과일")) return "식물성";
    if (name.includes("가공")) return "가공식품";
    if (name.includes("조미료") || name.includes("양념")) return "조미료·양념";
    return "기타";
  };

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
  const handleCategoryClick = (majorCategoryName: string) => {
    if (selectedMajorCategory === majorCategoryName) {
      // 이미 선택된 상태 → 해제
      setSelectedMajorCategory(null);
      setSelectedCategoryId(null); // 전체 리스트 보기
    } else {
      // 새로운 선택
      setSelectedMajorCategory(majorCategoryName);

      const filteredCategories = categories.filter(
          c => normalizeCategoryName(c.category_major_name) === majorCategoryName
      );

      if (filteredCategories.length > 0) {
        setSelectedCategoryId(filteredCategories[0].category_id);
      } else {
        setSelectedCategoryId(-1);
      }
    }
  }

  console.log('카테고리 상태:', categories);
  console.log('API에서 받은 items:', items);
  console.log('DB에서 실제 데이터 개수(확인용):', items.length);

  
  return (
    <div 
      className="grid grid-cols-5 py-4 px-1 bg-white sticky top-0 z-10"
    >
      {majorCategories.map((categoryName, index) => {
        const isSelected = selectedMajorCategory === categoryName;

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
