
import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import CategoryBar from '../components/CategoryBar';
import InventoryList from '../components/InventoryList';
import AddItemButton from '../components/AddItemButton';
import OCRScanning from '../components/OCRScanning';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ManualItemEntry from '../components/ManualItemEntry';

const InventoryPage: React.FC = () => {
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [showManualEntry, setShowManualEntry] = useState<boolean>(false);
  const { isSelectionMode, setSelectionMode } = useInventory();
  
  // Enable selection mode with long press (1 second)
  const handleLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setSelectionMode(true);
  };
  
  // Handle escape key to exit selection mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSelectionMode) {
          setSelectionMode(false);
        } else if (showImagePicker) {
          setShowImagePicker(false);
        } else if (showManualEntry) {
          setShowManualEntry(false);
        } else if (showDeleteConfirmation) {
          setShowDeleteConfirmation(false);
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up selection mode when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      setSelectionMode(false);
    };
  }, [isSelectionMode, setSelectionMode, showImagePicker, showManualEntry, showDeleteConfirmation]);

  // Handle back button on mobile
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      if (isSelectionMode || showImagePicker || showManualEntry || showDeleteConfirmation) {
        e.preventDefault();
        setSelectionMode(false);
        setShowImagePicker(false);
        setShowManualEntry(false);
        setShowDeleteConfirmation(false);
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
  }, [isSelectionMode, setSelectionMode, showImagePicker, showManualEntry, showDeleteConfirmation]);
  
  return (
    <div className="pb-16 flex flex-col h-full">
      <CategoryBar />
      
      <div 
        className="flex-1 overflow-y-auto scrollbar-hide"
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
        onOpenManualEntry={() => setShowManualEntry(true)}
      />
      
      {showImagePicker && (
        <OCRScanning onClose={() => setShowImagePicker(false)} />
      )}
      
      {showDeleteConfirmation && (
        <DeleteConfirmation onClose={() => setShowDeleteConfirmation(false)} />
      )}
      
      {showManualEntry && (
        <ManualItemEntry onClose={() => setShowManualEntry(false)} />
      )}
    </div>
  );
};

export default InventoryPage;
