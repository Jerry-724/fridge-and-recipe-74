
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Trash2Icon } from 'lucide-react';

interface DeleteConfirmationProps {
  onClose: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onClose }) => {
  const { selectedItems, deleteItems } = useInventory();
  
  const handleDelete = async () => {
    await deleteItems(selectedItems);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <Trash2Icon size={56} className="text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2 text-center">삭제하시겠습니까?</h2>
          <p className="text-center text-gray-600 mb-6">
            {selectedItems.length}개의 항목을 삭제합니다.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-md font-bold"
          >
            취소
          </button>
          <button
            onClick={handleDelete}
            className="bg-destructive text-white py-3 px-6 rounded-md font-bold"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
