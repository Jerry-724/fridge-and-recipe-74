
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
  
  // Enable selection mode with long press (1 second)
  const handleLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setSelectionMode(true);
  };
  
  // Handle escape key to exit selection mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSelectionMode) {
        setSelectionMode(false);
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up selection mode when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      setSelectionMode(false);
    };
  }, [isSelectionMode, setSelectionMode]);

  // Handle back button on mobile
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      if (isSelectionMode) {
        e.preventDefault();
        setSelectionMode(false);
        // Push a new state to prevent navigating away
        window.history.pushState(null, document.title, window.location.pathname);
      }
    };

    // Save current history state
    window.history.pushState(null, document.title, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
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
