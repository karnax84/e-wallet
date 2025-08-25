/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#60a5fa',   // blue-400
        },
        secondary: {
          DEFAULT: '#fbbf24', // yellow-400
          dark: '#facc15',   // yellow-300
        },
        accent: {
          DEFAULT: '#a21caf', // purple-800
          dark: '#c084fc',   // purple-400
        },
        success: {
          DEFAULT: '#22c55e', // green-500
          dark: '#4ade80',   // green-400
        },
        warning: {
          DEFAULT: '#f87171', // red-400
          dark: '#fca5a5',   // red-300
        },
        error: {
          DEFAULT: '#dc2626', // red-600
          dark: '#f87171',   // red-400
        },
        background: {
          DEFAULT: '#f3f4f6', // gray-100
          dark: '#18181b',   // zinc-900
        },
        card: {
          DEFAULT: '#fff',
          dark: '#23272f',
        },
        border: {
          DEFAULT: '#e5e7eb', // gray-200
          dark: '#374151',   // gray-700
        },
      },
    },
  },
  plugins: [],
} 