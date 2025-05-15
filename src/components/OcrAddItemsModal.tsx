// src/components/OcrAddItemsModal.tsx
import React, { useState, useEffect } from 'react';
import { useOcr } from '../hooks/use-ocr';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../hooks/use-toast';
import { X } from 'lucide-react';

interface OcrAddItemsModalProps {
  onClose: () => void;
}
interface PreviewItem {
  item_name: string;
  expiry_date: string;   // yyyy-MM-dd
  category_id: number;
}

export function OcrAddItemsModal({ onClose }: OcrAddItemsModalProps) {
  const { extractNames, classifyNames, saveItems } = useOcr();
  const { categories, refreshInventory } = useInventory();
  const { toast } = useToast();

  const [stage, setStage] = useState<'upload'|'scanning'|'confirmation'>('upload');
  const [file, setFile] = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState<string|null>(null);
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 1) 파일 고르면 scanning 단계로
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(f);
    setStage('scanning');
  };

  // 2) scanning → OCR → classify → confirmation
  useEffect(() => {
    if (stage !== 'scanning' || !file) return;

    (async () => {
      setLoading(true);
      try {
        // OCR → 이름 리스트
        const names = await extractNames(file);
        // 이름 → 분류+expiry_text
        const classified = await classifyNames(names);

        // 분류된 텍스트 → date picker 형식, category_id 매핑
        const items: PreviewItem[] = classified.map((it) => {
          // 2-1) expiry_text → yyyy-MM-dd
          let expiry_date = '';
          if (it.expiry_text !== '무기한') {
            const days = parseInt(it.expiry_text.replace(/\D/g, '')) || 0;
            const d = new Date();
            d.setDate(d.getDate() + days);
            expiry_date = d.toISOString().slice(0,10);
          }
          // 2-2) category_major+sub → category_id
          const cat = categories.find(c =>
            c.category_major_name === it.category_major_name &&
            c.category_sub_name   === it.category_sub_name
          );
          const defaultId = categories.length ? categories[0].category_id : 0;
          return {
            item_name: it.item_name,
            expiry_date,
            category_id: cat ? cat.category_id : defaultId
          };
        });

        setPreviewItems(items);
        setStage('confirmation');
      } catch (err) {
        console.error(err);
        toast({ title: 'OCR 오류', description: '이미지 인식에 실패했습니다.', variant: 'destructive' });
        onClose();
      } finally {
        setLoading(false);
      }
    })();
  }, [stage, file, categories, extractNames, classifyNames, toast, onClose]);

  // 3) 확인 화면에서 필드 수정
  const updateItem = (idx: number, key: keyof PreviewItem, value: any) => {
    setPreviewItems(prev =>
      prev.map((it,i) => i===idx ? { ...it, [key]: value } : it)
    );
  };

  // 4) 저장 → 모달 닫고 재고 리프레시
  const handleSave = async () => {
    setLoading(true);
    try {
      await saveItems(previewItems);
      toast({ title: '완료', description: `${previewItems.length}개 추가되었습니다.` });
      onClose();
      await refreshInventory();
    } catch {
      toast({ title: '저장 오류', description: '저장에 실패했습니다.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg">식품 추가</h2>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-auto p-4">
        {stage==='upload' && (
          <div className="space-y-4 text-center">
            <div className="text-6xl">📷</div>
            <button
              className="w-full bg-primary text-white py-3 rounded"
              onClick={()=>document.getElementById('ocr-input')?.click()}
            >
              이미지 선택
            </button>
            <input
              id="ocr-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              className="w-full border border-primary text-primary py-3 rounded"
              onClick={() => {
                setPreviewItems([{
                  item_name:'', expiry_date:'', category_id:categories[0]?.category_id||0
                }]);
                setStage('confirmation');
              }}
            >
              직접 입력
            </button>
          </div>
        )}

        {stage==='scanning' && (
          <div className="flex flex-col items-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-t-primary rounded-full mb-4"/>
            <span>OCR 인식 중…</span>
          </div>
        )}

        {stage==='confirmation' && (
          <div className="space-y-6">
            {imagePreview && (
              <img src={imagePreview} className="w-full max-h-40 object-contain mb-4" />
            )}
            {previewItems.map((it,idx)=>(
              <div key={idx} className="border p-4 rounded relative">
                <button className="absolute top-2 right-2" onClick={()=>updateItem(idx,'item_name','')}>
                  <X size={18}/>
                </button>
                {/* 이름 */}
                <label className="block text-sm">식품 이름</label>
                <input
                  type="text"
                  value={it.item_name}
                  onChange={e=>updateItem(idx,'item_name',e.target.value)}
                  className="w-full border rounded p-2 mb-3"
                />

                {/* 유통기한 */}
                <label className="block text-sm">유통기한</label>
                <input
                  type="date"
                  value={it.expiry_date}
                  onChange={e=>updateItem(idx,'expiry_date',e.target.value)}
                  className="w-full border rounded p-2 mb-3"
                />

                {/* 카테고리 */}
                <label className="block text-sm">카테고리</label>
                <select
                  value={it.category_id}
                  onChange={e=>updateItem(idx,'category_id',+e.target.value)}
                  className="w-full border rounded p-2"
                >
                  {categories.map(c=>(
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_major_name} – {c.category_sub_name}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* 항목 추가 */}
            <button
              className="w-full border-dashed border-gray-300 py-2 rounded text-gray-500"
              onClick={()=>setPreviewItems(prev=>[...prev,{item_name:'',expiry_date:'',category_id:categories[0]?.category_id||0}])}
            >+ 항목 추가</button>

            {/* 취소/저장 */}
            <div className="flex space-x-2">
              <button
                className="flex-1 border py-2 rounded"
                onClick={onClose}
                disabled={loading}
              >취소</button>
              <button
                className="flex-1 bg-primary text-white py-2 rounded"
                onClick={handleSave}
                disabled={loading}
              >저장</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
