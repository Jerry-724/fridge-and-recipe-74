// src/hooks/use-ocr.ts
import { useAuth } from '../context/AuthContext';
import type {
  OCRExtractResponse,
  OCRClassifyResponse,
  OCRSaveResponse
} from '../types/api';

export function useOcr() {
  const { apiClient, user } = useAuth();

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

  async function classifyNames(names: string[]): Promise<OCRClassifyResponse['items']> {
    const res = await apiClient.post<OCRClassifyResponse>(
      '/ocr/classify-names',
      { names }
    );
    return res.data.items;
  }

  async function saveItems(payload: {
    items: {
      item_name: string;
      category_major_name: string;
      category_sub_name: string;
      expiry_text: string;
    }[];
    user_id: number;
  }): Promise<OCRSaveResponse> {
    // user_id 와 items 를 꼭 함께 넘겨줘야 합니다!
    const res = await apiClient.post<OCRSaveResponse>(
      '/ocr/save-items',
      payload
    );
    return res.data;
  }

  return { extractNames, classifyNames, saveItems };
}
