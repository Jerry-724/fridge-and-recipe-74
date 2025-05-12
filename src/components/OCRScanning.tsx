
import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { toast } from 'sonner';
import { Item } from '../types/api';
import { Refrigerator, X, Trash } from 'lucide-react'; 

interface OCRScanningProps {
  onClose: () => void;
}

interface OCRItem {
  item_name: string;
  major_category?: string;
  sub_category?: string;
  expiry_text?: string;
  expiry_date: string;
  category_id: number;
}

const OCRScanning: React.FC<OCRScanningProps> = ({ onClose }) => {
  const [stage, setStage] = useState<'upload' | 'scanning' | 'confirmation'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recognizedItems, setRecognizedItems] = useState<OCRItem[]>([]);
  
  const { addItem, categories } = useInventory();
  
  // Detect if device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  useEffect(() => {
    if (stage === 'scanning') {
      // Simulate OCR processing
      const timer = setTimeout(() => {
        // Mock OCR result with multiple items
        const mockItems: OCRItem[] = [
          {
            item_name: '우유',
            major_category: '동물성',
            sub_category: '유제품',
            expiry_text: '1주',
            expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category_id: 9, // Dairy category
          },
          {
            item_name: '도너츠',
            major_category: '가공식품',
            sub_category: '가공식품',
            expiry_text: '1주',
            expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category_id: 11, // Processed food category
          },
          {
            item_name: '바나나',
            major_category: '식물성',
            sub_category: '과일류',
            expiry_text: '3일',
            expiry_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category_id: 5, // Fruit category
          }
        ];
        
        setRecognizedItems(mockItems);
        setStage('confirmation');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [stage]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setStage('scanning');
    }
  };
  
  const handleSaveAllItems = async () => {
    try {
      // Save all items one by one
      for (const item of recognizedItems) {
        await addItem({
          item_name: item.item_name,
          expiry_date: item.expiry_date,
          category_id: item.category_id,
        });
      }
      
      // Only show one notification for all items
      toast(`${recognizedItems.length}개의 식품이 추가되었습니다.`, {
        duration: 1000,
      });
      
      onClose();
    } catch (error) {
      toast("식품 추가에 실패했습니다.");
    }
  };

  const handleRemoveItem = (index: number) => {
    setRecognizedItems(prevItems => prevItems.filter((_, i) => i !== index));
  };
  
  const handleItemChange = (index: number, field: keyof OCRItem, value: string | number) => {
    setRecognizedItems(prevItems => {
      const newItems = [...prevItems];
      if (field === 'category_id') {
        newItems[index] = { ...newItems[index], [field]: value as number };
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      return newItems;
    });
  };
  
  const renderContent = () => {
    switch (stage) {
      case 'upload':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-6xl mb-4">
              <Refrigerator size={64} />
            </div>
            <h2 className="text-xl font-medium mb-6">이미지 업로드</h2>
            <label className="w-full">
              <input
                type="file"
                accept="image/*"
                capture={isMobile ? "environment" : undefined}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="bg-primary text-white py-3 rounded-md text-center cursor-pointer">
                {isMobile ? '카메라 열기' : '갤러리에서 선택'}
              </div>
            </label>
          </div>
        );
        
      case 'scanning':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
            <h2 className="text-xl font-medium">OCR 인식 중...</h2>
          </div>
        );
        
      case 'confirmation':
        return (
          <div className="p-4">
            <h2 className="text-xl font-medium mb-4">인식 결과 확인</h2>
            
            {imagePreview && (
              <div className="mb-6 flex justify-center">
                <img 
                  src={imagePreview} 
                  alt="Uploaded food" 
                  className="max-h-40 rounded-md object-contain"
                />
              </div>
            )}
            
            <div className="text-sm text-gray-600 mb-4">
              {recognizedItems.length}개의 식품이 인식되었습니다.
            </div>
            
            <div className="space-y-6 max-h-60 overflow-y-auto scrollbar-hide">
              {recognizedItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 relative">
                  <button 
                    onClick={() => handleRemoveItem(index)} 
                    className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                  >
                    <Trash size={16} />
                  </button>
                  
                  <div className="mb-3">
                    <div className="text-xs text-gray-500">분류</div>
                    <div className="font-medium">{item.major_category} &gt; {item.sub_category}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">식품 이름</label>
                    <input
                      type="text"
                      value={item.item_name}
                      onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                      className="input-field mb-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">유통기한</label>
                    <div className="flex items-center mb-2">
                      <input
                        type="date"
                        value={item.expiry_date}
                        onChange={(e) => handleItemChange(index, 'expiry_date', e.target.value)}
                        className="input-field flex-1"
                      />
                      {item.expiry_text && (
                        <div className="ml-2 text-sm text-gray-500">
                          약 {item.expiry_text}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">카테고리</label>
                    <select
                      value={item.category_id}
                      onChange={(e) => handleItemChange(index, 'category_id', Number(e.target.value))}
                      className="input-field mb-2"
                    >
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.category_major_name} - {category.category_sub_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2 mt-6">
              <button
                onClick={onClose}
                className="w-1/2 py-3 border border-gray-300 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleSaveAllItems}
                className="w-1/2 bg-primary text-white py-3 rounded-md"
                disabled={recognizedItems.length === 0}
              >
                {recognizedItems.length > 1 ? '모두 저장' : '저장'}
              </button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-medium">식품 추가</h1>
        <button onClick={onClose} className="text-gray-500">
          <X size={20} />
        </button>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default OCRScanning;
