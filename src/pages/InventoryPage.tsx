
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
  
  // Enable selection mode with long press (1 second instead of 1.5)
  const handleLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setSelectionMode(true);
  };
  
  // Handle Escape key press to exit selection mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSelectionMode) {
        setSelectionMode(false);
      }
    };

    // Add event listener for escape key
    document.addEventListener('keydown', handleKeyDown);
    
    // Handle back button on mobile
    const handlePopState = () => {
      if (isSelectionMode) {
        setSelectionMode(false);
        // Prevent actual navigation
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    // Add event listeners
    if (isSelectionMode) {
      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', handlePopState);
    }
    
    // Clean up event listeners and selection mode when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
      setSelectionMode(false);
    };
  }, [isSelectionMode, setSelectionMode]);
  
  return (
    <div className="pb-16">
      <CategoryBar />
      
      <div 
        className="pb-20"
        onTouchStart={(e) => {
          let timer = setTimeout(() => handleLongPress(e), 1000);
          e.currentTarget.addEventListener('touchend', () => clearTimeout(timer), { once: true });
        }}
        onMouseDown={(e) => {
          let timer = setTimeout(() => handleLongPress(e), 1000);
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
