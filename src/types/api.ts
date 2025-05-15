// src/types/api.ts

// User model
export interface User {
  user_id: number;
  login_id: string;
  username: string;
  password?: string;  // Not returned from API
  notification: boolean;
  fcm_token?: string;
}

// Category model
export interface Category {
  category_id: number;
  category_major_name: string;
  category_sub_name: string;
}

// Item model
export interface Item {
  item_id: number;
  user_id: number;
  category_id: number;
  item_name: string;
  expiry_date: string;
  created_at: string;
  category: Category;
  daysLeft?: number | null; // 프론트에서 계산해 붙이는 남은 일수 (optional) 
}

// Authentication response
export interface AuthResponse {
  user: User;
  token: string;
}

// ---------------------------
// OCR 관련 API 응답 타입
// ---------------------------

// 1) OCR 이미지에서 이름 추출
export interface OCRExtractResponse {
  extracted_names: string[];
}

// 2) OCR로 추출된 이름들을 분류 + 유통기한 텍스트 변환
export interface OCRClassifyItem {
  item_name: string;
  category_major_name: string;
  category_sub_name: string;
  expiry_text: string;
}
export interface OCRClassifyResponse {
  items: OCRClassifyItem[];
}

// 3) OCR로 확인된 항목을 저장했을 때 반환되는 ID 목록
export interface OCRSaveResponse {
  saved_items: number[];
}
