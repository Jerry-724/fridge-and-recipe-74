// src/components/InventoryList.tsx
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import InventoryItem from './InventoryItem';

// Subcategory definitions by major category
const subcategories = {
  '식물성': ['곡류·서류','두류·견과','채소류','버섯류','과일류','해조류'],
  '동물성': ['육류','알류','유제품','해산물'],
  '가공식품': ['가공식품','저장식품/반찬'],
  '조미료·양념': ['기본 조미료','한식 양념'],
  '기타': ['스낵/과자'],
};

const InventoryList: React.FC = () => {
  const { items, categories, selectedCategoryId } = useInventory();

  // Filter by selected major category
  let filtered = items;
  let major: string | null = null;
  if (selectedCategoryId) {
    const sel = categories.find(c => c.category_id === selectedCategoryId);
    major = sel?.category_major_name || null;
    filtered = items.filter(i => {
      const cat = categories.find(c => c.category_id === i.category_id);
      return cat?.category_major_name === major;
    });
  }

  // Partition expiring (<=3 days) vs others
  const expiring = filtered.filter(i => i.daysLeft != null && i.daysLeft <= 3);
  const others = filtered.filter(i => i.daysLeft == null || i.daysLeft > 3);

  // No category selected: sort and show all
  if (!major) {
    expiring.sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0));
    others.sort((a, b) => a.item_name.localeCompare(b.item_name));
    const all = [...expiring, ...others];

    return (
      <div className="overflow-y-auto h-[calc(100vh-130px)] bg-[#FFFFF0]">
        {all.length === 0 ? (
          <div className="p-8 text-center text-gray-500">아직 등록된 식품이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-3 gap-3 p-4">
            {all.map(item => <InventoryItem key={item.item_id} item={{ ...item, daysLeft: item.daysLeft ?? null }} />)}
          </div>
        )}
      </div>
    );
  }

  // Category selected: group by subcategory
  const subs = subcategories[major as keyof typeof subcategories] || [];
  const groups: Record<string, typeof filtered> = {};
  subs.forEach(sub => (groups[sub] = []));
  filtered.forEach(i => {
    const cat = categories.find(c => c.category_id === i.category_id);
    const sub = cat?.category_sub_name || '기타';
    if (!groups[sub]) groups[sub] = [];
    groups[sub].push(i);
  });

  // Sort within each group
  Object.values(groups).forEach(arr =>
    arr.sort((a, b) => {
      const aExp = a.daysLeft != null && a.daysLeft <= 3;
      const bExp = b.daysLeft != null && b.daysLeft <= 3;
      if (aExp !== bExp) return aExp ? -1 : 1;
      if (a.daysLeft != null && b.daysLeft != null) {
        if (aExp && bExp) return a.daysLeft - b.daysLeft;
      }
      return a.item_name.localeCompare(b.item_name);
    })
  );

  return (
    <div className="overflow-y-auto h-[calc(100vh-130px)] bg-[#FFFFF0]">
      {subs.map(sub => {
        const list = groups[sub];
        if (!list || list.length === 0) return null;
        return (
          <div key={sub} className="mb-4">
            <div className="border-b border-gray-200 px-4 py-1">
              <h3 className="text-sm font-medium text-gray-600">{sub}</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
              {list.map(item => <InventoryItem key={item.item_id} item={{ ...item, daysLeft: item.daysLeft ?? null }} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryList;
