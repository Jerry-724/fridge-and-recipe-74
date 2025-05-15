// src/hooks/use-ocr.ts
import { useAuth } from '../context/AuthContext';
import type {
  OCRExtractResponse,
  OCRClassifyResponse,
  OCRSaveResponse,
  OCRClassifyItem,
} from '../types/api';

export function useOcr() {
  const { apiClient, user } = useAuth();

  // 1) 이미지 → 추출된 이름 리스트
  async function extractNames(file: File): Promise<string[]> {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post<OCRExtractResponse>(
      '/ocr/extract-names',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data.extracted_names;
  }

  // 2) 이름 리스트 → 분류 + expiry_text
  async function classifyNames(names: string[]): Promise<OCRClassifyItem[]> {
    const res = await apiClient.post<OCRClassifyResponse>(
      '/ocr/classify-names',
      { names }
    );
    return res.data.items;
  }

  // 3) 항목 저장 → id 리스트 반환
  async function saveItems(
    payloadItems: {
      item_name: string;
      expiry_date: string;      // YYYY-MM-DD
      category_id: number;
      expiry_text: string;      // ex. "7일" or "무기한"
    }[]
  ): Promise<number[]> {
    // 백엔드에 넘길 shape: { user_id, items: { item_name, category_major_name, category_sub_name, expiry_text }[] }
    // 카테고리 매핑 위해 다시 불러오거나 캐시된 categories 활용
    // 여기선 /category/ 엔드포인트를 직접 호출해서 최신 카테고리 목록을 가져옵니다.
    const catRes = await apiClient.get<{ category_id: number; category_major_name: string; category_sub_name: string }[]>('/category/');
    const allCats = catRes.data;

    const toSave = payloadItems.map((it) => {
      const cat = allCats.find((c) => c.category_id === it.category_id)!;
      return {
        item_name: it.item_name,
        category_major_name: cat.category_major_name,
        category_sub_name: cat.category_sub_name,
        expiry_text: it.expiry_text,
      };
    });

    const res = await apiClient.post<OCRSaveResponse>(
      '/ocr/save-items',
      { user_id: user.user_id, items: toSave }
    );
    return res.data.saved_items;
  }

  return { extractNames, classifyNames, saveItems };
}
