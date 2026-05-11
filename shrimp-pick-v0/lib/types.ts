export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type OrderStatus = "Noted" | "Shipping" | "Completed";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  address: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface Item {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
  featured: boolean;
  created_at?: string;
}

export interface Review {
  id: string;
  image_url: string;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  status: OrderStatus;
  receipt_url: string;
  full_name: string;
  address: string;
  phone: string;
  created_at: string;
  items?: Item | null;
  users?: UserProfile | null;
}

export interface ChatMessage {
  id: string;
  order_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  users?: Pick<UserProfile, "id" | "email" | "full_name" | "is_admin"> | null;
}

export interface DashboardMetric {
  label: string;
  amount: number;
}
