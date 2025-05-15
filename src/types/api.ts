
// User model
export interface User {
  user_id: number;
  login_id: string;
  username: string;
  password?: string;  // Not returned from API
  notification: boolean;
  fcm_token?: string;
}

// Item model
export interface Item {
  item_id: number;
  user_id: number;
  category_id: number;
  item_name: string;
  expiry_date: string;
  created_at: string;

  daysLeft?: number | null; // 프론트에서 계산해 붙이는 남은 일수 (optional) 
}

// Category model
export interface Category {
  category_id: number;
  category_major_name: string;
  category_sub_name: string;
}

// Authentication response
export interface AuthResponse {
  user: User;
  token: string;
}
