
import React, { useState } from 'react';
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
  
  return (
    <div className="h-full flex flex-col">
      <CategoryBar />
      
      <div className="flex-1">
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
        <DeleteConfirmation onClose={() => {
          setShowDeleteConfirmation(false);
          setSelectionMode(false);
        }} />
      )}
    </div>
  );
};

export default InventoryPage;
