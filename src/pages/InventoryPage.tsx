
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
  
  // Enable selection mode with long press (1 second) - UPDATED FROM 1.5s to 1s
  const handleLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setSelectionMode(true);
  };
  
  // Handle escape key to exit selection mode
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSelectionMode) {
        setSelectionMode(false);
      }
    };

    // Handle back button on mobile
    const handleBackButton = (event: PopStateEvent) => {
      if (isSelectionMode) {
        event.preventDefault();
        setSelectionMode(false);
        // Push a new state to replace the one that was popped
        window.history.pushState(null, '', window.location.pathname);
      }
    };
    
    // Add event listeners
    document.addEventListener('keydown', handleEscKey);
    
    // For mobile back button
    if (isSelectionMode) {
      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', handleBackButton);
    }
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isSelectionMode, setSelectionMode]);
  
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
          let timer = setTimeout(() => handleLongPress(e), 1000); // UPDATED FROM 1500 to 1000
          e.currentTarget.addEventListener('touchend', () => clearTimeout(timer), { once: true });
        }}
        onMouseDown={(e) => {
          let timer = setTimeout(() => handleLongPress(e), 1000); // UPDATED FROM 1500 to 1000
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
