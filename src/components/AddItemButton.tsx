
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { PlusIcon, MinusIcon } from 'lucide-react';

interface AddItemButtonProps {
  onOpenImagePicker: () => void;
  onOpenDeleteConfirmation: () => void;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({ 
  onOpenImagePicker, 
  onOpenDeleteConfirmation 
}) => {
  const { isSelectionMode, selectedItems } = useInventory();
  
  return (
    <button
      onClick={isSelectionMode ? onOpenDeleteConfirmation : onOpenImagePicker}
      className={`fixed bottom-20 right-5 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-20 ${
        isSelectionMode 
          ? selectedItems.length > 0 ? 'bg-destructive' : 'bg-gray-400' 
          : 'bg-primary'
      }`}
      disabled={isSelectionMode && selectedItems.length === 0}
    >
      {isSelectionMode ? (
        <MinusIcon className="text-white" size={24} />
      ) : (
        <PlusIcon className="text-white" size={24} />
      )}
    </button>
  );
};

export default AddItemButton;
