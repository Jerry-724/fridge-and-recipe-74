import React, { useState, useEffect } from "react";
import { useOcr } from "../hooks/use-ocr";
import { useInventory } from "../context/InventoryContext";
import { useToast } from "../hooks/use-toast";
import { X } from "lucide-react";

interface PreviewItem {
  item_name: string;
  expiry_date: string; // yyyy-MM-dd
  category_id: number;
}

interface OcrAddItemsModalProps {
  onClose: () => void;
}

export function OcrAddItemsModal({ onClose }: OcrAddItemsModalProps) {
  const { extractNames, classifyNames, saveItems } = useOcr();
  const { categories, refreshInventory } = useInventory();
  const { toast } = useToast();

  const [stage, setStage] = useState<"upload" | "scanning" | "confirmation">(
    "upload"
  );
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(f);
    setStage("scanning");
  };

  // **중요: categories를 deps에서 제거** 하고, refreshInventory 호출도 제거했습니다.
  useEffect(() => {
    if (stage !== "scanning" || !file) return;

    (async () => {
      setLoading(true);
      try {
        // 1) OCR
        const names = await extractNames(file);
        // 2) 분류+expiry_text
        const classified = await classifyNames(names);

        // 3) PreviewItem 변환
        const items: PreviewItem[] = classified.map((it) => {
          let expiry_date = "";
          if (it.expiry_text !== "무기한") {
            const days = parseInt(it.expiry_text.replace(/\D/g, "")) || 0;
            const d = new Date();
            d.setDate(d.getDate() + days);
            expiry_date = d.toISOString().slice(0, 10);
          }
          const found = categories.find(
            (c) =>
              c.category_major_name === it.category_major_name &&
              c.category_sub_name === it.category_sub_name
          );
          return {
            item_name: it.item_name,
            expiry_date,
            category_id: found
              ? found.category_id
              : categories[0]?.category_id ?? 0,
          };
        });

        setPreviewItems(items);
        setStage("confirmation");
      } catch (err) {
        console.error(err);
        toast({
          title: "OCR 오류",
          description: "이미지 인식에 실패했습니다.",
          variant: "destructive",
        });
        onClose();
      } finally {
        setLoading(false);
      }
    })();
  }, [stage, file]);

  const updateItem = (
    idx: number,
    key: keyof PreviewItem,
    value: string | number
  ) => {
    setPreviewItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it))
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveItems(previewItems);
      toast({ title: "완료", description: `${previewItems.length}개 추가되었습니다.` });
      onClose();
      await refreshInventory();
    } catch {
      toast({
        title: "저장 오류",
        description: "식품 저장에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg">식품 추가</h2>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {stage === "upload" && (
          <div className="space-y-4 text-center">
            <div className="text-6xl">📷</div>
            <button
              className="w-full bg-primary text-white py-3 rounded"
              onClick={() => document.getElementById("ocr-input")?.click()}
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
                setPreviewItems([
                  {
                    item_name: "",
                    expiry_date: "",
                    category_id: categories[0]?.category_id ?? 0,
                  },
                ]);
                setStage("confirmation");
              }}
            >
              직접 입력
            </button>
          </div>
        )}
        {stage === "scanning" && (
          <div className="flex flex-col items-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-t-primary rounded-full mb-4" />
            <span>OCR 인식 중…</span>
          </div>
        )}
        {stage === "confirmation" && (
          <div className="space-y-6">
            {imagePreview && (
              <img
                src={imagePreview}
                className="w-full max-h-40 object-contain mb-4"
              />
            )}
            {previewItems.map((it, idx) => (
              <div key={idx} className="border p-4 rounded relative">
                <button
                  className="absolute top-2 right-2"
                  onClick={() => updateItem(idx, "item_name", "")}
                >
                  <X size={18} />
                </button>
                <label className="block text-sm">식품 이름</label>
                <input
                  type="text"
                  value={it.item_name}
                  onChange={(e) =>
                    updateItem(idx, "item_name", e.target.value)
                  }
                  className="w-full border rounded p-2 mb-3"
                />
                <label className="block text-sm">유통기한</label>
                <input
                  type="date"
                  value={it.expiry_date}
                  onChange={(e) =>
                    updateItem(idx, "expiry_date", e.target.value)
                  }
                  className="w-full border rounded p-2 mb-3"
                />
                <label className="block text-sm">카테고리</label>
                <select
                  value={it.category_id}
                  onChange={(e) =>
                    updateItem(idx, "category_id", +e.target.value)
                  }
                  className="w-full border rounded p-2"
                >
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_major_name} – {c.category_sub_name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button
              className="w-full border-dashed border-gray-300 py-2 rounded text-gray-500"
              onClick={() =>
                setPreviewItems((prev) => [
                  ...prev,
                  {
                    item_name: "",
                    expiry_date: "",
                    category_id: categories[0]?.category_id ?? 0,
                  },
                ])
              }
            >
              + 항목 추가
            </button>
            <div className="flex space-x-2">
              <button
                className="flex-1 border py-2 rounded"
                onClick={onClose}
                disabled={loading}
              >
                취소
              </button>
              <button
                className="flex-1 bg-primary text-white py-2 rounded"
                onClick={handleSave}
                disabled={loading}
              >
                저장
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
