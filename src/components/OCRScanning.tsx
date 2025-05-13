import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface OCRScanningProps {
  onClose: () => void;
}

interface RecognizedItem {
  item_name: string;
  expiry_date: string;
  category_id: number;
}

const OCRScanning: React.FC<OCRScanningProps> = ({ onClose }) => {
  const [stage, setStage] = useState<'upload' | 'scanning' | 'confirmation'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([]);
  
  const { addItem, categories } = useInventory();
  const { toast } = useToast();
  
  // Detect if device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  useEffect(() => {
    if (stage === 'scanning') {
      // Simulate OCR processing with multiple items
      const timer = setTimeout(() => {
        // Mock OCR results with multiple items
        setRecognizedItems([
          {
            item_name: '사과',
            expiry_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category_id: 5, // Fruit category
          },
          {
            item_name: '우유',
            expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category_id: 9, // Dairy category
          },
          {
            item_name: '계란',
            expiry_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category_id: 8, // Egg category
          }
        ]);
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
  
  const handleSaveItems = async () => {
    try {
      // Process each item individually to ensure separate database entries
      for (const item of recognizedItems) {
        await addItem({
          item_name: item.item_name.trim(),
          expiry_date: item.expiry_date,
          category_id: item.category_id,
        });
      }
      
      // Show single notification for all items
      toast({
        title: '성공',
        description: `${recognizedItems.length}개의 식품이 추가되었습니다.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: '오류',
        description: '식품 추가에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateItem = (index: number, updatedItem: Partial<RecognizedItem>) => {
    setRecognizedItems(items => 
      items.map((item, i) => 
        i === index ? { ...item, ...updatedItem } : item
      )
    );
  };
  
  const handleRemoveItem = (index: number) => {
    setRecognizedItems(items => items.filter((_, i) => i !== index));
  };
  
  const renderContent = () => {
    switch (stage) {
      case 'upload':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-xl font-medium mb-6">이��지 업로드</h2>
            <div className="w-full space-y-4">
              <button
                onClick={() => document.getElementById('camera-input')?.click()}
                className="w-full bg-primary text-white py-3 rounded-md text-center cursor-pointer"
              >
                이미지 업로드
              </button>
              <button
                onClick={() => {
                  // Add empty item for direct entry
                  setRecognizedItems([{
                    item_name: '',
                    expiry_date: new Date().toISOString().split('T')[0],
                    category_id: 1,
                  }]);
                  setStage('confirmation');
                }}
                className="w-full border border-primary text-primary py-3 rounded-md text-center cursor-pointer"
              >
                직접 입력
              </button>
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture={isMobile ? "environment" : undefined}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
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
          <div className="p-4 max-h-[80vh] overflow-y-auto">
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
            
            <div className="space-y-6">
              {recognizedItems.map((item, index) => (
                <div key={index} className="p-4 border rounded-md relative">
                  <button 
                    onClick={() => handleRemoveItem(index)} 
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <X size={18} />
                  </button>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">식품 이름</label>
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) => handleUpdateItem(index, { item_name: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">유통기한</label>
                      <input
                        type="date"
                        value={item.expiry_date}
                        onChange={(e) => handleUpdateItem(index, { expiry_date: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">카테고리</label>
                      <select
                        value={item.category_id}
                        onChange={(e) => handleUpdateItem(index, { category_id: Number(e.target.value) })}
                        className="w-full p-2 border rounded"
                      >
                        {categories.map((category) => (
                          <option key={category.category_id} value={category.category_id}>
                            {category.category_major_name} - {category.category_sub_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => {
                  setRecognizedItems([...recognizedItems, {
                    item_name: '',
                    expiry_date: new Date().toISOString().split('T')[0],
                    category_id: 1,
                  }]);
                }}
                className="w-full border border-dashed border-gray-300 p-3 rounded-md text-gray-500 hover:bg-gray-50"
              >
                + 항목 추가
              </button>
              
              <div className="flex space-x-2 pt-4">
                <button
                  onClick={onClose}
                  className="w-1/2 py-3 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveItems}
                  className="w-1/2 bg-primary text-white py-3 rounded-md"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 bg-[#FFFFF8] z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-medium">식품 추가</h1>
        <button onClick={onClose} className="text-gray-500">
          ✕
        </button>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default OCRScanning;
