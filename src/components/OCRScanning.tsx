
import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '@/hooks/use-toast';
import { Item } from '../types/api';
import { Trash2 } from 'lucide-react';

interface OCRScanningProps {
  onClose: () => void;
}

interface OCRItem {
  item_name: string;
  major_category: string;
  sub_category: string;
  expiry_text: string;
  expiry_date?: string;
  category_id?: number;
}

const OCRScanning: React.FC<OCRScanningProps> = ({ onClose }) => {
  const [stage, setStage] = useState<'upload' | 'scanning' | 'confirmation'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recognizedItems, setRecognizedItems] = useState<OCRItem[]>([]);
  
  const { addItem, categories } = useInventory();
  const { toast } = useToast();
  
  // Detect if device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Convert expiry_text to actual date
  const convertExpiryTextToDate = (text: string): string => {
    const today = new Date();
    
    if (text.includes('일')) {
      const days = parseInt(text.replace('일', '')) || 1;
      const date = new Date(today);
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    } else if (text.includes('주')) {
      const weeks = parseInt(text.replace('주', '')) || 1;
      const date = new Date(today);
      date.setDate(date.getDate() + (weeks * 7));
      return date.toISOString().split('T')[0];
    } else if (text.includes('개월')) {
      const months = parseInt(text.replace('개월', '')) || 1;
      const date = new Date(today);
      date.setMonth(date.getMonth() + months);
      return date.toISOString().split('T')[0];
    } else {
      // Default to 1 week if format is not recognized
      const date = new Date(today);
      date.setDate(date.getDate() + 7);
      return date.toISOString().split('T')[0];
    }
  };
  
  // Find category ID based on major and sub category names
  const findCategoryId = (majorCategory: string, subCategory: string): number => {
    // Convert category names to match our existing category structure
    let majorCategoryName = '';
    
    if (majorCategory.includes('식물성')) {
      majorCategoryName = '식물성';
    } else if (majorCategory.includes('동물성')) {
      majorCategoryName = '동물성';
    } else if (majorCategory.includes('가공식품')) {
      majorCategoryName = '가공식품';
    } else if (majorCategory.includes('조미료') || majorCategory.includes('양념')) {
      majorCategoryName = '조미료·양념';
    } else {
      majorCategoryName = '기타';
    }
    
    const category = categories.find(c => 
      c.category_major_name === majorCategoryName && 
      c.category_sub_name.includes(subCategory)
    );
    
    return category?.category_id || 1; // Default to first category if not found
  };
  
  useEffect(() => {
    if (stage === 'scanning') {
      // Simulate OCR processing
      const timer = setTimeout(() => {
        // Mock OCR results - multiple items
        const mockItems: OCRItem[] = [
          {
            item_name: '우유',
            major_category: '동물성 식재료',
            sub_category: '유제품',
            expiry_text: '1주',
          },
          {
            item_name: '도너츠',
            major_category: '가공식품',
            sub_category: '가공식품',
            expiry_text: '3일',
          },
          {
            item_name: '사과',
            major_category: '식물성 식재료',
            sub_category: '과일류',
            expiry_text: '2주',
          }
        ];
        
        // Process the mock items
        const processedItems = mockItems.map(item => ({
          ...item,
          expiry_date: convertExpiryTextToDate(item.expiry_text),
          category_id: findCategoryId(item.major_category, item.sub_category)
        }));
        
        setRecognizedItems(processedItems);
        setStage('confirmation');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [stage, categories]);
  
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
    setRecognizedItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSaveItems = async () => {
    try {
      // Check if we have items to save
      if (recognizedItems.length === 0) {
        toast({
          title: '오류',
          description: '저장할 식품이 없습니다.',
          variant: 'destructive',
        });
        return;
      }
      
      // Save each item
      for (const item of recognizedItems) {
        if (!item.item_name || !item.expiry_date || !item.category_id) continue;
        
        await addItem({
          item_name: item.item_name,
          expiry_date: item.expiry_date,
          category_id: item.category_id,
        });
      }
      
      toast({
        title: '성공',
        description: `${recognizedItems.length}개 식품이 추가되었습니다.`,
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
            <h2 className="text-xl font-medium mb-2">인식 결과 확인</h2>
            <p className="text-sm text-gray-500 mb-4">{recognizedItems.length}개 식품이 인식되었습니다.</p>
            
            {imagePreview && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={imagePreview} 
                  alt="Uploaded food" 
                  className="max-h-40 rounded-md object-contain"
                />
              </div>
            )}
            
            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              {recognizedItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 relative">
                  <button 
                    onClick={() => handleRemoveItem(index)} 
                    className="absolute top-2 right-2 text-gray-500 hover:text-destructive"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">식품 이름</label>
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) => {
                          const newItems = [...recognizedItems];
                          newItems[index].item_name = e.target.value;
                          setRecognizedItems(newItems);
                        }}
                        className="input-field mb-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">유통기한</label>
                      <input
                        type="date"
                        value={item.expiry_date}
                        onChange={(e) => {
                          const newItems = [...recognizedItems];
                          newItems[index].expiry_date = e.target.value;
                          setRecognizedItems(newItems);
                        }}
                        className="input-field mb-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">카테고리</label>
                      <select
                        value={item.category_id}
                        onChange={(e) => {
                          const newItems = [...recognizedItems];
                          newItems[index].category_id = Number(e.target.value);
                          setRecognizedItems(newItems);
                        }}
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
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={onClose}
                className="w-1/2 py-3 border border-gray-300 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleSaveItems}
                className="w-1/2 bg-primary text-white py-3 rounded-md"
                disabled={recognizedItems.length === 0}
              >
                {recognizedItems.length}개 저장
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
