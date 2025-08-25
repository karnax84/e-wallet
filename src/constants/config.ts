export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const APP_CONFIG = {
  name: 'My React App',
  version: '1.0.0',
  theme: {
    light: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      background: '#F3F4F6',
    },
    dark: {
      primary: '#60A5FA',
      secondary: '#9CA3AF',
      background: '#1F2937',
    },
  },
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const; 