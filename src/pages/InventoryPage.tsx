
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
  const { isSelectionMode, setSelectionMode } = useInventory();
  
  // Enable selection mode with long press (2 seconds)
  const handleLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setSelectionMode(true);
  };
  
  useEffect(() => {
    // Clean up selection mode when component unmounts
    return () => {
      setSelectionMode(false);
    };
  }, [setSelectionMode]);
  
  return (
    <div className="pb-16">
      <CategoryBar />
      
      <div 
        className="pb-20"
        onTouchStart={(e) => {
          let timer = setTimeout(() => handleLongPress(e), 2000);
          e.currentTarget.addEventListener('touchend', () => clearTimeout(timer), { once: true });
        }}
        onMouseDown={(e) => {
          let timer = setTimeout(() => handleLongPress(e), 2000);
          e.currentTarget.addEventListener('mouseup', () => clearTimeout(timer), { once: true });
        }}
      >
        <InventoryList />
      </div>
      
      <AddItemButton 
        onOpenImagePicker={() => setShowImagePicker(true)} 
        onOpenDeleteConfirmation={() => setShowDeleteConfirmation(true)}
      />
      
      {showImagePicker && (
        <OCRScanning onClose={() => setShowImagePicker(false)} />
      )}
      
      {showDeleteConfirmation && (
        <DeleteConfirmation onClose={() => setShowDeleteConfirmation(false)} />
      )}
    </div>
  );
};

export default InventoryPage;
