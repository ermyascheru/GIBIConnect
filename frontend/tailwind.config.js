/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F172A',      // Slate Navy
          emerald: '#10B981',   // Verified Emerald
          indigo: '#4F46E5',    // AI Advisor Indigo
          gold: '#F59E0B',      // Warm Amber
          canvas: '#F8FAFC',    // Light Canvas Slate
          border: '#E2E8F0',    // Muted Border
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        ethiopic: ['Noto Sans Ethiopic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}