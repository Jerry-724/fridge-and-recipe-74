
import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface ManualItemEntryProps {
  onClose: () => void;
}

const ManualItemEntry: React.FC<ManualItemEntryProps> = ({ onClose }) => {
  const [itemName, setItemName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  
  const { addItem, categories } = useInventory();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName || !expiryDate || !categoryId) {
      toast("모든 필드를 입력해주세요.");
      return;
    }
    
    try {
      await addItem({
        item_name: itemName,
        expiry_date: expiryDate,
        category_id: categoryId,
      });
      
      toast("식품이 추가되었습니다.", {
        duration: 1000,
      });
      onClose();
    } catch (error) {
      toast("식품 추가에 실패했습니다.");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-medium">직접 입력</h1>
        <button onClick={onClose} className="text-gray-500">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">식품 이름</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="input-field"
              placeholder="식품 이름을 입력하세요"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">유통기한</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">카테고리</label>
            <select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="input-field"
              required
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_major_name} - {category.category_sub_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 border border-gray-300 rounded-md"
            >
              취소
            </button>
            <button
              type="submit"
              className="w-1/2 bg-primary text-white py-3 rounded-md"
              disabled={!itemName || !expiryDate || !categoryId}
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualItemEntry;
