
import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Camera, MinusIcon, Type, Plus, X } from 'lucide-react';

interface AddItemButtonProps {
  onOpenImagePicker: () => void;
  onOpenDeleteConfirmation: () => void;
  onOpenManualEntry: () => void;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({ 
  onOpenImagePicker, 
  onOpenDeleteConfirmation,
  onOpenManualEntry 
}) => {
  const { isSelectionMode, selectedItems } = useInventory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleMainButtonClick = () => {
    if (isSelectionMode) {
      onOpenDeleteConfirmation();
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };
  
  return (
    <>
      {/* The text input button */}
      {isMenuOpen && !isSelectionMode && (
        <button
          onClick={() => {
            onOpenManualEntry();
            setIsMenuOpen(false);
          }}
          className="fixed bottom-36 right-5 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-20 bg-primary bg-opacity-80"
        >
          <Type className="text-white" size={20} />
        </button>
      )}
      
      {/* The camera button */}
      {isMenuOpen && !isSelectionMode && (
        <button
          onClick={() => {
            onOpenImagePicker();
            setIsMenuOpen(false);
          }}
          className="fixed bottom-28 right-5 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-20 bg-primary"
        >
          <Camera className="text-white" size={20} />
        </button>
      )}
      
      {/* The main button */}
      <button
        onClick={handleMainButtonClick}
        className={`fixed bottom-20 right-5 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-20 ${
          isSelectionMode 
            ? selectedItems.length > 0 ? 'bg-destructive' : 'bg-gray-400' 
            : 'bg-primary'
        }`}
        disabled={isSelectionMode && selectedItems.length === 0}
      >
        {isSelectionMode ? (
          <MinusIcon className="text-white" size={24} />
        ) : isMenuOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <Plus className="text-white" size={24} />
        )}
      </button>
    </>
  );
};

export default AddItemButton;
