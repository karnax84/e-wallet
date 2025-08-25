export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export type Theme = 'light' | 'dark';

export interface AppConfig {
  apiUrl: string;
  theme: Theme;
  language: string;
} 