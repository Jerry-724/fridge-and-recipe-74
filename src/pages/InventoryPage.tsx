// src/pages/InventoryPage.tsx
import React, { useState, useEffect } from 'react';
import { Trash2Icon } from 'lucide-react';
import CategoryBar from '../components/CategoryBar';
import InventoryList from '../components/InventoryList';
import AddItemButton from '../components/AddItemButton';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { useInventory } from '../context/InventoryContext';

const InventoryPage: React.FC = () => {
  // 선택 모드 관련 상태
  const {
    isSelectionMode,
    setSelectionMode,
    clearSelectedItems,
    selectedItems,
  } = useInventory();

  // ESC 누르면 선택 모드 해제
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSelectionMode) {
        setSelectionMode(false);
      }
    };
    
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isSelectionMode, setSelectionMode]);

  // 삭제 확인 모달 노출 여부
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <div className="h-full flex flex-col bg-[#FFFFF0]">
      {/* 카테고리 바 */}
      <CategoryBar />

      {/* 재고 리스트 */}
      <div className="flex-1 overflow-hidden">
        <InventoryList />
      </div>

      {/* 편집 버튼: 내부에서 OCR 모달 + 삭제 모드 토글을 다 처리합니다 */}
      <AddItemButton />

      {/* 선택 모드에서 하단 “몇개 삭제” 버튼 */}
      {isSelectionMode && selectedItems.length > 0 && (
        <div
          className="absolute bottom-24 left-0 right-0 flex justify-center z-20"
        >
          <button
            className="bg-destructive text-white py-2 px-6 rounded-full flex items-center"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash2Icon size={18} className="mr-1" />
            <span className="font-bold">{selectedItems.length}개 삭제</span>
          </button>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          onClose={() => {
            setShowDeleteConfirmation(false);
            setSelectionMode(false);
            clearSelectedItems();
          }}
        />
      )}
    </div>
  );
};

export default InventoryPage;
