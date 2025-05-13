
import React, { useState, useRef, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface AddItemButtonProps {
  onOpenImagePicker: () => void;
  onOpenDeleteConfirmation: () => void;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({ 
  onOpenImagePicker, 
  onOpenDeleteConfirmation 
}) => {
  const { isSelectionMode, setSelectionMode, selectedItems } = useInventory();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleAddItems = () => {
    setIsOpen(false);
    onOpenImagePicker();
  };
  
  const handleDeleteItems = () => {
    setIsOpen(false);
    setSelectionMode(true);
  };
  
  return (
    <div ref={dropdownRef} className="fixed bottom-20 right-5 z-20">
      {!isSelectionMode ? (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              className="bg-[#70B873] hover:bg-[#5fa762] text-white font-bold px-4 py-2 rounded flex items-center gap-2"
              onClick={() => setIsOpen(true)}
            >
              <PencilIcon size={18} />
              편집
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="mt-1 border-2 border-[#70B873] p-0 rounded-md bg-white" 
            align="end"
            sideOffset={5}
          >
            <DropdownMenuItem
              className="cursor-pointer bg-white text-[#70B873] font-bold py-2 px-4 hover:bg-gray-50"
              onClick={handleAddItems}
            >
              + 재고 추가
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer bg-white text-[#70B873] font-bold py-2 px-4 hover:bg-gray-50"
              onClick={handleDeleteItems}
            >
              – 재고 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
};

export default AddItemButton;
