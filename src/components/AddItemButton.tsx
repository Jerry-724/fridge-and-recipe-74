
import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

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
  const { isSelectionMode, selectedItems, setSelectionMode } = useInventory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  
  const handleMainButtonClick = () => {
    if (isSelectionMode) {
      onOpenDeleteConfirmation();
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handleAddButtonClick = () => {
    setShowAddOptions(true);
    setIsMenuOpen(false);
  };
  
  const handleDeleteButtonClick = () => {
    setSelectionMode(true);
    setIsMenuOpen(false);
  };

  const handleAddOptionClick = (option: 'manual' | 'image') => {
    if (option === 'manual') {
      onOpenManualEntry();
    } else {
      onOpenImagePicker();
    }
    setShowAddOptions(false);
  };
  
  if (showAddOptions) {
    return (
      <div className="fixed bottom-20 right-5 flex flex-col items-end space-y-3 z-20">
        <button
          onClick={() => handleAddOptionClick('image')}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center shadow-lg"
        >
          <span>이미지 업로드</span>
        </button>
        
        <button
          onClick={() => handleAddOptionClick('manual')}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center shadow-lg"
        >
          <span>직접 입력</span>
        </button>
        
        <button
          onClick={() => setShowAddOptions(false)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-primary"
        >
          <X className="text-white" size={24} />
        </button>
      </div>
    );
  }
  
  return (
    <>
      {/* Add food items button */}
      {isMenuOpen && !isSelectionMode && (
        <button
          onClick={handleAddButtonClick}
          className="fixed bottom-36 right-5 bg-primary text-white px-4 py-2 rounded-md flex items-center shadow-lg z-20"
        >
          <Plus className="mr-1" size={16} />
          <span>재고 추가</span>
        </button>
      )}
      
      {/* Delete food items button */}
      {isMenuOpen && !isSelectionMode && (
        <button
          onClick={handleDeleteButtonClick}
          className="fixed bottom-28 right-5 bg-destructive text-white px-4 py-2 rounded-md flex items-center shadow-lg z-20"
        >
          <Trash2 className="mr-1" size={16} />
          <span>재고 삭제</span>
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
          <Trash2 className="text-white" size={24} />
        ) : isMenuOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <Pencil className="text-white" size={24} />
        )}
      </button>
    </>
  );
};

export default AddItemButton;
