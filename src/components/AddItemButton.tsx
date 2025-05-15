// src/components/AddItemButton.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { OcrAddItemsModal } from './OcrAddItemsModal';

export default function AddItemButton() {
  const { isSelectionMode, setSelectionMode, selectedItems } = useInventory();
  const [open, setOpen] = useState(false);
  const [ocrOpen, setOcrOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return ()=>document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <>
      <div ref={ref} className="fixed bottom-20 right-5 z-20">
        {!isSelectionMode && (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button onClick={()=>setOpen(true)} className="bg-green-600">
                <PencilIcon/> 편집
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={()=>{ setOpen(false); setOcrOpen(true); }}>
                + 재고 추가
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{ setOpen(false); setSelectionMode(true); }}>
                – 재고 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {ocrOpen && <OcrAddItemsModal onClose={()=>setOcrOpen(false)} />}
    </>
  );
}
