
// User model
export interface User {
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
  daysLeft?: number; // Calculated field, not from DB
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
