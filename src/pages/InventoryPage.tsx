
import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import CategoryBar from '../components/CategoryBar';
import InventoryList from '../components/InventoryList';
import AddItemButton from '../components/AddItemButton';
import OCRScanning from '../components/OCRScanning';
import DeleteConfirmation from '../components/DeleteConfirmation';

const InventoryPage: React.FC = () => {
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const { isSelectionMode, setSelectionMode, clearSelectedItems, selectedItems } = useInventory();
  
  // Handle ESC key to exit selection mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSelectionMode) {
        setSelectionMode(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelectionMode, setSelectionMode]);
  
  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setSelectionMode(false);
    clearSelectedItems();
  };
  
  return (
    <div className="h-full flex flex-col bg-[#FFFFF8]">
      <CategoryBar />
      
      <div className="flex-1">
        <InventoryList />
      </div>
      
      <AddItemButton 
        onOpenImagePicker={() => setShowImagePicker(true)} 
        onOpenDeleteConfirmation={() => {
          setSelectionMode(true);
          // Don't immediately show confirmation dialog - it should only show after selection
        }}
      />
      
      {showImagePicker && (
        <OCRScanning onClose={() => setShowImagePicker(false)} />
      )}
      
      {showDeleteConfirmation && (
        <DeleteConfirmation onClose={handleCloseDeleteConfirmation} />
      )}

      {isSelectionMode && selectedItems.length > 0 && (
        <div 
          className="absolute bottom-24 left-0 right-0 flex justify-center"
          onClick={() => setShowDeleteConfirmation(true)}
        >
          <button className="bg-destructive text-white py-2 px-6 rounded-full flex items-center">
            <span className="font-bold">{selectedItems.length}개 삭제</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
