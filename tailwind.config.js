/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Use class-based dark mode instead of media queries
  theme: {
    extend: {
      colors: {
        // Custom colors for the app
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      animation: {
        'bounce': 'bounce 1.5s infinite',
      }
    },
  },
  plugins: [],
}