// src/components/InventoryList.tsx
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import InventoryItem from './InventoryItem';

const subcategories = {
  식물성: ['곡류·서류','두류·견과','채소류','버섯류','과일류','해조류'],
  동물성: ['육류','알류','유제품','해산물'],
  '가공·저장식품': ['가공식품','저장식품/반찬'],
  '조미료·양념': ['기본 조미료','한식 양념'],
  기타: ['스낵/과자'],
};

const InventoryList: React.FC = () => {
  const {
    items,
    categories,
    selectedMajor,
    selectedCategoryId,
  } = useInventory();

  // ⬇️ 1) 전체 모드
  if (!selectedMajor) {
    const expiring   = items.filter(i => i.daysLeft != null && i.daysLeft <= 3);
    const others     = items.filter(i => i.daysLeft == null || i.daysLeft > 3);
    expiring.sort((a,b)=> (a.daysLeft! - b.daysLeft!));
    others.sort((a,b)=> a.item_name.localeCompare(b.item_name));
    const all = [...expiring, ...others];

    return (
      <div className="overflow-y-auto h-[calc(100vh-130px)]">
        {all.length === 0
          ? <div className="p-8 text-gray-500 text-center">아직 등록된 식품이 없습니다.</div>
          : <div className="grid grid-cols-3 gap-3 p-4">
              {all.map(item => <InventoryItem key={item.item_id} item={item} />)}
            </div>
        }
      </div>
    );
  }

  // ⬇️ 2) 대분류 선택 모드
  let filtered = items.filter(i=>{
    return i.category.category_major_name === selectedMajor;
  });

  // ⬇️ 3) 소분류까지 선택했다면 더 좁히기
  if (selectedCategoryId) {
    filtered = filtered.filter(i=> i.category.category_id === selectedCategoryId);
  }

  // ⬇️ 4) 그룹핑
  const subs = subcategories[selectedMajor as keyof typeof subcategories] || [];
  const groups: Record<string, typeof filtered> = {};
  subs.forEach(s=> groups[s]=[]);
  filtered.forEach(i=>{
    const sub = i.category.category_sub_name;
    (groups[sub] ||= []).push(i);
  });

  // ⬇️ 5) 정렬
  Object.values(groups).forEach(arr=>{
    arr.sort((a,b)=>{
      const aExp = a.daysLeft != null && a.daysLeft <= 3;
      const bExp = b.daysLeft != null && b.daysLeft <= 3;
      if (aExp !== bExp) return aExp ? -1 : 1;
      if (aExp && bExp) return (a.daysLeft! - b.daysLeft!);
      return a.item_name.localeCompare(b.item_name);
    });
  });

  return (
    <div className="overflow-y-auto h-[calc(100vh-130px)]">
      {subs.map(sub=>{
        const group = groups[sub];
        if (!group || group.length===0) {
          return (
              <div key={sub} className="mb-4">
                <div className="px-4 py-1 border-b"><h3>{sub}</h3></div>
                <div className="p-4 text-gray-400 text-sm text-center">아직 등록되지 않았습니다.</div>
              </div>
          )
        }
        ;
        return (
            <div key={sub} className="mb-4">
              <div className="px-4 py-1 border-b"><h3>{sub}</h3></div>
              <div className="grid grid-cols-3 gap-3 p-4">
              {group.map(item => <InventoryItem key={item.item_id} item={item} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryList;