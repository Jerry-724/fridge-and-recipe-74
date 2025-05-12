
import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { toast } from "sonner";
import { Item } from '../types/api';
import { X, Trash2 } from 'lucide-react';

interface OCRScanningProps {
  onClose: () => void;
}

// Interface for OCR recognized item
interface RecognizedItem {
  item_name: string;
  expiry_date: string;
  category_id: number;
  major_category?: string;
  sub_category?: string;
  expiry_text?: string;
}

const OCRScanning: React.FC<OCRScanningProps> = ({ onClose }) => {
  const [stage, setStage] = useState<'upload' | 'scanning' | 'confirmation'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([]);
  
  const { addItem, categories } = useInventory();
  
  // Detect if device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  useEffect(() => {
    if (stage === 'scanning') {
      // Simulate OCR processing
      const timer = setTimeout(() => {
        // Mock multiple OCR results
        setRecognizedItems([
          {
            item_name: '우유',
            expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category_id: 9, // 유제품 category
            major_category: '동물성',
            sub_category: '유제품',
            expiry_text: '1주'
          },
          {
            item_name: '사과',
            expiry_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category_id: 5, // 과일류 category
            major_category: '식물성',
            sub_category: '과일류',
            expiry_text: '10일'
          },
          {
            item_name: '도너츠',
            expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category_id: 11, // 가공식품 category
            major_category: '가공식품',
            sub_category: '가공식품',
            expiry_text: '5일'
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
  
  const handleRemoveItem = (index: number) => {
    setRecognizedItems(items => items.filter((_, i) => i !== index));
  };
  
  const handleSaveAllItems = async () => {
    try {
      // Filter out empty items
      const itemsToSave = recognizedItems.filter(item => item.item_name.trim() !== '');
      
      if (itemsToSave.length === 0) {
        toast("저장할 항목이 없습니다.");
        return;
      }
      
      // Save each item
      for (const item of itemsToSave) {
        await addItem({
          item_name: item.item_name,
          expiry_date: item.expiry_date,
          category_id: item.category_id,
        });
      }
      
      toast(`${itemsToSave.length}개 식품이 추가되었습니다.`, {
        duration: 1000
      });
      onClose();
    } catch (error) {
      toast("식품 추가에 실패했습니다.", {
        description: "다시 시도해주세요.",
        variant: 'destructive',
      });
    }
  };
  
  const renderContent = () => {
    switch (stage) {
      case 'upload':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-6xl mb-4">📸</div>
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
            <h2 className="text-xl font-medium mb-4">인식 결과 확인 ({recognizedItems.length}개)</h2>
            
            {imagePreview && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={imagePreview} 
                  alt="Uploaded food" 
                  className="max-h-32 rounded-md object-contain"
                />
              </div>
            )}
            
            <div className="max-h-60 overflow-y-auto mb-4">
              {recognizedItems.length > 0 ? (
                recognizedItems.map((item, index) => (
                  <div key={index} className="p-3 border rounded-md mb-3 relative">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="absolute top-2 right-2 text-gray-500"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">식품 이름</label>
                        <input
                          type="text"
                          value={item.item_name}
                          onChange={(e) => {
                            const updatedItems = [...recognizedItems];
                            updatedItems[index].item_name = e.target.value;
                            setRecognizedItems(updatedItems);
                          }}
                          className="input-field py-2 mb-0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">유통기한</label>
                        <input
                          type="date"
                          value={item.expiry_date}
                          onChange={(e) => {
                            const updatedItems = [...recognizedItems];
                            updatedItems[index].expiry_date = e.target.value;
                            setRecognizedItems(updatedItems);
                          }}
                          className="input-field py-2 mb-0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">카테고리</label>
                        <select
                          value={item.category_id}
                          onChange={(e) => {
                            const updatedItems = [...recognizedItems];
                            updatedItems[index].category_id = Number(e.target.value);
                            setRecognizedItems(updatedItems);
                          }}
                          className="input-field py-2 mb-0"
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
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  식품을 인식하지 못했습니다.
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
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
                모두 저장 ({recognizedItems.length}개)
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
