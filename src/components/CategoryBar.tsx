import React from "react";
import { useInventory } from "../context/InventoryContext";
import { Beef, Carrot, Archive, Utensils, Cookie } from "lucide-react";

const majorCategories = [
  "식물성",
  "동물성",
  "가공·저장식품",
  "조미료·양념",
  "기타",
] as const;

const icons = {
  식물성: Carrot,
  동물성: Beef,
  "가공·저장식품": Archive,
  "조미료·양념": Utensils,
  기타: Cookie,
} as const;

const CategoryBar: React.FC = () => {
  const {
    selectedMajor,
    setSelectedMajor,
    setSelectedCategoryId,
  } = useInventory();

  function handleMajorClick(major: string) {
  if (selectedMajor === major) {
    setSelectedMajor(null);
    setSelectedCategoryId(null);
  } else {
    setSelectedMajor(major);
    setSelectedCategoryId(null);
  }
}

  const onClick = (major: typeof majorCategories[number]) => {
    if (selectedMajor === major) {
      setSelectedMajor(null);
      setSelectedCategoryId(null);
    } else {
      setSelectedMajor(major);
      setSelectedCategoryId(null);
    }
  };

  return (
    <div className="grid grid-cols-5 py-4 px-1 bg-white sticky top-0 z-10">
      {majorCategories.map((major) => {
        const Icon = icons[major];
        const active = selectedMajor === major;
        return (
          <button
            key={major}
            onClick={() => onClick(major)}
            className="flex flex-col items-center justify-center relative"
          >
            <div
              className={`mb-1 p-2 rounded-full ${
                active ? "bg-[#E6F5EA]" : ""
              }`}
            >
              <Icon size={32} color={active ? "#70B873" : "#A0A0A0"} />
            </div>
            <span
              className={`text-xs font-bold ${
                active ? "text-[#2F855A]" : "text-gray-700"
              }`}
            >
              {major}
            </span>
            {active && (
              <div className="absolute bottom-[-6px] left-0 w-full h-1 bg-[#70B873] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryBar;
