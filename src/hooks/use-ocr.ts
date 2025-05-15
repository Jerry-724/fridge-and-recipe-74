// src/hooks/use-0cr.ts
import { useAuth } from '../context/AuthContext';

export function useOcr() {
  // useAuth() 훅으로 apiClient와 user를 꺼내옵니다
  const { apiClient, user } = useAuth();

  // ① 이미지 → 이름 목록 추출
  async function extractNames(file: File): Promise<string[]> {
    const form = new FormData();
    form.append("file", file);
    const res = await apiClient.post<{ extracted_names: string[] }>(
      "/ocr/extract-names",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.extracted_names;
  }

  // ② 목록 → 분류 + expiry_text
  async function classifyNames(names: string[]) {
    const res = await apiClient.post<{ items: any[] }>(
      "/ocr/classify-names",
      { names }
    );
    return res.data.items;
  }

  // ③ 분류 결과 → DB 저장 (Upsert)
  async function saveItems(items: any[]): Promise<number[]> {
    const res = await apiClient.post<{ saved_items: number[] }>(
      "/ocr/save-items",
      { user_id: user.user_id, items }
    );
    return res.data.saved_items;
  }

  return { extractNames, classifyNames, saveItems };
}
