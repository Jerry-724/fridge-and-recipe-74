
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
  
  // Handle Escape key to exit selection mode
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSelectionMode) {
        setSelectionMode(false);
      }
    };
    
    // Handle back button on mobile
    const handleBackButton = (e: PopStateEvent) => {
      if (isSelectionMode) {
        e.preventDefault();
        setSelectionMode(false);
        // Push a new state to replace the one consumed by back button
        window.history.pushState(null, "");
      }
    };
    
    // Add listeners
    window.addEventListener('keydown', handleEscKey);
    
    if (isSelectionMode) {
      // Add a history entry so we can catch "back" press on mobile
      window.history.pushState(null, "");
      window.addEventListener('popstate', handleBackButton);
    }
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isSelectionMode, setSelectionMode]);
  
  // Push a history state when selection mode is enabled
  useEffect(() => {
    if (isSelectionMode) {
      window.history.pushState(null, "");
    }
  }, [isSelectionMode]);
  
  // Clean up selection mode when component unmounts
  useEffect(() => {
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
          let timer = setTimeout(() => handleLongPress(e), 1000); // Reduced from 1500 to 1000ms
          e.currentTarget.addEventListener('touchend', () => clearTimeout(timer), { once: true });
        }}
        onMouseDown={(e) => {
          let timer = setTimeout(() => handleLongPress(e), 1000); // Reduced from 1500 to 1000ms
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
