
import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '@/hooks/use-toast';
import { Item } from '../types/api';

interface OCRScanningProps {
  onClose: () => void;
}

const OCRScanning: React.FC<OCRScanningProps> = ({ onClose }) => {
  const [stage, setStage] = useState<'upload' | 'scanning' | 'confirmation'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recognizedItem, setRecognizedItem] = useState<{
    item_name: string;
    expiry_date: string;
    category_id: number;
  }>({
    item_name: '',
    expiry_date: '',
    category_id: 1, // Default category
  });
  
  const { addItem, categories } = useInventory();
  const { toast } = useToast();
  
  useEffect(() => {
    if (stage === 'scanning') {
      // Simulate OCR processing
      const timer = setTimeout(() => {
        // Mock OCR result
        setRecognizedItem({
          item_name: '사과',
          expiry_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category_id: 5, // Fruit category
        });
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
  
  const handleSaveItem = async () => {
    try {
      await addItem({
        item_name: recognizedItem.item_name,
        expiry_date: recognizedItem.expiry_date,
        category_id: recognizedItem.category_id,
      });
      
      toast({
        title: '성공',
        description: '식품이 추가되었습니다.',
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
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="bg-primary text-white py-3 rounded-md text-center cursor-pointer">
                갤러리에서 선택
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">식품 이름</label>
                <input
                  type="text"
                  value={recognizedItem.item_name}
                  onChange={(e) => setRecognizedItem({...recognizedItem, item_name: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">유통기한</label>
                <input
                  type="date"
                  value={recognizedItem.expiry_date}
                  onChange={(e) => setRecognizedItem({...recognizedItem, expiry_date: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">카테고리</label>
                <select
                  value={recognizedItem.category_id}
                  onChange={(e) => setRecognizedItem({...recognizedItem, category_id: Number(e.target.value)})}
                  className="input-field"
                >
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_major_name} - {category.category_sub_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="w-1/2 py-3 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveItem}
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
